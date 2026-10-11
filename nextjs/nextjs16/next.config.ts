import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForBuild: true,
  },
  cacheComponents: true,
};

export default nextConfig;
