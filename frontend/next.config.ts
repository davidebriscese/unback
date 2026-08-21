import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The app ships as static files served by the .NET backend, same origin as the API.
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
};

export default nextConfig;
