// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // --- ADD OR MODIFY THIS 'images' SECTION ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '', // Keep empty unless Sanity uses a specific port (unlikely)
        pathname: '/images/**', // Allow any path starting with /images/ under that hostname
      },
      // You can add other patterns here if you use other image sources
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
    ],
  },
  // --- End of images section ---

  // ... any other existing configurations you might have ...
};

export default nextConfig;