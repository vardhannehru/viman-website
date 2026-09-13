"use client";

import { Info } from "lucide-react";
import { prerequisites } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { RevealGroup, RevealItem, Reveal } from "@/components/motion/reveal";

/** "Prerequisites & Qualifications" — age, education, and the NIOS note. */
export function Prerequisites() {
  return (
    <section id="prerequisites" className="relative z-10 section-pad">
      <div className="shell">
        <SectionHeading title="Prerequisites" accent="& Qualifications." />

        <RevealGroup className="mt-16 grid gap-4 md:grid-cols-2" stagger={0.09}>
          {prerequisites.items.map((item) => (
            <RevealItem key={item.label}>
              <GlassCard tilt tiltStrength={4} className="h-full p-8 md:p-10">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/[0.07] text-cyan">
                  <item.icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.6} />
                </span>
                <h3 className="mt-7 text-subhead font-medium tracking-[-0.03em] text-cloud">
                  {item.label}
                </h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-mist">{item.body}</p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-4">
          <div className="rounded-3xl border border-gold/20 bg-gold/[0.05] p-8 md:p-10">
            <div className="flex items-center gap-2.5">
              <Info className="h-3.5 w-3.5 text-gold" strokeWidth={2} />
              <span className="mono-label text-gold">{prerequisites.note.title}</span>
            </div>
            <p className="mt-5 max-w-3xl text-[0.9375rem] leading-relaxed text-cloud-dim">
              {prerequisites.note.body}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
