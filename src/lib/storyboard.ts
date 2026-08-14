/* ==========================================================================
 * THE STORYBOARD
 *
 * The roadmap is the runway. Scroll progress across the nine steps of
 * "Steps to Become an Airline Pilot" is the flight timeline, 0 → 1, and the
 * aeroplane's entire condition is a function of that one number.
 *
 * The six aircraft states from the brief are placed against the nine steps
 * so that each state lands on the step that earns it:
 *
 *   p     step                              aircraft
 *   ────  ────────────────────────────────  ─────────────────────────────
 *   0.00  01 Complete 12th Board Exams      Cold & dark, parked
 *   0.11  02 Class 2 Medical                still cold — nothing has begun
 *   0.26  03 DGCA & RTR(A) prep             engines start, taxi begins
 *   0.44  04 Class 1 Medical                taxiing
 *   0.55  05 DGCA & RTR(A) exams            taxiing faster
 *   0.62  06 DGCA Computer Number           lined up, holding
 *   0.75  07 CPL Flight Training            TOGA, roll, rotate
 *   0.87  08 CPL Licence & Conversion       gear up, initial climb
 *   1.00  09 Type Rating                    cruise — "Congratulations"
 *
 * Nothing here is a separate animation timeline. There are keys and there is
 * interpolation, which is why the aeroplane can never be out of step with
 * how far down the roadmap you have read.
 * ========================================================================== */

/** The nine roadmap steps, as scroll positions. Step i spans [i/9, (i+1)/9]. */
export const STEP_COUNT = 9;
export const stepStart = (i: number) => i / STEP_COUNT;
export const stepCentre = (i: number) => (i + 0.5) / STEP_COUNT;

export type AircraftState = {
  /** Metres along the runway centreline from the parking spot. */
  distance: number;
  /** Metres above the runway. 0 = wheels on tarmac. */
  altitude: number;
  /** Ground/air speed in metres per second — drives wheel spin. */
  speed: number;
  /** N1 as a fraction: 0 shut down, 0.22 idle, 1.0 TOGA. */
  thrust: number;
  /** Nose-up pitch, radians. */
  pitch: number;
  /** Roll, radians. */
  roll: number;
  /** 1 extended and locked, 0 fully retracted and doors closed. */
  gear: number;
  /** Oleo compression, 0 fully extended (airborne) → 1 sitting on it. */
  compression: number;
  /** Trailing-edge flap setting, 0 clean → 1 full. */
  flaps: number;
  /** Lights, 0 → 1. */
  beacon: number;
  strobe: number;
  nav: number;
  landingLights: number;
};

export type StoryKey = AircraftState & {
  /** Scroll position this key sits at. */
  at: number;
  /** Present when this key is one of the six named stages. */
  stage?: string;
};

/* --------------------------------------------------------------------------
 * KEYS
 *
 * Six of these are the named stages. The rest are holds — a stage that lasts
 * across two roadmap steps needs a key at each end or it would start drifting
 * the moment you scrolled past its name.
 * ------------------------------------------------------------------------ */

