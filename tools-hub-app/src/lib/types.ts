// Domain types returned by the repository layer. Both the local and Sanity
// repositories resolve references and return THESE shapes, so the UI never
// depends on the data source.

export type FitLabel =
  | 'best-fit'
  | 'strong-fit'
  | 'conditional-fit'
  | 'weak-fit'
  | 'insufficient-evidence'
export type Confidence = 'high' | 'medium' | 'low' | 'insufficient'
export type VerificationStatus = 'verified' | 'partially-verified' | 'not-publicly-verified'
export type FeatureStatus =
  | 'verified'
  | 'integration-dependent'
  | 'beta'
  | 'announced'
  | 'discontinued'
  | 'unverified-marketing-claim'
export type PricingModel =
  | 'free'
  | 'freemium'
  | 'flat-subscription'
  | 'seat-based'
  | 'usage-based'
  | 'custom-enterprise'
export type ProductType = 'native' | 'suite_module' | 'feature_module'
export type AiEngine = 'chatgpt' | 'claude' | 'google-ai-mode' | 'perplexity' | 'gemini'
export type RelationshipType = 'direct' | 'cheaper' | 'open-source' | 'complementary'

export interface Category {
  id: string
  code: string
  name: string
  slug: string
  level: number
  parentCode?: string
  definition: string
  indexable: boolean
  minimumProductCount: number
  updateFrequency?: string
  order: number
}

export interface PricingPlan {
  planName: string
  priceDisplay?: string
  price?: number | null
  pricingModel: PricingModel
  freePlan?: boolean
  freeTrial?: boolean
  thirdPartyEstimate?: boolean
  verificationStatus: VerificationStatus
  priceLastChecked?: string
}

export interface AiEngineScore {
  engine: AiEngine
  confidencePct: number
  mentionRate: number
}
export interface SourceOfTruth {
  kind: 'website' | 'ai-consensus' | 'web-reviews'
  claim: string
  confidencePct: number
}
export interface DimensionScore {
  name: string
  aiStatedPct: number
  webVerifiedPct: number
}
export interface CitationSource {
  domain: string
  citedCount: number
}
export interface AiConfidence {
  jobContext: string
  aggregatePct: number
  dataStatus: 'illustrative' | 'live'
  methodologyNote?: string
  lastCheckedAt?: string
  engineScores: AiEngineScore[]
  sourcesOfTruth: SourceOfTruth[]
  dimensions: DimensionScore[]
  citations: CitationSource[]
}

export interface AlternativeRef {
  toolSlug: string
  toolName: string
  relationshipType: RelationshipType
  reason?: string
}

export interface Capability {
  name: string
  description?: string
  featureStatus: FeatureStatus
}

export interface QuickVerdict {
  fitLabel: FitLabel
  confidence: Confidence
  numericScore?: number
  verdictText?: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface Tool {
  id: string
  name: string
  slug: string
  officialUrl: string
  domain: string
  logoUrl?: string
  oneLineDescription: string
  tagline?: string
  videoUrl?: string
  idealCustomer?: string
  easeOfUse?: number
  productType: ProductType
  status: string
  primaryCategory: Category
  secondaryCategories: Category[]
  quickVerdict?: QuickVerdict
  pricingPlans: PricingPlan[]
  capabilities: Capability[]
  alternatives: AlternativeRef[]
  strengths: string[]
  limitations: string[]
  aiConfidence?: AiConfidence
  faq: FaqItem[]
  lastVerifiedAt?: string
}

export const AI_ENGINE_LABELS: Record<AiEngine, {label: string; domain: string}> = {
  chatgpt: {label: 'ChatGPT', domain: 'chatgpt.com'},
  claude: {label: 'Claude', domain: 'claude.ai'},
  'google-ai-mode': {label: 'Google AI Mode', domain: 'google.com'},
  perplexity: {label: 'Perplexity', domain: 'perplexity.ai'},
  gemini: {label: 'Gemini', domain: 'gemini.google.com'},
}

export const FIT_ORDER: FitLabel[] = [
  'best-fit',
  'strong-fit',
  'conditional-fit',
  'weak-fit',
  'insufficient-evidence',
]

export const FIT_LABEL_TEXT: Record<FitLabel, string> = {
  'best-fit': 'Best fit',
  'strong-fit': 'Strong fit',
  'conditional-fit': 'Conditional fit',
  'weak-fit': 'Weak fit',
  'insufficient-evidence': 'Insufficient evidence',
}
