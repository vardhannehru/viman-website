"use client";

import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/use-magnetic";

/**
 * Wraps any element in a magnetic field. The wrapper does the translating so
 * the child keeps its own transforms (hover scale, motion variants) intact.
 */
export function Magnetic({
  children,
  strength = 0.34,
  radius = 1.5,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useMagnetic<HTMLSpanElement>(strength, radius);
  return (
    <span ref={ref} className={cn("inline-block will-change-transform", className)}>
      {children}
    </span>
  );
}
