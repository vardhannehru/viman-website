"use client";

import * as THREE from "three";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";

/* ==========================================================================
 * AIRBUS A320
 *
 * The model arrives from Blender in its own convention:
 *
 *   +X  nose            (length 38.27 m)
 *   +Z  starboard wing  (span   33.91 m — the A320ceo's 34.10 m)
 *   +Y  up              (fin tip at 10.85 m)
 *
 * Everything inside MODEL SPACE below uses those axes, because that is what
 * the mesh coordinates are in and translating them by hand would only invite
 * mistakes. One wrapper group rotates the whole thing into the scene's
 * convention (+Z forward) and lifts it so the wheels sit on y = 0.
 *
 * Two things the file does not contain and this component supplies:
 *
 *   1. Landing gear. The GLB is a clean-configuration model — it has gear
 *      doors and a nose-gear well, but no struts and no wheels. Stages 1-4
 *      all happen on the ground, so the gear is built here.
 *   2. Usable materials. Every one of the 28 materials exports as
 *      metalness 0 / roughness 1, which renders as matte plastic. They are
 *      rebuilt as painted metal below.
 * ========================================================================== */

export const MODEL_URL = "/models/a320.glb";

/** Ground plane in model space, derived from CFM56 nacelle clearance. */
const GROUND_Y = -1.45;
/** Lift applied to the whole model so the wheels touch y = 0 in the scene. */
export const GROUND_LIFT = -GROUND_Y;

/** Where the aeroplane's parts live, in model space. */
const GEOM = {
  /* Wheelbase 12.64 m and track 7.59 m, both taken from the A320-200. The
     nose leg lands inside the exported well (x 10.25 → 12.93) as a result,
     which is the check that these numbers agree with the mesh. */
  noseGear: { x: 10.94, z: 0, top: 0.5, wheelR: 0.39, halfTrack: 0.21 },
  mainGear: { x: -1.7, z: 3.795, top: 1.15, wheelR: 0.635, halfTrack: 0.47 },
} as const;

/* --------------------------------------------------------------------------
 * MATERIALS
 *
 * Classified by the exported material name. Parts that share a finish share
 * one material instance, which also collapses 28 materials into 9.
 * ------------------------------------------------------------------------ */

type Finish = ReturnType<typeof buildFinishes>;

