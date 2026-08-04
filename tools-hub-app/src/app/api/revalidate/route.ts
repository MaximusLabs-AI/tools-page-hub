import {revalidatePath} from 'next/cache'
import {NextRequest, NextResponse} from 'next/server'

/**
 * On-demand revalidation for Sanity edits (optional — the site already refreshes
 * on its own within the ISR window). Point a Sanity webhook here to make edits
 * appear instantly:
 *   URL:    https://tools-page-hub.vercel.app/api/revalidate?secret=YOUR_SECRET
 *   Method: POST   Trigger: on create/update/delete of `tool` and `category`
 * Set SANITY_REVALIDATE_SECRET in Vercel env to the same secret.
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({revalidated: false, error: 'invalid secret'}, {status: 401})
  }
  const body = await req.json().catch(() => ({}) as Record<string, unknown>)
  const slug =
    (body?.slug as {current?: string} | undefined)?.current ??
    (typeof body?.slug === 'string' ? (body.slug as string) : undefined)

  // refresh the whole tree (cheap for this catalog size) + the specific tool page
  revalidatePath('/', 'layout')
  if (slug) revalidatePath(`/tools/${slug}`)
  return NextResponse.json({revalidated: true, slug: slug ?? null})
}
