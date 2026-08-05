import {describe, it, expect} from 'vitest'
import {localRepository} from '@/lib/repository/local'
import {searchTools} from './search'
import {buildComparison} from './comparison'
import {findTools} from './toolFinder'
import {calculateStackCost, detectOverlap} from './stackBuilder'
import {rankTools} from './taxonomy'
import {resolveProfileConfidence} from './confidence'

const tools = await localRepository.getTools()
const bySlug = (s: string) => tools.find((t) => t.slug === s)!

describe('seed integrity', () => {
  it('loads the curated AI-search catalog (31 tools, 13 categories)', async () => {
    expect(tools).toHaveLength(31)
    expect(await localRepository.getCategories()).toHaveLength(13)
  })
  it('resolves references (primary category + alternatives)', () => {
    const peec = bySlug('peec-ai')
    expect(peec.primaryCategory.code).toBe('L3-AIVIS-NATIVE')
    expect(peec.alternatives.length).toBeGreaterThan(0)
    expect(peec.alternatives[0].toolName).toBeTruthy()
  })
  it('keeps every landing page above the rich-content floor', () => {
    for (const tool of tools) {
      expect(tool.overview?.length, `${tool.name} overview`).toBeGreaterThan(300)
      expect(tool.capabilities.length, `${tool.name} capabilities`).toBeGreaterThanOrEqual(6)
      expect(tool.strengths.length, `${tool.name} strengths`).toBeGreaterThanOrEqual(3)
      expect(tool.limitations.length, `${tool.name} limitations`).toBeGreaterThanOrEqual(2)
      expect(tool.pricingPlans.length, `${tool.name} pricing`).toBeGreaterThanOrEqual(1)
      expect(tool.pricingPlans.every((p) => (p.features?.length ?? 0) >= 3), `${tool.name} plan features`).toBe(true)
      expect(tool.alternatives.length, `${tool.name} alternatives`).toBeGreaterThanOrEqual(2)
      expect(tool.faq.length, `${tool.name} FAQs`).toBeGreaterThanOrEqual(6)
    }
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
    expect(searchTools(tools, 'visibility').length).toBeGreaterThan(0)
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
    const recs = findTools(tools, {problem: 'technical', budget: 0, needFree: true})
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
    const customOnly = {
      ...bySlug('profound'),
      name: 'Custom-only product',
      pricingPlans: bySlug('profound').pricingPlans.filter((p) => p.pricingModel === 'custom-enterprise'),
    }
    const cost = calculateStackCost([customOnly, bySlug('otterly-ai'), bySlug('peec-ai')])
    expect(cost.excluded).toContain('Custom-only product') // custom-enterprise, not counted as $0
    expect(cost.countedTools).toContain('Otterly.AI')
    expect(cost.monthly).toBeGreaterThan(0) // Otterly ($29) + Peec ($95) must total > 0
  })
  it('numeric prices are populated for paid tools (the $0 bug is fixed)', () => {
    const priced = tools.filter((t) => t.pricingPlans.some((p) => typeof p.price === 'number'))
    expect(priced.length).toBeGreaterThanOrEqual(20) // was 0 before the fix; 27 of 31 now priced
    expect(bySlug('otterly-ai').pricingPlans[0].price).toBe(29)
    expect(bySlug('peec-ai').pricingPlans[0].price).toBe(95)
    expect(bySlug('profound').pricingPlans[0].price).toBe(99) // current self-serve Starter price
    expect(bySlug('profound').pricingPlans.at(-1)?.price ?? null).toBeNull() // Enterprise stays null, never $0
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

describe('profile confidence', () => {
  it('preserves supplied confidence research', () => {
    expect(resolveProfileConfidence(bySlug('peec-ai'))).toBe(bySlug('peec-ai').aiConfidence)
  })

  it('creates bounded editorial estimates without inventing engine scores', () => {
    const estimated = tools
      .filter((tool) => !tool.aiConfidence)
      .map((tool) => resolveProfileConfidence(tool))

    expect(estimated).toHaveLength(30)
    for (const confidence of estimated) {
      expect(confidence.dataStatus).toBe('estimated')
      expect(confidence.aggregatePct).toBeGreaterThanOrEqual(55)
      expect(confidence.aggregatePct).toBeLessThanOrEqual(94)
      expect(confidence.engineScores).toHaveLength(0)
      expect(confidence.methodologyNote).toContain('not a live AI-engine recommendation measurement')
    }
  })
})
