"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { flight, REDUCED_MOTION_FRAME } from "@/lib/flight-state";
import { GROUND_ACT } from "@/lib/storyboard";
import { FlightScene } from "./flight-scene";

/**
 * The persistent stage.
 *
 * One canvas, fixed behind the document, and one number written into it.
 * Scroll is the only clock: there is no autoplay anywhere in the scene, no
 * timer, and no animation that advances on its own. Stop scrolling and the
 * film stops on the frame you stopped on; scroll back and it runs backwards.
 *
 * The film is scrubbed by two contiguous ScrollTriggers rather than one, so
 * the story beats stay pinned to the sections that carry them however tall
 * those sections turn out to be on a given viewport:
 *
 *   A  top of the page → top of the roadmap   →  progress 0 → GROUND_ACT
 *   B  the roadmap itself                     →  progress GROUND_ACT → 1
 *
 * They share an edge exactly, so the handover is a single value written twice
 * rather than a seam.
 */
export function FlightCanvas({ stageSelector = "#flight-stage" }: { stageSelector?: string }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [quality, setQuality] = useState<"high" | "low">("low");
  const [active, setActive] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    const tier: "high" | "low" = prefersReduced || isMobile || cores <= 4 ? "low" : "high";

    flight.quality = tier;
    flight.reducedMotion = prefersReduced;
    /* Reduced motion never scrubs, so the scene is parked on one composed
       frame before it is ever rendered. */
    if (prefersReduced) flight.progress = REDUCED_MOTION_FRAME;

    setQuality(tier);
    setReduced(prefersReduced);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    gsap.registerPlugin(ScrollTrigger);

    const stage = document.querySelector<HTMLElement>(stageSelector);
    if (!stage) return;

    const triggers: ScrollTrigger[] = [];

    // 1 — The film. Nothing is scrubbed at all when reduced motion is asked
    // for: the scene stays on its single settled frame.
    const roadmap = document.querySelector<HTMLElement>("#roadmap");
    if (!flight.reducedMotion && roadmap) {
      triggers.push(
        // Act I — the ground story, across everything above the roadmap.
        ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          endTrigger: roadmap,
          end: "top top",
          onUpdate: (self) => {
            flight.progress = self.progress * GROUND_ACT;
          },
        }),
        // Act II — the flight, across the nine roadmap steps.
        ScrollTrigger.create({
          trigger: roadmap,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            flight.progress = GROUND_ACT + self.progress * (1 - GROUND_ACT);
          },
        }),
      );
    }

    // 2 — Hand the page back to the DOM once the aeroplane is at cruise.
    if (wrapper.current) {
      triggers.push(
        ScrollTrigger.create({
          trigger: stage,
          start: "bottom bottom",
          end: "bottom top",
          scrub: 0.6,
          animation: gsap.to(wrapper.current, { opacity: 0, ease: "none" }),
        }),
      );
    }

    // 3 — Suspend the render loop when the stage is off screen.
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: "20% 0px 20% 0px",
    });
    io.observe(stage);

    return () => {
      triggers.forEach((t) => t.kill());
      io.disconnect();
    };
  }, [mounted, stageSelector]);

  if (!mounted) return null;

  return (
    <div
      ref={wrapper}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ contain: "strict" }}
    >
      <Canvas
        frameloop={reduced || !active ? "demand" : "always"}
        shadows={quality === "high"}
        dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
        gl={{
          antialias: quality === "low",
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        /* The world is in metres: the far plane has to clear a 9 km sky dome,
           and the near plane stays back so depth precision survives it. */
        camera={{ fov: 34, near: 1, far: 20000, position: [58, 17, 74] }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor("#04070e", 1);
          gl.toneMappingExposure = 1.05;
          scene.background = null;
        }}
      >
        <Suspense fallback={null}>
          <FlightScene quality={quality} />
        </Suspense>
      </Canvas>
    </div>
  );
}
