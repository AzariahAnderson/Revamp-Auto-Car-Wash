import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow a custom dist dir locally (NEXT_DIST_DIR=.next-prod bun run build)
  // so production builds never clobber the dev server's .next folder.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
