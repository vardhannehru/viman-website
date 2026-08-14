"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Scroll-linked depth. Distance is expressed in pixels of travel across the
 * element's full scroll pass — positive lags behind, negative leads ahead.
 */
export function Parallax({
  children,
  className,
  distance = 90,
  scale = false,
  opacity = false,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  scale?: boolean;
  opacity?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const y = useTransform(smooth, [0, 1], [distance, -distance]);
  const s = useTransform(smooth, [0, 0.5, 1], scale ? [0.94, 1, 0.94] : [1, 1, 1]);
  const o = useTransform(smooth, [0, 0.2, 0.8, 1], opacity ? [0.3, 1, 1, 0.3] : [1, 1, 1, 1]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ y, scale: s, opacity: o }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
