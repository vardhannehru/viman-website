"use client";

import dynamic from "next/dynamic";

/**
 * WebGL is loaded on the client only, and lazily — the document, its copy and
 * its structured data all render and index without waiting on three.js.
 */
const FlightCanvas = dynamic(
  () => import("./flight-canvas").then((m) => m.FlightCanvas),
  { ssr: false, loading: () => null },
);

export function FlightCanvasClient() {
  return <FlightCanvas />;
}
