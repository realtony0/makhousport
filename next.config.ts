import type { NextConfig } from "next";

let supabaseStorageHostname: string | null = null;
try {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (url) {
    supabaseStorageHostname = new URL(url).hostname;
  }
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
