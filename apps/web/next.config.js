/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@tarot-app/shared'],
  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
