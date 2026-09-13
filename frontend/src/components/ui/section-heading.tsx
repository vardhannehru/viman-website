"use client";

import { cn } from "@/lib/utils";
import { Pill } from "./pill";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";

/**
 * The standard section opener: eyebrow, masked headline reveal, lede.
 *
 * `accent` continues the headline. By default it continues it on the same line
 * in a dimmer weight, which is the quiet case. `serif` promotes it to its own
 * italic line — that treatment is loud, so it is reserved for the two sections
 * that open an act rather than applied to every heading on the page.
 */
export function SectionHeading({
  eyebrow,
  title,
  accent,
  serif = false,
  lede,
  align = "left",
  tone = "cyan",
  className,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  /** Break the accent onto its own italic serif line. Use sparingly. */
  serif?: boolean;
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

      <h2 className={cn("text-heading text-cloud", eyebrow && "mt-7")}>
        <TextReveal text={title} by="word" />
        {accent &&
          (serif ? (
            <>
              <br />
              <span className="font-serif italic text-cloud/90">
                <TextReveal text={accent} by="word" delay={0.12} />
              </span>
            </>
          ) : (
            <>
              {" "}
              <span className="text-mist">
                <TextReveal text={accent} by="word" delay={0.1} />
              </span>
            </>
          ))}
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
