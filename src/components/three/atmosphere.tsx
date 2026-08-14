"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { flight } from "@/lib/flight-state";
import { createCloudTexture, createRunwayTexture } from "./textures";

/* ==========================================================================
 * The world is in metres, at 1:1 with the aeroplane. A320 span 34 m, runway
 * 45 m wide and 3 000 m long, cruise at 2 400 m. Working at real scale means
 * the aeroplane's size is legible without ever having to be described.
 * ========================================================================== */

/** Flight position, 0 → 1 across the nine roadmap steps. */
const phase = () => flight.progress;

/* --------------------------------------------------------------------------
 * SKY
 *
 * Pre-dawn on the ramp → full sunrise at cruise. The colour transition is the
 * emotional arc of the whole page, so it is driven by progress, not by time.
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
  uniform float uPhase;
  uniform vec3  uSunDir;

  void main() {
    vec3 dir = normalize(vPos);
    float h  = dir.y;

    /* Blue hour on the ramp */
    vec3 nightTop    = vec3(0.012, 0.026, 0.062);
    vec3 nightMid    = vec3(0.035, 0.075, 0.150);
    vec3 nightBottom = vec3(0.090, 0.150, 0.250);

    /* Sunrise at altitude */
    vec3 dawnTop     = vec3(0.045, 0.130, 0.310);
    vec3 dawnMid     = vec3(0.240, 0.400, 0.640);
    vec3 dawnBottom  = vec3(0.960, 0.560, 0.330);

    vec3 top    = mix(nightTop,    dawnTop,    uPhase);
    vec3 mid    = mix(nightMid,    dawnMid,    uPhase);
    vec3 bottom = mix(nightBottom, dawnBottom, uPhase);

    float t1 = smoothstep(-0.30, 0.12, h);
    float t2 = smoothstep(0.08, 0.70, h);
    vec3 col = mix(bottom, mid, t1);
    col = mix(col, top, t2);

    /* Horizon band — cold at night, molten at sunrise */
    float band = exp(-abs(h) * 7.5);
    vec3 rim = mix(vec3(0.15, 0.55, 0.85), vec3(1.0, 0.52, 0.24), uPhase);
    col += rim * band * (0.14 + uPhase * 0.75);

    /* Sun disc and its bloom into the surrounding sky. The falloff exponents
       are high on purpose: a wide, low-exponent term reads as haze over the
       entire frame rather than as a sun, and bloom then amplifies it. */
    float sd = max(dot(dir, normalize(uSunDir)), 0.0);
    float glow = pow(sd, 900.0) * 3.2 + pow(sd, 90.0) * 0.30 + pow(sd, 22.0) * 0.06;
    col += mix(vec3(0.30, 0.48, 0.80), vec3(1.0, 0.70, 0.40), uPhase) * glow * (0.2 + uPhase * 0.8);

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
export const SUN_DIR = new THREE.Vector3(-0.86, 0.26, 0.44).normalize();

export function SkyDome() {
  const mesh = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const uniforms = useMemo(
    () => ({ uPhase: { value: 0 }, uSunDir: { value: SUN_DIR.clone() } }),
    [],
  );

  useFrame((_, delta) => {
    mesh.current?.position.copy(camera.position);
    const target = THREE.MathUtils.smoothstep(phase(), 0.45, 1.0);
    uniforms.uPhase.value += (target - uniforms.uPhase.value) * (1 - Math.pow(0.05, delta));
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
 * STARS — visible on the ramp, washed out by the climb.
 * ------------------------------------------------------------------------ */

export function Starfield({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const { camera } = useThree();

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(1 - Math.random() * 1.3);
      const r = 4000 + Math.random() * 2500;
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
      const target = 0.85 * (1 - THREE.MathUtils.smoothstep(phase(), 0.25, 0.8));
      mat.current.opacity += (target - mat.current.opacity) * (1 - Math.pow(0.06, delta));
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
 * Two decks. A low scattered layer that only matters once the aeroplane is
 * off the ground, and a cruise deck that becomes the floor at stage six.
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

  const puffs = useMemo<Puff[]>(() => {
    const out: Puff[] = [];
    let seed = 20250814;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = 0; i < count; i++) {
      const low = i < count * 0.4;
      out.push({
        position: [
          (rand() - 0.5) * 5200,
          low ? 700 + rand() * 500 : 1750 + rand() * 900,
          rand() * 16000 - 1200,
        ],
        scale: low ? 420 + rand() * 460 : 700 + rand() * 900,
        opacity: low ? 0.16 + rand() * 0.2 : 0.24 + rand() * 0.3,
        deck: low ? 0 : 1,
      });
    }
    return out;
  }, [count]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const p = phase();
    group.current.children.forEach((child, i) => {
      const puff = puffs[i];
      if (!puff) return;
      child.position.x = puff.position[0] + Math.sin(t * 0.02 + i) * 22;
      const mat = (child as THREE.Sprite).material as THREE.SpriteMaterial;
      // Clouds only exist once there is sky to put them in.
      const reveal = THREE.MathUtils.smoothstep(p, puff.deck === 0 ? 0.5 : 0.62, 0.95);
      mat.opacity = puff.opacity * reveal;
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
 * A 3 000 m runway on the +Z centreline with the threshold at z = 0, so the
 * aeroplane's `distance` in metres is literally its z position.
 *
 * The edge lights are the progress bar: each pair illuminates as the
 * aeroplane reaches it, so the runway lights up behind the student.
 * ------------------------------------------------------------------------ */

const RUNWAY_LENGTH = 3000;
const RUNWAY_WIDTH = 45;
/** The threshold sits behind the parking spot, so the aeroplane starts the
    story already standing on the runway rather than short of it. */
const RUNWAY_START = -110;
const LIGHT_PAIRS = 40;
const LIGHT_SPACING = RUNWAY_LENGTH / LIGHT_PAIRS;

export function Airport() {
  const runwayTex = useMemo(() => {
    const t = createRunwayTexture();
    t.repeat.set(1, 60);
    return t;
  }, []);

  const edgeLights = useRef<THREE.InstancedMesh>(null);
  const centreLights = useRef<THREE.InstancedMesh>(null);
  const groundMat = useRef<THREE.MeshStandardMaterial>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colour = useMemo(() => new THREE.Color(), []);
  /** How many lights were lit last frame — the colour buffers are only
      re-uploaded when that number actually changes. */
  const litCount = useRef(-1);

  useFrame(() => {
    // The ground fades out as the aeroplane climbs away from it.
    if (groundMat.current) {
      const fade = 1 - THREE.MathUtils.smoothstep(phase(), 0.78, 1.0);
      groundMat.current.opacity = 0.2 + fade * 0.8;
    }

    // Aircraft position along the runway, in metres. The lights only change
    // when the aeroplane crosses one, so the colour buffers stay put in
    // between rather than being re-uploaded 60 times a second.
    const z = flight.readout.distance ?? 0;
    const nowLit = Math.max(0, Math.floor((z + 40) / LIGHT_SPACING) + 1);
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
        const lit = z >= lz - 40 ? 1 : 0.06;
        const amber = lz > RUNWAY_LENGTH - 600;
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
        colour.setStyle("#22e0ff").multiplyScalar(z >= lz - 40 ? 1 : 0.04);
        centreLights.current.setColorAt(i, colour);
      }
      centreLights.current.instanceMatrix.needsUpdate = true;
      if (centreLights.current.instanceColor) centreLights.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Terrain */}
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

      {/* Runway */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, RUNWAY_START + RUNWAY_LENGTH / 2]}
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
  );
}
