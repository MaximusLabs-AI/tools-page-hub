// =====================================================
// MAXIMUS LABS - Tools directory reverse proxy (v3)
// =====================================================
// Serves the Vercel-hosted tools-hub-app under
// www.maximuslabs.ai/resources/ai-tool-directory/* while keeping the
// origin noindex.
//
// The app is mounted at that exact path via Next.js `basePath`
// (see tools-hub-app/next.config.mjs). basePath scopes BOTH page routes
// AND static assets (/_next/*) under the same prefix, so this worker only
// needs to recognise ONE prefix and forward requests unchanged — no path
// rewriting, no separate asset-prefix handling.
//
// IMPORTANT: /resources/* already serves other Webflow content (e.g.
// /resources/reports). Match the FULL prefix below, never a bare
// "/resources" prefix, or this worker will swallow unrelated pages.
//
// Worker route to register on the maximuslabs.ai zone:
//   www.maximuslabs.ai/resources/ai-tool-directory*
//
// Routing rule, in order:
//   1. path under APP_PREFIX -> proxy to the Next origin, unchanged
//   2. everything else        -> Webflow
//
// There is no free-tool collision to guard against here: Webflow's free
// tools live at /tools/<slug>, a namespace this app doesn't touch at all
// now that it's mounted under /resources/ai-tool-directory. (Earlier
// revisions of this worker had a RESERVED_SLUGS guard for when the app
// lived at /tools/*, and a separate /tools-static prefix + path-stripping
// step for when the app used a custom assetPrefix instead of basePath.
// Both were removed when the app moved to its own basePath-scoped mount.)
// =====================================================

const ORIGIN = 'tools.maximuslabs.ai' // Vercel deployment host for tools-hub-app

// The one path prefix this worker forwards to the Next app. Keep this
// scoped — broadening to a bare "/resources" would hijack other Webflow
// pages under that same top-level segment.
const APP_PREFIX = '/resources/ai-tool-directory'

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const path = url.pathname

    const shouldProxy = path === APP_PREFIX || path.startsWith(APP_PREFIX + '/')
    if (!shouldProxy) return fetch(request) // everything else -> Webflow

    // No path rewriting needed: the origin's own basePath expects to
    // receive this exact path, assets included.
    const res = await fetch(`https://${ORIGIN}${path}${url.search}`, {
      method: request.method,
      headers: request.headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
    })

    const headers = new Headers(res.headers)
    headers.delete('x-robots-tag') // origin is noindex; the public URL stays indexable
    headers.set('x-served-by', 'maximus-tools-v3')
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
  },
}
