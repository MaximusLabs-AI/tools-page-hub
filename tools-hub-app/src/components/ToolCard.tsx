import Link from 'next/link'
import type {Tool} from '@/lib/types'
import ToolLogo from './ToolLogo'
import {AiPill, FitPill, ProductTypeBadge} from './badges'

export default function ToolCard({tool}: {tool: Tool}) {
  return (
    <Link className="card" href={`/tools/${tool.slug}`}>
      <div className="card__top">
        <ToolLogo domain={tool.domain} name={tool.name} />
        <div>
          <div className="card__name">{tool.name}</div>
          <div className="card__meta">{tool.primaryCategory.name}</div>
        </div>
      </div>
      <p className="card__desc">{tool.oneLineDescription}</p>
      <div className="card__foot">
        <AiPill tool={tool} />
        <ProductTypeBadge tool={tool} />
        <FitPill tool={tool} />
      </div>
    </Link>
  )
}
