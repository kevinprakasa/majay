/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/dashboard/sku',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
