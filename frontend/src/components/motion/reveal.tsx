"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE, viewport } from "@/lib/motion";

type Direction = "up" | "down" | "left" | "right" | "none";

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 30 },
  down: { y: -30 },
  left: { x: 40 },
  right: { x: -40 },
  none: {},
};

/**
 * The site's default entrance: rise, de-blur, settle.
 * Blur is what makes it read as cinematic rather than "a div faded in".
 */
export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.95,
  blur = 10,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  blur?: number;
  as?: "div" | "section" | "li" | "article" | "span";
}) {
  const variants: Variants = {
    hidden: { opacity: 0, ...offset[direction], filter: `blur(${blur}px)` },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: { duration, ease: EASE, delay },
    },
  };

  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={variants}
    >
      {children}
    </Tag>
  );
}

/** Orchestrates a group of <RevealItem /> children into a sequence. */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "section";
}) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
  y = 34,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
  y?: number;
}) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y, filter: "blur(12px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: EASE } },
      }}
    >
      {children}
    </Tag>
  );
}
