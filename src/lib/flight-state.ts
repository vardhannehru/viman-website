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
   * Scroll progress across the roadmap, 0 → 1. This is the flight timeline:
   * step 01 is the aeroplane cold on the ramp, step 09 is cruise. Everything
   * the aeroplane does is a function of this one number.
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

  /** Live figures published by the scene each frame, for the instrument strip. */
  readout: { speed: 0, altitude: 0, thrust: 0, distance: 0 },
};
