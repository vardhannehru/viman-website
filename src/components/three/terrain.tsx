"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { flight } from "@/lib/flight-state";

/* ==========================================================================
 * LANDSCAPE
 *
 * The airport sits in a place. The airfield itself is flat, because airfields
 * are; beyond its boundary the ground starts to roll, a tree line gives the
 * middle distance scale, and a ridge closes the horizon — and all three catch
 * the sunrise, which is what stops the sky from reading as a backdrop hung
 * behind the aeroplane.
 *
 * All of it is geometry, so it parallaxes correctly as the camera moves and
 * drops away properly during the climb. Everything is generated from seeded
 * PRNGs, so the landscape is identical on every load and between server and
 * client.
 * ========================================================================== */

function makeRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Half-width of the flat airfield, in metres. Nothing undulates inside this. */
const FIELD_HALF_WIDTH = 1300;
/** The airfield's centre along the runway. */
const FIELD_Z = 1200;

/* --------------------------------------------------------------------------
 * ROLLING GROUND
 *
 * A displaced grid that is dead flat across the airfield and gains relief the
 * further out it goes, so the runway sits in a landscape rather than on a
 * disc. The mask is what makes that safe: the aeroplane's world is untouched.
 * ------------------------------------------------------------------------ */

function Rolling({
  quality,
  material,
}: {
  quality: "high" | "low";
  material: THREE.Material;
}) {
  const geometry = useMemo(() => {
    const size = 17000;
    const segments = quality === "high" ? 110 : 56;
    const g = new THREE.PlaneGeometry(size, size, segments, segments);
    const pos = g.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < pos.count; i++) {
      // The plane is built in XY and rotated flat, so its local y is world z.
      const x = pos.getX(i);
      const z = pos.getY(i) + FIELD_Z;

      /* Relief ramps in from the airfield boundary outward. Lateral distance
         alone, so the ground stays flat the whole length of the strip and the
         approach and departure ends are both clean. */
      const out = Math.max(
        0,
        (Math.abs(x) - FIELD_HALF_WIDTH) / 2200,
        (Math.abs(z - FIELD_Z) - 4200) / 2600,
      );
      const mask = Math.min(1, out) ** 1.4;
      if (mask <= 0) continue;

      const h =
        Math.sin(x * 0.00042 + 1.7) * 34 +
        Math.sin(z * 0.00051 - 0.4) * 28 +
        Math.sin((x + z) * 0.00097 + 2.3) * 15 +
        Math.sin((x - z * 0.6) * 0.0021) * 6;

      pos.setZ(i, h * mask);
    }

    g.computeVertexNormals();
    return g;
  }, [quality]);

  return (
    <mesh
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.06, FIELD_Z]}
      receiveShadow
    />
  );
}

/* --------------------------------------------------------------------------
 * HILLS — a ring of low, soft ridges well outside the airport boundary.
 * ------------------------------------------------------------------------ */

