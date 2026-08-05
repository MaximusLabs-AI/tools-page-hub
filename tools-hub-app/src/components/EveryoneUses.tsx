'use client'
import {useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import type {Tool} from '@/lib/types'
import ToolLogo from './ToolLogo'

type Group = {code: string; name: string; tools: Tool[]}

/** Full-width category browser with richer tool cards. */
export default function EveryoneUses({featured, groups}: {featured: Tool[]; groups: Group[]}) {
  const router = useRouter()
  const [active, setActive] = useState('featured')
  const shown = active === 'featured' ? featured : (groups.find((g) => g.code === active)?.tools ?? [])
  const items = [{code: 'featured', name: 'Best AI-era tools'}, ...groups.slice(0, 9).map((g) => ({code: g.code, name: g.name}))]
  const activeName = items.find((item) => item.code === active)?.name ?? 'Best AI-era tools'

  return (
    <div className="eu">
      <aside className="eu__side">
        <span className="eu__eyebrow">Explore the collection</span>
        <h3>Tools by category</h3>
        <p>Choose a category to compare the most relevant platforms.</p>
        <div className="eu__cats">
          {items.map((s) => (
            <button
              key={s.code}
              className={`eu__cat${active === s.code ? ' on' : ''}`}
              onClick={() => setActive(s.code)}
              aria-pressed={active === s.code}
            >
              <span>{s.name}</span>
              <span className="eu__chev" aria-hidden="true">›</span>
            </button>
          ))}
        </div>
        <Link href="#directory" className="eu__more">Browse every category ›</Link>
      </aside>

      <section className="eu__results" aria-label={`${activeName} tools`}>
        <div className="eu__results-head">
          <div>
            <span>Selected collection</span>
            <h3>{activeName}</h3>
          </div>
          <b>{shown.length} tools</b>
        </div>

        <div className="eu__grid" aria-live="polite">
          {shown.map((t) => (
            <Link
              key={t.id}
              className="eucard"
              href={`/tools/${t.slug}`}
              prefetch={false}
              onMouseEnter={() => router.prefetch(`/tools/${t.slug}`)}
              onFocus={() => router.prefetch(`/tools/${t.slug}`)}
            >
              <div className="eucard__top">
                <ToolLogo domain={t.domain} name={t.name} size={38} radius={10} />
                <span className="eucard__nm">{t.name}</span>
                <span className="eucard__arrow" aria-hidden="true">›</span>
              </div>
              <p className="eucard__desc">{t.oneLineDescription}</p>
              <div className="eucard__features" aria-label={`${t.name} key features`}>
                {t.capabilities.slice(0, 3).map((capability) => (
                  <span key={capability.name}>{capability.name}</span>
                ))}
              </div>
              <div className="eucard__meta">
                <span>{t.primaryCategory.name}</span>
                {t.pricingPlans.some((plan) => plan.freePlan) && <b>Free option</b>}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
