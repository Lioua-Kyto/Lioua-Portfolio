import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Support both VPS/Docker and Vercel deploys.
  output: "standalone",
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
