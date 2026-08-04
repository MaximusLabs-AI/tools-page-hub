import type {Tool} from '@/lib/types'
import {FIT_LABEL_TEXT} from '@/lib/types'

export interface ComparisonRow {
  label: string
  values: Record<string, string> // keyed by tool slug
}
export interface Comparison {
  tools: Tool[]
  positioningNote: string | null
  rows: ComparisonRow[]
}

const NPV = 'Not publicly verified'

function priceOf(t: Tool): string {
  return t.pricingPlans[0]?.priceDisplay || NPV
}
function freeOf(t: Tool): string {
  return t.pricingPlans.some((p) => p.freePlan) ? 'Yes' : 'No'
}
function aiOf(t: Tool): string {
  return t.aiConfidence ? `${t.aiConfidence.aggregatePct}%` : 'Not measured yet'
}
function typeOf(t: Tool): string {
  return t.productType === 'suite_module' ? 'Suite module' : 'Native platform'
}

/**
 * Build a normalized comparison. Missing values render as "Not publicly verified"
 * (never blank). A positioning note is emitted whenever the tools are not the
 * same tier (different product type or category), per the frozen rule.
 */
export function buildComparison(tools: Tool[]): Comparison {
  const rows: ComparisonRow[] = [
    row('AI answer confidence', tools, aiOf),
    row('Fit', tools, (t) => (t.quickVerdict ? FIT_LABEL_TEXT[t.quickVerdict.fitLabel] : NPV)),
    row('Entry price', tools, priceOf),
    row('Free plan', tools, freeOf),
    row('Product type', tools, typeOf),
    row('Category', tools, (t) => t.primaryCategory.name),
  ]

  const types = new Set(tools.map((t) => t.productType))
  const cats = new Set(tools.map((t) => t.primaryCategory.code))
  let positioningNote: string | null = null
  if (types.size > 1) {
    positioningNote =
      'These are not the same tier: a suite module bundles AI visibility into a broader SEO suite, while a native platform is a standalone product. Compare with that difference in mind.'
  } else if (cats.size > 1) {
    positioningNote =
      'These tools sit in different categories and solve adjacent, not identical, jobs. The comparison is directional.'
  }

  // hide rows where every tool has the same value (frozen "identical rows auto-hidden")
  const filtered = rows.filter((r) => new Set(Object.values(r.values)).size > 1)

  return {tools, positioningNote, rows: filtered.length ? filtered : rows}
}

function row(label: string, tools: Tool[], fn: (t: Tool) => string): ComparisonRow {
  const values: Record<string, string> = {}
  for (const t of tools) values[t.slug] = fn(t)
  return {label, values}
}