function buildFinishes() {
  /* Painted fuselage. Airline paint is a dielectric under a clear lacquer, so
     metalness stays low and the sheen comes from a clearcoat layer over a
     fairly tight roughness — that second specular lobe is the whole
     difference between "painted aluminium" and "grey plastic". */
  const paint = new THREE.MeshPhysicalMaterial({
    color: "#eef3fb",
    metalness: 0.18,
    roughness: 0.3,
    clearcoat: 0.7,
    clearcoatRoughness: 0.14,
    envMapIntensity: 1.9,
  });

  /* Wings and stabilisers: same paint, fractionally duller, so the wing does
     not mirror the fuselage highlight and flatten the silhouette. */
  const wing = new THREE.MeshPhysicalMaterial({
    color: "#e7edf7",
    metalness: 0.24,
    roughness: 0.36,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.7,
  });

  /* The fin carries the brand. */
  const fin = new THREE.MeshPhysicalMaterial({
    color: "#2f4bd8",
    metalness: 0.26,
    roughness: 0.32,
    clearcoat: 0.7,
    clearcoatRoughness: 0.16,
    envMapIntensity: 1.8,
  });

  /* Bare metal — nacelle lips, exhaust, engine internals. */
  const metal = new THREE.MeshStandardMaterial({
    color: "#b9c4d4",
    metalness: 0.94,
    roughness: 0.24,
    envMapIntensity: 2.4,
  });

  /* Dark machined parts inside the intake and around the core. */
  const dark = new THREE.MeshStandardMaterial({
    color: "#2b323d",
    metalness: 0.82,
    roughness: 0.42,
    envMapIntensity: 1.3,
  });

  /* Fan blades — near-mirror, so the disc catches light as it spins. */
  const blade = new THREE.MeshStandardMaterial({
    color: "#8f9aa8",
    metalness: 1,
    roughness: 0.16,
    envMapIntensity: 2.8,
  });

  /* Nozzle runs hot and slightly burnished. */
  const nozzle = new THREE.MeshStandardMaterial({
    color: "#6f7683",
    metalness: 0.95,
    roughness: 0.38,
    envMapIntensity: 2,
  });

  /* Cockpit glazing. Transmission would be more correct and far more
     expensive; a dark near-mirror is what cockpit glass actually looks like
     from outside in daylight. */
  const glass = new THREE.MeshStandardMaterial({
    color: "#0a1020",
    metalness: 1,
    roughness: 0.045,
    envMapIntensity: 3.2,
    /* Instrument glow, brought up with the aeroplane's power. Barely there —
       a cockpit at dawn shows as a hint behind the glass, not a lantern. */
    emissive: new THREE.Color("#5fb4d8"),
    emissiveIntensity: 0,
  });

  /* The exported cabin "windows" are one continuous 21.8 m × 0.44 m sliver
     sharing the cockpit's material. At mirror roughness it reflects the key
     light as a single unbroken highlight down the whole fuselage — the thing
     that most gives the model away. It becomes the dark recessed band the
     real windows sit in, and the windows themselves are placed on top. */
  const cabin = new THREE.MeshStandardMaterial({
    color: "#080d16",
    metalness: 0.3,
    roughness: 0.55,
    envMapIntensity: 0.7,
  });

  /* The windows themselves: dark glass that lights up warm from inside once
     the aeroplane has power. */
  const window_ = new THREE.MeshStandardMaterial({
    color: "#0b111d",
    metalness: 0.75,
    roughness: 0.14,
    emissive: new THREE.Color("#ffcf8f"),
    emissiveIntensity: 0,
    envMapIntensity: 2,
  });

  /* Rubber. */
  const tyre = new THREE.MeshStandardMaterial({
    color: "#14171c",
    metalness: 0.05,
    roughness: 0.92,
  });

  /* Gear legs and hubs — cadmium-plated steel. */
  const strut = new THREE.MeshStandardMaterial({
    color: "#9aa6b6",
    metalness: 0.9,
    roughness: 0.3,
    envMapIntensity: 2,
  });

  return { paint, wing, fin, metal, dark, blade, nozzle, glass, cabin, window_, tyre, strut };
}

/* --------------------------------------------------------------------------
 * CABIN WINDOWS
 *
 * The export has no individual windows, and a bare fuselage is the fastest
 * way to read as a toy. A320 cabin windows are 23 × 33 cm on roughly 53 cm
 * centres, set a little above the horizontal centreline — placed here as one
 * instanced mesh per side, so all seventy-odd cost two draw calls.
 * ------------------------------------------------------------------------ */

/** Fuselage centreline and radius in model space, measured from the mesh. */
const FUSELAGE = { y: 2.5, r: 2.02 };
/** Cabin extent along the fuselage, short of the nose and tail tapers. */
const CABIN = { from: -12.6, to: 8.4, pitch: 0.53 };
/** Window band sits ~19° above the horizontal centreline. */
const WINDOW_ANGLE = 0.33;

