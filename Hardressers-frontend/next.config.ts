import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rzkdwiobufxosrkksooc.supabase.co',
      },
    ],
  },
};

export default nextConfig;
