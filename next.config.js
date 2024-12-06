/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ['tsx', 'ts'],
    webpack: (config) => {
      config.resolve.fallback = { fs: false, path: false };
      return config;
    },
    env: {
      CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
    },
  };
  
  module.exports = nextConfig;