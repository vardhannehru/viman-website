"use client";

import { portals } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

/**
 * "Key Application Links & Portals".
 *
 * The source names each airline's portal but does not print its URL, so none
 * is fabricated here. Each card names the portal and leaves the applicant to
 * reach it through the airline's own site.
 */
export function Portals() {
  return (
    <section id="portals" className="relative z-10 section-pad">
      <div className="shell">
        <SectionHeading title="Key Application Links" accent="& Portals." />

        <RevealGroup className="mt-16 grid gap-4 lg:grid-cols-3" stagger={0.09}>
          {portals.map((portal) => (
            <RevealItem key={portal.airline}>
              <GlassCard tilt tiltStrength={4} className="flex h-full flex-col p-8">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-subhead font-medium tracking-[-0.03em] text-cloud">
                    {portal.airline}
                  </h3>
                </div>
                <p className="mt-2 text-[0.875rem] text-mist">{portal.program}</p>

                <dl className="mt-8 space-y-6 border-t border-cloud/8 pt-7">
                  <div>
                    <dt className="mono-label text-mist-deep">Overview</dt>
                    <dd className="mt-3 text-[0.875rem] leading-relaxed text-cloud-dim">
                      {portal.overview}
                    </dd>
                  </div>
                  <div>
                    <dt className="mono-label text-mist-deep">Official Application Portal</dt>
                    <dd className="mt-3 text-[0.875rem] leading-relaxed text-cloud-dim">
                      {portal.application}
                    </dd>
                  </div>
                  {portal.initiative && (
                    <div>
                      <dt className="mono-label text-mist-deep">Special Initiatives</dt>
                      <dd className="mt-3 text-[0.875rem] leading-relaxed text-cloud-dim">
                        {portal.initiative}
                      </dd>
                    </div>
                  )}
                </dl>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
