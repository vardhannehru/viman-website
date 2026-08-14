"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { roadmap, type RoadmapStep } from "@/lib/site";
import { flight } from "@/lib/flight-state";
import { SUCCESS_MESSAGE } from "@/lib/storyboard";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";

const accents = {
  cyan: {
    text: "text-cyan",
    border: "border-cyan/30",
    bg: "bg-cyan/[0.08]",
    node: "bg-cyan",
    glow: "shadow-[0_0_24px_6px_rgba(34,224,255,0.35)]",
    line: "from-cyan/60",
  },
  sky: {
    text: "text-sky",
    border: "border-sky/30",
    bg: "bg-sky/[0.08]",
    node: "bg-sky",
    glow: "shadow-[0_0_24px_6px_rgba(90,169,255,0.32)]",
    line: "from-sky/60",
  },
  gold: {
    text: "text-gold",
    border: "border-gold/30",
    bg: "bg-gold/[0.08]",
    node: "bg-gold",
    glow: "shadow-[0_0_24px_6px_rgba(232,195,106,0.32)]",
    line: "from-gold/60",
  },
} as const;

/**
 * Roadmap — "Steps to Become an Airline Pilot".
 *
 * The nine steps exactly as the source lists them. This section is also the
 * runway: scroll progress across it is the flight timeline, so the A320
 * behind the page is cold and dark at step 01 and at cruise by step 09.
 * The steps light up as you reach them, like runway edge lighting.
 */
export function Roadmap() {
  const timeline = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timeline,
    offset: ["start 62%", "end 78%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const markerTop = useTransform(progress, [0, 1], ["0%", "100%"]);

  /* Which steps have been reached. Nine possible values, so tracking it as
     state costs nothing and keeps the lighting logic declarative. */
  const [reached, setReached] = useState(-1);
  useMotionValueEvent(progress, "change", (v) => {
    const next = Math.floor(v * roadmap.length + 0.35);
    setReached((prev) => (prev === next ? prev : next));
  });

  return (
    <section id="roadmap" className="relative z-10 section-pad">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,14,0.55),rgba(4,7,14,0.9)_8%,rgba(4,7,14,0.88)_50%,rgba(4,7,14,0.9)_92%,rgba(4,7,14,0.55))] md:bg-[linear-gradient(180deg,transparent,rgba(4,7,14,0.5)_12%,rgba(4,7,14,0.68)_50%,rgba(4,7,14,0.5)_88%,transparent)]"
      />

      <div className="shell relative">
        <SectionHeading eyebrow="Roadmap" title="Steps to Become" accent="an Airline Pilot." />

        <Instruments />

        <div ref={timeline} className="relative mt-20 md:mt-28">
          {/* Spine */}
          <div className="absolute bottom-0 left-[0.6875rem] top-0 w-px bg-cloud/8 lg:left-1/2 lg:-translate-x-1/2" />

          {/* Progress */}
          <motion.div
            style={{ scaleY: progress }}
            className="absolute bottom-0 left-[0.6875rem] top-0 w-px origin-top bg-gradient-to-b from-cyan via-sky to-gold lg:left-1/2 lg:-translate-x-1/2"
          />

          {/* Position marker. The A320 behind the page is the real indicator,
              so this stays a light on the centreline rather than a second,
              competing aeroplane. */}
          <motion.div
            style={{ top: markerTop }}
            className="absolute left-[0.6875rem] z-20 -translate-x-1/2 lg:left-1/2"
          >
            <span className="relative flex h-3 w-3 -translate-y-1/2 items-center justify-center">
              <span className="absolute h-3 w-3 rounded-full bg-cyan shadow-[0_0_26px_9px_rgba(34,224,255,0.45)]" />
              <motion.span
                className="absolute h-3 w-3 rounded-full bg-cyan"
                animate={{ scale: [1, 3.2], opacity: [0.55, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            </span>
          </motion.div>

          <ol className="relative space-y-10 md:space-y-14">
            {roadmap.map((step, i) => (
              <RoadmapRow key={step.index} step={step} index={i} lit={i <= reached} />
            ))}
          </ol>
        </div>

        {/* Reaching the last step is reaching cruising altitude. */}
        <motion.div
          initial={false}
          animate={
            reached >= roadmap.length - 1
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 24, filter: "blur(12px)" }
          }
          transition={{ duration: 1.1, ease: EASE }}
          className="mx-auto mt-16 max-w-xl rounded-3xl glass px-10 py-9 text-center"
        >
          <p className="font-serif text-[2rem] italic leading-none text-gold md:text-[2.6rem]">
            {SUCCESS_MESSAGE.title}
          </p>
          <p className="mt-4 text-lead text-cloud-dim">{SUCCESS_MESSAGE.body}</p>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function RoadmapRow({
  step,
  index,
  lit,
}: {
  step: RoadmapStep;
  index: number;
  lit: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40% 0px -30% 0px" });
  const accent = accents[step.accent];
  const left = index % 2 === 0;

  return (
    <li
      ref={ref}
      className="relative grid grid-cols-[2.75rem_1fr] items-start gap-x-2 lg:grid-cols-2 lg:gap-x-20"
    >
      {/* Node */}
      <div className="relative z-10 flex h-6 items-center justify-center pt-6 lg:absolute lg:left-1/2 lg:top-7 lg:-translate-x-1/2 lg:pt-0">
        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className={cn(
            "relative block h-3 w-3 rounded-full border border-void transition-all duration-700",
            lit ? cn(accent.node, accent.glow) : "bg-navy-700",
          )}
        >
          {lit && (
            <motion.span
              className={cn("absolute inset-0 rounded-full", accent.node)}
              animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
            />
          )}
        </motion.span>
      </div>

      {/* Connector */}
      <motion.div
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        className={cn(
          "absolute top-[1.9rem] hidden h-px w-[3.5rem] bg-gradient-to-r to-transparent transition-opacity duration-700 lg:block",
          accent.line,
          lit ? "opacity-100" : "opacity-30",
          left ? "right-1/2 origin-right bg-gradient-to-l" : "left-1/2 origin-left",
        )}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 1, ease: EASE, delay: 0.08 }}
        className={cn(
          "col-start-2 lg:col-start-auto",
          left ? "lg:col-start-1 lg:pr-6 lg:text-right" : "lg:col-start-2 lg:pl-6",
        )}
      >
        <div
          className={cn(
            "group/step relative overflow-hidden rounded-3xl glass p-7 transition-all duration-700 hover:-translate-y-1 md:p-8",
            !lit && "opacity-60",
          )}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cloud/25 to-transparent"
          />

          <div className={cn("flex items-center gap-3", left && "lg:flex-row-reverse")}>
            <span
              className={cn(
                "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-700 group-hover/step:scale-110",
                lit ? cn(accent.border, accent.bg, accent.text) : "border-cloud/10 bg-cloud/[0.02] text-mist-deep",
              )}
            >
              <step.icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.7} />
            </span>
            <span
              className={cn(
                "ml-auto font-mono text-[2rem] font-light leading-none tracking-tight text-cloud/12 transition-colors duration-700 group-hover/step:text-cloud/25",
                left && "lg:ml-0 lg:mr-auto",
              )}
            >
              {step.index}
            </span>
          </div>

          <h3 className="mt-6 text-[1.1875rem] font-medium leading-snug tracking-[-0.025em] text-cloud md:text-subhead">
            {step.title}
          </h3>

          {step.detail && (
            <p className="mt-3 font-serif text-[1rem] italic text-mist">{step.detail}</p>
          )}
        </div>
      </motion.div>
    </li>
  );
}

