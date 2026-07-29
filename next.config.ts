import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone only when a VPS or Docker build asks for it. Left on
  // unconditionally, `next start` warns that it is serving the wrong output
  // and Vercel does not want it either — the bundle it produces is meant to be
  // run with `node .next/standalone/server.js`. Set STANDALONE=1 for that
  // build; leave it unset for Vercel and for local `npm start`.
  output: process.env.STANDALONE === "1" ? "standalone" : undefined,
  images: {
    // Next 16 requires every quality used to be declared. UI captures are read
    // for their text, so they are served well above the 75 default — at 75 the
    // optimiser was re-encoding an already-compressed webp and the screens came
    // out mushy.
    qualities: [75, 90, 92],
  },
  eslint: {
    // Linting runs as a dedicated CI step (`eslint . --max-warnings 0`)
    // with the full strict-type-checked config; the build-time pass would
    // duplicate it with a weaker setup.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
