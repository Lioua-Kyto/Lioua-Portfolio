import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Support both VPS/Docker and Vercel deploys.
  output: "standalone",
  images: {
    // The portrait is served at quality 90; Next 16 requires every quality
    // used to be declared up front.
    qualities: [75, 90],
  },
  eslint: {
    // Linting runs as a dedicated CI step (`eslint . --max-warnings 0`)
    // with the full strict-type-checked config; the build-time pass would
    // duplicate it with a weaker setup.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
