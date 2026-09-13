import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Clamp a number between min and max. */
export const clamp = (v: number, min = 0, max = 1) => Math.min(Math.max(v, min), max);

/**
 * Map a value from one range to another, clamped.
 * Used heavily by the flight storyboard to slice a global 0→1 scroll
 * progress into per-beat local progress.
 */
export const mapRange = (v: number, inMin: number, inMax: number, outMin = 0, outMax = 1) =>
  clamp((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;

/** Smoothstep easing — the workhorse for scroll-linked 3D transitions. */
export const smoothstep = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
