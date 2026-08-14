"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, SMAA } from "@react-three/postprocessing";
import { flight } from "@/lib/flight-state";
import {
  emptyAircraftState,
  sampleAircraft,
  sampleCamera,
  type SampledCamera,
} from "@/lib/storyboard";
import { A320, type A320Controls, type A320Handle } from "./a320";
import { Airport, CloudDecks, SkyDome, Starfield, SUN_DIR } from "./atmosphere";

/* ==========================================================================
 * THE DIRECTOR
 *
 * One input: scroll progress across the roadmap. Everything else — where the
 * aeroplane is, what its engines are doing, which lights are on, where the
 * camera stands — is derived from it every frame.
 * ========================================================================== */

function FlightDirector({ quality }: { quality: "high" | "low" }) {
  const aircraft = useRef<A320Handle>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const { camera } = useThree();

  const v = useMemo(
    () => ({
      state: emptyAircraftState(),
      /** Damped follow of raw scroll, so flings do not snap the aeroplane. */
      p: 0,
      prevAltitude: 0,
      prevRoll: 0,
      cam: { ox: 0, oy: 0, oz: 0, tx: 0, ty: 0, tz: 0, fov: 34, damping: 1 } as SampledCamera,
      camPos: new THREE.Vector3(62, 19, 78),
      camTarget: new THREE.Vector3(),
      lookAt: new THREE.Vector3(0, 3, 8),
      controls: {
        thrust: 0,
        gear: 1,
        compression: 1,
        flaps: 0,
        speed: 0,
        aileron: 0,
        elevator: 0,
        rudder: 0,
        steering: 0,
        spoilers: 0,
        beacon: 0,
        strobe: 0,
        nav: 0,
        landingLights: 0,
        time: 0,
        delta: 0,
      } as A320Controls,
    }),
    [],
  );

  useFrame((scene, rawDelta) => {
    // Clamp delta so a dropped frame or a backgrounded tab cannot fling the
    // aeroplane down the runway.
    const delta = Math.min(rawDelta, 1 / 20);
    const t = scene.clock.elapsedTime;
    const portrait = scene.size.height > scene.size.width;

    /* ---- Scroll, damped ---- */
    v.p += (flight.progress - v.p) * (1 - Math.pow(0.002, delta));
    const p = v.p;

    /* ---- The aeroplane ---- */
    const s = sampleAircraft(p, v.state);

    // It flies straight down the runway centreline: x = 0, z = distance.
    // "Always aligned with the roadmap" is not a constraint to satisfy — it
    // is the only degree of freedom the aeroplane has.
    const root = aircraft.current?.root;
    if (root) {
      root.position.set(0, s.altitude, s.distance);
      root.rotation.set(s.pitch, 0, s.roll);
    }

    /* ---- Derive the control inputs from what the airframe is doing ---- */
    const climbRate = (s.altitude - v.prevAltitude) / Math.max(delta, 1e-4);
    const rollRate = (s.roll - v.prevRoll) / Math.max(delta, 1e-4);
    v.prevAltitude = s.altitude;
    v.prevRoll = s.roll;

    const c = v.controls;
    c.thrust = s.thrust;
    c.gear = s.gear;
    c.compression = s.compression;
    c.flaps = s.flaps;
    c.speed = s.speed;
    c.beacon = s.beacon;
    c.strobe = s.strobe;
    c.nav = s.nav;
    c.landingLights = s.landingLights;
    c.time = t;
    c.delta = delta;

    c.elevator = THREE.MathUtils.clamp(-s.pitch * 2.2 - climbRate * 0.004, -1, 1);
    c.aileron = THREE.MathUtils.clamp(rollRate * 1.2 + s.roll * 0.8, -1, 1);

    // A slow control check during the taxi — full and free, as briefed.
    const taxiing = s.speed > 1 && s.altitude < 1 && s.thrust < 0.5;
    if (taxiing) {
      c.aileron += Math.sin(t * 0.9) * 0.55;
      c.elevator += Math.sin(t * 0.7 + 1.2) * 0.4;
      c.rudder = Math.sin(t * 0.55 + 2.4) * 0.5;
      c.steering = Math.sin(t * 0.4) * 0.12;
    } else {
      c.rudder += (0 - c.rudder) * 0.06;
      c.steering += (0 - c.steering) * 0.06;
    }
    c.spoilers = 0;

    aircraft.current?.set(c);

    /* ---- Publish for the DOM instrument strip and the runway lights ---- */
    flight.readout.speed = s.speed;
    flight.readout.altitude = s.altitude;
    flight.readout.thrust = s.thrust;
    flight.readout.distance = s.distance;

    /* ---- Camera ---- */
    const shot = sampleCamera(p, v.cam);

    // Pointer parallax, strongest at the wide establishing shots.
    const parallax = 1 - THREE.MathUtils.smoothstep(p, 0.16, 0.62);

    v.camPos.set(
      shot.ox + flight.pointerX * 14 * parallax,
      shot.oy + s.altitude - flight.pointerY * 7 * parallax,
      shot.oz + s.distance,
    );
    // Stand further off in portrait so the full 34 m span clears a narrow frame.
    if (portrait) {
      v.camPos.x *= 1.45;
      v.camPos.z = s.distance + (v.camPos.z - s.distance) * 1.45;
    }

    camera.position.lerp(v.camPos, 1 - Math.pow(0.0001 * shot.damping, delta));

    v.camTarget.set(shot.tx, shot.ty + s.altitude, shot.tz + s.distance);
    v.lookAt.lerp(v.camTarget, 1 - Math.pow(0.002, delta));
    camera.lookAt(v.lookAt);

    const cam = camera as THREE.PerspectiveCamera;
    const fov = shot.fov * (portrait ? 1.15 : 1);
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov += (fov - cam.fov) * (1 - Math.pow(0.02, delta));
      cam.updateProjectionMatrix();
    }

    /* ---- Key light tracks the aeroplane so the shadow never falls off ---- */
    if (keyLight.current) {
      keyLight.current.position.set(
        SUN_DIR.x * 220,
        SUN_DIR.y * 220 + 160 + s.altitude,
        SUN_DIR.z * 220 + s.distance,
      );
      keyLight.current.target.position.set(0, s.altitude, s.distance);
      keyLight.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <A320 ref={aircraft} quality={quality} />

      <directionalLight
        ref={keyLight}
        intensity={2.6}
        color="#ffd9b0"
        castShadow={quality === "high"}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={10}
        shadow-camera-far={620}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-90}
        shadow-bias={-0.0008}
        shadow-normalBias={0.6}
      />
    </>
  );
}

