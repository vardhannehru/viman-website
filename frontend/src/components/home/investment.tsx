"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { investment } from "@/lib/site";
import { EASE, viewport } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/motion/reveal";

/**
 * "Timeline & Approx. Investment".
 * The bar under each row is sized by that line's share of the total, which is
 * derived arithmetic on the source's own figures — no new numbers.
 */
export function Investment() {
  /* The bars fill together once the list is on screen. Watching the list
     rather than each bar means the lowest bar can never be left empty just
     because it sits near the bottom edge when the reader stops scrolling. */
  const list = useRef<HTMLUListElement>(null);
  const shown = useInView(list, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();

  return (
    <section id="investment" className="relative z-10 section-pad">
      <div className="shell">
        <SectionHeading title="Timeline &" accent="Approx. Investment." />

        <Reveal className="mt-16">
          <GlassCard className="p-8 md:p-12">
            {/* Duration */}
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-cloud/8 pb-9">
              <div>
                <div className="mono-label text-mist-deep">{investment.duration.label}</div>
                <div className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-none tracking-[-0.04em] text-gradient-cyan">
                  {investment.duration.value}
                </div>
              </div>
              <p className="max-w-xs text-[0.875rem] leading-relaxed text-mist">
                {investment.duration.detail}
              </p>
            </div>

            {/* Cost lines */}
            <ul ref={list} className="mt-10 space-y-8">
              {investment.rows.map((row, i) => (
                <li key={row.label}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <span className="text-[0.9375rem] text-cloud-dim md:text-[1.0625rem]">
                      {row.label}
                    </span>
                    <span className="font-mono text-[0.9375rem] tabular-nums text-cloud md:text-[1.0625rem]">
                      {row.value}
                    </span>
                  </div>
                  <div className="mt-3.5 h-2.5 overflow-hidden rounded-full bg-cloud/10">
                    <motion.div
                      initial={false}
                      animate={{ width: shown ? `${Math.max(row.weight * 100, 2)}%` : "0%" }}
                      transition={
                        reduced ? { duration: 0 } : { duration: 1.5, ease: EASE, delay: 0.15 + i * 0.12 }
                      }
                      className="h-full rounded-full bg-gradient-to-r from-cyan to-sky"
                    />
                  </div>
                </li>
              ))}
            </ul>

            {/* Total */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
              className="mt-10 flex flex-wrap items-baseline justify-between gap-4 rounded-2xl border border-gold/22 bg-gold/[0.05] px-7 py-6"
            >
              <span className="mono-label text-gold">{investment.total.label}</span>
              <span className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium leading-none tracking-[-0.035em] text-gradient-gold">
                {investment.total.value}
              </span>
            </motion.div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
