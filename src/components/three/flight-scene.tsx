"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
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
import {
  Airport,
  CloudDecks,
  SkyDome,
  Starfield,
  SUN_DIR,
  updateSunDirection,
} from "./atmosphere";
import { Landscape } from "./terrain";

/* ==========================================================================
 * THE DIRECTOR
 *
 * One input: scroll progress. Everything else — where the aeroplane is, which
 * way its nose points, what its engines are doing, which lights are on, where
 * the sun sits, where the camera stands — is derived from it every frame.
 *
 * Nothing here advances on a clock. The only two things that free-run are the
 * anti-collision lights and the fan discs, because an aeroplane whose beacon
 * stops blinking the moment you stop scrolling does not read as "paused", it
 * reads as broken.
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
      /** Damped heading — a real aeroplane's nose swings round, it does not cut. */
      heading: 0,
      started: false,
      prevAltitude: 0,
      prevRoll: 0,
      cam: { ox: 0, oy: 0, oz: 0, tx: 0, ty: 0, tz: 0, fov: 34, damping: 1 } as SampledCamera,
      camPos: new THREE.Vector3(),
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

    /* Reduced motion, and the very first frame, land on the target state
       immediately instead of easing into it from nowhere. */
    const snap = flight.reducedMotion || !v.started;

    /* ---- Scroll, damped ---- */
    v.p = snap ? flight.progress : v.p + (flight.progress - v.p) * (1 - Math.pow(0.002, delta));
    const p = v.p;

    /* ---- The aeroplane ---- */
    const s = sampleAircraft(p, v.state);

    /* Heading is read off the path rather than keyed, so it steps as the route
       changes chord; damping is what turns those steps into a taxi turn. */
    let swing = s.heading - v.heading;
    while (swing > Math.PI) swing -= Math.PI * 2;
    while (swing < -Math.PI) swing += Math.PI * 2;
    v.heading = snap ? s.heading : v.heading + swing * (1 - Math.pow(0.004, delta));

    const root = aircraft.current?.root;
    if (root) {
      /* Yaw first, then pitch about the body's own lateral axis, then roll —
         which is what YXZ means and what an aeroplane actually does. With a
         heading of zero it is identical to the original two-axis behaviour. */
      root.rotation.order = "YXZ";
      root.position.set(s.lateral, s.altitude, s.distance);
      root.rotation.set(s.pitch, v.heading, s.roll);
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

    /* The full-and-free control check during the taxi. Its phase comes from
       scroll, not from the clock, so the surfaces stop where you stop. */
    const taxiing = s.speed > 1 && s.altitude < 1 && s.thrust < 0.5;
    if (taxiing) {
      const phase = p * 210;
      c.aileron += Math.sin(phase) * 0.55;
      c.elevator += Math.sin(phase * 0.8 + 1.2) * 0.4;
      c.rudder = Math.sin(phase * 0.6 + 2.4) * 0.5;
    } else {
      c.rudder += (0 - c.rudder) * 0.06;
    }
    /* Nose-wheel steering follows the turn the aeroplane is actually in. */
    c.steering = THREE.MathUtils.clamp(swing * 26, -1, 1) * (s.altitude < 1 ? 1 : 0);
    c.spoilers = 0;

    aircraft.current?.set(c);

    /* ---- Publish for the DOM instrument strip and the runway lights ---- */
    flight.readout.speed = s.speed;
    flight.readout.altitude = s.altitude;
    flight.readout.thrust = s.thrust;
    flight.readout.distance = s.distance;
    flight.readout.lateral = s.lateral;

    /* ---- Camera ---- */
    const shot = sampleCamera(p, v.cam);

    /* Pointer parallax, strongest at the wide establishing shots and again at
       the cruise hero shot; suppressed through the intimate ground beats. */
    const wide = Math.max(
      1 - THREE.MathUtils.smoothstep(p, 0.08, 0.4),
      THREE.MathUtils.smoothstep(p, 0.9, 1),
    );

    v.camPos.set(
      s.lateral + shot.ox + flight.pointerX * 14 * wide,
      shot.oy + s.altitude - flight.pointerY * 7 * wide,
      s.distance + shot.oz,
    );
    // Stand further off in portrait so the full 34 m span clears a narrow frame.
    if (portrait) {
      v.camPos.x = s.lateral + (v.camPos.x - s.lateral) * 1.45;
      v.camPos.z = s.distance + (v.camPos.z - s.distance) * 1.45;
    }

    if (snap) camera.position.copy(v.camPos);
    else camera.position.lerp(v.camPos, 1 - Math.pow(0.0001 * shot.damping, delta));

    v.camTarget.set(s.lateral + shot.tx, shot.ty + s.altitude, s.distance + shot.tz);
    if (snap) v.lookAt.copy(v.camTarget);
    else v.lookAt.lerp(v.camTarget, 1 - Math.pow(0.002, delta));
    camera.lookAt(v.lookAt);

    const cam = camera as THREE.PerspectiveCamera;
    const fov = shot.fov * (portrait ? 1.15 : 1);
    if (snap) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    } else if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov += (fov - cam.fov) * (1 - Math.pow(0.02, delta));
      cam.updateProjectionMatrix();
    }

    /* ---- The sun climbs with the scroll, and the key light follows it ---- */
    updateSunDirection(p);

    if (keyLight.current) {
      /* Positioned along the live sun vector, and kept over the aeroplane so
         the shadow camera never runs off the end of the runway. */
      keyLight.current.position.set(
        s.lateral + SUN_DIR.x * 260,
        Math.max(SUN_DIR.y * 260, 8) + 40 + s.altitude,
        s.distance + SUN_DIR.z * 260,
      );
      keyLight.current.target.position.set(s.lateral, s.altitude, s.distance);
      keyLight.current.target.updateMatrixWorld();

      /* Below the horizon the sun contributes nothing, and it takes hold fast
         once it clears it. Physically a 2° sun is very weak; cinematically the
         moment it breaks the horizon is the moment the airframe should start
         catching gold, so the response is deliberately steeper than reality. */
      const above = THREE.MathUtils.smoothstep(SUN_DIR.y, -0.03, 0.1);
      keyLight.current.intensity = above * 3.1;

      /* Low sun is reddened by the atmosphere it travels through, and cools
         toward white as it climbs — the reason a sunrise looks like one. */
      const warmth = 1 - THREE.MathUtils.smoothstep(SUN_DIR.y, 0.03, 0.45);
      keyLight.current.color.setRGB(1, 0.78 + (1 - warmth) * 0.2, 0.52 + (1 - warmth) * 0.42);
    }

    v.started = true;
  });

  return (
    <>
      <A320 ref={aircraft} quality={quality} />

      <directionalLight
        ref={keyLight}
        intensity={0}
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

/* --------------------------------------------------------------------------
 * AMBIENT
 *
 * The fill light is the difference between "night" and "morning" on every
 * surface the sun is not hitting. Pre-dawn it is a weak cold blue; by cruise
 * it is bright skylight. Scroll-driven, like everything else.
 * ------------------------------------------------------------------------ */

function AmbientRig() {
  const ambient = useRef<THREE.AmbientLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const { scene } = useThree();

  const v = useMemo(
    () => ({
      p: 0,
      started: false,
      night: new THREE.Color("#4a6a9e"),
      day: new THREE.Color("#bcdcff"),
      groundNight: new THREE.Color("#080f18"),
      groundDay: new THREE.Color("#28323f"),
      /* Haze is blue before dawn and picks up the sun's warmth as it rises —
         this is what puts atmospheric depth between the hills and the camera. */
      hazeNight: new THREE.Color("#0d1626"),
      hazeDay: new THREE.Color("#8fb0d8"),
      tmp: new THREE.Color(),
    }),
    [],
  );

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 20);
    const snap = flight.reducedMotion || !v.started;
    v.p = snap ? flight.progress : v.p + (flight.progress - v.p) * (1 - Math.pow(0.002, delta));
    v.started = true;

    const lit = THREE.MathUtils.smoothstep(v.p, 0.04, 0.6);

    /* The studio rig below is a fixed environment map, and a fixed environment
       map is a light that never goes out: without this, every reflective
       surface in the scene — airframe, tarmac, grass, glass — is lit for
       midday while the sky behind it is still at blue hour. Scaling the whole
       probe with the sunrise is what makes pre-dawn actually read as dark. */
    scene.environmentIntensity = 0.3 + lit * 0.78;

    if (ambient.current) {
      ambient.current.intensity = 0.06 + lit * 0.2;
      ambient.current.color.copy(v.tmp.copy(v.night).lerp(v.day, lit));
    }
    if (hemi.current) {
      hemi.current.intensity = 0.14 + lit * 0.52;
      hemi.current.color.copy(v.tmp.copy(v.night).lerp(v.day, lit));
      hemi.current.groundColor.copy(v.tmp.copy(v.groundNight).lerp(v.groundDay, lit));
    }
    if (scene.fog) {
      (scene.fog as THREE.FogExp2).color.copy(v.tmp.copy(v.hazeNight).lerp(v.hazeDay, lit));
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.06} color="#4a6a9e" />
      <hemisphereLight ref={hemi} args={["#4a6a9e", "#080f18", 0.14]} />
    </>
  );
}

