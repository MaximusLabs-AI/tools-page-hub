'use client'
import {useEffect, useState} from 'react'

type Item = {code: string; name: string; count: number}

/** Sticky category sidebar with scroll-spy — stays fixed while the tool list scrolls. */
export default function DirectorySidebar({items}: {items: Item[]}) {
  const [active, setActive] = useState(items[0]?.code.toLowerCase() ?? '')

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id.replace('cat-', ''))
        }
      },
      {rootMargin: '-90px 0px -72% 0px', threshold: 0},
    )
    for (const it of items) {
      const el = document.getElementById(`cat-${it.code.toLowerCase()}`)
      if (el) obs.observe(el)
    }
    return () => obs.disconnect()
  }, [items])

  const go = (code: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById(`cat-${code.toLowerCase()}`)
    if (el) {
      window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: 'smooth'})
      setActive(code.toLowerCase())
    }
  }

  return (
    <aside className="dir__side">
      <div className="side-title">Categories</div>
      <nav className="dir__nav">
        {items.map((it) => (
          <a
            key={it.code}
            href={`#cat-${it.code.toLowerCase()}`}
            onClick={go(it.code)}
            className={active === it.code.toLowerCase() ? 'active' : ''}
          >
            <span>{it.name}</span>
            <span className="dir__nav-c">{it.count}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}
