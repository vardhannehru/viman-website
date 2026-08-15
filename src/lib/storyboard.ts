/* ==========================================================================
 * THE STORYBOARD
 *
 * One number runs the entire film: `flight.progress`, 0 → 1, written by
 * ScrollTrigger and by nothing else. Where the aeroplane is, what its engines
 * are doing, which lights are on, where the taxi and the person are, where the
 * sun sits, where the camera stands — all of it is sampled from this file
 * every frame as a pure function of that number.
 *
 * Nothing in here is a timeline that plays. There are keys and there is
 * interpolation, which is why scrolling up reverses the film exactly and
 * stopping freezes it exactly.
 *
 * The film is in two acts, split at GROUND_ACT:
 *
 *   ACT I   0.00 → 0.56   the ground story
 *           Hero + "Which stage are you in?" + the pre-flight section.
 *           Pre-dawn on the stand, first light, sunrise, the aeroplane wakes
 *           up, engine start, and the taxi out to the runway.
 *
 *   ACT II  0.56 → 1.00   the flight
 *           The nine roadmap steps. This is the original verified curve —
 *           lined up, TOGA, rotation, gear up, climb, cruise — unchanged in
 *           shape and simply given the whole roadmap to happen across.
 *
 *   p     beat                          roadmap step
 *   ────  ────────────────────────────  ──────────────────────────────
 *   0.56  lined up, holding             01 Complete 12th Board Exams
 *   0.60  brakes released, TOGA         01
 *   0.70  accelerating                  02 Class 2 Medical
 *   0.78  rotation                      03 DGCA & RTR(A) prep
 *   0.81  liftoff                       04 Class 1 Medical
 *   0.88  gear up, initial climb        05 DGCA & RTR(A) exams
 *   0.92  climb, flaps retracting       06 DGCA Computer Number
 *   0.96  climbing through the deck     07 CPL Flight Training
 *   1.00  cruise                        09 Type Rating
 * ========================================================================== */

/** Where the ground story hands over to the flight. Act I is everything above
    the roadmap; act II is the roadmap itself. Read by the ScrollTrigger pair
    in `flight-canvas.tsx`, which is what makes the two agree. */
export const GROUND_ACT = 0.56;

export type AircraftState = {
  /** Metres along the runway centreline. The runway threshold is z = -110. */
  distance: number;
  /** Metres to the side of the centreline. Negative is the apron side. */
  lateral: number;
  /** Heading in radians, 0 = down the runway. Derived, never keyed. */
  heading: number;
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
};

/* --------------------------------------------------------------------------
 * KEYS
 *
 * Written as deltas against the previous key: a field that is not mentioned
 * holds exactly what it held before. Every hold in the film — the long dark
 * wait before first light, the aeroplane sitting still while someone walks
 * toward it — is therefore an empty object rather than fifteen repeated
 * numbers, and a field can never be left at a wrong value by accident.
 * ------------------------------------------------------------------------ */

/** The stand. The aeroplane is parked here for the first half of the film. */
export const GROUND = { park: { x: -62, z: -230 } } as const;

