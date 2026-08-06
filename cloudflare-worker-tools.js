// =====================================================
// MAXIMUS LABS - Tools directory reverse proxy (v2)
// =====================================================
// Serves the Vercel-hosted tools-hub-app under
// www.maximuslabs.ai/resources/ai-tool-directory/* while keeping the
// origin noindex.
//
// The app is mounted at that exact path via Next.js `basePath`
// (see tools-hub-app/next.config.mjs), so every route the app generates
// already includes the /resources/ai-tool-directory prefix — this worker
// just needs to recognise the prefix and forward, no path rewriting.
//
// IMPORTANT: /resources/* already serves other Webflow content (e.g.
// /resources/reports). Match the FULL prefix below, never a bare
// "/resources" prefix, or this worker will swallow unrelated pages.
//
// Worker routes to register on the maximuslabs.ai zone:
//   www.maximuslabs.ai/resources/ai-tool-directory*
//   www.maximuslabs.ai/tools-static/*
//
// Routing rule, in order:
//   1. path under an APP_PREFIX  -> proxy to the Next origin
//   2. everything else            -> Webflow
//
// There is no free-tool collision to guard against here: Webflow's free
// tools live at /tools/<slug>, a namespace this app no longer touches at
// all now that it's mounted under /resources/ai-tool-directory. (v1 of
// this worker had a RESERVED_SLUGS guard for when the app lived at
// /tools/*; that guard and its matching Sanity schema rule were removed
// when the app moved here.)
// =====================================================

const ORIGIN = 'tools.maximuslabs.ai' // Vercel deployment host for tools-hub-app

// Path prefixes this worker forwards to the Next app. Keep this scoped —
// broadening "/resources/ai-tool-directory" to a bare "/resources" would
// hijack other Webflow pages under that same top-level segment.
const APP_PREFIXES = [
  '/resources/ai-tool-directory',
  '/tools-static', // assetPrefix, keeps this app's /_next off the shared root
]

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const path = url.pathname

    const shouldProxy = APP_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))
    if (!shouldProxy) return fetch(request) // everything else -> Webflow

    // assetPrefix rewrite: Next emits /tools-static/_next/... but the origin
    // still serves those files at /_next/..., so strip the prefix here.
    // The /resources/ai-tool-directory prefix on page routes is NOT stripped:
    // the origin's own basePath expects to receive it as-is.
    const originPath = path.startsWith('/tools-static/') ? path.slice('/tools-static'.length) : path

    const res = await fetch(`https://${ORIGIN}${originPath}${url.search}`, {
      method: request.method,
      headers: request.headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
    })

    const headers = new Headers(res.headers)
    headers.delete('x-robots-tag') // origin is noindex; the public URL stays indexable
    headers.set('x-served-by', 'maximus-tools-v2')
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
  },
}
