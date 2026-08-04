import Link from 'next/link'
import type {Tool} from '@/lib/types'
import {FIT_LABEL_TEXT} from '@/lib/types'
import ToolLogo from './ToolLogo'

/** One tool as a full-width vertical list row (logo + name + one-line description). */
export default function ToolRow({tool, medal}: {tool: Tool; medal?: string | null}) {
  const free = tool.pricingPlans.some((p) => p.freePlan)
  return (
    <Link className="toolrow" href={`/tools/${tool.slug}`}>
      <span className="medal">{medal || <i className="medal__dot" />}</span>
      <ToolLogo domain={tool.domain} name={tool.name} size={38} />
      <div className="toolrow__body">
        <div className="toolrow__nm">
          {tool.name}
          {tool.productType === 'suite_module' && <span className="badge badge--suite">Suite</span>}
          {free && <span className="badge badge--free">Free</span>}
        </div>
        <div className="toolrow__tg">{tool.oneLineDescription}</div>
      </div>
      <div className="toolrow__rt">
        {tool.aiConfidence ? (
          <>
            <b>{tool.aiConfidence.aggregatePct}%</b>
            <span>AI conf.</span>
          </>
        ) : tool.quickVerdict ? (
          <span className="toolrow__fit">{FIT_LABEL_TEXT[tool.quickVerdict.fitLabel]}</span>
        ) : null}
      </div>
    </Link>
  )
}