const PARKED: AircraftState = {
  /* Parked on the ramp, well short of the threshold and 62 m off the
     centreline, with the nose already pointing down the field. */
  distance: GROUND.park.z,
  lateral: GROUND.park.x,
  heading: 0,
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

function buildStoryboard(): StoryKey[] {
  const keys: StoryKey[] = [];
  let state: AircraftState = { ...PARKED };
  const key = (at: number, change: Partial<AircraftState> = {}) => {
    state = { ...state, ...change };
    keys.push({ at, ...state });
  };

  /* ======================= ACT I — THE GROUND STORY =======================
     The beats below are pinned to the sections that carry them: the hero
     holds pre-dawn, "which stage are you in?" holds first light, and the
     pre-flight section holds everything that actually happens. */

  /* Pre-dawn. Cold and dark on the ramp: no power, no lights, nothing turning.
     The only thing lit in the whole frame is the airfield itself. */
  key(0.0);

  /* The first hint of it. Still nothing has moved. */
  key(0.05);

  /* Ground power: the cabin and the cockpit start to show. */
  key(0.09, { nav: 0.12 });

  /* The sky warms and the stars go. The aeroplane has still not moved, and
     will not for a while yet — this is the quiet the film needs. */
  key(0.15);

  /* First light reaches the airframe. Still parked, still silent. */
  key(0.2, { nav: 0.3 });

  /* The sun breaks the horizon and the ramp floods start to lose the argument.
     The cabin comes up to full. */
  key(0.26, { nav: 0.7 });

  /* The aeroplane wakes: cabin and cockpit lit, nav lights on, nothing
     turning yet. */
  key(0.32, { nav: 1 });

  /* Beacon on, engines start, both spool to idle. */
  key(0.38, { beacon: 1, thrust: 0.22 });

  /* Chocks away. Rolls off the stand; flaps set for departure on the move. */
  key(0.44, { speed: 2.5, distance: -222, compression: 0.97, flaps: 0.3, landingLights: 0.25 });

  /* Down the parallel taxiway. */
  key(0.49, { speed: 6.5, distance: -180, thrust: 0.26, compression: 0.94, flaps: 0.5 });

  /* Onto the link. */
  key(0.515, { speed: 6, distance: -152, lateral: -58, compression: 0.93 });

  /* Through the turn. This is the whole reason `lateral` exists: the heading
     is derived from the path, so the nose points where the wheels are going
     without any of it being keyed by hand. */
  key(0.532, { speed: 5.5, distance: -128, lateral: -45 });
  key(0.545, { speed: 5, distance: -101, lateral: -20 });
  key(0.553, { speed: 3.4, distance: -84, lateral: -6, strobe: 1, landingLights: 1 });

  /* ==================== ACT II — THE VERIFIED FLIGHT ===================== */

  /* Lined up on the centreline, holding, about to be released. Everything
     from here down is the original curve. */
  key(GROUND_ACT, {
    speed: 0.6,
    distance: -55,
    lateral: 0,
    thrust: 0.34,
    compression: 1,
    flaps: 0.55,
  });

  /* Brakes off, thrust set. */
  key(0.6, { speed: 9, distance: -18, thrust: 1 });

  /* The roll. Deliberately flat: an A320 rotates at Vr, not gradually down
     the whole runway, and it strikes its tail at 11.7° on the ground. */
  key(0.66, { speed: 40, distance: 340, pitch: 0.005, compression: 0.92 });

  /* Approaching V1. Lift is already unloading the oleos. */
  key(0.72, { speed: 62, distance: 900, pitch: 0.01, compression: 0.78 });
  key(0.755, { speed: 74, distance: 1300, compression: 0.68 });

  /* Rotation. Nose comes up; the mains are still just on the tarmac. */
  key(0.78, { speed: 80, distance: 1650, altitude: 2, pitch: 0.14, compression: 0.15 });

  /* Positive rate. */
  key(0.81, { speed: 84, distance: 2050, altitude: 40, pitch: 0.19, compression: 0 });

  /* Gear travelling — doors lead the legs, as the real sequence does. */
  key(0.845, { speed: 88, distance: 2650, altitude: 140, gear: 0.4 });

  /* Gear up and locked, initial climb. */
  key(0.88, { speed: 92, distance: 3500, altitude: 320, gear: 0, landingLights: 0.5 });

  /* Climbing away, a gentle turn onto course, flaps coming in. */
  key(0.92, { speed: 100, distance: 5200, altitude: 820, pitch: 0.2, roll: -0.08, flaps: 0.25 });

  /* Through the low deck. */
  key(0.96, {
    speed: 110,
    distance: 8000,
    altitude: 1500,
    pitch: 0.12,
    roll: 0,
    flaps: 0,
    thrust: 0.78,
    landingLights: 0,
  });

  /* Cruise. */
  key(1, { speed: 118, distance: 12000, altitude: 2400, pitch: 0.03, thrust: 0.6 });

  return keys;
}

export const STORYBOARD: StoryKey[] = buildStoryboard();

/* --------------------------------------------------------------------------
 * CAMERA
 *
 * One shot per beat, described the way a director would: where the camera
 * sits relative to the aeroplane, and where it points. Offsets are in metres
 * and are added to the aeroplane's position, so a shot stays composed no
 * matter where on the airfield it is.
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
  /* Pre-dawn: wide, low and still, and pointed at the part of the horizon the
     sun is going to come up over — so the aeroplane is a silhouette against
     the first light rather than a grey shape in the dark. */
  { at: 0.0, offset: [88, 12, -76], target: [0, 6, 12], fov: 30, damping: 0.3 },

  /* First light — the frame closes in fractionally as the sky warms. */
  { at: 0.05, offset: [80, 10, -64], target: [0, 5.5, 10], fov: 31, damping: 0.32 },
  { at: 0.09, offset: [72, 8, -52], target: [0, 5, 10], fov: 33, damping: 0.4 },

  /* Closer and lower, still into the light: the sun comes up beyond the
     airframe rather than behind the lens, which is the only way a sunrise
     ever actually reads in a shot. */
  { at: 0.15, offset: [78, 6, -58], target: [0, 5, 8], fov: 34, damping: 0.46 },
  { at: 0.2, offset: [66, 3.6, -46], target: [0, 5, 6], fov: 38, damping: 0.62 },
  { at: 0.26, offset: [52, 2.8, -36], target: [0, 5.5, 4], fov: 42, damping: 0.8 },

  /* In under the starboard wingtip, looking up along the wing at the fin.
     Nothing else in the film says "this thing is thirty-four metres across"
     as economically as one low lens beneath it. */
  { at: 0.32, offset: [-17, 1.8, -4], target: [2, 7, 8], fov: 52, damping: 0.95 },

  /* Out and back to the starboard quarter for engine start. */
  { at: 0.38, offset: [-56, 7, -36], target: [0, 4.5, 2], fov: 40, damping: 0.8 },

  /* Pull wide and up as it comes off the stand — re-establishing. */
  { at: 0.44, offset: [52, 11, 62], target: [0, 4, 4], fov: 35, damping: 0.6 },

  /* Planted ahead of it on the taxiway, so it drives at the lens. */
  { at: 0.49, offset: [9, 5.0, 50], target: [0, 3.6, -4], fov: 42, damping: 1.15 },

  /* Round to the far side for the turn onto the runway — the classic taxi
     profile, threshold markings running through the foreground. */
  { at: 0.532, offset: [-28, 6.5, 44], target: [0, 4, -6], fov: 40, damping: 1.0 },

  /* Down the centreline from ahead, lined up and waiting. */
  { at: GROUND_ACT, offset: [3, 3.2, 72], target: [0, 3.2, 0], fov: 38, damping: 0.95 },
  { at: 0.6, offset: [4.5, 2.6, 82], target: [0, 3.0, 0], fov: 40, damping: 1.0 },

  /* Dynamic low tracking shot down the runway, close to the tarmac. */
  { at: 0.72, offset: [26, 2.2, -44], target: [0, 5, 12], fov: 50, damping: 1.5 },

  /* Rotation, looking up at it from beside the strip. */
  { at: 0.78, offset: [22, 2.0, -40], target: [0, 6, 9], fov: 54, damping: 1.7 },

  /* Chasing it into the climb. */
  { at: 0.845, offset: [34, 9, -58], target: [0, 6, 4], fov: 45, damping: 1.15 },

  /* The camera rises with it and the landscape falls away. */
  { at: 0.92, offset: [50, 18, -68], target: [0, 5, 6], fov: 40, damping: 0.85 },

  /* Wide aerial hero shot at cruise. */
  { at: 1, offset: [58, 16, 74], target: [0, 4, 0], fov: 33, damping: 0.45 },
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

/** Where the aeroplane's wheels are at p, on the ground plane. */
export function samplePosition(p: number, out: { x: number; z: number }) {
  const { a, b, t } = bracket(STORYBOARD, p);
  out.x = lerp(a.lateral, b.lateral, t);
  out.z = lerp(a.distance, b.distance, t);
  return out;
}

/** Scratch for the heading lookahead. Sampling is single-threaded per frame. */
const ahead = { x: 0, z: 0 };

/** How far ahead, in scroll, the nose looks to work out which way it is going. */
const LOOKAHEAD = 0.006;

/** Writes the aeroplane's condition at scroll position p into `out`. */
export function sampleAircraft(p: number, out: AircraftState): AircraftState {
  const { a, b, t } = bracket(STORYBOARD, p);
  out.distance = lerp(a.distance, b.distance, t);
  out.lateral = lerp(a.lateral, b.lateral, t);
  out.altitude = lerp(a.altitude, b.altitude, t);
  out.speed = lerp(a.speed, b.speed, t);
  out.thrust = lerp(a.thrust, b.thrust, t);
  out.pitch = lerp(a.pitch, b.pitch, t);
  out.roll = lerp(a.roll, b.roll, t);
  out.gear = lerp(a.gear, b.gear, t);

  /* Heading is never keyed. It is read off the path itself, a little way
     ahead, which is the only way a taxiing aeroplane can be guaranteed never
     to crab: the nose points where the wheels are about to be. When the
     aeroplane is standing still there is no direction to read, so the last
     one holds — which is also what a parked aeroplane does. */
  samplePosition(p + LOOKAHEAD, ahead);
  const dx = ahead.x - out.lateral;
  const dz = ahead.z - out.distance;
  if (dx * dx + dz * dz > 1e-4) out.heading = Math.atan2(dx, dz);

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
  return { ...PARKED };
}

/* --------------------------------------------------------------------------
 * THE PAINTED ROUTE
 *
 * The taxiway the aeroplane drives along is generated from the storyboard
 * rather than drawn by hand, so the tarmac and the aeroplane physically
 * cannot disagree about where the route goes.
 * ------------------------------------------------------------------------ */

/** Samples the ground track between two scroll positions, dropping points
    that are too close together to add anything to the ribbon. */
export function taxiRoute(from = 0.4, to = GROUND_ACT + 0.02, steps = 64) {
  const points: { x: number; z: number }[] = [];
  const p = { x: 0, z: 0 };
  for (let i = 0; i <= steps; i++) {
    samplePosition(from + ((to - from) * i) / steps, p);
    const last = points[points.length - 1];
    if (last && Math.abs(last.x - p.x) < 0.5 && Math.abs(last.z - p.z) < 0.5) continue;
    points.push({ x: p.x, z: p.z });
  }
  return points;
}

/** Copy shown when the last step is reached. Fixed by the brief. */
export const SUCCESS_MESSAGE = {
  title: "Congratulations",
  body: "You are now ready for your journey.",
} as const;