function Hills({ quality }: { quality: "high" | "low" }) {
  const geometry = useMemo(() => {
    const rand = makeRandom(77713);
    const segments = quality === "high" ? 128 : 64;
    const radius = 7200;

    /* A ring of vertices whose height is a few summed sine terms — enough to
       read as a ridge line at 7 km without being a heightfield. */
    const positions: number[] = [];
    const indices: number[] = [];

    /* Kept low. The camera sits well off the centre of this ring, so the near
       side of it is only five or six kilometres away — a ridge that reads as
       "hills" on paper becomes a black wall across the top of the frame. */
    const ridge = (a: number) =>
      215 +
      Math.sin(a * 3.1 + 0.7) * 118 +
      Math.sin(a * 7.3 + 2.1) * 66 +
      Math.sin(a * 13.7 + 4.4) * 30;

    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      const jitter = 1 + (rand() - 0.5) * 0.06;
      const x = Math.cos(a) * radius * jitter;
      const z = Math.sin(a) * radius * jitter;
      positions.push(x, 0, z);
      positions.push(x, ridge(a) * jitter, z);
    }

    for (let i = 0; i < segments; i++) {
      const b = i * 2;
      indices.push(b, b + 1, b + 2);
      indices.push(b + 1, b + 3, b + 2);
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, [quality]);

  return (
    <mesh geometry={geometry} position={[0, -2, FIELD_Z + 200]} renderOrder={-800}>
      {/* Deliberately desaturated and dark. At this distance atmospheric
          scattering does most of the work, and a saturated hill reads as a
          painted flat. */}
      <meshStandardMaterial color="#141d2b" roughness={1} metalness={0} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* --------------------------------------------------------------------------
 * VEGETATION
 *
 * Two instanced scatters: a conifer belt along the airfield boundary, and low
 * scrub inside it. Two draw calls each, matrices written once, and both are
 * thinned right down on the low tier.
 * ------------------------------------------------------------------------ */

function TreeLine({ quality }: { quality: "high" | "low" }) {
  const count = quality === "high" ? 460 : 130;

  const matrices = useMemo(() => {
    const rand = makeRandom(42071);
    const dummy = new THREE.Object3D();
    const trunk: THREE.Matrix4[] = [];
    const canopy: THREE.Matrix4[] = [];

    for (let i = 0; i < count; i++) {
      /* Two belts either side of the field, running the length of the runway.
         They stay well clear of the strip, the apron and the taxiway. */
      const side = i % 2 === 0 ? 1 : -1;
      const x = side * (300 + rand() * 950);
      const z = -1100 + rand() * 5600;
      const h = 9 + rand() * 12;
      const spread = 0.55 + rand() * 0.3;

      dummy.position.set(x, h * 0.22, z);
      dummy.scale.set(spread * 0.5, h * 0.45, spread * 0.5);
      dummy.rotation.set(0, rand() * Math.PI, 0);
      dummy.updateMatrix();
      trunk.push(dummy.matrix.clone());

      dummy.position.set(x, h * 0.66, z);
      dummy.scale.set(spread * 2.6, h * 0.62, spread * 2.6);
      dummy.updateMatrix();
      canopy.push(dummy.matrix.clone());
    }
    return { trunk, canopy };
  }, [count]);

  const trunks = useRef<THREE.InstancedMesh>(null);
  const canopies = useRef<THREE.InstancedMesh>(null);

  /* Instance matrices never change, so they are written once rather than
     every frame. */
  const written = useRef(false);
  useFrame(() => {
    if (written.current || !trunks.current || !canopies.current) return;
    matrices.trunk.forEach((m, i) => trunks.current!.setMatrixAt(i, m));
    matrices.canopy.forEach((m, i) => canopies.current!.setMatrixAt(i, m));
    trunks.current.instanceMatrix.needsUpdate = true;
    canopies.current.instanceMatrix.needsUpdate = true;
    written.current = true;
  });

  return (
    <group>
      <instancedMesh ref={trunks} args={[undefined, undefined, count]} frustumCulled={false}>
        <cylinderGeometry args={[0.6, 0.9, 2, 5]} />
        <meshStandardMaterial color="#2a2119" roughness={0.95} metalness={0} />
      </instancedMesh>
      <instancedMesh ref={canopies} args={[undefined, undefined, count]} frustumCulled={false}>
        <coneGeometry args={[1, 2, 6]} />
        <meshStandardMaterial color="#1b2a1f" roughness={0.92} metalness={0} />
      </instancedMesh>
    </group>
  );
}

function Scrub({ quality }: { quality: "high" | "low" }) {
  const count = quality === "high" ? 220 : 60;

  const matrices = useMemo(() => {
    const rand = makeRandom(551029);
    const dummy = new THREE.Object3D();
    const out: THREE.Matrix4[] = [];

    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      /* Well outside the strip, the apron and the road, so nothing ever grows
         where an aeroplane has to be — and thinned out and flattened enough
         that it reads as rough grass rather than as a field of boulders. */
      const x = side * (190 + rand() * 210);
      const z = -700 + rand() * 4200;
      const s = 0.7 + rand() * 1.3;

      dummy.position.set(x, s * 0.22, z);
      dummy.scale.set(s * 2.1, s * 0.5, s * 2.1);
      dummy.rotation.set(0, rand() * Math.PI, 0);
      dummy.updateMatrix();
      out.push(dummy.matrix.clone());
    }
    return out;
  }, [count]);

  const mesh = useRef<THREE.InstancedMesh>(null);
  const written = useRef(false);
  useFrame(() => {
    if (written.current || !mesh.current) return;
    matrices.forEach((m, i) => mesh.current!.setMatrixAt(i, m));
    mesh.current.instanceMatrix.needsUpdate = true;
    written.current = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 4]} />
      <meshStandardMaterial color="#1d2a1c" roughness={0.95} metalness={0} />
    </instancedMesh>
  );
}

/* -------------------------------------------------------------------------- */

export function Landscape({ quality }: { quality: "high" | "low" }) {
  /* Airfield grass and the ground beyond it share one material, so they can
     never light differently at the seam. It is nearly black before dawn and
     only takes on colour as the sun comes up — driven by scroll, like
     everything else in the scene. */
  const grass = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0a1410", roughness: 1, metalness: 0 }),
    [],
  );

  useFrame(() => {
    const lit = THREE.MathUtils.smoothstep(flight.progress, 0.08, 0.55);
    const v = 0.022 + lit * 0.2;
    grass.color.setRGB(v * 0.62, v, v * 0.5);
  });

  return (
    <group>
      {/* The airfield itself: flat, because airfields are. */}
      <mesh
        material={grass}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.04, FIELD_Z]}
        receiveShadow
      >
        <planeGeometry args={[FIELD_HALF_WIDTH * 2, 9000]} />
      </mesh>

      <Rolling quality={quality} material={grass} />
      <Hills quality={quality} />
      <TreeLine quality={quality} />
      <Scrub quality={quality} />
    </group>
  );
}
