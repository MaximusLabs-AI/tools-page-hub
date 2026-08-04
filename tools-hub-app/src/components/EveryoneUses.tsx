'use client'
import {useState} from 'react'
import Link from 'next/link'
import type {Tool} from '@/lib/types'
import ToolLogo from './ToolLogo'

type Group = {code: string; name: string; tools: Tool[]}

/** ColdIQ "Everyone Uses": category sidebar (filter) + 3-column tool card grid. */
export default function EveryoneUses({featured, groups}: {featured: Tool[]; groups: Group[]}) {
  const [active, setActive] = useState('featured')
  const shown = active === 'featured' ? featured : (groups.find((g) => g.code === active)?.tools ?? [])
  const items = [{code: 'featured', name: 'Best AI-era tools'}, ...groups.slice(0, 9).map((g) => ({code: g.code, name: g.name}))]

  return (
    <div className="eu">
      <aside className="eu__side">
        {items.map((s) => (
          <button key={s.code} className={`eu__cat${active === s.code ? ' on' : ''}`} onClick={() => setActive(s.code)}>
            <span>{s.name}</span>
            <span className="eu__chev">›</span>
          </button>
        ))}
        <Link href="#directory" className="eu__more">More categories ›</Link>
      </aside>
      <div className="eu__grid">
        {shown.slice(0, 15).map((t) => (
          <Link key={t.id} className="eucard" href={`/tools/${t.slug}`}>
            <div className="eucard__top">
              <ToolLogo domain={t.domain} name={t.name} size={34} radius={9} />
              <span className="eucard__nm">{t.name}</span>
              <span className="eucard__arrow">›</span>
            </div>
            <p className="eucard__desc">{t.oneLineDescription}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
