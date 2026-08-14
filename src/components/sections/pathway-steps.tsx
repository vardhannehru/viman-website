"use client";

import { pathwaySteps, type PathwayStep } from "@/lib/site";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

const accents = {
  cyan: { text: "text-cyan", border: "border-cyan/25", bg: "bg-cyan/[0.07]", dot: "bg-cyan" },
  sky: { text: "text-sky", border: "border-sky/25", bg: "bg-sky/[0.07]", dot: "bg-sky" },
  gold: { text: "text-gold", border: "border-gold/25", bg: "bg-gold/[0.07]", dot: "bg-gold" },
} as const;

/**
 * "Step-by-Step Pilot Pathway" — the seven detailed steps, with the italic
 * caption and sub-points the source carries under each heading.
 */
export function PathwaySteps() {
  return (
    <section id="pathway" className="relative z-10 section-pad">
      <div className="shell">
        <SectionHeading
          eyebrow="Step-by-Step Pilot Pathway"
          title="Seven steps,"
          accent="in the order they happen."
        />

        <RevealGroup className="mt-20 space-y-4" stagger={0.07}>
          {pathwaySteps.map((step) => (
            <RevealItem key={step.id}>
              <StepCard step={step} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function StepCard({ step }: { step: PathwayStep }) {
  const accent = accents[step.accent];

  return (
    <GlassCard className="group/step p-7 transition-transform duration-700 hover:-translate-y-1 md:p-9">
      <div className="flex flex-col gap-7 md:flex-row md:gap-10">
        {/* Index + icon rail */}
        <div className="flex shrink-0 items-center gap-4 md:w-40 md:flex-col md:items-start">
          <span
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition-transform duration-700 group-hover/step:scale-110",
              accent.border,
              accent.bg,
              accent.text,
            )}
          >
            <step.icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.7} />
          </span>
          <div className="flex items-baseline gap-2 md:mt-4">
            <span className="mono-label text-mist-deep">Step</span>
            <span className="font-mono text-[1.75rem] font-light leading-none text-cloud/20 transition-colors duration-700 group-hover/step:text-cloud/40">
              {step.index}
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-subhead font-medium tracking-[-0.03em] text-cloud">{step.title}</h3>
          <p className="mt-2.5 font-serif text-[1rem] italic text-mist-deep">{step.caption}</p>

          {step.intro && (
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-cloud-dim">{step.intro}</p>
          )}

          <ul className="mt-6 space-y-3 border-t border-cloud/8 pt-6">
            {step.detail.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-mist">
                <span className={cn("mt-[0.55rem] h-1 w-1 shrink-0 rounded-full", accent.dot)} />
                {item}
              </li>
            ))}
          </ul>

          {step.note && (
            <div className="mt-6">
              <span
                className={cn(
                  "inline-block rounded-full border px-3.5 py-2 font-mono text-[0.625rem] uppercase tracking-[0.18em]",
                  accent.border,
                  accent.bg,
                  accent.text,
                )}
              >
                {step.note}
              </span>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
