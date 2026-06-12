/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
