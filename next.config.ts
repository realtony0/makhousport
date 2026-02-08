import type { NextConfig } from "next";

const DEFAULT_SUPABASE_URL = "https://xjmfycgzqsgnddlhhcoh.supabase.co";

let supabaseStorageHostname: string | null = null;
try {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  supabaseStorageHostname = new URL(url).hostname;
} catch {
  supabaseStorageHostname = null;
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseStorageHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseStorageHostname,
            pathname: "/storage/v1/object/public/**"
          }
        ]
      : []
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  }
};

export default nextConfig;
