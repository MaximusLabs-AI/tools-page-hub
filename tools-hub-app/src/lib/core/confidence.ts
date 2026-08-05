import type {
  AiConfidence,
  EvidenceDimension,
  EvidenceSource,
  FeatureStatus,
  Tool,
  VerificationStatus,
} from '@/lib/types'

const percent = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, Math.round(value)))

const FEATURE_EVIDENCE: Record<FeatureStatus, number> = {
  verified: 100,
  'integration-dependent': 70,
  beta: 65,
  announced: 40,
  discontinued: 20,
  'unverified-marketing-claim': 15,
}

const VERIFICATION_EVIDENCE: Record<VerificationStatus, number> = {
  verified: 100,
  'partially-verified': 60,
  'not-publicly-verified': 20,
}

const average = (values: number[]) =>
  values.length > 0 ? values.reduce((total, value) => total + value, 0) / values.length : 0

const daysSince = (dateValue: string | undefined, now: Date) => {
  if (!dateValue) return Number.POSITIVE_INFINITY
  const checked = new Date(dateValue)
  if (Number.isNaN(checked.getTime())) return Number.POSITIVE_INFINITY
  return Math.max(0, (now.getTime() - checked.getTime()) / 86_400_000)
}

const freshnessScore = (dateValue: string | undefined, now: Date) => {
  const age = daysSince(dateValue, now)
  if (age <= 30) return 100
  if (age <= 90) return 85
  if (age <= 180) return 70
  if (age <= 365) return 50
  if (Number.isFinite(age)) return 25
  return 0
}

const hostname = (value: string | undefined) => {
  if (!value) return ''
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return ''
  }
}

const samePublisher = (left: string | undefined, right: string | undefined) => {
  const leftHost = hostname(left)
  const rightHost = hostname(right)
  return Boolean(
    leftHost &&
      rightHost &&
      (leftHost === rightHost ||
        leftHost.endsWith(`.${rightHost}`) ||
        rightHost.endsWith(`.${leftHost}`)),
  )
}

const isPlanSpecificSource = (
  plan: Tool['pricingPlans'][number],
  officialUrl: string,
) => {
  if (!plan.sourceUrl) return false
  if (plan.freePlan || plan.pricingModel === 'free' || plan.price === 0) return true
  if (!samePublisher(plan.sourceUrl, officialUrl)) return false
  try {
    return /(?:pricing|plans?|subscriptions?|billing|packages?|rates?)/i.test(
      new URL(plan.sourceUrl).pathname,
    )
  } catch {
    return false
  }
}

const evidenceBand = (score: number): NonNullable<AiConfidence['evidenceBand']> => {
  if (score >= 85) return 'strong'
  if (score >= 70) return 'good'
  if (score >= 55) return 'partial'
  return 'limited'
}

