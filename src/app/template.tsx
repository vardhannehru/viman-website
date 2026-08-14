"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

/**
 * Route transition.
 *
 * Deliberately opacity-only: `transform` or `filter` here would make this a
 * containing block for every `position: fixed` descendant, which would nail the
 * WebGL stage to the page instead of the viewport. The fade is the transition;
 * each page animates its own content in behind it.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
