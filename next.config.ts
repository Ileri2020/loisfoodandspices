import type { NextConfig } from "next";

interface CustomNextConfig extends NextConfig {
  eslint?: {
    ignoreDuringBuilds: boolean;
  };
}

const nextConfig: CustomNextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
