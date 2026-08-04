import {describe, it, expect} from 'vitest'
import {localRepository} from '@/lib/repository/local'
import {searchTools} from './search'
import {buildComparison} from './comparison'
import {findTools} from './toolFinder'
import {calculateStackCost, detectOverlap} from './stackBuilder'
import {rankTools} from './taxonomy'

const tools = await localRepository.getTools()
const bySlug = (s: string) => tools.find((t) => t.slug === s)!

describe('seed integrity', () => {
  it('loads 50 tools and 22 categories', async () => {
    expect(tools).toHaveLength(50)
    expect(await localRepository.getCategories()).toHaveLength(22)
  })
  it('resolves references (primary category + alternatives)', () => {
    const peec = bySlug('peec-ai')
    expect(peec.primaryCategory.code).toBe('L3-AIVIS-NATIVE')
    expect(peec.alternatives.length).toBeGreaterThan(0)
    expect(peec.alternatives[0].toolName).toBeTruthy()
  })
  it('seeds AI confidence only on Peec AI, flagged illustrative', () => {
    expect(bySlug('peec-ai').aiConfidence?.dataStatus).toBe('illustrative')
    expect(bySlug('otterly-ai').aiConfidence).toBeUndefined()
  })
})

describe('search', () => {
  it('finds Peec AI by name', () => {
    expect(searchTools(tools, 'peec').map((t) => t.slug)).toContain('peec-ai')
  })
  it('finds by category term', () => {
    expect(searchTools(tools, 'attribution').length).toBeGreaterThan(0)
  })
})

describe('comparison', () => {
  it('emits a positioning note when tiers differ (native vs suite module)', () => {
    const c = buildComparison([bySlug('peec-ai'), bySlug('ahrefs-brand-radar')])
    expect(c.positioningNote).not.toBeNull()
  })
  it('never leaves a blank cell (uses Not publicly verified)', () => {
    const c = buildComparison([bySlug('peec-ai'), bySlug('profound')])
    const allValues = c.rows.flatMap((r) => Object.values(r.values))
    expect(allValues.every((v) => v !== '' && v != null)).toBe(true)
  })
})

describe('tool finder', () => {
  it('hard-excludes tools without a free plan when free is required', () => {
    const recs = findTools(tools, {problem: 'analytics', budget: 0, needFree: true})
    expect(recs.length).toBeGreaterThan(0)
    for (const r of recs) expect(r.tool.pricingPlans.some((p) => p.freePlan)).toBe(true)
  })
  it('never returns a best-fit with unmet criteria', () => {
    const recs = findTools(tools, {problem: 'ai-visibility', budget: 100, needFree: false})
    for (const r of recs) if (r.fitLabel === 'best-fit') expect(r.unmet).toHaveLength(0)
  })
})

describe('stack builder', () => {
  it('sums numeric prices and excludes custom-priced tools (the $0 bug is fixed)', () => {
    const cost = calculateStackCost([bySlug('profound'), bySlug('plausible'), bySlug('peec-ai')])
    expect(cost.excluded).toContain('Profound') // custom-enterprise, not counted as $0
    expect(cost.countedTools).toContain('Plausible')
    expect(cost.monthly).toBeGreaterThan(0) // Plausible ($9) + Peec ($95) must total > 0
  })
  it('numeric prices are populated for paid tools (the $0 bug is fixed)', () => {
    const priced = tools.filter((t) => t.pricingPlans.some((p) => typeof p.price === 'number'))
    expect(priced.length).toBeGreaterThanOrEqual(40) // was 0 before the fix
    expect(bySlug('plausible').pricingPlans[0].price).toBe(9)
    expect(bySlug('peec-ai').pricingPlans[0].price).toBe(95)
    expect(bySlug('profound').pricingPlans[0].price ?? null).toBeNull() // custom stays null, never $0
  })
  it('detects overlap when two tools share a category', () => {
    const overlaps = detectOverlap([bySlug('peec-ai'), bySlug('otterly-ai')])
    expect(overlaps.length).toBe(1)
    expect(overlaps[0].tools.length).toBe(2)
  })
})

describe('ranking', () => {
  it('orders best/strong fit ahead of insufficient evidence', () => {
    const ranked = rankTools(tools)
    const firstInsufficient = ranked.findIndex((t) => t.quickVerdict?.fitLabel === 'insufficient-evidence')
    const lastStrong = ranked.map((t) => t.quickVerdict?.fitLabel).lastIndexOf('strong-fit')
    if (firstInsufficient >= 0 && lastStrong >= 0) expect(lastStrong).toBeLessThan(firstInsufficient)
  })
})
