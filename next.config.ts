import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint checks during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Ignores TypeScript errors during builds
  },
  reactStrictMode: false, // Disables React strict mode to prevent warnings
  webpack: (config) => {
    // Optional: Add custom webpack configuration if needed
    return config;
  },
};

export default nextConfig;
