"use client";

import { useEffect } from "react";
import { flight } from "@/lib/flight-state";

/**
 * Writes a damped, normalised pointer position into the shared flight record.
 * Nothing re-renders — the 3D scene samples it per frame, and the cursor glow
 * reads it from its own rAF loop.
 */
export function PointerTracker() {
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;

    const onMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const loop = () => {
      flight.pointerX += (targetX - flight.pointerX) * 0.07;
      flight.pointerY += (targetY - flight.pointerY) * 0.07;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
