import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Build the whole site as plain files in out/ — Cloudflare serves them as
  // static assets (see wrangler.jsonc). Nothing here needs a server.
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin tracing to this project — a stray lockfile in the home directory
  // otherwise gets inferred as the workspace root.
  outputFileTracingRoot: path.join(__dirname),
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion", "@react-three/drei"],
  },
};

export default nextConfig;
