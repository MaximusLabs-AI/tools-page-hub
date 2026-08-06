const BASE_PATH = '/resources/ai-tool-directory'
const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This app is mounted under www.maximuslabs.ai/resources/ai-tool-directory
  // (see cloudflare-worker-tools.js). basePath makes every Link, useRouter()
  // navigation, redirect(), AND static asset URL (/_next/*) in the app
  // auto-prefix with this path, so no component code needs to reference it
  // directly. Only takes effect in production builds; dev still serves the
  // app at "/" for convenience.
  //
  // No separate assetPrefix is needed: the app used to live at the shared
  // root with a bare /_next/*, which collided with another Next app on the
  // same domain (ai-search-101-hub), so assets were moved to a custom
  // /tools-static/_next/* prefix with a rewrite back to /_next/*. Now that
  // this app has its own unique basePath, Next automatically serves assets
  // at {basePath}/_next/* by default — already a unique, non-colliding path
  // — so that whole extra layer (and its Vercel-platform-specific rewrite
  // quirks around static-asset destinations) is no longer needed.
  basePath: isProd ? BASE_PATH : undefined,
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
