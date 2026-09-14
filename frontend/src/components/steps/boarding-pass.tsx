"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Check, Mail, Phone } from "lucide-react";
import { contact, type StepGuide } from "@/lib/site";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { Wordmark } from "@/components/layout/logo";

type Promo = NonNullable<StepGuide["promo"]>;

/* The perforation holes and corner notches are cut in the page colour. It is
   written out rather than taken from --color-void because the ticket half sits
   in the dark theme, where that token is the night palette. */
const PAGE = "#f5f7fb";

/**
 * A boarding pass for a VimanOne offer. Scrolling it up the screen tears the
 * stub off along the perforation; scrolling back down joins it again.
 */
export function BoardingPass({ promo, stepLabel }: { promo: Promo; stepLabel: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["center 85%", "center 35%"] });
  const tear = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.35 });

  /* The stub rips from the right, so it pivots on its top-left corner and the
     free end drops furthest. The ticket gives a little the other way. */
  const stubY = useTransform(tear, [0, 1], [0, 36]);
  const stubX = useTransform(tear, [0, 1], [0, 6]);
  const stubRotate = useTransform(tear, [0, 1], [0, 5]);
  const ticketRotate = useTransform(tear, [0, 1], [0, -0.8]);

  return (
    <section
      ref={ref}
      aria-label="VimanOne professional guidance"
      /* The bottom padding is the room the torn stub drops into, so it never
         lands on whatever follows the pass. */
      className={`relative mt-6 pb-10 ${promo.turbulence ? "animate-chop" : ""}`}
    >
      <motion.div
        style={reduced ? undefined : { rotate: ticketRotate, transformOrigin: "100% 100%" }}
        className="theme-dark relative overflow-hidden rounded-t-3xl bg-[#13235b] px-7 pb-11 pt-10 shadow-[0_18px_40px_-28px_rgba(19,35,91,0.55)] md:px-10 md:pt-12"
      >
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <Wordmark className="text-[1.35rem]" />
          <span className="text-[0.875rem] text-[#aeb9e8]">{promo.eyebrow}</span>
        </div>
        <h2 className="mt-8 text-[clamp(1.75rem,4vw,2.6rem)] font-medium leading-[1.06] tracking-[-0.03em] text-white">
          {promo.title}
        </h2>
        <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-[#d6ddf6]">{promo.body}</p>
        <ul className="mt-7 space-y-3">
          {promo.points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-[0.9375rem] text-white">
              <Check className="mt-1 h-4 w-4 shrink-0 text-[#f5b841]" strokeWidth={2.5} />
              {point}
            </li>
          ))}
        </ul>

        {/* Upper half of the perforation, and the corner notches. */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1.5 bg-[length:12px_6px] bg-repeat-x"
          style={{ backgroundImage: `radial-gradient(circle at 6px 6px, ${PAGE} 3px, transparent 3.5px)` }}
        />
        <span aria-hidden className="absolute -bottom-3 -left-3 h-6 w-6 rounded-full" style={{ background: PAGE }} />
        <span aria-hidden className="absolute -bottom-3 -right-3 h-6 w-6 rounded-full" style={{ background: PAGE }} />
      </motion.div>

      <motion.div
        style={reduced ? undefined : { x: stubX, y: stubY, rotate: stubRotate, transformOrigin: "0% 0%" }}
        className="relative flex flex-col gap-7 overflow-hidden rounded-b-3xl bg-[#fdf6e7] px-7 pb-8 pt-9 shadow-[0_30px_60px_-36px_rgba(19,35,91,0.5)] md:px-10"
      >
        {/* Lower half of the perforation, and the corner notches. */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1.5 bg-[length:12px_6px] bg-repeat-x"
          style={{ backgroundImage: `radial-gradient(circle at 6px 0, ${PAGE} 3px, transparent 3.5px)` }}
        />
        <span aria-hidden className="absolute -left-3 -top-3 h-6 w-6 rounded-full" style={{ background: PAGE }} />
        <span aria-hidden className="absolute -right-3 -top-3 h-6 w-6 rounded-full" style={{ background: PAGE }} />

        <dl className="grid gap-5 sm:grid-cols-[1.6fr_1fr_0.7fr] sm:gap-6">
          <div>
            <dt className="text-[0.75rem] text-[#7a6d55]">Step</dt>
            <dd className="mt-1 text-[0.9375rem] font-medium leading-snug text-[#13235b]">{stepLabel}</dd>
          </div>
          <div>
            <dt className="text-[0.75rem] text-[#7a6d55]">Service</dt>
            <dd className="mt-1 text-[0.9375rem] font-medium text-[#13235b]">
              {promo.service ?? "Professional guidance & help"}
            </dd>
          </div>
          <div>
            <dt className="text-[0.75rem] text-[#7a6d55]">Operated by</dt>
            <dd className="mt-1 text-[0.9375rem] font-medium text-[#13235b]">VimanOne</dd>
          </div>
        </dl>

        <div>
          <p className="text-[1.125rem] font-semibold leading-snug text-[#13235b]">{promo.action}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={`mailto:${contact.email}?subject=${encodeURIComponent(`VimanOne guidance — Step ${stepLabel}`)}`}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#13235b] px-5 text-[0.9375rem] font-medium text-white transition-colors duration-300 hover:bg-[#1d3380]"
            >
              <Mail className="h-4 w-4" />
              Email VimanOne
            </a>
            <a
              href={contact.phoneHref}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#13235b]/25 px-5 text-[0.9375rem] font-medium text-[#13235b] transition-colors duration-300 hover:border-[#13235b]/60"
            >
              <Phone className="h-4 w-4" />
              {contact.phone}
            </a>
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#13235b]/25 px-5 text-[0.9375rem] font-medium text-[#13235b] transition-colors duration-300 hover:border-[#13235b]/60"
            >
              <InstagramIcon className="h-4 w-4" />
              <span className="sr-only">Instagram </span>
              {contact.instagramHandle}
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
