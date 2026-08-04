import type {Tool} from '@/lib/types'

/**
 * Weighted local search, mirroring the Typesense field weights in Phase 5:
 * name (10) > category (6) > description (3). Typo-tolerance is a Typesense
 * concern; locally we do substring + token matching.
 */
export function searchTools(tools: Tool[], q: string): Tool[] {
  const query = q.trim().toLowerCase()
  if (!query) return tools
  const terms = query.split(/\s+/).filter(Boolean)

  return tools
    .map((t) => {
      const name = t.name.toLowerCase()
      const cats = [t.primaryCategory.name, ...t.secondaryCategories.map((c) => c.name)]
        .join(' ')
        .toLowerCase()
      const desc = t.oneLineDescription.toLowerCase()
      let score = 0
      for (const term of terms) {
        if (name.includes(term)) score += 10
        if (cats.includes(term)) score += 6
        if (desc.includes(term)) score += 3
      }
      return {t, score}
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.t.name.localeCompare(b.t.name))
    .map((x) => x.t)
}
