import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photography is served from Wikimedia Commons until the agency supplies
    // its own files (see `photos` in src/lib/content.ts).
    remotePatterns: [
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;
