import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail, Phone } from "lucide-react";
import { about, company, companyAddress, contact, site } from "@/lib/site";
import { InstagramIcon } from "@/components/ui/instagram-icon";

export const metadata: Metadata = {
  title: "About us",
  description: about.summary,
};

export default function AboutPage() {
  return (
    <div className="relative border-t border-cloud/8">
      <div className="shell pb-28 pt-32 md:pt-40">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[0.875rem] text-mist transition-colors duration-300 hover:text-cloud"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to {site.name}
        </Link>

        <article className="mt-12 max-w-[62ch]">
          <header className="border-b border-cloud/10 pb-10">
            <p className="text-[0.9375rem] font-medium text-cyan">About us</p>
            <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.035em] text-cloud">
              {site.name} — {site.tagline}
            </h1>
            <p className="mt-6 text-lead text-mist">{about.intro}</p>
          </header>

          <div className="legal-prose mt-10">
            {about.sections.map((section) => (
              <Fragment key={section.heading}>
                <h2>{section.heading}</h2>
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

            <h2>Where we are</h2>
            <p>
              <strong>{company.legalName}</strong>
              <br />
              {companyAddress}
            </p>
          </div>

          <section
            aria-label={`Contact ${site.name}`}
            className="mt-14 rounded-3xl bg-[#fdf6e7] px-7 py-8 md:px-9"
          >
            <h2 className="text-[1.375rem] font-medium tracking-[-0.02em] text-[#13235b]">
              Talk to {site.name}
            </h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#3d3a52]">
              Questions about any step, or want professional guidance? Get in touch.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#13235b] px-5 text-[0.9375rem] font-medium text-white transition-colors duration-300 hover:bg-[#1d3380]"
              >
                <Mail className="h-4 w-4" />
                {contact.email}
              </a>
              <a
                href={contact.phoneHref}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#13235b]/25 px-5 text-[0.9375rem] font-medium text-[#13235b] transition-colors duration-300 hover:border-[#13235b]/60"
              >
                <Phone className="h-4 w-4" />
                {contact.phone}
              </a>
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#13235b]/25 px-5 text-[0.9375rem] font-medium text-[#13235b] transition-colors duration-300 hover:border-[#13235b]/60"
              >
                <InstagramIcon className="h-4 w-4" />
                <span className="sr-only">Instagram </span>
                {contact.instagramHandle}
              </a>
            </div>
          </section>

          <Link
            href="/#roadmap"
            className="group mt-10 inline-flex items-center gap-2 text-[1rem] font-medium text-cloud"
          >
            Start the checklist
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </article>
      </div>
    </div>
  );
}
