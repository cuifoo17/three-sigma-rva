import type { NextConfig } from "next";

// Static export for GitHub Pages. The site is served under the repo name
// (user.github.io/<repo>), which the deploy workflow passes in as
// NEXT_PUBLIC_BASE_PATH; locally it's empty and the site runs at /.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Pages has no image server, so next/image serves the source files as-is.
  images: { unoptimized: true },
  // Lets a phone on the same Wi-Fi load the dev server's scripts.
  allowedDevOrigins: [
    "172.31.207.39",
    "192.168.12.53",
    "10.126.150.243",
    "192.168.1.159",
    "172.30.131.200",
  ],
};

export default nextConfig;