/* --------------------------------------------------------------------------
 * REDUCED MOTION
 *
 * The canvas runs on `demand` when motion is not wanted, so the scene has to
 * be told to draw. A short burst of frames lets the environment probe, the
 * damped camera and the materials all arrive at the settled frame, and then
 * it stops for good.
 * ------------------------------------------------------------------------ */

function SettleOnce() {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    if (!flight.reducedMotion) return;
    let frames = 0;
    let id = requestAnimationFrame(function tick() {
      invalidate();
      if (++frames < 12) id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [invalidate]);

  return null;
}

/* -------------------------------------------------------------------------- */

export function FlightScene({ quality }: { quality: "high" | "low" }) {
  return (
    <>
      <fogExp2 attach="fog" args={["#16273f", 0.00012]} />

      <SkyDome />
      <Starfield count={quality === "high" ? 900 : 350} />
      <CloudDecks count={quality === "high" ? 90 : 30} />
      <Landscape quality={quality} />
      <Airport quality={quality} />

      <Rig />
      {/* Restrained: the Environment rig above is doing the real work, and
          stacking ambient on top of it flattens the airframe into grey. */}
      <AmbientRig />

      <FlightDirector quality={quality} />
      <SettleOnce />

      {quality === "high" && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={0.36}
            luminanceThreshold={0.86}
            luminanceSmoothing={0.24}
            mipmapBlur
            radius={0.6}
          />
          <Vignette offset={0.3} darkness={0.62} eskil={false} />
          <SMAA />
        </EffectComposer>
      )}
    </>
  );
}
