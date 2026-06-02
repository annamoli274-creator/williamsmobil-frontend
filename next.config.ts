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
  webpack: (config: import('webpack').Configuration) => {
    const cfg = config || ({} as import('webpack').Configuration);
    cfg.resolve = cfg.resolve || {};
    const alias: import('webpack').Resolve['alias'] = {
      ...(cfg.resolve.alias || {}),
      "@swc/helpers/esm/index.js": path.resolve(
        __dirname,
        "src/shims/swc-helpers.js",
      ),
    };
    cfg.resolve.alias = alias;
    return cfg;
  },
};

export default nextConfig;
