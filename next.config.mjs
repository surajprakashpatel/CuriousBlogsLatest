/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Add the domains for your Firebase Storage images here.
    domains: [
      'storage.googleapis.com', 
      'firebasestorage.googleapis.com'
    ],
  },
};

export default nextConfig;