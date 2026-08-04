import type {Tool} from '@/lib/types'
import {FIT_LABEL_TEXT} from '@/lib/types'

export function FitPill({tool}: {tool: Tool}) {
  if (!tool.quickVerdict) return null
  return <span className="badge badge--verdict">{FIT_LABEL_TEXT[tool.quickVerdict.fitLabel]}</span>
}

export function ProductTypeBadge({tool}: {tool: Tool}) {
  if (tool.productType === 'suite_module') return <span className="badge badge--suite">Suite module</span>
  return null
}

export function AiPill({tool}: {tool: Tool}) {
  if (!tool.aiConfidence) return null
  return (
    <span className="aipill">
      <span className="spark" /> AI confidence {tool.aiConfidence.aggregatePct}%
    </span>
  )
}

export function priceLabel(tool: Tool): string {
  return tool.pricingPlans[0]?.priceDisplay || 'Pricing not publicly verified'
}