function CabinWindows({ mat }: { mat: THREE.Material }) {
  const geometry = useMemo(() => new THREE.PlaneGeometry(0.23, 0.33), []);

  const count = Math.floor((CABIN.to - CABIN.from) / CABIN.pitch);
  const y = FUSELAGE.y + FUSELAGE.r * Math.sin(WINDOW_ANGLE);
  // Sit a few millimetres proud of the skin so nothing z-fights.
  const z = FUSELAGE.r * Math.cos(WINDOW_ANGLE) + 0.012;

  const sides = useMemo(() => {
    const build = (sign: number) => {
      const m = new THREE.InstancedMesh(geometry, mat, count);
      const d = new THREE.Object3D();
      for (let i = 0; i < count; i++) {
        d.position.set(CABIN.from + i * CABIN.pitch, y, sign * z);
        /* Face outward along the fuselage's surface normal, which at this
           station is (0, sin θ, ±cos θ). A plane starts facing +Z, so the
           starboard side tilts by -θ and the port side is turned through
           180° first, which flips the required tilt to +θ. */
        d.rotation.set(sign > 0 ? -WINDOW_ANGLE : WINDOW_ANGLE, 0, 0);
        d.rotateY(sign > 0 ? 0 : Math.PI);
        d.updateMatrix();
        m.setMatrixAt(i, d.matrix);
      }
      m.instanceMatrix.needsUpdate = true;
      m.frustumCulled = false;
      return m;
    };
    return [build(1), build(-1)];
  }, [geometry, mat, count, y, z]);

  useEffect(() => {
    const meshes = sides;
    return () => {
      meshes.forEach((m) => m.dispose());
      geometry.dispose();
    };
  }, [sides, geometry]);

  return (
    <>
      <primitive object={sides[0]} />
      <primitive object={sides[1]} />
    </>
  );
}

/**
 * Maps an exported material onto one of the finishes above. The node name is
 * consulted too, because the export gives the cockpit and the cabin windows
 * the same material despite them needing very different finishes.
 */
function classify(name: string, f: Finish, node = ""): THREE.Material {
  const n = name.toLowerCase();
  if (n.startsWith("glass")) {
    return node.toLowerCase().startsWith("cockpit") ? f.glass : f.cabin;
  }
  if (n.startsWith("defaultwhite.004") || n.startsWith("defaultwhite.005")) return f.wing;
  if (n.startsWith("defaultwhite.006")) return f.wing;
  if (n.startsWith("defaultwhite.007")) return f.fin;
  if (n.startsWith("defaultwhite")) return f.paint;
  if (n.startsWith("geardoor")) return f.paint;
  if (n.startsWith("cockpitframe")) return f.metal;
  if (n.startsWith("doorinterior")) return f.dark;
  if (n.startsWith("intakeinterior")) return f.dark;
  if (n.startsWith("nozzle")) return f.nozzle;
  if (n.startsWith("pylon")) return f.paint;
  if (n.startsWith("aluminum")) return f.metal;
  if (n.startsWith("grey")) return f.blade;
  if (n.startsWith("black")) return f.dark;
  if (n.startsWith("white")) return f.metal;
  return f.paint;
}

/* --------------------------------------------------------------------------
 * RE-PIVOTING
 *
 * Every control surface exports with an identity transform, so rotating the
 * node spins it around the wing's origin instead of its own hinge. Each one
 * is therefore rewrapped in a group placed on its hinge line, with the mesh
 * offset back by the same amount — after which `pivot.rotation` is a real
 * deflection.
 * ------------------------------------------------------------------------ */

type Edge = "fore" | "aft";

function repivot(mesh: THREE.Object3D, edge: Edge): THREE.Group | null {
  const parent = mesh.parent;
  if (!parent) return null;

  // setFromObject works in world space, so the hinge has to come back into
  // the parent's frame before it can be used as a local position.
  const box = new THREE.Box3().setFromObject(mesh);
  if (!isFinite(box.min.x)) return null;

  // Hinge sits on the leading (+X) or trailing (-X) edge, mid-height,
  // centred spanwise on the surface itself.
  const hinge = new THREE.Vector3(
    edge === "fore" ? box.max.x : box.min.x,
    (box.min.y + box.max.y) / 2,
    (box.min.z + box.max.z) / 2,
  );
  parent.worldToLocal(hinge);

  const pivot = new THREE.Group();
  pivot.name = `${mesh.name}__pivot`;
  pivot.position.copy(hinge);
  parent.add(pivot);

  mesh.position.sub(hinge);
  pivot.add(mesh);
  return pivot;
}

