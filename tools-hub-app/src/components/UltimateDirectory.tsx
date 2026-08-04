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
    let frame = 0
    const update = () => {
      frame = 0
      const closest = items
        .map(({sectionId}) => ({
          id: sectionId,
          rect: document.getElementById(sectionId)?.getBoundingClientRect(),
        }))
        .filter((item): item is {id: string; rect: DOMRect} =>
          Boolean(item.rect && item.rect.bottom > 72 && item.rect.top < window.innerHeight),
        )
        .sort((a, b) => Math.abs(a.rect.top - 86) - Math.abs(b.rect.top - 86))[0]
      if (closest) setActive(closest.id)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [items])

  const jumpTo = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    target.scrollIntoView({behavior: 'smooth', block: 'start'})
    window.history.replaceState(null, '', `#${id}`)
    setActive(id)
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
        {items.map(({id, name, slug, definition, tools, sectionId}) => (
          <section className="udgroup" id={sectionId} key={id}>
            <Link className="udgroup__head" href={`/tools/${slug}`} prefetch={false}>
              <span>
                <b>{name}</b>
                <small>{definition}</small>
              </span>
              <em>{tools.length} tools</em>
            </Link>
            <div className="udgroup__list">
              {tools.map((tool) => (
                <Link
                  key={tool.id}
                  className="udtool"
                  href={`/tools/${tool.slug}`}
                  prefetch={false}
                  onMouseEnter={() => prepareTool(tool.slug)}
                  onFocus={() => prepareTool(tool.slug)}
                >
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
