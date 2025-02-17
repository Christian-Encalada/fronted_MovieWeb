/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['image.tmdb.org'],
    unoptimized: true,
  },
  env: {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    TMDB_API_KEY: process.env.TMDB_API_KEY,
  },
};

module.exports = nextConfig;
