import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  images: {
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://danubooking.et/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