export const STORYBOARD: StoryKey[] = [
  /* ---- 1 · Thinking to Become a Pilot — cold and dark ---- */
  {
    at: 0,
    stage: "Thinking to Become a Pilot",
    distance: 0,
    altitude: 0,
    speed: 0,
    thrust: 0,
    pitch: 0,
    roll: 0,
    gear: 1,
    compression: 1,
    flaps: 0,
    beacon: 0,
    strobe: 0,
    nav: 0,
    landingLights: 0,
  },
  /* Holds through the second step: nothing has started yet. */
  {
    at: 0.16,
    distance: 0,
    altitude: 0,
    speed: 0,
    thrust: 0,
    pitch: 0,
    roll: 0,
    gear: 1,
    compression: 1,
    flaps: 0,
    beacon: 0,
    strobe: 0,
    nav: 0,
    landingLights: 0,
  },

  /* ---- 2 · Ground School — engine start, lights, taxi begins ---- */
  {
    at: 0.3,
    stage: "Ground School",
    distance: 90,
    altitude: 0,
    speed: 4.5,
    thrust: 0.24,
    pitch: 0,
    roll: 0,
    gear: 1,
    compression: 0.96,
    flaps: 0.35,
    beacon: 1,
    strobe: 0,
    nav: 1,
    landingLights: 0.3,
  },

  /* ---- 3 · Flight School — taxiing properly, controls checked ---- */
  {
    at: 0.5,
    stage: "Flight School",
    distance: 380,
    altitude: 0,
    speed: 13,
    thrust: 0.3,
    pitch: 0,
    roll: 0,
    gear: 1,
    compression: 0.92,
    flaps: 0.55,
    beacon: 1,
    strobe: 0,
    nav: 1,
    landingLights: 0.6,
  },

  /* Lined up on the centreline, holding, about to be released. */
  {
    at: 0.62,
    distance: 560,
    altitude: 0,
    speed: 2,
    thrust: 0.32,
    pitch: 0,
    roll: 0,
    gear: 1,
    compression: 1,
    flaps: 0.55,
    beacon: 1,
    strobe: 1,
    nav: 1,
    landingLights: 1,
  },

  /* Takeoff roll. Deliberately flat: an A320 rotates at Vr, not gradually
     down the whole runway, and it strikes its tail at 11.7° on the ground. */
  {
    at: 0.73,
    distance: 1150,
    altitude: 0,
    speed: 55,
    thrust: 1,
    pitch: 0.01,
    roll: 0,
    gear: 1,
    /* Lift is unloading the oleos well before the wheels leave. */
    compression: 0.72,
    flaps: 0.55,
    beacon: 1,
    strobe: 1,
    nav: 1,
    landingLights: 1,
  },

  /* ---- 4 · CPL — rotation. Nose comes up, mains leave the tarmac ---- */
  {
    at: 0.78,
    stage: "CPL",
    distance: 1620,
    altitude: 7,
    speed: 80,
    thrust: 1,
    pitch: 0.17,
    roll: 0,
    gear: 1,
    compression: 0.08,
    flaps: 0.55,
    beacon: 1,
    strobe: 1,
    nav: 1,
    landingLights: 1,
  },

  /* ---- 5 · Ready to Taxi / Initial Climb — gear up, climbing away ---- */
  {
    at: 0.89,
    stage: "Ready to Taxi / Initial Climb",
    distance: 3900,
    altitude: 560,
    speed: 93,
    thrust: 0.88,
    pitch: 0.22,
    roll: -0.1,
    gear: 0,
    compression: 0,
    flaps: 0.25,
    beacon: 1,
    strobe: 1,
    nav: 1,
    landingLights: 0.45,
  },

  /* ---- 6 · Ready to Take Off / Success — cruise ---- */
  {
    at: 1,
    stage: "Ready to Take Off / Success",
    distance: 12000,
    altitude: 2400,
    speed: 118,
    thrust: 0.6,
    pitch: 0.03,
    roll: 0,
    gear: 0,
    compression: 0,
    flaps: 0,
    beacon: 1,
    strobe: 1,
    nav: 1,
    landingLights: 0,
  },
];

/* --------------------------------------------------------------------------
 * CAMERA
 *
 * One shot per beat, described the way a director would: where the camera
 * sits relative to the aeroplane, and where it points. Offsets are in metres
 * and are added to the aeroplane's position, so a shot stays composed no
 * matter where along the runway it is.
 * ------------------------------------------------------------------------ */

export type CameraKey = {
  at: number;
  /** Camera position, as an offset from the aeroplane. */
  offset: readonly [number, number, number];
  /** Look-at point, as an offset from the aeroplane. */
  target: readonly [number, number, number];
  fov: number;
  /** How hard the camera chases. Low = loose and cinematic. */
  damping: number;
};

