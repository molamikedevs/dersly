import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'akawsokoxuhwjjobcwrr.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },
};

export default nextConfig;
