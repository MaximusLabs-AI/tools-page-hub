import type {Tool} from '@/lib/types'

/**
 * Stack Builder — the Phase 5 pseudocode over local data.
 * Custom-priced tools are excluded from the numeric total (never treated as $0);
 * overlaps are flagged when two tools share a primary category.
 */
export interface StackCost {
  monthly: number
  excluded: string[] // custom-priced tools, named
  countedTools: string[]
}

const minPrice = (t: Tool): number | null => {
  const nums = t.pricingPlans.map((p) => p.price).filter((n): n is number => typeof n === 'number')
  return nums.length ? Math.min(...nums) : null
}
const isCustom = (t: Tool): boolean =>
  t.pricingPlans.length > 0 && t.pricingPlans.every((p) => p.pricingModel === 'custom-enterprise')

export function calculateStackCost(stack: Tool[]): StackCost {
  let monthly = 0
  const excluded: string[] = []
  const countedTools: string[] = []
  for (const t of stack) {
    const p = minPrice(t)
    if (isCustom(t) || p === null) {
      excluded.push(t.name)
    } else {
      monthly += p
      countedTools.push(t.name)
    }
  }
  return {monthly, excluded, countedTools}
}

export interface Overlap {
  categoryName: string
  tools: string[]
}

export function detectOverlap(stack: Tool[]): Overlap[] {
  const byCat = new Map<string, {name: string; tools: string[]}>()
  for (const t of stack) {
    const key = t.primaryCategory.code
    const entry = byCat.get(key) ?? {name: t.primaryCategory.name, tools: []}
    entry.tools.push(t.name)
    byCat.set(key, entry)
  }
  return [...byCat.values()]
    .filter((g) => g.tools.length > 1)
    .map((g) => ({categoryName: g.name, tools: g.tools}))
}

/** Suggested categories missing from the stack, from a simple essential set. */
export function detectGaps(stack: Tool[], essentialCodes: string[]): string[] {
  const covered = new Set(stack.map((t) => t.primaryCategory.code))
  return essentialCodes.filter((c) => !covered.has(c))
}
