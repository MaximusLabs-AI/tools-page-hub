import type {Tool} from '@/lib/types'

export interface FilterState {
  pricingModel?: string
  freePlan?: boolean
  productType?: string
  verification?: string
}

export const FACETS: {key: keyof FilterState; label: string; options: {value: string; label: string}[]}[] = [
  {
    key: 'pricingModel',
    label: 'Pricing model',
    options: [
      {value: 'free', label: 'Free'},
      {value: 'freemium', label: 'Freemium'},
      {value: 'flat-subscription', label: 'Subscription'},
      {value: 'seat-based', label: 'Per seat'},
      {value: 'usage-based', label: 'Usage-based'},
      {value: 'custom-enterprise', label: 'Custom / enterprise'},
    ],
  },
  {
    key: 'productType',
    label: 'Product type',
    options: [
      {value: 'native', label: 'Native platform'},
      {value: 'suite_module', label: 'Suite module'},
    ],
  },
  {
    key: 'verification',
    label: 'Evidence',
    options: [
      {value: 'verified', label: 'Verified'},
      {value: 'partially-verified', label: 'Partially verified'},
    ],
  },
]

export function applyFilters(tools: Tool[], f: FilterState): Tool[] {
  return tools.filter((t) => {
    if (f.productType && t.productType !== f.productType) return false
    if (f.pricingModel && !t.pricingPlans.some((p) => p.pricingModel === f.pricingModel)) return false
    if (f.freePlan && !t.pricingPlans.some((p) => p.freePlan)) return false
    if (f.verification && !t.pricingPlans.some((p) => p.verificationStatus === f.verification)) return false
    return true
  })
}

export type SortKey = 'best-fit' | 'ai-confidence' | 'recent' | 'price' | 'name'

export const SORTS: {value: SortKey; label: string}[] = [
  {value: 'best-fit', label: 'Best fit'},
  {value: 'ai-confidence', label: 'AI confidence'},
  {value: 'recent', label: 'Recently verified'},
  {value: 'price', label: 'Price (low to high)'},
  {value: 'name', label: 'Name (A to Z)'},
]

const minPrice = (t: Tool): number | null => {
  const nums = t.pricingPlans.map((p) => p.price).filter((n): n is number => typeof n === 'number')
  return nums.length ? Math.min(...nums) : null
}

export function sortTools(tools: Tool[], key: SortKey): Tool[] {
  const arr = [...tools]
  switch (key) {
    case 'ai-confidence':
      return arr.sort((a, b) => (b.aiConfidence?.aggregatePct ?? -1) - (a.aiConfidence?.aggregatePct ?? -1))
    case 'recent':
      return arr.sort((a, b) => (b.lastVerifiedAt ?? '').localeCompare(a.lastVerifiedAt ?? ''))
    case 'price':
      // nulls (custom) sorted last, never treated as 0
      return arr.sort((a, b) => {
        const pa = minPrice(a)
        const pb = minPrice(b)
        if (pa === null && pb === null) return a.name.localeCompare(b.name)
        if (pa === null) return 1
        if (pb === null) return -1
        return pa - pb
      })
    case 'name':
      return arr.sort((a, b) => a.name.localeCompare(b.name))
    case 'best-fit':
    default:
      return arr // ranking handled by rankTools where needed
  }
}
