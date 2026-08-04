import seed from '@/data/seed.json'
import type {Category, Tool, QuickVerdict, PricingPlan, AiConfidence, AlternativeRef, Capability, FaqItem} from '@/lib/types'
import {hostname} from '@/lib/util'
import type {ToolsRepository} from './index'

/* raw Sanity-shaped docs from the generated seed */
type Ref = {_ref: string}
type RawCategory = {
  _id: string
  _type: 'category'
  categoryCode: string
  name: string
  slug: {current: string}
  level: number
  parent?: Ref
  definition: string
  indexable: boolean
  minimumProductCount: number
  updateFrequency?: string
  order: number
}
type RawTool = {
  _id: string
  _type: 'tool'
  name: string
  slug: {current: string}
  officialUrl: string
  oneLineDescription: string
  productType: Tool['productType']
  status: string
  primaryCategory: Ref
  secondaryCategories?: Ref[]
  quickVerdict?: QuickVerdict
  pricingPlans?: PricingPlan[]
  capabilities?: Capability[]
  alternatives?: {tool: Ref; relationshipType: AlternativeRef['relationshipType']; reason?: string}[]
  strengths?: string[]
  limitations?: string[]
  aiConfidence?: AiConfidence
  faq?: FaqItem[]
  lastVerifiedAt?: string
}

const docs = seed as unknown as Array<RawCategory | RawTool>
const rawCategories = docs.filter((d): d is RawCategory => d._type === 'category')
const rawTools = docs.filter((d): d is RawTool => d._type === 'tool')

const rawCatById = new Map(rawCategories.map((c) => [c._id, c]))
const rawToolById = new Map(rawTools.map((t) => [t._id, t]))

function toCategory(c: RawCategory): Category {
  const parent = c.parent ? rawCatById.get(c.parent._ref) : undefined
  return {
    id: c._id,
    code: c.categoryCode,
    name: c.name,
    slug: c.slug.current,
    level: c.level,
    parentCode: parent?.categoryCode,
    definition: c.definition,
    indexable: c.indexable,
    minimumProductCount: c.minimumProductCount,
    updateFrequency: c.updateFrequency,
    order: c.order,
  }
}

const categoriesById = new Map(rawCategories.map((c) => [c._id, toCategory(c)]))

function toTool(t: RawTool): Tool {
  const primary = categoriesById.get(t.primaryCategory._ref)!
  const secondary = (t.secondaryCategories || [])
    .map((r) => categoriesById.get(r._ref))
    .filter((c): c is Category => Boolean(c))
  const alternatives: AlternativeRef[] = (t.alternatives || []).flatMap((a) => {
    const raw = rawToolById.get(a.tool._ref)
    if (!raw) return []
    return [
      {
        toolSlug: raw.slug.current,
        toolName: raw.name,
        relationshipType: a.relationshipType,
        reason: a.reason,
      },
    ]
  })
  return {
    id: t._id,
    name: t.name,
    slug: t.slug.current,
    officialUrl: t.officialUrl,
    domain: hostname(t.officialUrl),
    oneLineDescription: t.oneLineDescription,
    productType: t.productType,
    status: t.status,
    primaryCategory: primary,
    secondaryCategories: secondary,
    quickVerdict: t.quickVerdict,
    pricingPlans: t.pricingPlans || [],
    capabilities: t.capabilities || [],
    alternatives,
    strengths: t.strengths || [],
    limitations: t.limitations || [],
    aiConfidence: t.aiConfidence,
    faq: t.faq || [],
    lastVerifiedAt: t.lastVerifiedAt,
  }
}

const allCategories = rawCategories.map(toCategory).sort((a, b) => a.level - b.level || a.order - b.order)
const allTools = rawTools.map(toTool).sort((a, b) => a.name.localeCompare(b.name))

export const localRepository: ToolsRepository = {
  async getCategories() {
    return allCategories
  },
  async getCategoryBySlug(slug: string) {
    return allCategories.find((c) => c.slug === slug) ?? null
  },
  async getCategoryByCode(code: string) {
    return allCategories.find((c) => c.code === code) ?? null
  },
  async getTools() {
    return allTools
  },
  async getToolBySlug(slug: string) {
    return allTools.find((t) => t.slug === slug) ?? null
  },
  async getToolsByCategorySlug(slug: string) {
    return allTools.filter(
      (t) => t.primaryCategory.slug === slug || t.secondaryCategories.some((c) => c.slug === slug),
    )
  },
}
