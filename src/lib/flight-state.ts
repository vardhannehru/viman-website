/**
 * A single mutable module-level record shared between the DOM (which owns
 * scrolling) and the WebGL canvas (which owns the aircraft).
 *
 * Deliberately not React state: the 3D scene reads this every frame inside
 * useFrame, and re-rendering React 60 times a second to move a plane would be
 * an act of vandalism.
 */

export const flight = {
  /**
   * The film's one input, 0 → 1, written by ScrollTrigger and nothing else.
   * 0 is pre-dawn on the ramp, 0.56 is lined up on the runway, 1 is cruise.
   * Everything visible — aeroplane, taxi, person, sun, sky, camera — is a
   * pure function of this number, which is why the whole thing scrubs.
   */
  progress: 0,

  /** Normalised pointer position, -1 → 1, already damped by the pointer hook. */
  pointerX: 0,
  pointerY: 0,
  /** Whether the canvas is on screen — drives frameloop suspension. */
  visible: true,
  /** Set once on mount from device capability probes. */
  quality: "high" as "high" | "low",
  /** Honours prefers-reduced-motion: the scene renders a single static frame. */
  reducedMotion: false,

  /** Live figures published by the scene each frame, for the instrument strip
      and for anything on the ground that needs to know where the aeroplane is. */
  readout: { speed: 0, altitude: 0, thrust: 0, distance: 0, lateral: 0 },
};

/**
 * The frame the scene settles on when the visitor has asked for reduced
 * motion: airborne, gear up, in daylight. Nothing animates, but the page is
 * not left staring at an unlit aeroplane in the dark either.
 */
export const REDUCED_MOTION_FRAME = 0.9;
