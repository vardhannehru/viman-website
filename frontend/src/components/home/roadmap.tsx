"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUp, Check, TriangleAlert, X } from "lucide-react";
import { roadmap, type RoadmapStep } from "@/lib/site";
import { setStepCompleted, useCompletedSteps } from "@/lib/progress";
import { scrollToSection } from "@/components/providers/smooth-scroll";

function glideTo(selector: string) {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  scrollToSection(el, -(parseFloat(getComputedStyle(el).scrollMarginTop) || 20));
}
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
 * The prerequisites, then the seven pathway steps exactly as the source lists
 * them. This section is also the runway: scroll progress across it is the
 * flight timeline, so the A320 is lined up at step 01 and at cruise by step 08.
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

  /* Which steps have been reached. Eight possible values, so tracking it as
     state costs nothing and keeps the lighting logic declarative. */
  const [reached, setReached] = useState(-1);
  const completed = useCompletedSteps();
  const allDone = roadmap.every((step) => completed.includes(step.id));

  const [celebrating, setCelebrating] = useState<{ step: RoadmapStep; next: RoadmapStep } | null>(
    null,
  );
  const timers = useRef<number[]>([]);
  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  /* Ticking a step congratulates, then glides to the next one still open —
     below first, then any skipped above — or to the final congratulations
     once none are left. */
  const toggle = (i: number, checked: boolean) => {
    setStepCompleted(roadmap[i].id, checked);
    clearTimers();
    setCelebrating(null);
    if (!checked) return;
    const done = new Set([...completed, roadmap[i].id]);
    const open = (step: RoadmapStep) => !done.has(step.id);
    const next = roadmap.slice(i + 1).find(open) ?? roadmap.slice(0, i).find(open);
    if (!next) {
      glideTo("#roadmap-complete");
      return;
    }
    setCelebrating({ step: roadmap[i], next });
    timers.current.push(
      window.setTimeout(() => glideTo(`#step-${next.index}`), 1100),
      window.setTimeout(() => setCelebrating(null), 2800),
    );
  };

  /* How many steps the reader has scrolled clean past: a step counts once its
     card has left the top fifth of the screen. */
  const [passed, setPassed] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", () => {
    const line = window.innerHeight * 0.2;
    let count = 0;
    for (const step of roadmap) {
      const el = document.getElementById(`step-${step.index}`);
      if (!el || el.getBoundingClientRect().bottom > line) break;
      count++;
    }
    setPassed((prev) => (prev === count ? prev : count));
  });

  const timelineInView = useInView(timeline);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const skipped = timelineInView
    ? roadmap
        .slice(0, passed)
        .find((s) => !completed.includes(s.id) && !dismissed.includes(s.id))
    : undefined;
  const notice: Notice | null = celebrating
    ? { kind: "success", ...celebrating }
    : skipped
      ? { kind: "warning", step: skipped }
      : null;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
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
        <SectionHeading
          eyebrow="Checklist"
          title="Steps to Become"
          accent="an Airline Pilot."
          serif
          lede="Eight steps, in order. Tick each one off as you finish it — the aircraft behind this page flies them with you."
        />

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

          {/* The gaps are the flight. Scroll distance across these steps is
              what the takeoff is scrubbed against, so they are spaced for
              pacing rather than for density — compress them and the rotation
              happens in a few hundred pixels. */}
          <ol className="relative space-y-20 md:space-y-32">
            {roadmap.map((step, i) => (
              <RoadmapRow
                key={step.index}
                step={step}
                index={i}
                lit={i <= reached}
                done={completed.includes(step.id)}
                onToggle={(checked) => toggle(i, checked)}
              />
            ))}
          </ol>
        </div>

        {/* Every step ticked off. */}
        <motion.div
          id="roadmap-complete"
          aria-hidden={!allDone}
          initial={false}
          animate={
            allDone
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 24, filter: "blur(12px)" }
          }
          transition={{ duration: 1.1, ease: EASE }}
          className="mx-auto mt-16 max-w-xl scroll-mt-48 rounded-3xl glass px-10 py-9 text-center"
        >
          <p className="font-serif text-[2rem] italic leading-none text-gold md:text-[2.6rem]">
            {SUCCESS_MESSAGE.title}
          </p>
          <p className="mt-4 text-lead text-cloud-dim">{SUCCESS_MESSAGE.body}</p>
        </motion.div>
      </div>

      {/* Portalled so later sections, which share this section's z-index,
          can never paint over it. */}
      {mounted &&
        createPortal(
          <div
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"
          >
            <AnimatePresence mode="wait">
              {notice && (
                <RoadmapNotice
                  key={`${notice.kind}-${notice.step.id}`}
                  notice={notice}
                  onBack={() => glideTo(`#step-${notice.step.index}`)}
                  onDismiss={() => setDismissed((d) => [...d, notice.step.id])}
                />
              )}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */

type Notice =
  | { kind: "success"; step: RoadmapStep; next: RoadmapStep }
  | { kind: "warning"; step: RoadmapStep };

function RoadmapNotice({
  notice,
  onBack,
  onDismiss,
}: {
  notice: Notice;
  onBack: () => void;
  onDismiss: () => void;
}) {
  const success = notice.kind === "success";

  return (
    <motion.div
      role={success ? "status" : "alert"}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.45, ease: EASE }}
      className={cn(
        "glass-strong pointer-events-auto flex w-full max-w-md items-start gap-4 rounded-2xl border px-5 py-4 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.3)]",
        success ? "border-cyan/40" : "border-gold/40",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          success ? "bg-cyan/15 text-cyan" : "bg-gold/15 text-gold",
        )}
      >
        {success ? (
          <Check className="h-4 w-4" strokeWidth={2.5} />
        ) : (
          <TriangleAlert className="h-4 w-4" strokeWidth={2} />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[0.9375rem] font-medium text-cloud">
          {success
            ? `Congratulations! Step ${notice.step.index} completed.`
            : `You haven't completed step ${notice.step.index}.`}
        </p>
        <p className="mt-1 text-[0.8125rem] leading-relaxed text-cloud-dim">
          {notice.kind === "success"
            ? `Moving on to step ${notice.next.index} — ${notice.next.title}.`
            : `${notice.step.title}: tick "Did you complete this step?" before moving on.`}
        </p>
        {!success && (
          <button
            type="button"
            onClick={onBack}
            className="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-gold transition-colors duration-300 hover:text-cloud"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Go back to step {notice.step.index}
          </button>
        )}
      </div>

      {!success && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="-mr-1 rounded-full p-1 text-mist-deep transition-colors duration-300 hover:text-cloud"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}

function RoadmapRow({
  step,
  index,
  lit,
  done,
  onToggle,
}: {
  step: RoadmapStep;
  index: number;
  lit: boolean;
  done: boolean;
  onToggle: (checked: boolean) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40% 0px -30% 0px" });
  const accent = accents[step.accent];
  const left = index % 2 === 0;

  return (
    <li
      ref={ref}
      id={`step-${step.index}`}
      className="relative grid scroll-mt-32 grid-cols-[2.75rem_1fr] items-start gap-x-2 lg:grid-cols-2 lg:gap-x-20"
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

          {step.intro && (
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-cloud-dim">{step.intro}</p>
          )}

          <ul className="mt-5 space-y-2.5 border-t border-cloud/8 pt-5">
            {step.points.map((point) => (
              <li
                key={point}
                className={cn(
                  "flex items-start gap-3 text-[0.875rem] leading-relaxed text-mist",
                  left && "lg:flex-row-reverse",
                )}
              >
                <span className={cn("mt-[0.55rem] h-1 w-1 shrink-0 rounded-full", accent.node)} />
                {point}
              </li>
            ))}
          </ul>

          {step.note && (
            <p className="mt-5 rounded-2xl border border-cloud/8 bg-cloud/[0.02] px-4 py-3 text-[0.8125rem] leading-relaxed text-cloud-dim">
              {step.note}
            </p>
          )}

          {step.guide && (
            <Button asChild size="sm" className="mt-6 bg-cyan text-void hover:bg-cyan/85">
              <Link href={step.guide}>
                Full guide &amp; official links
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </Link>
            </Button>
          )}

          <label
            className={cn(
              "mt-6 flex cursor-pointer items-center gap-3 border-t border-cloud/8 pt-5 text-[0.9375rem]",
              left && "lg:flex-row-reverse",
            )}
          >
            <input
              type="checkbox"
              checked={done}
              onChange={(e) => onToggle(e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-cyan peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-void",
                done ? "border-cyan bg-cyan text-void" : "border-cloud/30",
              )}
            >
              {done && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
            </span>
            <span className={done ? "text-cyan" : "text-cloud-dim"}>
              {done ? "Step completed" : "Did you complete this step?"}
            </span>
          </label>
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
