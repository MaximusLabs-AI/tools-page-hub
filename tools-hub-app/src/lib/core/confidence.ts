import type {AiConfidence, Tool} from '@/lib/types'

const percent = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, Math.round(value)))

/**
 * Preserve supplied research data. Otherwise, derive a transparent editorial
 * evidence estimate from the profile without inventing AI-engine measurements.
 */
export function resolveProfileConfidence(tool: Tool): AiConfidence {
  if (tool.aiConfidence) return tool.aiConfidence

  const verifiedCapabilities = tool.capabilities.filter(
    (capability) => capability.featureStatus === 'verified',
  ).length
  const verifiedPlans = tool.pricingPlans.filter(
    (plan) => plan.verificationStatus === 'verified',
  ).length
  const sourcedPlans = tool.pricingPlans.filter((plan) => Boolean(plan.sourceUrl)).length

  const capabilityVerification = percent(verifiedCapabilities, tool.capabilities.length)
  const pricingVerification = Math.round(
    (percent(verifiedPlans, tool.pricingPlans.length) +
      percent(sourcedPlans, tool.pricingPlans.length)) /
      2,
  )

  const contentSignals = [
    (tool.overview?.length ?? 0) >= 300,
    tool.capabilities.length >= 6,
    tool.strengths.length >= 3,
    tool.limitations.length >= 2,
    tool.alternatives.length >= 2,
    tool.faq.length >= 6,
  ]
  const profileCompleteness = percent(contentSignals.filter(Boolean).length, contentSignals.length)
  const contentDepth =
    Math.min((tool.overview?.length ?? 0) / 900, 1) * 3 +
    (Math.min(tool.strengths.length + tool.limitations.length, 8) / 8) * 2 +
    (Math.min(tool.alternatives.length, 4) / 4) * 2 +
    (Math.min(tool.faq.length, 8) / 8) * 2 +
    (Math.min(tool.pricingPlans.length, 4) / 4) * 2

  const recencySignals = [
    Boolean(tool.lastVerifiedAt),
    tool.pricingPlans.every((plan) => Boolean(plan.priceLastChecked)),
    tool.pricingPlans.every((plan) => Boolean(plan.sourceUrl)),
    Boolean(tool.videoSourceUrl || tool.officialUrl),
  ]
  const sourceRecency = percent(recencySignals.filter(Boolean).length, recencySignals.length)

  const verdictWeight =
    tool.quickVerdict?.confidence === 'high'
      ? 3
      : tool.quickVerdict?.confidence === 'medium'
        ? 2
        : 1
  const aggregatePct = clamp(
    32 +
      capabilityVerification * 0.12 +
      Math.min(tool.capabilities.length, 8) * 0.5 +
      pricingVerification * 0.14 +
      profileCompleteness * 0.08 +
      contentDepth +
      (tool.lastVerifiedAt ? 4 : 0) +
      (tool.videoOfficial ? 3 : tool.videoUrl ? 2 : 1) +
      verdictWeight,
    55,
    94,
  )

  return {
    jobContext: tool.primaryCategory.name,
    aggregatePct,
    dataStatus: 'estimated',
    methodologyNote:
      'MaximusLabs editorial estimate derived from verified capability coverage, official pricing sources, profile completeness, and evidence recency. It is not a live AI-engine recommendation measurement.',
    lastCheckedAt: tool.lastVerifiedAt,
    engineScores: [],
    sourcesOfTruth: [],
    dimensions: [
      {
        name: 'Capability verification',
        aiStatedPct: capabilityVerification,
        webVerifiedPct: capabilityVerification,
      },
      {
        name: 'Pricing source coverage',
        aiStatedPct: pricingVerification,
        webVerifiedPct: pricingVerification,
      },
      {
        name: 'Profile completeness',
        aiStatedPct: profileCompleteness,
        webVerifiedPct: profileCompleteness,
      },
      {
        name: 'Evidence recency',
        aiStatedPct: sourceRecency,
        webVerifiedPct: sourceRecency,
      },
    ],
    citations: [],
  }
}
