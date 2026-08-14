"use client";

import { useEffect, useRef } from "react";
import { useIsTouch } from "./use-media-query";

/**
 * Magnetic hover: the element is attracted to the cursor within a radius,
 * then springs home. Pure rAF + transforms — never touches layout.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.34, radius = 1.5) {
  const ref = useRef<T>(null);
  const isTouch = useIsTouch();

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let active = false;

    const render = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      if (active || Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        raf = requestAnimationFrame(render);
      } else {
        el.style.transform = "translate3d(0,0,0)";
        raf = 0;
      }
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - (rect.left + rect.width / 2);
      const my = e.clientY - (rect.top + rect.height / 2);
      const reach = Math.max(rect.width, rect.height) * radius;
      const dist = Math.hypot(mx, my);

      if (dist < reach) {
        active = true;
        const falloff = 1 - dist / reach;
        tx = mx * strength * falloff;
        ty = my * strength * falloff;
      } else if (active) {
        active = false;
        tx = 0;
        ty = 0;
      }
      start();
    };

    const onLeave = () => {
      active = false;
      tx = 0;
      ty = 0;
      start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [strength, radius, isTouch]);

  return ref;
}
