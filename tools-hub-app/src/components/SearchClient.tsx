'use client'
import Link from 'next/link'
import {useMemo, useState} from 'react'
import type {Tool} from '@/lib/types'
import {searchTools} from '@/lib/core/search'
import {applyFilters, sortTools, FACETS, SORTS, type FilterState, type SortKey} from '@/lib/core/filters'
import ToolCard from './ToolCard'

export default function SearchClient({tools, initialQ}: {tools: Tool[]; initialQ: string}) {
  const [q, setQ] = useState(initialQ)
  const [filters, setFilters] = useState<FilterState>({})
  const [sort, setSort] = useState<SortKey>('ai-confidence')

  const results = useMemo(() => {
    let r = searchTools(tools, q)
    r = applyFilters(r, filters)
    r = sortTools(r, sort)
    return r
  }, [tools, q, filters, sort])

  const setFacet = (key: keyof FilterState, value: string) =>
    setFilters((s) => ({...s, [key]: value || undefined}))

  return (
    <section className="blk paper">
      <div className="wrap">
        <nav className="tpcrumb" aria-label="Breadcrumb" style={{display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', paddingTop: 0}}>
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/#directory">Tools</Link>
          <span>›</span>
          <b>{q.trim() ? `Search: “${q.trim()}”` : 'Search results'}</b>
        </nav>
        <div className="hr-accent" style={{marginTop: 14}} />
        <h1 className="sec">Search &amp; filter tools</h1>
        <div className="searchbar" style={{maxWidth: '100%', marginTop: 16}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, category or description…"
            aria-label="Search tools"
          />
        </div>
        <div className="toolbar" style={{marginTop: 16}}>
          {FACETS.map((f) => (
            <select
              key={String(f.key)}
              className="select"
              aria-label={f.label}
              value={String((filters as Record<string, unknown>)[f.key] ?? '')}
              onChange={(e) => setFacet(f.key, e.target.value)}
            >
              <option value="">{f.label}: any</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          ))}
          <label className="opt" style={{display: 'inline-flex', gap: 6, alignItems: 'center'}}>
            <input
              type="checkbox"
              checked={Boolean(filters.freePlan)}
              onChange={(e) => setFilters((s) => ({...s, freePlan: e.target.checked || undefined}))}
            />
            Free plan
          </label>
          <select className="select" aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>Sort: {s.label}</option>
            ))}
          </select>
          <span className="count">{results.length} tools</span>
        </div>

        {results.length ? (
          <div className="grid grid--feat">
            {results.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        ) : (
          <p className="lead">No tools match. Try broadening your filters.</p>
        )}
      </div>
    </section>
  )
}
