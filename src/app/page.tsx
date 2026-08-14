import { FlightCanvasClient } from "@/components/three/flight-canvas-client";
import { Hero } from "@/components/sections/hero";
import { Stages } from "@/components/sections/stages";
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

      {/* The aeroplane lives behind this whole region. It sits cold and dark
          on the ramp through the hero and the stages, and flies across the
          roadmap — scroll progress over those nine steps is the flight. */}
      <div id="flight-stage" className="relative">
        <Hero />
        <Stages />
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
