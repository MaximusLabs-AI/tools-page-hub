'use client'

import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useEffect, useMemo, useState} from 'react'
import ToolLogo from './ToolLogo'

export type UltimateDirectoryGroup = {
  id: string
  name: string
  slug: string
  definition: string
  tools: {
    id: string
    name: string
    slug: string
    domain: string
    description: string
    free: boolean
  }[]
}

function sectionId(group: UltimateDirectoryGroup) {
  return `directory-${group.slug.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`
}

export default function UltimateDirectory({groups}: {groups: UltimateDirectoryGroup[]}) {
  const router = useRouter()
  const [active, setActive] = useState(groups[0] ? sectionId(groups[0]) : '')
  const items = useMemo(
    () => groups.map((group) => ({...group, sectionId: sectionId(group)})),
    [groups],
  )

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (items.some((item) => item.sectionId === hash)) setActive(hash)
  }, [items])

  const jumpTo = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    setActive(id)
    target.scrollIntoView({behavior: 'smooth', block: 'start'})
    window.history.replaceState(null, '', `#${id}`)
  }

  const prepareTool = (slug: string) => {
    router.prefetch(`/tools/${slug}`)
  }

  return (
    <div className="ud">
      <aside className="ud__side" aria-label="Tool categories">
        <span className="ud__eyebrow">Browse the directory</span>
        <h3>AI tools by category</h3>
        <p>Jump directly to the tool category you need.</p>
        <nav className="ud__chips">
          {items.map(({name, tools, sectionId}) => (
            <a
              key={sectionId}
              href={`#${sectionId}`}
              onClick={jumpTo(sectionId)}
              className={active === sectionId ? 'active' : ''}
              aria-current={active === sectionId ? 'location' : undefined}
            >
              <span>{name}</span>
              <b>{tools.length}</b>
            </a>
          ))}
        </nav>
      </aside>

      <div className="ud__catalog">
        {items.map(({id, name, slug, definition, tools, sectionId}, groupIndex) => (
          <section className={`udgroup udgroup--${groupIndex % 4}`} id={sectionId} key={id}>
            <Link className="udgroup__head" href={`/tools/${slug}`} prefetch={false}>
              <span className="udgroup__marker">{String(groupIndex + 1).padStart(2, '0')}</span>
              <span className="udgroup__copy">
                <b>{name}</b>
                <small>{definition}</small>
              </span>
              <em>{tools.length} tools</em>
            </Link>
            <div className="udgroup__list">
              {tools.map((tool, toolIndex) => (
                <Link
                  key={tool.id}
                  className="udtool"
                  href={`/tools/${tool.slug}`}
                  prefetch={false}
                  onMouseEnter={() => prepareTool(tool.slug)}
                  onFocus={() => prepareTool(tool.slug)}
                >
                  <span className="udtool__rank">{String(toolIndex + 1).padStart(2, '0')}</span>
                  <ToolLogo domain={tool.domain} name={tool.name} size={30} radius={8} />
                  <span className="udtool__body">
                    <span className="udtool__name">
                      {tool.name}
                      {tool.free && <i>Free</i>}
                    </span>
                    <small>{tool.description}</small>
                  </span>
                  <span className="udtool__arrow" aria-hidden="true">›</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
