import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Support both VPS/Docker and Vercel deploys.
  output: "standalone",
  eslint: {
    // Linting runs as a dedicated CI step (`eslint . --max-warnings 0`)
    // with the full strict-type-checked config; the build-time pass would
    // duplicate it with a weaker setup.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
