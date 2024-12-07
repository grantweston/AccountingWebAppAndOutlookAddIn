/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/outlook',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://outlook.live.com'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://outlook.live.com https://*.outlook.com https://*.outlook.office.com https://*.outlook.office365.com"
          }
        ],
      },
    ]
  }
}

module.exports = nextConfig