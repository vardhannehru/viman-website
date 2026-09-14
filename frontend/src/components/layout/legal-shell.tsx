import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { legalPages, legalUpdated } from "@/lib/legal";

/**
 * The reading frame for every legal page.
 *
 * Deliberately still: no WebGL, no scroll choreography, no reveal animations.
 * These pages are read, not experienced, so the only job here is a comfortable
 * measure, a clear hierarchy and a way back into the site.
 */
export function LegalShell({
  title,
  summary,
  current,
  children,
}: {
  title: string;
  summary: string;
  current: string;
  children: React.ReactNode;
}) {
  const others = legalPages.filter((p) => p.slug !== current);

  return (
    <div className="relative border-t border-cloud/8">
      <div className="shell pb-28 pt-32 md:pt-40">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[0.875rem] text-mist transition-colors duration-300 hover:text-cloud"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to VimanOne
        </Link>

        <div className="mt-12 grid gap-16 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-20">
          <article className="max-w-[60ch]">
            <header className="border-b border-cloud/10 pb-10">
              <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-cloud">
                {title}
              </h1>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-mist">{summary}</p>
              <p className="mono-label mt-8 text-mist-deep">Last updated · {legalUpdated}</p>
            </header>

            <div className="legal-prose">{children}</div>
          </article>

          <aside className="lg:pt-4">
            <nav aria-label="Legal pages">
              <h2 className="mono-label text-mist-deep">Policies</h2>
              <ul className="mt-6 space-y-4 border-l border-cloud/10 pl-5">
                {others.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={p.href}
                      className="text-[0.9375rem] text-cloud-dim transition-colors duration-300 hover:text-cloud"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="mt-10 border-l border-cloud/10 pl-5 text-[0.8125rem] leading-relaxed text-mist-deep">
              This document is a template. It should be reviewed by a qualified legal
              professional, and every bracketed placeholder replaced, before publication.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
