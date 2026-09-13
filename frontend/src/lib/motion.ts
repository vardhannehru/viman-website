import type { Variants, Transition } from "motion/react";

/**
 * Shared motion language.
 * Everything decelerates — nothing in this product accelerates into a stop.
 */

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_SWIFT = [0.4, 0, 0.2, 1] as const;

export const transition: Transition = { duration: 0.9, ease: EASE };
export const transitionFast: Transition = { duration: 0.5, ease: EASE };

/** Standard section entrance: rise + de-blur. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition },
};

/** Cards arriving with depth. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 30, filter: "blur(12px)" },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE },
  },
};

/** Parent orchestrator — children arrive in sequence, never all at once. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

/** Per-character / per-word reveal used by <TextReveal />. */
export const revealChild: Variants = {
  hidden: { opacity: 0, y: "0.6em", rotateX: -55 },
  show: {
    opacity: 1,
    y: "0em",
    rotateX: 0,
    transition: { duration: 1.05, ease: EASE },
  },
};

/** Viewport config used site-wide so trigger points feel consistent. */
export const viewport = { once: true, margin: "-12% 0px -12% 0px" } as const;
