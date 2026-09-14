"use client";

import { motion } from "motion/react";
import { MoveDown } from "lucide-react";
import { EASE, viewport } from "@/lib/motion";
import { scrollToSection } from "@/components/providers/smooth-scroll";

/**
 * The question the whole page answers. It sits over the first light of the
 * film, and the only thing it asks of you is to keep scrolling.
 */
export function Stages() {
  return (
    <section id="stages" className="relative z-10 section-pad">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,14,0.5),rgba(4,7,14,0.93)_10%,rgba(4,7,14,0.95)_90%,rgba(4,7,14,0.5))] md:bg-[linear-gradient(180deg,transparent,rgba(4,7,14,0.6)_15%,rgba(4,7,14,0.75)_50%,rgba(4,7,14,0.6)_85%,transparent)]"
      />

      <div className="shell relative text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={viewport}
          transition={{ duration: 0.95, ease: EASE }}
          className="mx-auto max-w-4xl text-title text-cloud"
        >
          Thinking to become a pilot?
        </motion.h2>

        <motion.button
          type="button"
          onClick={() => scrollToSection("#approach")}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="mt-10 inline-flex flex-col items-center gap-4 text-lead text-cloud-dim transition-colors duration-300 hover:text-cloud"
        >
          Scroll down to become a pilot
          <MoveDown className="h-5 w-5 animate-bounce" strokeWidth={1.6} />
        </motion.button>
      </div>
    </section>
  );
}
