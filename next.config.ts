import type { NextConfig } from "next";
// Import the webpack type

const nextConfig: NextConfig = {
  // webpack(config: Configuration) {
  //   // <-- use webpack's Configuration type
  //   config.module?.rules?.push({
  //     test: /\.svg$/i,
  //     issuer: /\.[jt]sx?$/,
  //     use: ["@svgr/webpack"],
  //   });
  //   return config;
};

export default nextConfig; // Prefer export default in TS
