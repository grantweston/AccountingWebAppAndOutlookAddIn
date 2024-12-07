/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://outlook.live.com https://*.outlook.com https://*.outlook.office.com https://*.outlook.office365.com https://*.microsoft.com'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://outlook.live.com'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://outlook.live.com https://*.outlook.com https://*.outlook.office.com https://*.outlook.office365.com; connect-src 'self' https://*.microsoft.com https://*.office.net https://*.office.com https://*.live.com; style-src 'self' 'unsafe-inline'"
          }
        ],
      }
    ]
  }
}

module.exports = nextConfig