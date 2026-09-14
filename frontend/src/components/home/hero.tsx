"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MoveDown } from "lucide-react";
import { EASE } from "@/lib/motion";
import { site } from "@/lib/site";
import { scrollToSection } from "@/components/providers/smooth-scroll";
import { LogoMark } from "@/components/layout/logo";

/**
 * The brand screen: "VimanOne / Zero to Cockpit", and one line on what it is.
 * No claims, no statistics, no supporting copy beyond what the source carries.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 190]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.6], [0, 14]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pb-10 pt-28 md:pb-16"
    >
      {/* Light rays — DOM layer between the WebGL sky and the type */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div
          className="absolute -top-1/3 left-1/2 h-[130%] w-[38rem] -translate-x-1/2 rotate-[14deg] opacity-40 blur-2xl animate-pulse-glow"
          style={{
            background:
              "linear-gradient(180deg, rgba(90,169,255,0.24), rgba(34,224,255,0.06) 45%, transparent 78%)",
          }}
        />
        <div
          className="absolute -top-1/4 left-[18%] h-[120%] w-[16rem] -rotate-[10deg] opacity-30 blur-2xl"
          style={{
            background: "linear-gradient(180deg, rgba(232,195,106,0.16), transparent 70%)",
            animation: "pulse-glow 5.5s cubic-bezier(0.65,0,0.35,1) infinite 1.2s",
          }}
        />
        {/* Legibility scrim */}
        <div className="hidden md:block md:absolute md:inset-0 md:bg-[radial-gradient(90%_70%_at_20%_45%,rgba(4,7,14,0.86),transparent_72%)]" />
        <div className="absolute inset-x-0 bottom-0 top-[30%] bg-gradient-to-t from-void via-void/94 to-transparent md:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-void via-void/70 to-transparent" />
      </div>

      <motion.div
        style={{ y, opacity, filter, scale }}
        className="shell relative z-10 flex flex-1 flex-col justify-end pb-6 md:justify-center md:pb-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
        >
          {/* The brand line: the logo's own delta, then the name set in the
              logo's light weight with "One" in the delta's blue. */}
          <p className="flex items-center gap-3 text-[clamp(1.75rem,3.4vw,2.6rem)] font-light leading-none tracking-[0.03em] text-cloud">
            <LogoMark className="h-[0.92em] w-[0.92em] shrink-0" />
            <span>
              Viman
              <span className="bg-gradient-to-r from-[#7C93FF] to-[#5271F5] bg-clip-text font-normal text-transparent">
                One
              </span>
            </span>
          </p>
        </motion.div>

        <h1 className="mt-4 max-w-5xl text-display">
          <span className="block overflow-hidden">
            <motion.span
              className="block text-gradient"
              initial={{ y: "115%", rotateX: -60, opacity: 0 }}
              animate={{ y: "0%", rotateX: 0, opacity: 1 }}
              transition={{ duration: 1.35, ease: EASE, delay: 0.25 }}
            >
              Zero to
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block"
              initial={{ y: "115%", rotateX: -60, opacity: 0 }}
              animate={{ y: "0%", rotateX: 0, opacity: 1 }}
              transition={{ duration: 1.35, ease: EASE, delay: 0.38 }}
            >
              <span className="text-gradient-cyan">Cockpit</span>
            </motion.span>
          </span>
        </h1>

        {/* One affordance, and it is the same gesture the whole film runs on.
            Everything past this point is scrubbed by how far you have read. */}
        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.62 }}
          className="mt-11 max-w-md text-lead text-cloud-dim"
        >
          {site.summary} It is still dark on the ramp — scroll, and the morning starts.
        </motion.p>
      </motion.div>

      <motion.div style={{ opacity }} className="shell relative z-10">
        <button
          type="button"
          onClick={() => scrollToSection("#stages", -8)}
          className="group/scroll inline-flex items-center gap-3 rounded-full py-2 pr-4 text-left"
        >
          <span className="relative flex h-8 w-[1px] overflow-hidden bg-cloud/12">
            <span className="absolute inset-x-0 h-3 bg-cyan animate-scan" />
          </span>
          <span className="mono-label text-mist-deep transition-colors duration-500 group-hover/scroll:text-cloud">
            Scroll
          </span>
          <MoveDown className="h-3.5 w-3.5 text-mist-deep transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/scroll:translate-y-0.5" />
        </button>
      </motion.div>
    </section>
  );
}