/* --------------------------------------------------------------------------
 * LANDING GEAR
 *
 * Absent from the GLB, so built here. Dimensions are the A320's: nose tyres
 * 780 × 254 mm, main tyres 1270 × 455 mm, track 7.59 m. Each leg is a group
 * whose y-scale is driven for oleo compression and whose parent rotates for
 * retraction.
 * ------------------------------------------------------------------------ */

function Wheel({ r, width, mat }: { r: number; width: number; mat: Finish }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh material={mat.tyre} castShadow>
        <cylinderGeometry args={[r, r, width, 24]} />
      </mesh>
      {/* Hub — a bright disc inside the dark tyre reads as a wheel even at
          the size this renders on screen. */}
      <mesh material={mat.strut} position={[0, width * 0.52, 0]}>
        <cylinderGeometry args={[r * 0.52, r * 0.52, width * 0.06, 18]} />
      </mesh>
      <mesh material={mat.strut} position={[0, -width * 0.52, 0]}>
        <cylinderGeometry args={[r * 0.52, r * 0.52, width * 0.06, 18]} />
      </mesh>
    </group>
  );
}

type LegProps = {
  /** Mount point in model space. */
  at: readonly [number, number, number];
  /** Vertical distance from mount to axle when fully extended. */
  travel: number;
  wheelR: number;
  wheelWidth: number;
  halfTrack: number;
  mat: Finish;
  /** Which way the leg folds when it retracts. */
  foldAxis: "x" | "z";
  foldSign: number;
};

const Leg = forwardRef<{ pivot: THREE.Group; oleo: THREE.Group; spin: THREE.Group }, LegProps>(
  function Leg({ at, travel, wheelR, wheelWidth, halfTrack, mat, foldAxis, foldSign }, ref) {
    const pivot = useRef<THREE.Group>(null!);
    const oleo = useRef<THREE.Group>(null!);
    const spin = useRef<THREE.Group>(null!);

    useImperativeHandle(ref, () => ({
      pivot: pivot.current,
      oleo: oleo.current,
      spin: spin.current,
    }));

    return (
      <group ref={pivot} position={at as unknown as THREE.Vector3Tuple}>
        {/* Trunnion */}
        <mesh material={mat.strut} castShadow>
          <sphereGeometry args={[0.17, 12, 10]} />
        </mesh>

        {/* Oleo — scaled in y to compress. Geometry is anchored at the top so
            scaling shortens the strut downward, exactly like the real thing. */}
        <group ref={oleo}>
          <mesh material={mat.strut} position={[0, -travel * 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.13, travel, 12]} />
          </mesh>
          {/* Polished slider, visibly narrower than the housing */}
          <mesh material={mat.metal} position={[0, -travel * 0.78, 0]} castShadow>
            <cylinderGeometry args={[0.085, 0.085, travel * 0.44, 12]} />
          </mesh>
          {/* Torque link */}
          <mesh
            material={mat.strut}
            position={[0.09, -travel * 0.62, 0]}
            rotation={[0, 0, 0.34]}
            castShadow
          >
            <boxGeometry args={[0.045, travel * 0.34, 0.05]} />
          </mesh>

          {/* Axle and wheels */}
          <group ref={spin} position={[0, -travel, 0]}>
            <mesh material={mat.strut} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.06, halfTrack * 2.3, 10]} />
            </mesh>
            <group position={[0, 0, halfTrack]}>
              <Wheel r={wheelR} width={wheelWidth} mat={mat} />
            </group>
            <group position={[0, 0, -halfTrack]}>
              <Wheel r={wheelR} width={wheelWidth} mat={mat} />
            </group>
          </group>
        </group>

        {/* Marks which way this leg folds; read by the animation code. */}
        <object3D userData={{ foldAxis, foldSign }} />
      </group>
    );
  },
);

