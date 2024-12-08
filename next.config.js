/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'header',
              key: 'x-frame-options',
            },
          ],
          destination: '/:path*',
        },
      ],
    }
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
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' https://*.office.com https://*.microsoft.com",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://appsforoffice.microsoft.com https://ajax.aspnetcdn.com https://res.cdn.office.net https://*.office.com https://*.microsoft.com https://res.cdn.office.net/owamail/hashed-v1/scripts/",
              "img-src 'self' data: https: http:",
              "connect-src 'self' https://*.office.com https://*.microsoft.com",
              "frame-ancestors *"
            ].join('; ')
          }
        ],
      }
    ]
  }
}

module.exports = nextConfig