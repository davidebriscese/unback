import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The app ships as static files served by the .NET backend, same origin as the API.
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
  // A branded 404 for the whole app: the root layout lives under [locale], so a plain
  // not-found.tsx has no layout to compose from.
  experimental: { globalNotFound: true },
};

export default nextConfig;
