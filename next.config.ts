import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sequelize"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  allowedDevOrigins: ["192.168.1.66"],
  turbopack: {},
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@swc/helpers/esm/index.js": path.resolve(
        __dirname,
        "src/shims/swc-helpers.js",
      ),
    } as any;
    return config;
  },
};

export default nextConfig;