/* --------------------------------------------------------------------------
 * INSTRUMENTS
 *
 * Reads the live figures the 3D scene publishes each frame. Deliberately
 * outside React's render loop — it writes to the DOM directly, so the numbers
 * can move at 60 fps without re-rendering the roadmap.
 * ------------------------------------------------------------------------ */

function Instruments() {
  const speed = useRef<HTMLSpanElement>(null);
  const alt = useRef<HTMLSpanElement>(null);
  const n1 = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const r = flight.readout;
      // Metres per second → knots, metres → feet. Pilots do not use SI.
      if (speed.current)
        speed.current.textContent = String(Math.round(r.speed * 1.94384)).padStart(3, "0");
      if (alt.current)
        alt.current.textContent = String(Math.round(r.altitude * 3.28084)).padStart(5, "0");
      if (n1.current) n1.current.textContent = String(Math.round(r.thrust * 100)).padStart(3, "0");
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      aria-hidden
      className="mx-auto mt-12 flex max-w-md items-center justify-center gap-px overflow-hidden rounded-2xl border border-cloud/10 bg-cloud/[0.02] font-mono"
    >
      {[
        { label: "IAS · KT", ref: speed, fallback: "000" },
        { label: "ALT · FT", ref: alt, fallback: "00000" },
        { label: "N1 · %", ref: n1, fallback: "000" },
      ].map((gauge) => (
        <div key={gauge.label} className="flex-1 px-4 py-3.5 text-center">
          <span
            ref={gauge.ref}
            className="block text-[1.35rem] font-light tabular-nums leading-none text-cloud"
          >
            {gauge.fallback}
          </span>
          <span className="mt-2 block text-[0.5625rem] uppercase tracking-[0.28em] text-mist-deep">
            {gauge.label}
          </span>
        </div>
      ))}
    </div>
  );
}
