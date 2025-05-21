/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  //later to add domains in images
  // images: {
  //   domains: [
  //     "firebasestorage.googleapis.com",
  //     "img.icons8.com",
  //     "icpc.global",
  //     "img.freepik.com",
  //     "media.licdn.com"
  //   ],
  // },
  images: { unoptimized: true },
};

module.exports = nextConfig;
