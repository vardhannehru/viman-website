"use client";

import { motion } from "motion/react";
import { stages } from "@/lib/site";
import { EASE, viewport } from "@/lib/motion";

/**
 * "Which stage are you in?"
 *
 * Presentational only. The source names the four stages and gives a status
 * phrase for three of them, but provides no per-stage content, destination or
 * interaction — so these are rendered as static items rather than controls.
 * Nothing here is clickable, and nothing implies that it should be.
 *
 * The flight is driven by the roadmap below this, not by these.
 */
export function Stages() {
  return (
    <section id="stages" className="relative z-10 section-pad">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,14,0.5),rgba(4,7,14,0.93)_10%,rgba(4,7,14,0.95)_90%,rgba(4,7,14,0.5))] md:bg-[linear-gradient(180deg,transparent,rgba(4,7,14,0.6)_15%,rgba(4,7,14,0.75)_50%,rgba(4,7,14,0.6)_85%,transparent)]"
      />

      <div className="shell relative">
        <motion.h2
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={viewport}
          transition={{ duration: 0.95, ease: EASE }}
          className="max-w-2xl text-heading text-gradient"
        >
          Which stage are you in?
        </motion.h2>

        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, i) => (
            <motion.li
              key={stage.id}
              initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={viewport}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
              className="relative flex flex-col rounded-3xl border border-cloud/10 bg-cloud/[0.02] p-7"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-cloud/20 to-transparent"
              />

              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cloud/10 bg-cloud/[0.03] text-mist">
                <stage.icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.6} />
              </span>

              <p className="mt-7 text-[1.0625rem] font-medium leading-snug tracking-[-0.02em] text-cloud">
                {stage.label}
              </p>

              {/* Three of the four stages carry a status phrase in the source.
                  The fourth has none, and none is invented for it. */}
              {stage.status && (
                <span className="mt-auto flex items-center gap-2 border-t border-cloud/8 pt-5 mono-label text-mist-deep">
                  <span className="h-1.5 w-1.5 rounded-full bg-mist-deep" />
                  {stage.status}
                </span>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
