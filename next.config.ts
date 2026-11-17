import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
    // Avoid stale CSS between dev restarts on Windows
    turbopackFileSystemCacheForDev: false,
    serverActions: {
      // Allow photo uploads from the admin panel
      bodySizeLimit: "8mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
