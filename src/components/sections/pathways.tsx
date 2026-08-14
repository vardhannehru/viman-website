"use client";

import { motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { pathways, type Pathway } from "@/lib/site";
import { cn } from "@/lib/utils";
import { EASE, viewport } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/motion/reveal";

const tone = {
  gold: { text: "text-gold", border: "border-gold/25", soft: "bg-gold/[0.06]", grad: "text-gradient-gold" },
  cyan: { text: "text-cyan", border: "border-cyan/25", soft: "bg-cyan/[0.06]", grad: "text-gradient-cyan" },
} as const;

/**
 * Cadet Pilot Program vs Traditional (Conventional) Pathway, followed by the
 * source's own decision tree.
 */
export function Pathways() {
  return (
    <section id="compare" className="relative z-10 section-pad">
      <div className="shell">
        <SectionHeading title="Cadet Pilot Program" accent="or Traditional Pathway." />

        <div className="mt-20 grid gap-5 lg:grid-cols-2">
          {pathways.map((pathway, i) => (
            <PathwayCard key={pathway.id} pathway={pathway} delay={i * 0.1} />
          ))}
        </div>

        <DecisionTree />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function PathwayCard({ pathway, delay }: { pathway: Pathway; delay: number }) {
  const t = tone[pathway.accent];

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={viewport}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      <GlassCard className="flex h-full flex-col p-8 md:p-10">
        <div>
          <span className="mono-label text-mist-deep">{pathway.index}</span>
          <h3 className={cn("mt-4 text-heading", t.grad)}>{pathway.name}</h3>
        </div>

        <div className="mt-8 border-t border-cloud/8 pt-7">
          <span className="mono-label text-mist-deep">How It Works</span>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-cloud-dim">{pathway.how}</p>

          {pathway.steps && (
            <ol className="mt-6 space-y-3">
              {pathway.steps.map((step, i) => (
                <li key={step} className="flex gap-3.5 text-[0.875rem] leading-relaxed text-mist">
                  <span className="font-mono text-[0.75rem] text-mist-deep">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="mt-8 border-t border-cloud/8 pt-7">
          <span className="mono-label text-cyan">Advantages</span>
          <ul className="mt-5 space-y-4">
            {pathway.pros.map((pro) => (
              <li key={pro.title} className="flex gap-3.5">
                <span className="mt-0.5 flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-full border border-cyan/25 bg-cyan/[0.08] text-cyan">
                  <Plus className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                <p className="text-[0.875rem] leading-relaxed text-mist">
                  <span className="font-medium text-cloud">{pro.title}:</span> {pro.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-cloud/8 pt-7">
          <span className="mono-label text-[#ff9aa4]">Disadvantages</span>
          <ul className="mt-5 space-y-4">
            {pathway.cons.map((con) => (
              <li key={con.title} className="flex gap-3.5">
                <span className="mt-0.5 flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-full border border-[#ff9aa4]/25 bg-[#ff9aa4]/[0.08] text-[#ff9aa4]">
                  <Minus className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                <p className="text-[0.875rem] leading-relaxed text-mist">
                  <span className="font-medium text-cloud">{con.title}:</span> {con.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */

/** "Which Pathway Fits You Best?" — rendered as a readout, not an image. */
function DecisionTree() {
  return (
    <Reveal className="mt-20" delay={0.1}>
      <div className="overflow-hidden rounded-3xl border border-cloud/10 bg-navy-950/70 backdrop-blur-2xl">
        <div className="flex items-center gap-2.5 border-b border-cloud/8 px-6 py-4">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_2px_rgba(34,224,255,0.6)]" />
          <span className="mono-label text-mist-deep">Which Pathway Fits You Best?</span>
        </div>

        <div className="p-6 md:p-10">
          <div className="text-center">
            <span className="inline-block rounded-lg border border-cloud/12 px-4 py-2 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-cloud">
              [ Decision Tree ]
            </span>
          </div>

          <svg
            viewBox="0 0 800 60"
            className="mx-auto mt-2 h-12 w-full max-w-3xl"
            fill="none"
            aria-hidden
            preserveAspectRatio="none"
          >
            <motion.path
              d="M400 0 V22 M120 22 H680 M120 22 V58 M680 22 V58"
              stroke="currentColor"
              className="text-cloud/25"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: EASE }}
            />
          </svg>

          <div className="grid gap-5 md:grid-cols-2">
            {pathways.map((pathway, i) => {
              const t = tone[pathway.accent];
              return (
                <motion.div
                  key={pathway.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewport}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.5 + i * 0.12 }}
                  className={cn(
                    "rounded-2xl border p-6 transition-transform duration-700 hover:-translate-y-1",
                    t.border,
                    t.soft,
                  )}
                >
                  <ul className="space-y-2.5">
                    {pathway.fit.map((criterion) => (
                      <li
                        key={criterion}
                        className="font-mono text-[0.8125rem] leading-relaxed text-cloud-dim"
                      >
                        <span className="text-mist-deep">[ </span>
                        {criterion}
                        <span className="text-mist-deep"> ]</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-2.5 border-t border-cloud/8 pt-5">
                    <span className={cn("text-[0.75rem]", t.text)}>▸</span>
                    <span className={cn("font-mono text-[0.75rem] uppercase tracking-[0.16em]", t.text)}>
                      {pathway.outcome}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
