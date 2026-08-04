import {defineType, defineField} from 'sanity'

/**
 * Reusable OBJECT types for the Tools Intelligence Hub.
 * These map the frozen Phase 4A relational sub-entities (evidence_records,
 * pricing_plans, tool_features, integrations, alternatives, rankings) onto
 * Sanity's document model as inline arrays on the `tool` document, plus the
 * NET-NEW `aiConfidence` extension (Krishna's "AI Answer Confidence" module),
 * which is not in Phases 1-5 and is layered on here as the signature feature.
 *
 * Enum VALUES are copied verbatim from the frozen Phase 4A controlled
 * vocabulary and SQL CHECK constraints. Do not rename values.
 */

/* ---- shared enum lists (frozen Phase 4A vocabulary) ---- */
const CONFIDENCE = ['high', 'medium', 'low', 'insufficient']
const VERIFICATION = ['verified', 'partially-verified', 'not-publicly-verified']
const FEATURE_STATUS = [
  'verified',
  'integration-dependent',
  'beta',
  'announced',
  'discontinued',
  'unverified-marketing-claim',
]
const FIT_LABEL = ['best-fit', 'strong-fit', 'conditional-fit', 'weak-fit', 'insufficient-evidence']
const PRICING_MODEL = [
  'free',
  'freemium',
  'flat-subscription',
  'seat-based',
  'usage-based',
  'custom-enterprise',
]
const AI_ENGINE = ['chatgpt', 'claude', 'google-ai-mode', 'perplexity', 'gemini']

/* ---------------------------------------------------------------- */
/* Evidence: every factual claim traces to >=1 source (never a bare value) */
export const evidenceClaim = defineType({
  name: 'evidenceClaim',
  title: 'Evidence claim',
  type: 'object',
  fields: [
    defineField({name: 'fieldName', title: 'Field', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'claimedValue', title: 'Claimed value', type: 'string'}),
    defineField({name: 'confidence', title: 'Confidence', type: 'string', options: {list: CONFIDENCE}, initialValue: 'medium'}),
    defineField({name: 'verificationStatus', title: 'Verification status', type: 'string', options: {list: VERIFICATION}, initialValue: 'partially-verified'}),
    defineField({name: 'verifiedAt', title: 'Verified at', type: 'datetime'}),
    defineField({name: 'sources', title: 'Sources', type: 'array', of: [{type: 'reference', to: [{type: 'source'}]}], description: '>=1 required for a Verified label (2+ independent Tier 1-3 sources).'}),
  ],
  preview: {select: {title: 'fieldName', subtitle: 'verificationStatus'}},
})

