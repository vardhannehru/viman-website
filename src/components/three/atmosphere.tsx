"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { flight } from "@/lib/flight-state";
import { taxiRoute } from "@/lib/storyboard";
import { createCloudTexture, createRunwayTexture } from "./textures";

/* ==========================================================================
 * The world is in metres, at 1:1 with the aeroplane. A320 span 34 m, runway
 * 45 m wide and 3 000 m long, cruise at 2 400 m. Working at real scale means
 * the aeroplane's size is legible without ever having to be described.
 * ========================================================================== */

/** The film's position, 0 → 1. */
const phase = () => flight.progress;

/* --------------------------------------------------------------------------
 * SKY
 *
 * Three palettes, not two. Night → sunrise happens across the arrival, and
 * sunrise → morning daylight across the climb, so the sky at cruise is a blue
 * sky with a warm horizon rather than a permanent orange wall.
 * ------------------------------------------------------------------------ */

const skyVertex = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragment = /* glsl */ `
  varying vec3 vPos;
  uniform float uDawn;
  uniform float uDay;
  uniform vec3  uSunDir;

  void main() {
    vec3 dir = normalize(vPos);
    float h  = dir.y;

    /* Blue hour on the ramp. Dark enough that the ramp lighting is what you
       are actually seeing by, which is the whole point of starting here. */
    vec3 nightTop    = vec3(0.005, 0.012, 0.034);
    vec3 nightMid    = vec3(0.016, 0.038, 0.086);
    vec3 nightBottom = vec3(0.042, 0.080, 0.148);

    /* Sunrise */
    vec3 dawnTop     = vec3(0.045, 0.130, 0.310);
    vec3 dawnMid     = vec3(0.240, 0.400, 0.640);
    vec3 dawnBottom  = vec3(0.960, 0.470, 0.190);

    /* Morning daylight at altitude */
    vec3 dayTop      = vec3(0.060, 0.200, 0.480);
    vec3 dayMid      = vec3(0.300, 0.500, 0.760);
    vec3 dayBottom   = vec3(0.680, 0.780, 0.900);

    vec3 top    = mix(mix(nightTop,    dawnTop,    uDawn), dayTop,    uDay);
    vec3 mid    = mix(mix(nightMid,    dawnMid,    uDawn), dayMid,    uDay);
    vec3 bottom = mix(mix(nightBottom, dawnBottom, uDawn), dayBottom, uDay);

    /* The warm band is kept tight to the horizon. Spread it up the dome and
       the whole sky goes orange, which is the single fastest way to make a
       sunrise look painted rather than lit. */
    float t1 = smoothstep(-0.05, 0.20, h);
    float t2 = smoothstep(0.18, 0.75, h);
    vec3 col = mix(bottom, mid, t1);
    col = mix(col, top, t2);

    /* Horizon band — cold at night, molten at sunrise, and mostly gone by the
       time the aeroplane is at altitude, where the horizon is pale, not orange. */
    float band = exp(-abs(h) * 9.0);
    vec3 rim = mix(vec3(0.15, 0.55, 0.85), vec3(1.0, 0.46, 0.18), uDawn);
    col += rim * band * (0.14 + uDawn * 1.05) * (1.0 - uDay * 0.66);

    /* Sun disc and its bloom into the surrounding sky. The falloff exponents
       are high on purpose: a wide, low-exponent term reads as haze over the
       entire frame rather than as a sun, and bloom then amplifies it. */
    float sd = max(dot(dir, normalize(uSunDir)), 0.0);
    float glow = pow(sd, 3000.0) * 3.0 + pow(sd, 180.0) * 0.16 + pow(sd, 30.0) * 0.035;
    vec3 sunTint = mix(vec3(0.30, 0.48, 0.80), vec3(1.0, 0.72, 0.44), uDawn);
    col += mix(sunTint, vec3(1.0, 0.95, 0.88), uDay) * glow * (0.2 + uDawn * 0.8);

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

/**
 * Sun direction, shared so the key light and the sky agree.
 *
 * Placed well off the camera axis on purpose. The shots all look forward and
 * inboard from the starboard side, so a sun ahead of them puts a blown-out
 * disc in the middle of every frame; out to port it rim-lights the airframe
 * instead, which is the shot worth having.
 */
export const SUN_DIR = new THREE.Vector3(-0.86, -0.07, 0.44).normalize();

/**
 * The sun actually climbs.
 *
 * `SUN_DIR` is a live vector re-derived from scroll every frame and read by
 * both the sky shader and the key light, so the disc in the sky and the
 * direction the airframe is lit from can never disagree.
 *
 * Two arcs, not one. It breaks the horizon during the arrival and then holds
 * low through the taxi and the takeoff — golden light along the fuselage at
 * the moment the aeroplane rotates, which is the point of setting the film at
 * this hour — before climbing to a proper morning elevation at cruise.
 */
export function updateSunDirection(p: number) {
  const risen = THREE.MathUtils.smoothstep(p, 0.03, 0.34);
  const morning = THREE.MathUtils.smoothstep(p, 0.6, 1);

  /* -4° at first light, +7° through the takeoff, +32° at cruise. */
  const elevation = THREE.MathUtils.lerp(-0.07, 0.12, risen) + morning * 0.44;

  /* It also swings as it rises, so the shadows rotate rather than simply
     shortening. */
  const azimuth = THREE.MathUtils.lerp(2.62, 2.12, THREE.MathUtils.smoothstep(p, 0.05, 0.9));

  SUN_DIR.set(
    Math.cos(elevation) * Math.cos(azimuth),
    Math.sin(elevation),
    Math.cos(elevation) * Math.sin(azimuth),
  ).normalize();
  return SUN_DIR;
}

export function SkyDome() {
  const mesh = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const uniforms = useMemo(
    () => ({
      uDawn: { value: 0 },
      uDay: { value: 0 },
      uSunDir: { value: SUN_DIR.clone() },
    }),
    [],
  );

  useFrame((_, delta) => {
    mesh.current?.position.copy(camera.position);
    const p = phase();
    const dawn = THREE.MathUtils.smoothstep(p, 0.03, 0.32);
    const day = THREE.MathUtils.smoothstep(p, 0.62, 0.98);
    const k = flight.reducedMotion ? 1 : 1 - Math.pow(0.05, delta);
    uniforms.uDawn.value += (dawn - uniforms.uDawn.value) * k;
    uniforms.uDay.value += (day - uniforms.uDay.value) * k;
    uniforms.uSunDir.value.copy(SUN_DIR);
  });

  return (
    <mesh ref={mesh} renderOrder={-1000}>
      <sphereGeometry args={[9000, 40, 28]} />
      <shaderMaterial
        args={[
          {
            vertexShader: skyVertex,
            fragmentShader: skyFragment,
            uniforms,
            side: THREE.BackSide,
            depthWrite: false,
            fog: false,
          },
        ]}
      />
    </mesh>
  );
}

/* --------------------------------------------------------------------------
 * STARS — visible on the ramp, washed out by first light.
 * ------------------------------------------------------------------------ */

export function Starfield({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const { camera } = useThree();

  const geometry = useMemo(() => {
    /* Seeded, so the sky is the same on every load and the server and the
       client cannot disagree about it. */
    let seed = 9781;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(1 - rand() * 1.3);
      const r = 4000 + rand() * 2500;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.9;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.position.copy(camera.position);
    if (mat.current) {
      const target = 0.85 * (1 - THREE.MathUtils.smoothstep(phase(), 0.03, 0.26));
      const k = flight.reducedMotion ? 1 : 1 - Math.pow(0.06, delta);
      mat.current.opacity += (target - mat.current.opacity) * k;
    }
  });

  return (
    <points ref={ref} geometry={geometry} renderOrder={-900}>
      <pointsMaterial
        ref={mat}
        color="#cfe0ff"
        size={7}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        fog={false}
        toneMapped={false}
      />
    </points>
  );
}

/* --------------------------------------------------------------------------
 * CLOUDS
 *
 * Two decks. A high deck that is on the horizon from the start — it is what
 * catches the sunrise and gives the sky something to be lit — and a low deck
 * that only matters once the aeroplane is climbing through it.
 *
 * The drift comes from scroll, not from a clock, so the sky stops when the
 * page stops.
 * ------------------------------------------------------------------------ */

type Puff = {
  position: [number, number, number];
  scale: number;
  opacity: number;
  deck: 0 | 1;
};

export function CloudDecks({ count = 60 }: { count?: number }) {
  const texture = useMemo(() => createCloudTexture(), []);
  const group = useRef<THREE.Group>(null);

  const tint = useMemo(
    () => ({
      warm: new THREE.Color("#ffcfa6"),
      cool: new THREE.Color("#dfeaff"),
      out: new THREE.Color(),
    }),
    [],
  );

  const puffs = useMemo<Puff[]>(() => {
    const out: Puff[] = [];
    let seed = 20250814;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = 0; i < count; i++) {
      const low = i < count * 0.45;
      out.push({
        /* Spread along the whole flight path rather than around the airfield,
           and kept below cruise, so the last shot is an aeroplane over a cloud
           floor instead of an aeroplane in an empty gradient. */
        position: [
          (rand() - 0.5) * 9000,
          low ? 620 + rand() * 380 : 1450 + rand() * 520,
          rand() * 22000 - 3000,
        ],
        scale: low ? 500 + rand() * 520 : 800 + rand() * 900,
        opacity: low ? 0.2 + rand() * 0.22 : 0.24 + rand() * 0.3,
        deck: low ? 0 : 1,
      });
    }
    return out;
  }, [count]);

  useFrame(() => {
    if (!group.current) return;
    const p = phase();

    /* Warm at sunrise, neutral once the sun is properly up. */
    tint.out.copy(tint.warm).lerp(tint.cool, THREE.MathUtils.smoothstep(p, 0.45, 0.9));

    /* Both decks are faintly on the horizon from first light — they are what
       the sunrise has to fall on — and come up to full as the aeroplane
       climbs into them. */
    const high =
      0.4 * THREE.MathUtils.smoothstep(p, 0.04, 0.28) +
      0.6 * THREE.MathUtils.smoothstep(p, 0.55, 0.95);
    const low =
      0.25 * THREE.MathUtils.smoothstep(p, 0.05, 0.3) +
      0.75 * THREE.MathUtils.smoothstep(p, 0.5, 0.9);

    group.current.children.forEach((child, i) => {
      const puff = puffs[i];
      if (!puff) return;
      child.position.x = puff.position[0] + Math.sin(p * 26 + i) * 40;
      const mat = (child as THREE.Sprite).material as THREE.SpriteMaterial;
      mat.opacity = puff.opacity * (puff.deck === 0 ? low : high);
      mat.color.copy(tint.out);
    });
  });

  return (
    <group ref={group}>
      {puffs.map((puff, i) => (
        <sprite key={i} position={puff.position} scale={[puff.scale, puff.scale * 0.55, 1]}>
          <spriteMaterial
            map={texture}
            transparent
            opacity={0}
            depthWrite={false}
            color="#dfeaff"
            fog={false}
          />
        </sprite>
      ))}
    </group>
  );
}

/* --------------------------------------------------------------------------
 * AIRPORT
 *
 * A 3 000 m runway on the +Z centreline with the threshold at z = -110, an
 * apron off to port where the aeroplane spends the first half of the film,
 * and the taxiway that joins the two.
 *
 * The taxiway is not drawn by hand: it is generated from the same storyboard
 * the aeroplane is driven by, so the painted route and the wheels on it are
 * the same curve by construction.
 * ------------------------------------------------------------------------ */

const RUNWAY_LENGTH = 3000;
const RUNWAY_WIDTH = 45;
/** The threshold, in metres along +Z. */
const RUNWAY_START = -110;
const LIGHT_PAIRS = 40;
const LIGHT_SPACING = RUNWAY_LENGTH / LIGHT_PAIRS;

/** The apron the aeroplane is parked on, and the ramp road beside it. */
const APRON = { x: -85, z: -240, w: 96, d: 132 };
/** Candela on the flood masts. Physically-lit renderer, so this is not a 0-1.
    Enough to model the airframe out of the dark; not enough to light it. */
const FLOOD = 2800;

/** Builds a flat ribbon of tarmac that follows a ground track. */
function ribbon(points: { x: number; z: number }[], halfWidth: number) {
  const position: number[] = [];
  const index: number[] = [];

  for (let i = 0; i < points.length; i++) {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    let dx = next.x - prev.x;
    let dz = next.z - prev.z;
    const len = Math.hypot(dx, dz) || 1;
    dx /= len;
    dz /= len;
    // Perpendicular, in the ground plane.
    const nx = -dz;
    const nz = dx;
    position.push(points[i].x + nx * halfWidth, 0, points[i].z + nz * halfWidth);
    position.push(points[i].x - nx * halfWidth, 0, points[i].z - nz * halfWidth);
  }

  for (let i = 0; i < points.length - 1; i++) {
    const b = i * 2;
    index.push(b, b + 2, b + 1, b + 1, b + 2, b + 3);
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

export function Airport({ quality = "high" }: { quality?: "high" | "low" }) {
  const runwayTex = useMemo(() => {
    const t = createRunwayTexture();
    t.repeat.set(1, 60);
    return t;
  }, []);

  /* The route the aeroplane taxis, extended back onto the stand so the ribbon
     starts under the parked aeroplane rather than in front of it. */
  const route = useMemo(() => {
    const pts = taxiRoute();
    const first = pts[0];
    return [{ x: first.x, z: first.z - 46 }, ...pts];
  }, []);

  const taxiway = useMemo(() => ribbon(route, 12.5), [route]);
  const taxiwayLine = useMemo(() => ribbon(route, 0.32), [route]);

  const edgeLights = useRef<THREE.InstancedMesh>(null);
  const centreLights = useRef<THREE.InstancedMesh>(null);
  const lightGroup = useRef<THREE.Group>(null);
  const groundMat = useRef<THREE.MeshStandardMaterial>(null);
  const floods = useRef<THREE.Group>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colour = useMemo(() => new THREE.Color(), []);
  /** What was lit last frame — the colour buffers are only re-uploaded when
      that actually changes, rather than sixty times a second. */
  const litCount = useRef(-999);

  useFrame(() => {
    const p = phase();

    // The ground fades out as the aeroplane climbs away from it.
    if (groundMat.current) {
      const fade = 1 - THREE.MathUtils.smoothstep(p, 0.9, 1.0);
      groundMat.current.opacity = 0.2 + fade * 0.8;
    }

    /* Apron floodlights: on in the dark, off once the sun has done the job. */
    if (floods.current) {
      const on = 1 - THREE.MathUtils.smoothstep(p, 0.16, 0.44);
      floods.current.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh && (mesh.material as THREE.MeshBasicMaterial).transparent) {
          (mesh.material as THREE.MeshBasicMaterial).opacity = on;
        }
        const light = o as THREE.PointLight;
        if (light.isPointLight) light.intensity = on * FLOOD;
      });
    }

    /* Runway lighting is a progress bar: each pair illuminates as the
       aeroplane reaches it, so the strip lights up behind the student. It only
       counts while the aeroplane is actually lined up on it, and it is
       switched off entirely once it is far above the airfield. */
    const z = flight.readout.distance ?? 0;
    const onRunway = Math.abs(flight.readout.lateral ?? 0) < 30;
    const visible = flight.readout.altitude < 500;
    if (lightGroup.current) lightGroup.current.visible = visible;

    const nowLit = onRunway && visible ? Math.floor((z + 40) / LIGHT_SPACING) + 2 : -1;
    if (nowLit === litCount.current) return;
    litCount.current = nowLit;

    if (edgeLights.current) {
      for (let i = 0; i < LIGHT_PAIRS * 2; i++) {
        const pair = Math.floor(i / 2);
        const side = i % 2 === 0 ? 1 : -1;
        const lz = RUNWAY_START + pair * LIGHT_SPACING;

        dummy.position.set((side * RUNWAY_WIDTH) / 2, 0.25, lz);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        edgeLights.current.setMatrixAt(i, dummy.matrix);

        // Lit once the aeroplane has reached it; the last 600 m are the
        // amber caution section, as on a real runway.
        const lit = nowLit >= 0 && z >= lz - 40 ? 1 : 0.06;
        const amber = lz > RUNWAY_START + RUNWAY_LENGTH - 600;
        colour.setStyle(amber ? "#ffb54a" : "#eaf4ff").multiplyScalar(lit);
        edgeLights.current.setColorAt(i, colour);
      }
      edgeLights.current.instanceMatrix.needsUpdate = true;
      if (edgeLights.current.instanceColor) edgeLights.current.instanceColor.needsUpdate = true;
    }

    if (centreLights.current) {
      for (let i = 0; i < LIGHT_PAIRS; i++) {
        const lz = RUNWAY_START + i * LIGHT_SPACING + LIGHT_SPACING / 2;
        dummy.position.set(0, 0.22, lz);
        dummy.updateMatrix();
        centreLights.current.setMatrixAt(i, dummy.matrix);
        colour.setStyle("#22e0ff").multiplyScalar(nowLit >= 0 && z >= lz - 40 ? 1 : 0.04);
        centreLights.current.setColorAt(i, colour);
      }
      centreLights.current.instanceMatrix.needsUpdate = true;
      if (centreLights.current.instanceColor) centreLights.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Airfield surface */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, RUNWAY_START + RUNWAY_LENGTH / 2]}
        receiveShadow
      >
        <planeGeometry args={[14000, 20000]} />
        <meshStandardMaterial
          ref={groundMat}
          color="#070d16"
          roughness={0.98}
          metalness={0.02}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Apron */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[APRON.x, 0.012, APRON.z]} receiveShadow>
        <planeGeometry args={[APRON.w, APRON.d]} />
        <meshStandardMaterial color="#141922" roughness={0.92} metalness={0.03} />
      </mesh>

      {/* Taxiway, generated from the storyboard's own ground track */}
      <mesh geometry={taxiway} position={[0, 0.016, 0]} receiveShadow>
        <meshStandardMaterial
          color="#12171f"
          roughness={0.9}
          metalness={0.03}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={taxiwayLine} position={[0, 0.02, 0]}>
        <meshStandardMaterial
          color="#c9a23a"
          roughness={0.7}
          metalness={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Runway */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.024, RUNWAY_START + RUNWAY_LENGTH / 2]}
        receiveShadow
      >
        <planeGeometry args={[RUNWAY_WIDTH, RUNWAY_LENGTH]} />
        <meshStandardMaterial map={runwayTex} roughness={0.86} metalness={0.04} />
      </mesh>

      {/* Threshold piano keys — worn paint, not fresh white, or they blow out
          under the key light and read louder than the aeroplane. */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[(i - 3.5) * 5, 0.04, RUNWAY_START + 32]}
        >
          <planeGeometry args={[2.6, 34]} />
          <meshStandardMaterial color="#9aa8b8" roughness={0.88} metalness={0.02} />
        </mesh>
      ))}

      <group ref={lightGroup}>
        {/* Edge lights */}
        <instancedMesh
          ref={edgeLights}
          args={[undefined, undefined, LIGHT_PAIRS * 2]}
          frustumCulled={false}
        >
          <sphereGeometry args={[0.55, 8, 6]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>

        {/* Centreline lights */}
        <instancedMesh
          ref={centreLights}
          args={[undefined, undefined, LIGHT_PAIRS]}
          frustumCulled={false}
        >
          <sphereGeometry args={[0.4, 8, 6]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
      </group>

      {/* Apron floodlight masts — the reason there is anything to see at all
          before the sun comes up. */}
      <group ref={floods}>
        {/* All four stand along the far edge of the apron, so from the camera
            side they rim the aeroplane rather than stand in front of it. */}
        {(
          [
            [APRON.x - 45, APRON.z - 60],
            [APRON.x - 45, APRON.z - 12],
            [APRON.x - 45, APRON.z + 36],
            [APRON.x - 45, APRON.z + 84],
          ] as const
        ).map(([x, z], i) => (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 11, 0]} castShadow={quality === "high"}>
              <cylinderGeometry args={[0.22, 0.34, 22, 8]} />
              <meshStandardMaterial color="#2b3340" roughness={0.75} metalness={0.5} />
            </mesh>
            <mesh position={[0, 22.4, 0]}>
              <boxGeometry args={[3.2, 0.7, 1.1]} />
              <meshBasicMaterial color="#ffe9c2" transparent opacity={1} toneMapped={false} />
            </mesh>
            {quality === "high" && (
              <pointLight
                position={[0, 21.6, 0]}
                color="#ffd9a8"
                intensity={FLOOD}
                distance={190}
                decay={2}
              />
            )}
          </group>
        ))}
      </group>

      <Buildings quality={quality} />
    </group>
  );
}

/* --------------------------------------------------------------------------
 * BUILDINGS
 *
 * A hangar line and a terminal block well beyond the apron. They exist to put
 * something man-made on the horizon behind the aeroplane and to give the
 * sunrise something to fall across — never to compete with it, so they stay
 * dark, low-contrast and far away.
 * ------------------------------------------------------------------------ */

function Buildings({ quality }: { quality: "high" | "low" }) {
  const windows = useRef<THREE.Group>(null);

  const blocks = useMemo(
    () =>
      [
        { pos: [-620, 9, -700], size: [170, 18, 70] },
        { pos: [-600, 7, -430], size: [120, 14, 58] },
        { pos: [-660, 12, -120], size: [200, 24, 84] },
        { pos: [-580, 6, 230], size: [96, 12, 52] },
        { pos: [-680, 8, 620], size: [150, 16, 64] },
      ] as const,
    [],
  );

  useFrame(() => {
    if (!windows.current) return;
    /* Lit windows before dawn, washed out afterwards — the same switch the
       rest of the airfield lighting is on. */
    const on = 1 - THREE.MathUtils.smoothstep(phase(), 0.16, 0.44);
    windows.current.children.forEach((child) => {
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = on * 0.3;
    });
  });

  return (
    <group>
      {blocks.map((b, i) => (
        <mesh
          key={i}
          position={b.pos as unknown as THREE.Vector3Tuple}
          castShadow={quality === "high"}
        >
          <boxGeometry args={b.size as unknown as [number, number, number]} />
          <meshStandardMaterial color="#161d29" roughness={0.94} metalness={0.06} />
        </mesh>
      ))}

      <group ref={windows}>
        {blocks.map((b, i) => (
          <mesh
            key={i}
            position={[b.pos[0] + b.size[0] / 2 + 0.4, b.pos[1], b.pos[2]]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <planeGeometry args={[b.size[2] * 0.9, b.size[1] * 0.28]} />
            <meshBasicMaterial
              color="#ffdda6"
              transparent
              opacity={0}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
