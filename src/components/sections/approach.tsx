"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

/* ==========================================================================
 * PRE-FLIGHT
 *
 * This section has almost no content, and that is the point: it is the scroll
 * distance the ground story needs. First light, sunrise across the airfield,
 * the aeroplane waking up, engine start and the taxi out to the runway all
 * happen behind it, in WebGL, scrubbed by how far down it you have read.
 *
 * What little is on top of it is three lines and a slate. Anything more and
 * the film would be competing with a paragraph.
 * ========================================================================== */

/* Section-local positions, which the storyboard's own keys are pinned to.
   The section is tall enough that each of these is a screen or more apart. */
const BEATS = [
  { at: 0.0, label: "First light" },
  { at: 0.2, label: "Sunrise" },
  { at: 0.36, label: "Wake-up" },
  { at: 0.52, label: "Engine start" },
  { at: 0.68, label: "Taxi" },
  { at: 0.89, label: "Line up" },
] as const;

const LINES = [
  { at: 0.12, text: "First light, and the airport starts to separate itself from the dark." },
  { at: 0.44, text: "The aircraft comes alive long before anything else does." },
  { at: 0.76, text: "Rolling toward the runway. Everything below this is the flight." },
] as const;

export function Approach() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="approach"
      ref={ref}
      aria-label="Pre-flight"
      // Tall on purpose: this is the scroll budget for nine story beats, and
      // it is what stops the takeoff arriving three seconds after the taxi.
      className="relative z-10 h-[440vh] md:h-[560vh]"
    >
      {/* Everything is pinned to the viewport for the length of the section,
          so the frame stays composed while the scene moves through it. */}
      <div className="sticky top-0 flex h-[100svh] flex-col justify-end overflow-hidden pb-10 md:pb-14">
        {/* Legibility scrim, bottom only — the sky and the aeroplane stay clear. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-void via-void/70 to-transparent"
        />

        <div className="shell relative">
          <div className="relative h-24 md:h-16">
            {LINES.map((line, i) => (
              <Line key={i} progress={scrollYProgress} at={line.at} text={line.text} />
            ))}
          </div>

          <Slate progress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/* Scroll-linked transforms are handed to the compositor as WAAPI keyframe
   offsets, and an offset outside 0 → 1 is a run-time error rather than a
   clamp — so every window below is kept inside the section. */
const inside = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** A single line, fading up and away across a window of the section. */
function Line({
  progress,
  at,
  text,
}: {
  progress: MotionValue<number>;
  at: number;
  text: string;
}) {
  const span = [
    inside(at - 0.1),
    inside(at - 0.03),
    inside(at + 0.06),
    inside(at + 0.13),
  ] as const;

  const opacity = useTransform(progress, [...span], [0, 1, 1, 0]);
  const y = useTransform(progress, [span[0], span[3]], [22, -22]);
  const blur = useTransform(opacity, (o) => `blur(${(1 - o) * 10}px)`);

  return (
    <motion.p
      style={{ opacity, y, filter: blur }}
      className="absolute inset-x-0 bottom-0 max-w-2xl font-serif text-[1.35rem] italic leading-snug text-cloud md:text-[1.75rem]"
    >
      {text}
    </motion.p>
  );
}

/* --------------------------------------------------------------------------
 * THE SLATE
 *
 * A film slate rather than a UI: the name of the beat you are currently in,
 * and a hairline showing how far through the sequence the scroll has taken
 * you. It is the only feedback in a section that is otherwise empty, and it
 * is deliberately quiet enough to be ignored.
 * ------------------------------------------------------------------------ */

function Slate({ progress }: { progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, [0, 1], [0, 1]);

  /* Six possible labels, so which one is current is cheap to hold in state —
     and it only ever changes five times across the whole section. */
  const [beat, setBeat] = useState<string>(BEATS[0].label);
  useMotionValueEvent(progress, "change", (v) => {
    let next: string = BEATS[0].label;
    for (const candidate of BEATS) if (v >= candidate.at) next = candidate.label;
    setBeat((prev) => (prev === next ? prev : next));
  });

  return (
    <div className="mt-10 max-w-md">
      <div className="flex items-baseline justify-between gap-3">
        <span className="mono-label text-mist-deep">Pre-flight</span>
        <span key={beat} className="mono-label animate-slate-in text-cloud/70">
          {beat}
        </span>
      </div>

      <div className="mt-3 h-px w-full bg-cloud/10">
        <motion.div
          style={{ scaleX }}
          className="h-px w-full origin-left bg-gradient-to-r from-cyan/70 to-gold/70"
        />
      </div>
    </div>
  );
}
