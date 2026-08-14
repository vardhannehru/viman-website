"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { EASE } from "@/lib/motion";
import { Pill } from "@/components/ui/pill";
import { TextReveal } from "@/components/motion/text-reveal";

/**
 * Shared opener for every interior page — keeps the entrance choreography
 * identical across routes so navigation feels like one continuous document.
 */
export function PageHero({
  eyebrow,
  title,
  accent,
  lede,
  tone = "cyan",
  backHref = "/",
  backLabel = "Home",
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  lede?: string;
  tone?: "cyan" | "gold" | "sky" | "neutral";
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[34rem] aurora opacity-70 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px rule-x"
      />

      <div className="shell relative">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <Link
            href={backHref}
            className="group inline-flex items-center gap-2 text-[0.875rem] text-mist transition-colors duration-500 hover:text-cloud"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1" />
            {backLabel}
          </Link>
        </motion.div>

        <div className="mt-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
          >
            <Pill tone={tone}>{eyebrow}</Pill>
          </motion.div>

          <h1 className="mt-7 max-w-4xl text-title">
            <span className="text-gradient">
              <TextReveal text={title} by="word" immediate delay={0.15} />
            </span>
            {accent && (
              <>
                <br />
                <span className="font-serif italic text-cloud/90">
                  <TextReveal text={accent} by="word" immediate delay={0.3} />
                </span>
              </>
            )}
          </h1>

          {lede && (
            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: EASE, delay: 0.45 }}
              className="mt-7 max-w-2xl text-lead text-mist"
            >
              {lede}
            </motion.p>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.6 }}
              className="mt-12"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
