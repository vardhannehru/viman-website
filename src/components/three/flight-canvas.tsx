"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { flight } from "@/lib/flight-state";
import { FlightScene } from "./flight-scene";

/**
 * The persistent stage.
 *
 * One canvas, fixed behind the document. It does *not* read scroll to move
 * the aeroplane — the aeroplane is driven by completed stages alone. Scroll
 * only fades the canvas out once the journey section is behind you, and the
 * IntersectionObserver suspends the render loop entirely when it is off
 * screen, so the back half of the page costs nothing.
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

    // 1 — The flight itself. Progress across the nine roadmap steps is the
    // timeline: the aeroplane is cold and dark until the roadmap comes into
    // view, rotates around step 07, and is at cruise by step 09.
    const roadmap = document.querySelector<HTMLElement>("#roadmap");
    if (roadmap) {
      triggers.push(
        ScrollTrigger.create({
          trigger: roadmap,
          start: "top 72%",
          end: "bottom bottom",
          onUpdate: (self) => {
            flight.progress = self.progress;
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
        /* The world is in metres now: the far plane has to clear a 9 km sky
           dome, and the near plane stays back so depth precision survives it. */
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
