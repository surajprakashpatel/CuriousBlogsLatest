/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 31536000,
    domains: [
      'storage.googleapis.com', 
      'firebasestorage.googleapis.com'
    ],
  },
};

export default nextConfig;