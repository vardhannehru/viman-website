"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/lib/motion";

const WORD = "VIMAN".split("");
const SESSION_KEY = "viman:booted";

/**
 * Cinematic boot sequence.
 * A horizon line draws, the wordmark climbs out of the void, systems report
 * ready, and the curtain lifts to reveal the hero already in motion.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(SESSION_KEY);

    if (seen || reduced) {
      setVisible(false);
      return;
    }

    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const started = performance.now();
    const MIN_DURATION = 2200;
    let raf = 0;

    const tick = () => {
      const elapsed = performance.now() - started;
      // Ease toward 100 over the minimum duration; never fake a stall.
      const t = Math.min(1, elapsed / MIN_DURATION);
      const eased = 1 - Math.pow(1 - t, 2.4);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem(SESSION_KEY, "1");
        setVisible(false);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      const id = window.setTimeout(() => {
        document.body.style.overflow = "";
        window.dispatchEvent(new CustomEvent("viman:ready"));
      }, 400);
      return () => window.clearTimeout(id);
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void"
          exit={{ y: "-100%", transition: { duration: 1.15, ease: EASE, delay: 0.15 } }}
        >
          {/* Horizon */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-px origin-center"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(34,224,255,0.55) 30%, rgba(90,169,255,0.8) 50%, rgba(34,224,255,0.55) 70%, transparent)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            /* Both tracks carry the same number of keyframes: `times` applies
               to every animated value, so a bare `scaleX: 1` alongside a
               three-stop opacity is a run-time error, not a shorthand. */
            animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0.35] }}
            transition={{ duration: 1.8, ease: EASE, times: [0, 0.5, 1] }}
          />

          {/* Wordmark */}
          <div className="relative flex items-baseline overflow-hidden px-6">
            {WORD.map((letter, i) => (
              <motion.span
                key={letter + i}
                className="text-[clamp(3rem,11vw,8rem)] font-medium leading-none tracking-[-0.04em] text-cloud"
                initial={{ y: "115%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.18 + i * 0.075 }}
              >
                {letter}
              </motion.span>
            ))}
            <motion.span
              className="ml-2 h-2 w-2 rounded-full bg-cyan"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.75 }}
              style={{ boxShadow: "0 0 18px 4px rgba(34,224,255,0.5)" }}
            />
          </div>

          <motion.p
            className="mono-label mt-6 text-mist"
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.28em" }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.55 }}
          >
            Zero to Cockpit
          </motion.p>

          {/* Telemetry */}
          <div className="absolute inset-x-0 bottom-0 px-[clamp(1.25rem,4vw,4.5rem)] pb-8">
            <div className="flex items-end justify-between">
              <motion.span
                className="mono-label text-mist-deep"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                Systems · Nominal
              </motion.span>
              <span className="font-mono text-4xl font-light tabular-nums tracking-tight text-cloud md:text-6xl">
                {String(progress).padStart(3, "0")}
              </span>
            </div>
            <div className="relative mt-5 h-px w-full bg-navy-700">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky to-cyan"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
