/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This app is mounted under www.maximuslabs.ai/resources/ai-tool-directory
  // (see cloudflare-worker-tools.js). basePath makes every Link, useRouter()
  // navigation and redirect() in the app auto-prefix with this path, so no
  // component code needs to reference it directly. Only takes effect in
  // production builds; dev still serves the app at "/" for convenience.
  basePath: process.env.NODE_ENV === 'production' ? '/resources/ai-tool-directory' : undefined,
  // The ai-search-101 Next app already claims /_next/* on www.maximuslabs.ai
  // (see ai-search-101-hub/cloudflare-worker-v9.js). Two Next apps behind one
  // domain cannot share that path, so this app's assets move under
  // /tools-static/_next/*, which cloudflare-worker-tools.js proxies and strips.
  // Independent of basePath above (assetPrefix governs /_next/* URLs only).
  // Only takes effect in production builds; dev still serves /_next directly.
  assetPrefix: process.env.NODE_ENV === 'production' ? '/tools-static' : undefined,
  // assetPrefix points asset URLs at /tools-static/_next/*. The Cloudflare worker
  // strips that prefix on the shared domain, but the Vercel origin itself must also
  // serve those URLs (direct preview, and any proxy that forwards the prefix), so
  // rewrite them back to /_next/*. beforeFiles runs before static resolution, so the
  // real asset is found. Without this the whole app loads with no CSS/JS.
  async rewrites() {
    return {
      beforeFiles: [{source: '/tools-static/_next/:path*', destination: '/_next/:path*'}],
    }
  },
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