/* --------------------------------------------------------------------------
 * LIGHTING RIG
 *
 * A studio built from area lights. This — not the geometry — is what makes
 * the aluminium read as aluminium.
 * ------------------------------------------------------------------------ */

function Rig() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#0a1424"]} />

      {/* Key streak overhead — draws the long highlight down the spine */}
      <Lightformer
        form="rect"
        intensity={7}
        color="#ffffff"
        position={[0, 40, 10]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[70, 20, 1]}
      />
      {/* Warm sunrise rim from behind */}
      <Lightformer
        form="rect"
        intensity={6}
        color="#ffc487"
        position={[-40, 8, -60]}
        rotation={[0, Math.PI / 2.4, 0]}
        scale={[60, 26, 1]}
      />
      {/* Cool sky fill from the left */}
      <Lightformer
        form="rect"
        intensity={3.4}
        color="#9fd0ff"
        position={[-50, 16, 12]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[60, 30, 1]}
      />
      {/* Ground bounce so the belly never goes to pure black */}
      <Lightformer
        form="rect"
        intensity={1.4}
        color="#2a3a4f"
        position={[0, -26, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[90, 90, 1]}
      />
    </Environment>
  );
}

/* -------------------------------------------------------------------------- */

export function FlightScene({ quality }: { quality: "high" | "low" }) {
  return (
    <>
      <fogExp2 attach="fog" args={["#16273f", 0.00012]} />

      <SkyDome />
      <Starfield count={quality === "high" ? 900 : 350} />
      <CloudDecks count={quality === "high" ? 60 : 24} />
      <Airport />

      <Rig />
      {/* Restrained: the Environment rig above is doing the real work, and
          stacking ambient on top of it flattens the airframe into grey. */}
      <ambientLight intensity={0.18} color="#8fb4e8" />
      <hemisphereLight args={["#bcdcff", "#0e1a28", 0.5]} />

      <FlightDirector quality={quality} />

      {quality === "high" && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={0.42}
            luminanceThreshold={0.82}
            luminanceSmoothing={0.22}
            mipmapBlur
            radius={0.65}
          />
          <Vignette offset={0.3} darkness={0.62} eskil={false} />
          <SMAA />
        </EffectComposer>
      )}
    </>
  );
}
