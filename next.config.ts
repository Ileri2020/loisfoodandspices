import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  turbopack: {
    root: "./",
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '.*\\.vercel\\.app',
          },
        ],
        destination: 'https://www.loyzfoodsandspices.com/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
