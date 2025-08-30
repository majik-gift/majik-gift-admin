/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // hostname: "*",
        hostname: 's3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/light-worker/coupons',
        destination: '/admin/coupons',
      },
      {
        source: '/light-worker/coupons/create',
        destination: '/admin/coupons/create',
      },
      {
        source: '/light-worker/coupons/update/:id',
        destination: '/admin/coupons/update/:id',
      },
    ]
  },
};

export default nextConfig;
