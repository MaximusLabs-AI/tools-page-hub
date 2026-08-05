'use client'

import {useMemo, useState} from 'react'
import {useRouter} from 'next/navigation'
import ToolLogo from './ToolLogo'

export type HeroSearchItem = {name: string; slug: string; category: string; domain: string}

/** Hero search box with live tool suggestions; Enter goes to the results page. */
export default function HeroSearch({tools}: {tools: HeroSearchItem[]}) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  const suggestions = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return []
    return tools
      .filter((t) => t.name.toLowerCase().includes(term) || t.category.toLowerCase().includes(term))
      .slice(0, 6)
  }, [q, tools])

  const goToResults = () => {
    const term = q.trim()
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  return (
    <form
      className="chero__search"
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        goToResults()
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search for a tool…"
        aria-label="Search for a tool"
        autoComplete="off"
      />
      <span className="kbd">Enter ↵</span>

      {open && suggestions.length > 0 && (
        <div className="chero__sugg" role="listbox" aria-label="Tool suggestions">
          {suggestions.map((t) => (
            <button
              type="button"
              key={t.slug}
              className="chero__sugg-item"
              role="option"
              aria-selected="false"
              // onMouseDown fires before the input's onBlur closes the list
              onMouseDown={(e) => {
                e.preventDefault()
                router.push(`/tools/${t.slug}`)
              }}
            >
              <ToolLogo domain={t.domain} name={t.name} size={26} radius={7} />
              <span className="chero__sugg-nm">{t.name}</span>
              <span className="chero__sugg-cat">{t.category}</span>
            </button>
          ))}
          <button
            type="button"
            className="chero__sugg-all"
            onMouseDown={(e) => {
              e.preventDefault()
              goToResults()
            }}
          >
            See all results for “{q.trim()}” →
          </button>
        </div>
      )}
    </form>
  )
}
