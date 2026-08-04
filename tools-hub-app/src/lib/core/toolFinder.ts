import type {Tool} from '@/lib/types'
import {FIT_ORDER} from '@/lib/types'

/**
 * Tool Finder — the Phase 5 recommendation pseudocode over local data.
 * Scoped to the fields actually present in the seed (category, pricing, fit,
 * AI confidence). Hard exclusions remove candidates before scoring; missing
 * data downgrades to "conditional", never a silent pass or a false "best fit".
 */
export interface Answers {
  problem: string // maps to target category codes
  budget: number // monthly USD ceiling; Infinity = no limit
  needFree: boolean
  companySize?: string
}

export const PROBLEMS: {value: string; label: string; categories: string[]}[] = [
  {value: 'ai-visibility', label: 'Track my brand in AI answers', categories: ['L3-AIVIS-NATIVE', 'L3-AIVIS-SUITE']},
  {value: 'analytics', label: 'Replace Google Analytics (privacy-first)', categories: ['L2-WEBANALYTICS-PRIVACY']},
  {value: 'attribution', label: 'Connect marketing spend to revenue', categories: ['L2-B2BATTR']},
  {value: 'visitor-id', label: 'Identify anonymous website visitors', categories: ['L2-VISITORID', 'L2-ABM']},
  {value: 'seo', label: 'Rank tracking & SEO', categories: ['L2-RANKTRACK', 'L2-SEOSUITE']},
  {value: 'content', label: 'Optimize content for AI answers', categories: ['L2-GEOCONTENT']},
  {value: 'technical', label: 'Technical SEO, schema & crawlers', categories: ['L2-SCHEMA', 'L2-TECHCRAWL', 'L2-AICRAWL']},
]

export const BUDGETS: {value: number; label: string}[] = [
  {value: 0, label: 'Free only'},
  {value: 100, label: 'Up to $100/mo'},
  {value: 500, label: 'Up to $500/mo'},
  {value: Infinity, label: 'No hard limit'},
]

export interface Recommendation {
  tool: Tool
  fitLabel: 'best-fit' | 'strong-fit' | 'conditional-fit'
  score: number
  fits: string[]
  unmet: string[]
  confidence: string
}

const minPrice = (t: Tool): number | null => {
  const nums = t.pricingPlans.map((p) => p.price).filter((n): n is number => typeof n === 'number')
  return nums.length ? Math.min(...nums) : null
}
const hasFree = (t: Tool): boolean => t.pricingPlans.some((p) => p.freePlan)
const isCustom = (t: Tool): boolean => t.pricingPlans.some((p) => p.pricingModel === 'custom-enterprise')

export function findTools(tools: Tool[], answers: Answers): Recommendation[] {
  const problem = PROBLEMS.find((p) => p.value === answers.problem)
  let candidates = tools.filter((t) => problem?.categories.includes(t.primaryCategory.code))

  // hard exclusion: free required (budget 0 or needFree) and no free plan
  const requireFree = answers.needFree || answers.budget === 0
  if (requireFree) candidates = candidates.filter(hasFree)

  return candidates
    .map((t): Recommendation => {
      const fits: string[] = []
      const unmet: string[] = []
      let score = 0

      // category fit (40)
      score += 40
      fits.push(`Solves "${problem?.label ?? answers.problem}"`)

      // budget fit (25)
      const price = minPrice(t)
      if (hasFree(t)) {
        score += 25
        fits.push('Has a free plan / trial')
      } else if (price !== null && price <= answers.budget) {
        score += 20
        fits.push(`Entry price fits your budget (${t.pricingPlans[0]?.priceDisplay})`)
      } else if (isCustom(t)) {
        score += 8
        unmet.push('Custom pricing — cannot confirm it fits your budget')
      } else if (price !== null) {
        unmet.push(`Entry price (${t.pricingPlans[0]?.priceDisplay}) may exceed your budget`)
      } else {
        unmet.push('Pricing not publicly verified')
      }

      // AI-confidence signal (20)
      if (t.aiConfidence) {
        score += Math.round((t.aiConfidence.aggregatePct / 100) * 20)
        fits.push(`${t.aiConfidence.aggregatePct}% AI-answer confidence`)
      }

      // fit-label signal (15)
      const fitIdx = t.quickVerdict ? FIT_ORDER.indexOf(t.quickVerdict.fitLabel) : FIT_ORDER.length
      score += Math.max(0, 15 - fitIdx * 4)

      // decide label
      let fitLabel: Recommendation['fitLabel'] = 'conditional-fit'
      if (unmet.length === 0 && score >= 75) fitLabel = 'best-fit'
      else if (unmet.length <= 1 && score >= 60) fitLabel = 'strong-fit'

      return {tool: t, fitLabel, score, fits, unmet, confidence: t.quickVerdict?.confidence ?? 'insufficient'}
    })
    .sort((a, b) => b.score - a.score)
}
