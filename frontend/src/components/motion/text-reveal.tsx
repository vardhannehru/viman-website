"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

type Split = "word" | "char" | "line";

type TextRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  by?: Split;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  once?: boolean;
  /** Renders immediately instead of on scroll — used for the hero. */
  immediate?: boolean;
};

/**
 * Masked type reveal. Each unit climbs out of a clipped box with a slight
 * X-rotation, so the line assembles like a departure board rather than a fade.
 * The source string stays readable to assistive tech via aria-label.
 */
export function TextReveal({
  text,
  as: Tag = "span",
  by = "word",
  className,
  delay = 0,
  stagger,
  duration = 1.05,
  once = true,
  immediate = false,
}: TextRevealProps) {
  const units =
    by === "char" ? Array.from(text) : by === "line" ? text.split("\n") : text.split(" ");

  const step = stagger ?? (by === "char" ? 0.028 : by === "line" ? 0.14 : 0.058);
  const MotionTag = motion[Tag] as typeof motion.span;

  return (
    <MotionTag
      aria-label={text}
      className={cn("inline-block", className)}
      initial="hidden"
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once, margin: "-10% 0px -10% 0px" } })}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: step, delayChildren: delay } },
      }}
      style={{ perspective: "800px" }}
    >
      {units.map((unit, i) => (
        <span
          key={`${unit}-${i}`}
          aria-hidden
          className={cn(
            "inline-block overflow-hidden align-bottom",
            by === "line" && "block",
          )}
          style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "108%", opacity: 0, rotateX: -42 },
              show: {
                y: "0%",
                opacity: 1,
                rotateX: 0,
                transition: { duration, ease: EASE },
              },
            }}
          >
            {unit}
            {by === "word" && i < units.length - 1 ? " " : ""}
            {by === "char" && unit === " " ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
