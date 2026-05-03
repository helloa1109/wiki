/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@chat/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