/* --------------------------------------------------------------------------
 * COMPONENT
 * ------------------------------------------------------------------------ */

export type A320Handle = {
  /** The outer group — scene frame, +Z forward, y = 0 at the wheels. */
  root: THREE.Group;
  /** Live controls the scene writes to each frame. */
  set: (s: A320Controls) => void;
};

export type A320Controls = {
  thrust: number;
  gear: number;
  compression: number;
  flaps: number;
  speed: number;
  /** Aileron / elevator / rudder deflection, -1 → 1. */
  aileron: number;
  elevator: number;
  rudder: number;
  /** Nose wheel steering, -1 → 1. */
  steering: number;
  spoilers: number;
  /** Light levels, 0 → 1. */
  beacon: number;
  strobe: number;
  nav: number;
  landingLights: number;
  /** Seconds, for anything that free-runs. */
  time: number;
  delta: number;
};

export const A320 = forwardRef<A320Handle, { quality?: "high" | "low" }>(function A320(
  { quality = "high" },
  ref,
) {
  /* useGLTF hands every mount the same cached scene, and the rig below
     rewrites its materials and hinges in place. Rigging a fresh clone each
     mount keeps the cached original untouched, so coming back to the page
     can't find it already re-materialled (and fall back to plain paint).
     The clone shares geometry, so it costs almost nothing. */
  const { scene: cached } = useGLTF(MODEL_URL);
  const scene = useMemo(() => cached.clone(true), [cached]);
  const root = useRef<THREE.Group>(null!);
  const finishes = useMemo(() => buildFinishes(), []);

  const noseLeg = useRef<{ pivot: THREE.Group; oleo: THREE.Group; spin: THREE.Group }>(null);
  const leftLeg = useRef<{ pivot: THREE.Group; oleo: THREE.Group; spin: THREE.Group }>(null);
  const rightLeg = useRef<{ pivot: THREE.Group; oleo: THREE.Group; spin: THREE.Group }>(null);
  /** The two hot-nozzle lights, so they can follow the throttles. */
  const engineGlow = useRef<THREE.Group>(null);

  /* ---- Rig the imported scene once ---- */
  const rig = useMemo(() => {
    // Box3.setFromObject reads world matrices, so they have to be current
    // before any hinge is measured.
    scene.updateMatrixWorld(true);

    const nodes: Record<string, THREE.Object3D> = {};
    /* The exported materials carry two airline liveries the site does not
       use. Every one of them is replaced below, so the originals and their
       textures are released rather than left decoded on the GPU. */
    const orphaned = new Set<THREE.Material>();

    scene.traverse((o) => {
      nodes[o.name] = o;
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        const src = o.material as THREE.Material | THREE.Material[];
        if (Array.isArray(src)) {
          src.forEach((m) => orphaned.add(m));
          o.material = src.map((m) => classify(m.name, finishes, o.name));
        } else {
          orphaned.add(src);
          o.material = classify(src.name, finishes, o.name);
        }
      }
    });

    orphaned.forEach((m) => {
      const std = m as THREE.MeshStandardMaterial;
      std.map?.dispose();
      std.normalMap?.dispose();
      std.roughnessMap?.dispose();
      std.metalnessMap?.dispose();
      std.emissiveMap?.dispose();
      m.dispose();
    });

    const pivots: Record<string, THREE.Group> = {};
    const hinge = (name: string, edge: Edge) => {
      const n = nodes[name];
      if (!n) return;
      const p = repivot(n, edge);
      if (p) pivots[name] = p;
    };

    // Trailing-edge surfaces hinge on their forward edge.
    ["AileronL", "AileronR", "ElevatorL", "ElevatorR"].forEach((n) => hinge(n, "fore"));
    ["FlapL1", "FlapL2", "FlapR1", "FlapR2"].forEach((n) => hinge(n, "fore"));
    for (let i = 1; i <= 5; i++) {
      hinge(`SpoilerL${i}`, "fore");
      hinge(`SpoilerR${i}`, "fore");
      // Slats sit on the leading edge and hinge on their aft edge.
      hinge(`SlatL${i}`, "aft");
      hinge(`SlatR${i}`, "aft");
    }
    hinge("Rudder", "fore");

    return { nodes, pivots };
  }, [scene, finishes]);

  /* ---- Emissive light bodies, added once ---- */
  const lights = useMemo(() => {
    const mk = (color: string, intensity = 1) =>
      new THREE.MeshBasicMaterial({ color, toneMapped: false, transparent: true, opacity: intensity });
    return {
      navRed: mk("#ff3b46"),
      navGreen: mk("#2bff86"),
      strobe: mk("#ffffff"),
      beacon: mk("#ff2b2b"),
      landing: mk("#fff6e0"),
      fanGlow: mk("#7fd4ff"),
      exhaust: mk("#ff9a45"),
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(finishes).forEach((m) => m.dispose());
      Object.values(lights).forEach((m) => m.dispose());
    };
  }, [finishes, lights]);

  /* ---- Per-frame control application ---- */
  const apply = useMemo(() => {
    const { nodes, pivots } = rig;
    const fanL = nodes["fanWheel"];
    const fanR = nodes["fanWheel.001"];
    const bladesL = nodes["blades"];
    const bladesR = nodes["blades.001"];

    const gearDoors = [
      nodes["GearLDoor"],
      nodes["GearRDoor"],
      nodes["GearNFwdDoorL"],
      nodes["GearNFwdDoorR"],
      nodes["GearNAftDoorL"],
      nodes["GearNAftDoorR"],
    ].filter(Boolean);

    // Doors need pivots too, or they rotate about the fuselage centre.
    // Re-parenting above invalidated the world matrices, so refresh first.
    scene.updateMatrixWorld(true);
    const doorPivots = gearDoors
      .map((d) => repivot(d, d.name.startsWith("GearN") ? "fore" : "aft"))
      .filter((p): p is THREE.Group => !!p);

    return (c: A320Controls) => {
      /* Fans. Idle is a visible turn; TOGA is a blur. */
      const rpm = c.thrust <= 0.01 ? 0 : 3 + c.thrust * 62;
      if (fanL) fanL.rotation.x += rpm * c.delta;
      if (fanR) fanR.rotation.x -= rpm * c.delta;
      if (bladesL) bladesL.rotation.x += rpm * c.delta;
      if (bladesR) bladesR.rotation.x -= rpm * c.delta;

      /* Flaps and slats. */
      for (const k of ["FlapL1", "FlapL2", "FlapR1", "FlapR2"]) {
        const p = pivots[k];
        if (p) p.rotation.z = c.flaps * 0.62;
      }
      for (let i = 1; i <= 5; i++) {
        const l = pivots[`SlatL${i}`];
        const r = pivots[`SlatR${i}`];
        if (l) l.rotation.z = -c.flaps * 0.35;
        if (r) r.rotation.z = -c.flaps * 0.35;
      }

      /* Roll, pitch, yaw. Ailerons oppose each other. */
      if (pivots["AileronL"]) pivots["AileronL"].rotation.z = c.aileron * 0.4;
      if (pivots["AileronR"]) pivots["AileronR"].rotation.z = -c.aileron * 0.4;
      if (pivots["ElevatorL"]) pivots["ElevatorL"].rotation.z = c.elevator * 0.35;
      if (pivots["ElevatorR"]) pivots["ElevatorR"].rotation.z = c.elevator * 0.35;
      if (pivots["Rudder"]) pivots["Rudder"].rotation.y = c.rudder * 0.42;

      for (let i = 1; i <= 5; i++) {
        const l = pivots[`SpoilerL${i}`];
        const r = pivots[`SpoilerR${i}`];
        if (l) l.rotation.z = -c.spoilers * 0.6;
        if (r) r.rotation.z = -c.spoilers * 0.6;
      }

      /* Gear. Doors lead the legs slightly on the way up, which is the order
         the real sequence runs in. */
      const doorOpen = THREE.MathUtils.clamp(c.gear * 1.35, 0, 1);
      doorPivots.forEach((p, i) => {
        const sign = i % 2 === 0 ? 1 : -1;
        p.rotation.x = sign * doorOpen * 1.15;
      });

      const legs = [noseLeg.current, leftLeg.current, rightLeg.current];
      legs.forEach((leg, i) => {
        if (!leg?.pivot) return;
        leg.pivot.visible = c.gear > 0.02;
        // Nose folds forward about Z, mains fold inboard about X.
        if (i === 0) leg.pivot.rotation.z = (1 - c.gear) * 1.5;
        else leg.pivot.rotation.x = (1 - c.gear) * (i === 1 ? 1.5 : -1.5);

        // Oleo compression shortens the strut.
        if (leg.oleo) {
          const squash = 1 - c.compression * 0.24;
          leg.oleo.scale.y = squash;
        }
        // Wheels spin with groundspeed, and only while they are on the ground.
        if (leg.spin && c.compression > 0.05) {
          const radius = i === 0 ? GEOM.noseGear.wheelR : GEOM.mainGear.wheelR;
          leg.spin.rotation.z -= (c.speed / radius) * c.delta;
        }
      });

      // Nose wheel steering.
      if (noseLeg.current?.pivot) {
        noseLeg.current.pivot.rotation.y = c.steering * 0.55;
      }

      /* Lights. */
      const flash = (period: number, on: number, offset = 0) =>
        ((c.time + offset) % period) < on ? 1 : 0;
      lights.beacon.opacity = c.beacon * (0.25 + flash(1.05, 0.16) * 0.75);
      lights.strobe.opacity =
        c.strobe * (flash(1.6, 0.055) || flash(1.6, 0.055, -0.18) ? 1 : 0.02);
      lights.navRed.opacity = c.nav;
      lights.navGreen.opacity = c.nav;
      lights.landing.opacity = c.landingLights;
      lights.fanGlow.opacity = Math.min(0.5, c.thrust * 0.5);
      lights.exhaust.opacity = Math.min(0.9, c.thrust * 0.95);

      /* Cabin lighting comes up with the aeroplane's power, and settles a
         touch dimmer once airborne — as the cabin does after takeoff. */
      finishes.window_.emissiveIntensity = c.nav * (0.9 - c.gear * 0.15);
      finishes.glass.emissiveIntensity = c.nav * 0.32;

      /* The nozzles only throw light when there is something burning in them. */
      if (engineGlow.current) {
        const heat = Math.min(1, c.thrust * 1.25) * 14;
        engineGlow.current.children.forEach((light) => {
          (light as THREE.PointLight).intensity = heat;
        });
      }
    };
  }, [rig, lights, scene, finishes]);

  useImperativeHandle(ref, () => ({ root: root.current, set: apply }), [apply]);

  const mainGearY = GEOM.mainGear.top;
  const noseTravel = GEOM.noseGear.top - (GROUND_Y + GEOM.noseGear.wheelR);
  const mainTravel = mainGearY - (GROUND_Y + GEOM.mainGear.wheelR);

  return (
    <group ref={root} dispose={null}>
      {/* Model space: rotated so the nose points down +Z, lifted so the
          wheels rest on y = 0. */}
      <group rotation={[0, -Math.PI / 2, 0]} position={[0, GROUND_LIFT, 0]}>
        <primitive object={scene} />

        {/* ---- Cabin windows ---- */}
        <CabinWindows mat={finishes.window_} />

        {/* ---- Landing gear ---- */}
        <Leg
          ref={noseLeg}
          at={[GEOM.noseGear.x, GEOM.noseGear.top, GEOM.noseGear.z]}
          travel={noseTravel}
          wheelR={GEOM.noseGear.wheelR}
          wheelWidth={0.25}
          halfTrack={GEOM.noseGear.halfTrack}
          mat={finishes}
          foldAxis="z"
          foldSign={1}
        />
        <Leg
          ref={leftLeg}
          at={[GEOM.mainGear.x, mainGearY, -GEOM.mainGear.z]}
          travel={mainTravel}
          wheelR={GEOM.mainGear.wheelR}
          wheelWidth={0.45}
          halfTrack={GEOM.mainGear.halfTrack}
          mat={finishes}
          foldAxis="x"
          foldSign={1}
        />
        <Leg
          ref={rightLeg}
          at={[GEOM.mainGear.x, mainGearY, GEOM.mainGear.z]}
          travel={mainTravel}
          wheelR={GEOM.mainGear.wheelR}
          wheelWidth={0.45}
          halfTrack={GEOM.mainGear.halfTrack}
          mat={finishes}
          foldAxis="x"
          foldSign={-1}
        />

        {/* ---- Navigation lights: red to port, green to starboard ---- */}
        <mesh material={lights.navRed} position={[-5.4, 2.95, -16.85]}>
          <sphereGeometry args={[0.16, 10, 10]} />
        </mesh>
        <mesh material={lights.navGreen} position={[-5.4, 2.95, 16.9]}>
          <sphereGeometry args={[0.16, 10, 10]} />
        </mesh>

        {/* ---- Strobes: wingtips and tail cone ---- */}
        <mesh material={lights.strobe} position={[-5.6, 2.95, -16.85]}>
          <sphereGeometry args={[0.19, 10, 10]} />
        </mesh>
        <mesh material={lights.strobe} position={[-5.6, 2.95, 16.9]}>
          <sphereGeometry args={[0.19, 10, 10]} />
        </mesh>
        <mesh material={lights.strobe} position={[-22.2, 3.1, 0]}>
          <sphereGeometry args={[0.17, 10, 10]} />
        </mesh>

        {/* ---- Anti-collision beacons, above the spine and under the belly ---- */}
        <mesh material={lights.beacon} position={[2.4, 4.7, 0]}>
          <sphereGeometry args={[0.15, 10, 10]} />
        </mesh>
        <mesh material={lights.beacon} position={[0.5, 0.15, 0]}>
          <sphereGeometry args={[0.15, 10, 10]} />
        </mesh>

        {/* ---- Landing lights, in the wing roots ---- */}
        <mesh material={lights.landing} position={[1.4, 1.35, -3.1]}>
          <sphereGeometry args={[0.2, 10, 10]} />
        </mesh>
        <mesh material={lights.landing} position={[1.4, 1.35, 3.1]}>
          <sphereGeometry args={[0.2, 10, 10]} />
        </mesh>

        {/* ---- Engines: intake glow and hot nozzle ---- */}
        {[-6.25, 6.34].map((z) => (
          <group key={z}>
            <mesh material={lights.fanGlow} position={[3.3, 0.4, z]} rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[0.92, 1.02, 36]} />
            </mesh>
            <mesh
              material={lights.exhaust}
              position={[-0.55, 0.4, z]}
              rotation={[0, Math.PI / 2, 0]}
            >
              <circleGeometry args={[0.52, 24]} />
            </mesh>
          </group>
        ))}

        <group ref={engineGlow}>
          {quality === "high" &&
            [-6.25, 6.34].map((z) => (
              <pointLight
                key={z}
                position={[-1.1, 0.4, z]}
                color="#ff8a3d"
                intensity={0}
                distance={11}
              />
            ))}
        </group>
      </group>
    </group>
  );
});

useGLTF.preload(MODEL_URL);
