"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { navItems, site } from "@/lib/site";
import { EASE, viewport } from "@/lib/motion";
import { Reveal } from "@/components/motion/reveal";
import { Wordmark } from "./logo";

/**
 * Minimal footer: the mark, the source's own tagline, and links back to the
 * sections that exist. The source carries no company details, legal pages,
 * social accounts or contact information, so none appear here.
 */
export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-cloud/8 bg-void">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(34,224,255,0.5) 35%, rgba(90,169,255,0.5) 65%, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(34,224,255,0.18), transparent)" }}
      />

      <div className="shell relative pt-20 md:pt-24">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <Reveal>
            <Link href="/" className="inline-flex items-center">
              <Wordmark className="text-[1.6rem]" />
            </Link>
            <p className="mono-label mt-6 text-mist-deep">{site.tagline}</p>
          </Reveal>

          <Reveal delay={0.08}>
            <nav aria-label="Footer">
              <ul className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3 md:grid-cols-2">
                {navItems.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex text-[0.9375rem] text-cloud-dim transition-colors duration-500 hover:text-cloud"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-cyan/60 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        </div>

        {/* Sign-off */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 1.3, ease: EASE }}
          className="pointer-events-none mt-20 select-none md:mt-24"
        >
          <div
            className="text-center text-[clamp(3rem,17vw,15rem)] font-medium leading-[0.8] tracking-[-0.055em]"
            style={{
              background:
                "linear-gradient(180deg, rgba(244,248,255,0.16) 0%, rgba(244,248,255,0.03) 62%, transparent 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {site.headline}
          </div>
        </motion.div>

        <div className="border-t border-cloud/8 py-8 text-[0.8125rem] text-mist-deep">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
