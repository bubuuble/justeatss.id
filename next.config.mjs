// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Keep your existing pattern for Sanity
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
      // --- ADD THIS NEW PATTERN FOR CLERK ---
      {
        protocol: 'https',
        hostname: 'img.clerk.com', // Allow Clerk images
        port: '',
        pathname: '/**', // Allow any path under this hostname
      },
      // --- END ADD ---
    ],
  },
  // ... any other existing configurations ...
};

export default nextConfig;