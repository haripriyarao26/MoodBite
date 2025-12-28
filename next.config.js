/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages subpath configuration
  basePath: '/MoodBite',
  assetPrefix: '/MoodBite',
}

module.exports = nextConfig

