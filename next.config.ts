import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
