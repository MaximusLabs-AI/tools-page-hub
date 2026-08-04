// =====================================================
// MAXIMUS LABS - Tools reverse proxy (v1)
// =====================================================
// Serves the Vercel-hosted tools-hub-app under
// www.maximuslabs.ai/tools/* while keeping the origin noindex,
// WITHOUT taking over the free-tool pages that Webflow serves
// from the same /tools/ prefix.
//
// Worker routes to register:
//   www.maximuslabs.ai/tools*
//   www.maximuslabs.ai/tools-static/*
//   (plus any root-level app routes you keep, see APP_PREFIXES)
//
// Routing rule, in order:
//   1. /tools/<slug> where <slug> is RESERVED  -> fall through to Webflow
//   2. anything under /tools or APP_PREFIXES   -> proxy to the Next origin
//   3. everything else                          -> Webflow
//
// The reserved list is the ONLY thing standing between a new
// directory tool and one of your free tools going dark. Two guards:
//   - env.TOOLS_RESERVED (a JSON array in a Worker env var or KV)
//     overrides the baked-in list, so you can add a slug without a
//     redeploy the moment you ship a free tool.
//   - a matching slug-validation rule in the Sanity `tool` schema, so
//     an editor cannot publish a directory tool on a reserved slug.
//     Both are needed. The Worker guard alone fails open in Sanity,
//     the Sanity guard alone fails open for anything not in Sanity.
// =====================================================

const ORIGIN = 'tools.maximuslabs.ai' // Vercel deployment host for tools-hub-app

// Free tools served by WEBFLOW at /tools/<slug>. Add every new one here.
// Keep in sync with the reserved-slug rule in sanity-schema/tool.ts.
const RESERVED_SLUGS = [
  'ai-content-humanizer',
  'ai-content-optimizer',
  'ai-crawlability-checker',
  'llms-txt-generator',
]

// Root-level routes owned by the Next app. Anything generic here (/search)
// competes with the main site for that path, so prefer moving those routes
// under /tools/ in the app and shortening this list.
const APP_PREFIXES = [
  '/tools',
  '/tools-static', // assetPrefix, keeps this app's /_next off the shared root
  '/alternatives',
  '/vs',
  '/stacks',
  '/tool-finder',
  '/methodology',
  '/corrections',
  '/disclosures',
]

function readReserved(env) {
  if (env && env.TOOLS_RESERVED) {
    try {
      const parsed = JSON.parse(env.TOOLS_RESERVED)
      if (Array.isArray(parsed) && parsed.length) return parsed.map(String)
    } catch (e) {
      // fall through to the baked-in list rather than 500 the whole site
    }
  }
  return RESERVED_SLUGS
}

function isReservedPath(pathname, reserved) {
  // Matches /tools/<slug> and /tools/<slug>/ only. Deeper paths such as
  // /tools/<slug>/anything belong to the directory, not to a free tool.
  const m = pathname.match(/^\/tools\/([^/]+)\/?$/)
  return !!m && reserved.includes(m[1])
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname

    if (isReservedPath(path, readReserved(env))) return fetch(request) // Webflow free tool

    const shouldProxy = APP_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))
    if (!shouldProxy) return fetch(request) // everything else -> Webflow main site

    // assetPrefix rewrite: Next emits /tools-static/_next/... but the origin
    // still serves those files at /_next/..., so strip the prefix here.
    const originPath = path.startsWith('/tools-static/') ? path.slice('/tools-static'.length) : path

    const res = await fetch(`https://${ORIGIN}${originPath}${url.search}`, {
      method: request.method,
      headers: request.headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
    })

    const headers = new Headers(res.headers)
    headers.delete('x-robots-tag') // origin is noindex; the public URL stays indexable
    headers.set('x-served-by', 'maximus-tools-v1')
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
  },
}
