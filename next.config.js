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
          }
        ],
      },
    ]
  }
}

module.exports = nextConfig