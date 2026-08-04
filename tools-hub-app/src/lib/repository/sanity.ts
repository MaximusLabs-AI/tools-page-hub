import type {Category, Tool} from '@/lib/types'
import {hostname} from '@/lib/util'
import type {ToolsRepository} from './index'
import {Q} from './groq'

/**
 * Sanity repository via the plain HTTP query API (no @sanity/client dependency).
 * Only used when DATA_SOURCE=sanity and a project id is set. Prepared, not
 * required to run the app locally.
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-08-01'
const token = process.env.SANITY_READ_TOKEN

async function query<T>(groq: string, params: Record<string, unknown> = {}): Promise<T> {
  if (!projectId) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set')
  const host = token ? 'api.sanity.io' : 'apicdn.sanity.io'
  const url = new URL(`https://${projectId}.${host}/v${apiVersion}/data/query/${dataset}`)
  url.searchParams.set('query', groq)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(`$${k}`, JSON.stringify(v))
  const res = await fetch(url.toString(), {
    headers: token ? {Authorization: `Bearer ${token}`} : {},
    next: {revalidate: 3600},
  })
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`)
  const json = (await res.json()) as {result: T}
  return json.result
}

function finalize(t: Partial<Tool> & {officialUrl: string}): Tool {
  // GROQ returns null for absent array fields, which would override defaults if
  // spread naively — coalesce each array so it's always iterable.
  return {
    ...t,
    domain: hostname(t.officialUrl),
    secondaryCategories: t.secondaryCategories ?? [],
    pricingPlans: t.pricingPlans ?? [],
    capabilities: t.capabilities ?? [],
    alternatives: t.alternatives ?? [],
    strengths: t.strengths ?? [],
    limitations: t.limitations ?? [],
    faq: t.faq ?? [],
  } as Tool
}

export const sanityRepository: ToolsRepository = {
  async getCategories() {
    return (await query<Category[]>(Q.categories)) || []
  },
  async getCategoryBySlug(slug: string) {
    return (await query<Category | null>(Q.categoryBySlug, {slug})) ?? null
  },
  async getCategoryByCode(code: string) {
    return (await query<Category | null>(Q.categoryByCode, {code})) ?? null
  },
  async getTools() {
    return ((await query<Tool[]>(Q.tools)) || []).map(finalize)
  },
  async getToolBySlug(slug: string) {
    const t = await query<(Partial<Tool> & {officialUrl: string}) | null>(Q.toolBySlug, {slug})
    return t ? finalize(t) : null
  },
  async getToolsByCategorySlug(slug: string) {
    return ((await query<Tool[]>(Q.toolsByCategorySlug, {slug})) || []).map(finalize)
  },
}