/* Pricing: append-only in the DB; here one row per plan. Never false precision. */
export const pricingPlan = defineType({
  name: 'pricingPlan',
  title: 'Pricing plan',
  type: 'object',
  fields: [
    defineField({name: 'planName', title: 'Plan name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'priceDisplay', title: 'Price (display)', type: 'string', description: 'Exact string to render, e.g. "$95-105/mo", "Custom — contact sales", "Free". Handles ranges + opacity per the no-false-precision rule.'}),
    defineField({name: 'price', title: 'Price (numeric, for sorting)', type: 'number', description: 'Leave empty for custom/unpublished so it sorts last, never as $0.'}),
    defineField({name: 'description', title: 'Plan summary', type: 'text', rows: 2}),
    defineField({name: 'bestFor', title: 'Best for', type: 'string'}),
    defineField({name: 'features', title: 'Included features', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'popular', title: 'Popular / recommended', type: 'boolean', initialValue: false}),
    defineField({name: 'sourceUrl', title: 'Official pricing source', type: 'url'}),
    defineField({name: 'currency', title: 'Currency', type: 'string', initialValue: 'USD'}),
    defineField({name: 'billingPeriod', title: 'Billing period', type: 'string', options: {list: ['monthly', 'annual', 'usage', 'custom']}}),
    defineField({name: 'pricingModel', title: 'Pricing model', type: 'string', options: {list: PRICING_MODEL}, validation: (r) => r.required()}),
    defineField({name: 'usageMetric', title: 'Usage metric', type: 'string', description: 'e.g. "per pageview", "per prompt" for usage-based plans.'}),
    defineField({name: 'region', title: 'Region', type: 'string', initialValue: 'global'}),
    defineField({name: 'freePlan', title: 'Free plan', type: 'boolean', initialValue: false}),
    defineField({name: 'freeTrial', title: 'Free trial', type: 'boolean', initialValue: false}),
    defineField({name: 'thirdPartyEstimate', title: 'Third-party estimate (not vendor-published)', type: 'boolean', initialValue: false, description: 'Renders the "third-party estimate" footnote (e.g. Dreamdata/HockeyStack).'}),
    defineField({name: 'verificationStatus', title: 'Verification status', type: 'string', options: {list: VERIFICATION}, initialValue: 'partially-verified'}),
    defineField({name: 'priceLastChecked', title: 'Price last checked', type: 'date'}),
    defineField({name: 'sources', title: 'Sources', type: 'array', of: [{type: 'reference', to: [{type: 'source'}]}]}),
  ],
  preview: {select: {title: 'planName', subtitle: 'priceDisplay'}},
})

/* Capability = a tool_features row, carrying the six-tier verification badge. */
export const capability = defineType({
  name: 'capability',
  title: 'Capability',
  type: 'object',
  fields: [
    defineField({name: 'name', title: 'Capability', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
    defineField({name: 'featureStatus', title: 'Status', type: 'string', options: {list: FEATURE_STATUS}, initialValue: 'verified', validation: (r) => r.required()}),
    defineField({name: 'sources', title: 'Sources', type: 'array', of: [{type: 'reference', to: [{type: 'source'}]}]}),
  ],
  preview: {select: {title: 'name', subtitle: 'featureStatus'}},
})

export const integrationRef = defineType({
  name: 'integrationRef',
  title: 'Integration',
  type: 'object',
  fields: [
    defineField({name: 'tool', title: 'Integrates with', type: 'reference', to: [{type: 'tool'}]}),
    defineField({name: 'integrationType', title: 'Type', type: 'string', options: {list: ['native', 'api', 'third-party-connector', 'unconfirmed']}, initialValue: 'unconfirmed'}),
    defineField({name: 'note', title: 'Note', type: 'string'}),
  ],
  preview: {select: {title: 'tool.name', subtitle: 'integrationType'}},
})

/* Four DISTINCT alternative relationship types (never merged into one list). */
export const alternativeRef = defineType({
  name: 'alternativeRef',
  title: 'Alternative',
  type: 'object',
  fields: [
    defineField({name: 'tool', title: 'Alternative tool', type: 'reference', to: [{type: 'tool'}], validation: (r) => r.required()}),
    defineField({name: 'relationshipType', title: 'Relationship', type: 'string', options: {list: ['direct', 'cheaper', 'open-source', 'complementary']}, validation: (r) => r.required()}),
    defineField({name: 'reason', title: 'Choose-if reason', type: 'string', description: 'One-line "choose this if…" rationale.'}),
  ],
  preview: {select: {title: 'tool.name', subtitle: 'relationshipType'}},
})

/* Quick verdict = the pre-computed editorial fit label (primary ranking signal). */
export const quickVerdict = defineType({
  name: 'quickVerdict',
  title: 'Quick verdict',
  type: 'object',
  fields: [
    defineField({name: 'fitLabel', title: 'Fit label', type: 'string', options: {list: FIT_LABEL}, validation: (r) => r.required()}),
    defineField({name: 'confidence', title: 'Evidence confidence', type: 'string', options: {list: CONFIDENCE}, initialValue: 'medium'}),
    defineField({name: 'numericScore', title: 'Numeric score (secondary, 0-100)', type: 'number', description: 'Never the headline signal; fit label leads.'}),
    defineField({name: 'verdictText', title: 'Verdict paragraph', type: 'text', rows: 3}),
  ],
})

export const bestFit = defineType({
  name: 'bestFit',
  title: 'Best-fit classification',
  type: 'object',
  fields: [
    defineField({name: 'companySizes', title: 'Company sizes', type: 'array', of: [{type: 'string'}], options: {list: ['startup', 'smb', 'mid-market', 'enterprise']}}),
    defineField({name: 'roles', title: 'Roles', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'industries', title: 'Industries', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'agencySupport', title: 'Agency support', type: 'string', options: {list: ['unknown', 'no', 'yes-unverified-claim', 'yes-verified']}, initialValue: 'unknown'}),
    defineField({name: 'enterpriseReadiness', title: 'Enterprise readiness', type: 'string', options: {list: ['unknown', 'enterprise-priced-only', 'enterprise-ready-documented']}, initialValue: 'unknown'}),
  ],
})

/* ================================================================ */
/* AI ANSWER CONFIDENCE — the net-new signature module (not in Phases 1-5) */
/* ================================================================ */
export const aiEngineScore = defineType({
  name: 'aiEngineScore',
  title: 'AI engine score',
  type: 'object',
  fields: [
    defineField({name: 'engine', title: 'Engine', type: 'string', options: {list: AI_ENGINE}, validation: (r) => r.required()}),
    defineField({name: 'confidencePct', title: 'Confidence %', type: 'number', validation: (r) => r.min(0).max(100)}),
    defineField({name: 'mentionRate', title: 'Mention rate % (of answers)', type: 'number', validation: (r) => r.min(0).max(100)}),
  ],
  preview: {select: {title: 'engine', subtitle: 'confidencePct'}},
})

export const sourceOfTruth = defineType({
  name: 'sourceOfTruth',
  title: 'Source of truth',
  type: 'object',
  fields: [
    defineField({name: 'kind', title: 'Kind', type: 'string', options: {list: ['website', 'ai-consensus', 'web-reviews']}, validation: (r) => r.required()}),
    defineField({name: 'claim', title: 'Claim', type: 'text', rows: 2}),
    defineField({name: 'confidencePct', title: 'Confidence %', type: 'number', validation: (r) => r.min(0).max(100)}),
  ],
  preview: {select: {title: 'kind', subtitle: 'confidencePct'}},
})

export const dimensionScore = defineType({
  name: 'dimensionScore',
  title: 'Feature dimension score',
  type: 'object',
  fields: [
    defineField({name: 'name', title: 'Dimension', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'aiStatedPct', title: 'AI-stated %', type: 'number', validation: (r) => r.min(0).max(100)}),
    defineField({name: 'webVerifiedPct', title: 'Web-verified %', type: 'number', validation: (r) => r.min(0).max(100)}),
  ],
  preview: {select: {title: 'name'}},
})

export const citationSource = defineType({
  name: 'citationSource',
  title: 'Citation source',
  type: 'object',
  fields: [
    defineField({name: 'domain', title: 'Domain', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'citedCount', title: 'Times cited', type: 'number'}),
  ],
  preview: {select: {title: 'domain', subtitle: 'citedCount'}},
})

export const aiConfidence = defineType({
  name: 'aiConfidence',
  title: 'AI Answer Confidence',
  type: 'object',
  description: 'Krishna\'s signature module: how much AI engines trust this tool for a job, vs website claims vs web reviews.',
  fields: [
    defineField({name: 'jobContext', title: 'Job context', type: 'string', description: 'e.g. "AI visibility tracking" — the job the confidence is measured for.', validation: (r) => r.required()}),
    defineField({name: 'aggregatePct', title: 'Aggregate AI confidence %', type: 'number', validation: (r) => r.min(0).max(100)}),
    defineField({name: 'dataStatus', title: 'Data status', type: 'string', options: {list: ['illustrative', 'live']}, initialValue: 'illustrative', description: 'MUST stay "illustrative" until wired to a real prompt-panel run. Drives the on-page "sample data" label.'}),
    defineField({name: 'methodologyNote', title: 'Methodology note', type: 'text', rows: 2}),
    defineField({name: 'lastCheckedAt', title: 'Last checked at', type: 'datetime'}),
    defineField({name: 'engineScores', title: 'Per-engine scores', type: 'array', of: [{type: 'aiEngineScore'}]}),
    defineField({name: 'sourcesOfTruth', title: 'Three sources of truth', type: 'array', of: [{type: 'sourceOfTruth'}], description: 'website self-claim / AI consensus / web reviews.'}),
    defineField({name: 'dimensions', title: 'Feature dimensions (AI vs Web)', type: 'array', of: [{type: 'dimensionScore'}]}),
    defineField({name: 'citations', title: 'Citation sources', type: 'array', of: [{type: 'citationSource'}]}),
  ],
})

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ item',
  type: 'object',
  fields: [
    defineField({name: 'question', title: 'Question', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (r) => r.required()}),
  ],
  preview: {select: {title: 'question'}},
})

export const objectTypes = [
  evidenceClaim,
  pricingPlan,
  capability,
  integrationRef,
  alternativeRef,
  quickVerdict,
  bestFit,
  faqItem,
  aiEngineScore,
  sourceOfTruth,
  dimensionScore,
  citationSource,
  aiConfidence,
]
