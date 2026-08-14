"use client";

import { cn } from "@/lib/utils";
import { Pill } from "./pill";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";

/**
 * The standard section opener: eyebrow, masked headline reveal, lede.
 * Used everywhere so vertical rhythm never drifts between sections.
 */
export function SectionHeading({
  eyebrow,
  title,
  accent,
  lede,
  align = "left",
  tone = "cyan",
  className,
}: {
  eyebrow?: string;
  title: string;
  /** Rendered in italic serif on its own line — one per heading, never more. */
  accent?: string;
  lede?: string;
  align?: "left" | "center";
  tone?: "cyan" | "gold" | "sky" | "neutral";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal direction="none" blur={6}>
          <Pill tone={tone}>{eyebrow}</Pill>
        </Reveal>
      )}

      <h2 className={cn("text-heading text-gradient", eyebrow && "mt-7")}>
        <TextReveal text={title} by="word" />
        {accent && (
          <>
            <br />
            <span className="font-serif italic text-cloud/95">
              <TextReveal text={accent} by="word" delay={0.12} />
            </span>
          </>
        )}
      </h2>

      {lede && (
        <Reveal delay={0.15}>
          <p
            className={cn(
              "mt-6 text-lead text-mist",
              align === "center" && "mx-auto max-w-2xl",
            )}
          >
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  );
}
