/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/dashboard',
        destination: '/dashboard/sku',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
