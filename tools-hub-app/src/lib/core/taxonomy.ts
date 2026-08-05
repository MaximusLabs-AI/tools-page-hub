import type {Category, Tool} from '@/lib/types'
import {FIT_ORDER} from '@/lib/types'
import {resolveProfileConfidence} from './confidence'

/** All Level-1 department categories, in order. */
export function departments(categories: Category[]): Category[] {
  return categories.filter((c) => c.level === 1).sort((a, b) => a.order - b.order)
}

/** Walk parentCode up to the Level-1 department for a category. */
export function departmentOf(cat: Category, categories: Category[]): Category | undefined {
  const byCode = new Map(categories.map((c) => [c.code, c]))
  let cur: Category | undefined = cat
  while (cur && cur.level > 1) cur = cur.parentCode ? byCode.get(cur.parentCode) : undefined
  return cur
}

/** Direct children of a category. */
export function childrenOf(cat: Category, categories: Category[]): Category[] {
  return categories.filter((c) => c.parentCode === cat.code).sort((a, b) => a.order - b.order)
}

/** Product categories (L2+) that belong to a department, with a tool count. */
export function categoriesInDepartment(
  dept: Category,
  categories: Category[],
  tools: Tool[],
): {category: Category; count: number}[] {
  return categories
    .filter((c) => c.level >= 2 && departmentOf(c, categories)?.code === dept.code)
    .map((category) => ({
      category,
      count: tools.filter((t) => t.primaryCategory.code === category.code).length,
    }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
}

const fitRank = (t: Tool): number => {
  const f = t.quickVerdict?.fitLabel
  return f ? FIT_ORDER.indexOf(f) : FIT_ORDER.length
}

/** Rank tools: editorial fit first, then evidence coverage, then name. */
export function rankTools(tools: Tool[]): Tool[] {
  return [...tools].sort(
    (a, b) =>
      fitRank(a) - fitRank(b) ||
      resolveProfileConfidence(b).aggregatePct - resolveProfileConfidence(a).aggregatePct ||
      a.name.localeCompare(b.name),
  )
}

export const MEDALS = ['🥇', '🥈', '🥉']

/** Featured tools across the whole catalog (editorial fit, then evidence coverage). */
export function featuredTools(tools: Tool[], n = 8): Tool[] {
  return [...tools]
    .sort(
      (a, b) =>
        fitRank(a) - fitRank(b) ||
        resolveProfileConfidence(b).aggregatePct - resolveProfileConfidence(a).aggregatePct ||
        a.name.localeCompare(b.name),
    )
    .slice(0, n)
}
