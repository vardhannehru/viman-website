import { FlightCanvasClient } from "@/components/three/flight-canvas-client";
import { Hero } from "@/components/home/hero";
import { Stages } from "@/components/home/stages";
import { Approach } from "@/components/home/approach";
import { Roadmap } from "@/components/home/roadmap";
import { Prerequisites } from "@/components/home/prerequisites";
import { Investment } from "@/components/home/investment";
import { Pathways } from "@/components/home/pathways";

/**
 * The page follows the order of the source document:
 *
 *   brand → which stage are you in? → checklist → prerequisites →
 *   timeline & approx. investment → cadet vs traditional (+ decision tree)
 */
export default function HomePage() {
  return (
    <>
      {/* Night sky behind the film. Server-rendered, so the light copy over
          the film is readable before WebGL has started (or if it never does);
          the canvas paints over it once it runs. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-[#04070e]" />

      {/* Persistent 3D stage, fixed behind the document at z-0. */}
      <FlightCanvasClient />

      {/* One continuous shot lives behind this whole region, and scrolling it
          is the only thing that moves it. The hero, the stages and the
          pre-flight section carry the ground story — pre-dawn, sunrise, the
          arrival, the walk, engine start and the taxi out. The roadmap is the
          flight: brakes off at step 01, cruise at step 09. */}
      <div id="flight-stage" className="theme-dark relative">
        <Hero />
        <Stages />
        <Approach />
        <Roadmap />
      </div>

      {/* The light page slides up over the finished film on its own ground,
          so no light copy is ever laid across the 3D scene. */}
      <div className="relative z-10 bg-void">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-48 h-48 bg-gradient-to-b from-transparent to-void"
        />
        <Prerequisites />
        <Investment />
        <Pathways />
      </div>
    </>
  );
}
