import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/adapter-pg", "pg"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
