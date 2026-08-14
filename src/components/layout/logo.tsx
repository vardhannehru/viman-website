"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  VIMAN IDENTITY                                                            */
/*                                                                            */
/*  Two marks, drawn rather than imported so they stay crisp at every size    */
/*  and inherit the page's colour:                                            */
/*                                                                            */
/*  · The delta — the "A" of VIMAN, a solid blue triangle with an aircraft    */
/*    climbing out of it in negative space.                                   */
/*  · The runway badge — a plate view of a jet on a runway, centreline above   */
/*    it and threshold bars below.                                            */
/* -------------------------------------------------------------------------- */

/** The delta "A". Doubles as the standalone app icon. */
export function LogoMark({ className }: { className?: string }) {
  // Every instance needs its own gradient and mask ids — `url(#id)` resolves
  // to the first match in the document, so shared ids break the moment one
  // instance unmounts.
  const uid = useId().replace(/:/g, "");
  const gradientId = `viman-delta-${uid}`;
  const maskId = `viman-delta-mask-${uid}`;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
      className={cn("h-7 w-7", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="14" y1="94" x2="86" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4560F0" />
          <stop offset="0.55" stopColor="#5271F5" />
          <stop offset="1" stopColor="#7C93FF" />
        </linearGradient>
        {/* The aircraft is cut out of the delta, not drawn on top of it —
            so the mark works on any background. */}
        <mask id={maskId}>
          <rect width="100" height="100" fill="#fff" />
          <path d="M50 43 L83 97 L67.5 97 L50 68 L32.5 97 L17 97 Z" fill="#000" />
          <rect x="45.4" y="62" width="9.2" height="38" fill="#000" />
        </mask>
      </defs>

      <path d="M50 5 L97 96 L3 96 Z" fill={`url(#${gradientId})`} mask={`url(#${maskId})`} />
    </svg>
  );
}

/** The runway plate that closes the wordmark. */
export function RunwayBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 64"
      fill="none"
      aria-hidden
      className={cn("h-8 w-5", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Plate */}
      <rect
        x="1.4"
        y="1.4"
        width="37.2"
        height="61.2"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="2.6"
      />
      {/* Approach centreline */}
      <path
        d="M20 5.5V25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 3.4"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Jet, plan view */}
      <path
        d="M20 20.4c1.2 0 1.9 2.4 2 5.5v4.6l11.5 8.4v2.6L22 37.6v5l4 3v1.6L20 45.6 14 47.2v-1.6l4-3v-5L6.5 41.5v-2.6L18 30.5v-4.6c.1-3.1.8-5.5 2-5.5Z"
        fill="currentColor"
      />
      {/* Threshold bars */}
      <g fill="currentColor">
        <rect x="8.4" y="51" width="2.4" height="9" />
        <rect x="12.8" y="51" width="2.4" height="9" />
        <rect x="24.8" y="51" width="2.4" height="9" />
        <rect x="29.2" y="51" width="2.4" height="9" />
      </g>
    </svg>
  );
}

/**
 * The full lockup: VIM · delta · N · runway plate.
 * `size` drives everything through `em`, so the whole mark scales from one
 * font-size and never drifts out of proportion.
 */
export function Wordmark({
  className,
  showBadge = true,
}: {
  className?: string;
  showBadge?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center leading-none text-cloud", className)}>
      <span className="font-light tracking-[0.04em]">VIM</span>
      <LogoMark className="mx-[0.045em] h-[0.82em] w-[0.82em] translate-y-[0.015em]" />
      <span className="font-light tracking-[0.04em]">N</span>
      {showBadge && (
        <RunwayBadge className="ml-[0.14em] h-[1.02em] w-[0.64em] text-cloud" />
      )}
    </span>
  );
}
