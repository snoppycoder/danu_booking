import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://danubooking.et/api/v1/:path*",
      },
    ];
  },

  // You can keep your commented-out webpack stuff here if you want
  // webpack(config) {
  //   config.module?.rules?.push({
  //     test: /\.svg$/i,
  //     issuer: /\.[jt]sx?$/,
  //     use: ["@svgr/webpack"],
  //   });
  //   return config;
  // },
};

export default nextConfig;
