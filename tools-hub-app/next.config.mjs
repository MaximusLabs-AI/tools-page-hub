/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The ai-search-101 Next app already claims /_next/* on www.maximuslabs.ai
  // (see ai-search-101-hub/cloudflare-worker-v9.js). Two Next apps behind one
  // domain cannot share that path, so this app's assets move under
  // /tools-static/_next/*, which cloudflare-worker-tools.js proxies and strips.
  // Only takes effect in production builds; dev still serves /_next directly.
  assetPrefix: process.env.NODE_ENV === 'production' ? '/tools-static' : undefined,
  images: {
    // tool + AI-platform favicons load from Google's favicon service in local/dev.
    // Swapped for Sanity CDN assets once logos are uploaded.
    remotePatterns: [
      { protocol: 'https', hostname: 'www.google.com', pathname: '/s2/favicons/**' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
}

export default nextConfig