export const CAMERA_TRACK: CameraKey[] = [
  /* Wide establishing shot — the whole aeroplane, small in a large frame. */
  { at: 0, offset: [62, 19, 78], target: [0, 3, 8], fov: 34, damping: 0.5 },
  { at: 0.16, offset: [52, 12, 62], target: [0, 3, 6], fov: 36, damping: 0.6 },

  /* Lower tracking shot as it starts to roll. */
  { at: 0.3, offset: [40, 6.5, 48], target: [0, 3, 4], fov: 38, damping: 0.9 },

  /* Side-on tracking shot — the classic taxi profile. */
  { at: 0.5, offset: [6, 4.6, 46], target: [0, 3.4, -2], fov: 43, damping: 1.15 },

  /* Down the centreline from ahead, lined up and waiting. */
  { at: 0.62, offset: [2, 3.4, 62], target: [0, 3.2, 0], fov: 40, damping: 1.0 },

  /* Dynamic low takeoff shot, close to the tarmac, looking up at rotation. */
  { at: 0.78, offset: [24, 2.4, -38], target: [0, 6, 6], fov: 52, damping: 1.6 },

  /* Follow camera, tilted up, chasing it into the climb. */
  { at: 0.89, offset: [30, 10, -48], target: [0, 7, 12], fov: 45, damping: 1.0 },

  /* Wide aerial hero shot at cruise. */
  { at: 1, offset: [52, 14, 68], target: [0, 4, 0], fov: 33, damping: 0.45 },
];

/* --------------------------------------------------------------------------
 * SAMPLING
 * ------------------------------------------------------------------------ */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Finds the pair of keys straddling p, and how far between them it lies. */
function bracket<T extends { at: number }>(track: T[], p: number) {
  const x = clamp01(p);
  let i = 0;
  while (i < track.length - 2 && x > track[i + 1].at) i++;
  const a = track[i];
  const b = track[i + 1] ?? a;
  const span = b.at - a.at || 1;
  return { a, b, t: smooth(clamp01((x - a.at) / span)) };
}

/** Writes the aeroplane's condition at scroll position p into `out`. */
export function sampleAircraft(p: number, out: AircraftState): AircraftState {
  const { a, b, t } = bracket(STORYBOARD, p);
  out.distance = lerp(a.distance, b.distance, t);
  out.altitude = lerp(a.altitude, b.altitude, t);
  out.speed = lerp(a.speed, b.speed, t);
  out.thrust = lerp(a.thrust, b.thrust, t);
  out.pitch = lerp(a.pitch, b.pitch, t);
  out.roll = lerp(a.roll, b.roll, t);
  out.gear = lerp(a.gear, b.gear, t);

  /* Oleo compression is keyed, but it is really a consequence of weight on
     wheels: once the aeroplane is off the ground the struts are extended, no
     matter what the surrounding keys say. Enforcing it here means a key can
     never leave the gear visibly squashed in mid-air. */
  const onGround = 1 - clamp01(out.altitude / 1.5);
  out.compression = lerp(a.compression, b.compression, t) * onGround;
  out.flaps = lerp(a.flaps, b.flaps, t);
  out.beacon = lerp(a.beacon, b.beacon, t);
  out.strobe = lerp(a.strobe, b.strobe, t);
  out.nav = lerp(a.nav, b.nav, t);
  out.landingLights = lerp(a.landingLights, b.landingLights, t);
  return out;
}

export type SampledCamera = {
  ox: number;
  oy: number;
  oz: number;
  tx: number;
  ty: number;
  tz: number;
  fov: number;
  damping: number;
};

export function sampleCamera(p: number, out: SampledCamera): SampledCamera {
  const { a, b, t } = bracket(CAMERA_TRACK, p);
  out.ox = lerp(a.offset[0], b.offset[0], t);
  out.oy = lerp(a.offset[1], b.offset[1], t);
  out.oz = lerp(a.offset[2], b.offset[2], t);
  out.tx = lerp(a.target[0], b.target[0], t);
  out.ty = lerp(a.target[1], b.target[1], t);
  out.tz = lerp(a.target[2], b.target[2], t);
  out.fov = lerp(a.fov, b.fov, t);
  out.damping = lerp(a.damping, b.damping, t);
  return out;
}

export function emptyAircraftState(): AircraftState {
  return {
    distance: 0,
    altitude: 0,
    speed: 0,
    thrust: 0,
    pitch: 0,
    roll: 0,
    gear: 1,
    compression: 1,
    flaps: 0,
    beacon: 0,
    strobe: 0,
    nav: 0,
    landingLights: 0,
  };
}

/** Copy shown when the last step is reached. Fixed by the brief. */
export const SUCCESS_MESSAGE = {
  title: "Congratulations",
  body: "You are now ready for your journey.",
} as const;