const distinctSources = (sources: EvidenceSource[]) => {
  const seen = new Set<string>()
  return sources.filter((source) => {
    const key = `${source.kind}:${source.url}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * Preserve only live prompt-panel research. Illustrative data is intentionally
 * ignored so a sample AI score can never appear as a measured recommendation.
 * All other profiles receive a deterministic evidence-coverage audit.
 */
export function resolveProfileConfidence(tool: Tool, now = new Date()): AiConfidence {
  if (tool.aiConfidence?.dataStatus === 'live') return tool.aiConfidence

  const capabilityStatus = average(
    tool.capabilities.map((capability) => FEATURE_EVIDENCE[capability.featureStatus]),
  )
  const describedCapabilities = percent(
    tool.capabilities.filter((capability) => (capability.description?.trim().length ?? 0) >= 35).length,
    tool.capabilities.length,
  )
  const featureEvidence = clamp(
    capabilityStatus * 0.35 +
      describedCapabilities * 0.2 +
      (tool.officialUrl ? 10 : 0) +
      (tool.videoOfficial && tool.videoSourceUrl ? 10 : 0),
    0,
    75,
  )

  const planVerification = average(
    tool.pricingPlans.map((plan) => VERIFICATION_EVIDENCE[plan.verificationStatus]),
  )
  const planSourceCoverage = percent(
    tool.pricingPlans.filter((plan) => Boolean(plan.sourceUrl)).length,
    tool.pricingPlans.length,
  )
  const planDetailCoverage = percent(
    tool.pricingPlans.filter(
      (plan) =>
        Boolean(plan.bestFor?.trim()) &&
        Boolean(plan.priceDisplay?.trim()) &&
        (plan.features?.length ?? 0) >= 2,
    ).length,
    tool.pricingPlans.length,
  )
  const planFreshness = average(
    tool.pricingPlans.map((plan) => freshnessScore(plan.priceLastChecked, now)),
  )
  const planSpecificSourceCoverage = percent(
    tool.pricingPlans.filter((plan) => isPlanSpecificSource(plan, tool.officialUrl)).length,
    tool.pricingPlans.length,
  )
  const independentlyCorroboratedPlans = percent(
    tool.pricingPlans.filter((plan) => Boolean(plan.corroborationUrl)).length,
    tool.pricingPlans.length,
  )
  const pricingEvidence = tool.pricingPlans.length
    ? clamp(
        planVerification * 0.2 +
          planSourceCoverage * 0.2 +
          planDetailCoverage * 0.2 +
          planFreshness * 0.15 +
          planSpecificSourceCoverage * 0.15 +
          independentlyCorroboratedPlans * 0.1,
        0,
        100,
      )
    : 0

  const overviewDepth = Math.min((tool.overview?.trim().length ?? 0) / 650, 1) * 10
  const workflowDepth =
    (tool.idealCustomer?.trim() ? 5 : 0) + (tool.setupSummary?.trim() ? 5 : 0)
  const tradeoffDepth =
    Math.min(tool.strengths.length / 3, 1) * 6 +
    Math.min(tool.limitations.length / 2, 1) * 9
  const alternativeDepth =
    Math.min(tool.alternatives.filter((alternative) => alternative.reason?.trim()).length / 4, 1) *
    10
  const faqDepth = Math.min(tool.faq.length / 6, 1) * 10
  // Live prompt-panel research returns above. Estimated profiles intentionally
  // receive no independent-source credit until explicit citations are recorded.
  const independentDomains = new Set<string>()
  const independentEvidence = Math.min(independentDomains.size / 3, 1) * 45
  const decisionSupport = clamp(
    overviewDepth +
      workflowDepth +
      tradeoffDepth +
      alternativeDepth +
      faqDepth +
      independentEvidence,
    0,
    100,
  )

  const evidenceSources = distinctSources([
    ...(tool.officialUrl
      ? [{label: 'Official product page', url: tool.officialUrl, kind: 'official-product' as const}]
      : []),
    ...tool.pricingPlans
      .filter((plan) => plan.sourceUrl)
      .map((plan) => ({
        label: `${plan.planName} pricing source`,
        url: plan.sourceUrl!,
        kind:
          plan.thirdPartyEstimate || !samePublisher(plan.sourceUrl, tool.officialUrl)
            ? 'independent' as const
            : 'official-pricing' as const,
      })),
    ...tool.pricingPlans
      .filter((plan) => plan.corroborationUrl)
      .map((plan) => ({
        label: `${plan.planName} independent corroboration`,
        url: plan.corroborationUrl!,
        kind: 'independent' as const,
      })),
    ...(tool.videoOfficial && tool.videoSourceUrl
      ? [{
          label: tool.videoTitle || 'Official product video',
          url: tool.videoSourceUrl,
          kind: 'official-video' as const,
        }]
      : []),
  ])
  const sourceBreadthAndRecency = clamp(
    (tool.officialUrl ? 10 : 0) +
      (planSourceCoverage > 0 ? 20 : 0) +
      (tool.videoOfficial && tool.videoSourceUrl ? 10 : 0) +
      freshnessScore(tool.lastVerifiedAt, now) * 0.15 +
      planFreshness * 0.15 +
      Math.min(independentDomains.size / 3, 1) * 30,
    0,
    100,
  )

  const evidenceBreakdown: EvidenceDimension[] = [
    {
      name: 'Feature evidence',
      scorePct: featureEvidence,
      weightPct: 30,
      note:
        tool.videoOfficial && tool.videoSourceUrl
          ? 'Capabilities are described and checked against official product and publisher-owned video sources. Claim-level citations are not recorded yet, so this dimension is capped at 75%.'
          : 'Capabilities are described and checked against the official product surface. Claim-level citations and an official intro video are missing, so this dimension cannot receive full credit.',
    },
    {
      name: 'Pricing evidence',
      scorePct: pricingEvidence,
      weightPct: 25,
      note: `${tool.pricingPlans.filter((plan) => plan.sourceUrl).length} of ${tool.pricingPlans.length} plans link to a source, ${tool.pricingPlans.filter((plan) => isPlanSpecificSource(plan, tool.officialUrl)).length} use a plan-specific or permanent-free source, and ${tool.pricingPlans.filter((plan) => plan.corroborationUrl).length} have a separately recorded corroboration link. A 100% score requires all three.`,
    },
    {
      name: 'Decision-support depth',
      scorePct: decisionSupport,
      weightPct: 25,
      note: independentDomains.size
        ? `The profile includes buyer guidance, trade-offs, alternatives, FAQs, and ${independentDomains.size} independent cited domain${independentDomains.size === 1 ? '' : 's'}.`
        : 'The profile includes buyer guidance, trade-offs, alternatives, and FAQs, but receives no independent-evidence points because no third-party research source is linked.',
    },
    {
      name: 'Source breadth and recency',
      scorePct: sourceBreadthAndRecency,
      weightPct: 20,
      note: `${evidenceSources.length} traceable source${evidenceSources.length === 1 ? '' : 's'} recorded; profile and pricing checks lose points as they age.`,
    },
  ]
  const aggregatePct = clamp(
    evidenceBreakdown.reduce(
      (total, dimension) => total + dimension.scorePct * (dimension.weightPct / 100),
      0,
    ),
    0,
    100,
  )

  return {
    jobContext: tool.primaryCategory.name,
    aggregatePct,
    dataStatus: 'estimated',
    methodologyNote:
      'Deterministic MaximusLabs evidence audit. Weights: feature evidence 30%, pricing evidence 25%, decision-support depth 25%, and source breadth plus recency 20%. Missing claim-level or independent citations reduce the score. This is not a product-quality rating and not a live AI-engine recommendation measurement.',
    lastCheckedAt: tool.lastVerifiedAt,
    engineScores: [],
    sourcesOfTruth: [],
    dimensions: evidenceBreakdown.map((dimension) => ({
      name: dimension.name,
      aiStatedPct: dimension.scorePct,
      webVerifiedPct: dimension.scorePct,
    })),
    citations: [],
    evidenceBand: evidenceBand(aggregatePct),
    evidenceBreakdown,
    evidenceSources,
  }
}
