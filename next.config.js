/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  security: {
    dangerouslyDisableDefaultSecurity: true
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
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
            key: 'Content-Security-Policy',
            value: "default-src 'self' https://*.live.com https://*.microsoft.com https://*.office.com https://*.office365.com; frame-ancestors 'self' https://*.live.com https://*.outlook.com https://*.office.com https://*.office365.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.microsoft.com https://*.office.com; connect-src 'self' https://*.microsoft.com https://*.office.net https://*.office.com https://*.live.com"
          }
        ],
      }
    ]
  }
}

module.exports = nextConfig