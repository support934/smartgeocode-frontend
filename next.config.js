
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force fresh loads in development
  devIndicators: {
    buildActivity: true,
  },
   async rewrites() {
    return [];  // Disable all rewrites/proxies (no local reroute)
  },
  async redirects() {
    return [];  // Disable redirects
  },
  // Add headers to disable caching for all pages in dev
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
  experimental: {
  optimizePackageImports: true,
  forceSwcTransforms: true, // Faster, more reliable cache busting
},
};

export default nextConfig;