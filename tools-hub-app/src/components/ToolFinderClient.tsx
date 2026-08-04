'use client'
import {useState} from 'react'
import Link from 'next/link'
import type {Tool} from '@/lib/types'
import {findTools, PROBLEMS, BUDGETS} from '@/lib/core/toolFinder'
import ToolLogo from './ToolLogo'

const FIT_TEXT: Record<string, string> = {
  'best-fit': 'Best fit',
  'strong-fit': 'Strong fit',
  'conditional-fit': 'Conditional fit',
}

export default function ToolFinderClient({tools}: {tools: Tool[]}) {
  const [problem, setProblem] = useState('')
  const [budget, setBudget] = useState<number | undefined>(undefined)
  const [needFree, setNeedFree] = useState(false)

  const ready = problem !== '' && budget !== undefined
  const recs = ready ? findTools(tools, {problem, budget: budget as number, needFree}) : []

  return (
    <section className="blk paper">
      <div className="wrap tf">
        <div className="hr-accent" />
        <h1 className="sec">Tool Finder</h1>
        <p className="lead">
          Answer a few questions for an evidence-backed shortlist. No result is a paid placement, and tools that
          don’t meet a hard requirement are excluded, not down-ranked.
        </p>

        <div className="tf__q">
          <h3>1. What are you trying to do?</h3>
          <div className="opts">
            {PROBLEMS.map((p) => (
              <button key={p.value} className={`opt${problem === p.value ? ' on' : ''}`} onClick={() => setProblem(p.value)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tf__q">
          <h3>2. What’s your monthly budget?</h3>
          <div className="opts">
            {BUDGETS.map((b) => (
              <button
                key={b.label}
                className={`opt${budget === b.value ? ' on' : ''}`}
                onClick={() => {
                  setBudget(b.value)
                  if (b.value === 0) setNeedFree(true)
                }}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tf__q">
          <h3>3. Do you require a free plan?</h3>
          <div className="opts">
            <button className={`opt${needFree ? ' on' : ''}`} onClick={() => setNeedFree(true)}>Yes</button>
            <button className={`opt${!needFree ? ' on' : ''}`} onClick={() => setNeedFree(false)}>No</button>
          </div>
        </div>

        {ready && (
          <div style={{marginTop: 24}}>
            <h2 className="sec" style={{fontSize: 24}}>
              {recs.length} match{recs.length === 1 ? '' : 'es'}
            </h2>
            {recs.length ? (
              recs.slice(0, 6).map((r) => (
                <div className="rec" key={r.tool.id}>
                  <div className="rec__top">
                    <ToolLogo domain={r.tool.domain} name={r.tool.name} size={40} />
                    <h4>
                      <Link href={`/tools/${r.tool.slug}`}>{r.tool.name}</Link>
                    </h4>
                    <span className="badge badge--verdict fitpill">{FIT_TEXT[r.fitLabel]}</span>
                  </div>
                  <ul>
                    {r.fits.map((f, i) => (
                      <li className="fit" key={`f${i}`}>{f}</li>
                    ))}
                    {r.unmet.map((f, i) => (
                      <li className="unmet" key={`u${i}`}>{f}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="lead">
                No tools match those constraints. Try relaxing the budget or the free-plan requirement.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
