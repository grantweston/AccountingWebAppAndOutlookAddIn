/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ['tsx', 'ts'],
    webpack: (config) => {
      config.resolve.fallback = { fs: false, path: false };
      config.resolve.alias = {
        ...config.resolve.alias,
        'pdfjs-dist': 'pdfjs-dist/legacy/build/pdf',
      };
      return config;
    },
    env: {
      CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || '',
    },
    experimental: {
      turbo: {
        rules: {
          // Add any Turbo-specific rules here
        }
      }
    }
  };
  
  module.exports = nextConfig;