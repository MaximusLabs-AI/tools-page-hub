import Link from 'next/link'
import type {Category, Tool} from '@/lib/types'
import {rankTools, MEDALS} from '@/lib/core/taxonomy'
import ToolRow from './ToolRow'

export default function CategoryBlock({category, tools}: {category: Category; tools: Tool[]}) {
  const ranked = rankTools(tools)
  return (
    <div className="catblk">
      <div className="catblk__head">
        <h3>
          <Link href={`/tools/${category.slug}`}>{category.name}</Link>
        </h3>
        <span className="badge badge--verdict">{tools.length} tools</span>
      </div>
      <p className="catblk__def">{category.definition}</p>
      <div className="toollist">
        {ranked.map((t, i) => (
          <ToolRow key={t.id} tool={t} medal={i < 3 ? MEDALS[i] : null} />
        ))}
      </div>
    </div>
  )
}
