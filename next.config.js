/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // If deploying to GitHub Pages with a custom domain or subpath
  // basePath: '/MoodBite', // Uncomment and set to your repo name if needed
  // assetPrefix: '/MoodBite', // Uncomment and set to your repo name if needed
}

module.exports = nextConfig

