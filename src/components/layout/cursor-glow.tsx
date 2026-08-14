"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A soft light source that trails the cursor and tightens over interactive
 * elements. The native cursor is intentionally left visible — hiding it looks
 * clever for four seconds and costs usability forever.
 */
export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let dx = tx;
    let dy = ty;
    let rx = tx;
    let ry = ty;
    let scale = 1;
    let targetScale = 1;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const interactive = (e.target as HTMLElement)?.closest?.(
        "a, button, [role='button'], input, textarea, select, [data-cursor='hover']",
      );
      targetScale = interactive ? 1.9 : 1;
    };

    const loop = () => {
      dx += (tx - dx) * 0.55;
      dy += (ty - dy) * 0.55;
      rx += (tx - rx) * 0.12;
      ry += (ty - ry) * 0.12;
      scale += (targetScale - scale) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[95] hidden md:block">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-10 w-10 rounded-full border border-cyan/30 opacity-70 mix-blend-screen"
        style={{ boxShadow: "0 0 30px 6px rgba(34,224,255,0.10)" }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1 w-1 rounded-full bg-cyan/90 mix-blend-screen"
        style={{ boxShadow: "0 0 14px 3px rgba(34,224,255,0.55)" }}
      />
    </div>
  );
}
