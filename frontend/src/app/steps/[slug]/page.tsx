import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, TriangleAlert } from "lucide-react";
import { guideBySlug, guideHref, guideSlugs, roadmap } from "@/lib/site";
import { BoardingPass } from "@/components/steps/boarding-pass";
import { StepComplete } from "@/components/steps/step-complete";
import { TurbulenceScene } from "@/components/steps/turbulence-scene";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return guideSlugs().map((slug) => ({ slug }));
}

function load(slug: string) {
  const guide = guideBySlug(slug);
  if (!guide) return null;
  const at = roadmap.findIndex((r) => r.id === guide.stepId);
  return { guide, step: roadmap[at], prev: roadmap[at - 1], next: roadmap[at + 1] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = load((await params).slug);
  if (!data) return {};
  return { title: data.step.title, description: data.guide.summary };
}

export default async function StepGuidePage({ params }: Props) {
  const data = load((await params).slug);
  if (!data) notFound();
  const { guide, step, prev, next } = data;
  const caption = step.detail ?? guide.caption;
  const hasExternal = guide.links.some((link) => !link.internal);

  return (
    <div className="relative border-t border-cloud/8">
      <div className="shell pb-28 pt-32 md:pt-40">
        <Link
          href={`/#step-${step.index}`}
          className="group inline-flex items-center gap-2 text-[0.875rem] text-mist transition-colors duration-300 hover:text-cloud"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to the roadmap
        </Link>

        <div
          className={`mt-12 grid gap-16 lg:gap-20 ${
            guide.links.length > 0 ? "lg:grid-cols-[minmax(0,1fr)_20rem]" : ""
          }`}
        >
          <article className="max-w-[62ch]">
            <header className="border-b border-cloud/10 pb-10">
              <p className="mono-label text-cyan">
                Roadmap · Step {step.index} of {String(roadmap.length).padStart(2, "0")}
              </p>
              <h1 className="mt-5 text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-cloud">
                {step.title}
              </h1>
              {caption && (
                <p className="mt-5 font-serif text-[1.125rem] italic text-mist">{caption}</p>
              )}
            </header>

            {guide.facts && (
              <dl className="mt-10 grid gap-3 sm:grid-cols-2">
                {guide.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-2xl border border-cloud/10 bg-cloud/[0.02] px-5 py-4"
                  >
                    <dt className="mono-label text-mist-deep">{fact.label}</dt>
                    <dd className="mt-2 text-[1.0625rem] font-medium text-cloud">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="legal-prose mt-10">
              <p>{guide.intro}</p>

              {guide.sections.map((section) => (
                <Fragment key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.visual === "turbulence" && <TurbulenceScene />}
                  {section.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.points && (
                    <ul>
                      {section.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </Fragment>
              ))}

              {guide.funFact && (
                <div className="rounded-2xl bg-[#fdf6e7] px-6 py-7 md:px-8">
                  <span className="block text-[0.8125rem] font-medium text-[#7a6d55]">Fun fact</span>
                  <span className="mt-3 block text-[clamp(1.375rem,3vw,1.75rem)] font-medium leading-tight tracking-[-0.02em] text-[#13235b]">
                    {guide.funFact.question}
                  </span>
                  <span className="mt-4 block text-[1rem] leading-relaxed text-[#3d3a52]">
                    {guide.funFact.answer}
                  </span>
                </div>
              )}

              <h2>Before you start</h2>
              <ul>
                {guide.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
                <li>
                  Requirements and portal procedures change. Always confirm against the official
                  source before acting. See our <Link href="/disclaimer">Disclaimer</Link>.
                </li>
              </ul>
            </div>

            {guide.warning && (
              <div
                role="note"
                className="mt-14 flex items-start gap-4 rounded-2xl border border-gold/40 bg-gold/[0.07] px-5 py-5 md:px-6"
              >
                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={2} />
                <div>
                  <p className="mono-label text-gold">{guide.warning.title}</p>
                  <p className="mt-2.5 text-[1rem] font-medium leading-relaxed text-cloud">
                    {guide.warning.body}
                  </p>
                </div>
              </div>
            )}

            {guide.promo && (
              <BoardingPass promo={guide.promo} stepLabel={`${step.index} · ${step.title}`} />
            )}

            <StepComplete
              stepId={step.id}
              stepIndex={step.index}
              prompt={guide.completePrompt}
              next={
                next
                  ? { label: `Step ${next.index}: ${next.title}`, href: guideHref(next.id) }
                  : { label: "your roadmap congratulations", href: "/#roadmap-complete" }
              }
            />

            <nav aria-label="Other steps" className="mt-10 grid gap-3 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={guideHref(prev.id)}
                  className="rounded-2xl border border-cloud/10 px-5 py-4 transition-colors duration-300 hover:border-cyan/40"
                >
                  <span className="mono-label flex items-center gap-2 text-mist-deep">
                    <ArrowLeft className="h-3 w-3" />
                    Step {prev.index}
                  </span>
                  <span className="mt-2 block text-[0.9375rem] font-medium text-cloud">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span aria-hidden />
              )}
              {next && (
                <Link
                  href={guideHref(next.id)}
                  className="rounded-2xl border border-cloud/10 px-5 py-4 text-right transition-colors duration-300 hover:border-cyan/40"
                >
                  <span className="mono-label flex items-center justify-end gap-2 text-mist-deep">
                    Step {next.index}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="mt-2 block text-[0.9375rem] font-medium text-cloud">
                    {next.title}
                  </span>
                </Link>
              )}
            </nav>
          </article>

          {guide.links.length > 0 && (
          <aside className="order-first lg:sticky lg:top-28 lg:order-none lg:self-start lg:pt-4">
            <h2 className="mono-label text-mist-deep">
              {hasExternal ? "Official links" : "Where to go next"}
            </h2>
            <ul className="mt-6 space-y-3">
              {guide.links.map((link) => {
                const className =
                  "group block rounded-2xl border border-cloud/10 bg-cloud/[0.02] p-5 transition-colors duration-300 hover:border-cyan/40 hover:bg-cyan/[0.05]";
                const Icon = link.internal ? ArrowRight : ArrowUpRight;
                const content = (
                  <>
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-[1rem] font-medium text-cloud">{link.label}</span>
                      <Icon className="h-4 w-4 shrink-0 text-cyan transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                    <span className="mt-1 block font-mono text-[0.75rem] text-mist-deep">
                      {link.host}
                    </span>
                    <span className="mt-3 block text-[0.875rem] leading-relaxed text-cloud-dim">
                      {link.use}
                    </span>
                  </>
                );
                return (
                  <li key={link.url}>
                    {link.internal ? (
                      <Link href={link.url} className={className}>
                        {content}
                      </Link>
                    ) : (
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className={className}>
                        {content}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
            {hasExternal && (
              <p className="mt-6 text-[0.8125rem] leading-relaxed text-mist-deep">
                Links open the official sites in a new tab. VIMAN is not affiliated with any
                authority named here.
              </p>
            )}
          </aside>
          )}
        </div>
      </div>
    </div>
  );
}
