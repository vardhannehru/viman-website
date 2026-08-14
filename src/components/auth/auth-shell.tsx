"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { site } from "@/lib/site";
import { Wordmark } from "@/components/layout/logo";

/**
 * Split-screen frame for the login screen. The left panel carries the brand
 * only — the source has no testimonial, marketing copy or secondary content
 * on this screen, so none is added.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid min-h-[100svh] lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden border-r border-cloud/8 lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-80" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-1/4 top-1/4 h-[36rem] w-[36rem] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(34,224,255,0.28), transparent)" }}
        />
        {[0.32, 0.5, 0.68].map((top, i) => (
          <motion.div
            key={top}
            aria-hidden
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.3 + i * 0.15 }}
            className="pointer-events-none absolute inset-x-0 h-px origin-left"
            style={{
              top: `${top * 100}%`,
              background:
                "linear-gradient(90deg, rgba(34,224,255,0.35), rgba(90,169,255,0.12) 45%, transparent)",
            }}
          />
        ))}

        <div className="relative p-12">
          <Link href="/" className="inline-flex items-center">
            <Wordmark className="text-[1.4rem]" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
          className="relative p-12"
        >
          <p className="mono-label text-mist-deep">{site.tagline}</p>
          <p className="mt-5 text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[0.95] tracking-[-0.04em] text-gradient">
            {site.headline}
          </p>
        </motion.div>

        <div className="relative p-12" />
      </aside>

      {/* Task panel */}
      <div className="relative flex items-center justify-center px-6 py-28 sm:px-10 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
