/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable production optimizations
  reactStrictMode: true,
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  // Environment variables validation
  env: {
    NODE_ENV: process.env.NODE_ENV,
  },

  // Compression
  compress: true,

  // Generate ETags for cache validation
  generateEtags: true,
};

export default nextConfig;
