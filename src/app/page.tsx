import { FlightCanvasClient } from "@/components/three/flight-canvas-client";
import { Hero } from "@/components/sections/hero";
import { Stages } from "@/components/sections/stages";
import { Approach } from "@/components/sections/approach";
import { Roadmap } from "@/components/sections/roadmap";
import { Prerequisites } from "@/components/sections/prerequisites";
import { PathwaySteps } from "@/components/sections/pathway-steps";
import { Investment } from "@/components/sections/investment";
import { Pathways } from "@/components/sections/pathways";
import { Portals } from "@/components/sections/portals";

/**
 * The page follows the order of the source document:
 *
 *   brand → which stage are you in? → roadmap → prerequisites →
 *   step-by-step pathway → timeline & investment →
 *   cadet vs traditional (+ decision tree) → application portals
 */
export default function HomePage() {
  return (
    <>
      {/* Persistent 3D stage, fixed behind the document at z-0. */}
      <FlightCanvasClient />

      {/* One continuous shot lives behind this whole region, and scrolling it
          is the only thing that moves it. The hero, the stages and the
          pre-flight section carry the ground story — pre-dawn, sunrise, the
          arrival, the walk, engine start and the taxi out. The roadmap is the
          flight: brakes off at step 01, cruise at step 09. */}
      <div id="flight-stage" className="relative">
        <Hero />
        <Stages />
        <Approach />
        <Roadmap />
      </div>

      <Prerequisites />
      <PathwaySteps />
      <Investment />
      <Pathways />
      <Portals />
    </>
  );
}
