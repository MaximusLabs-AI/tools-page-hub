'use client'
import {useState} from 'react'
import type {Tool} from '@/lib/types'
import {calculateStackCost, detectOverlap} from '@/lib/core/stackBuilder'
import ToolLogo from './ToolLogo'

export default function StackBuilderClient({tools}: {tools: Tool[]}) {
  const [ids, setIds] = useState<string[]>([])
  const stack = tools.filter((t) => ids.includes(t.id))
  const cost = calculateStackCost(stack)
  const overlaps = detectOverlap(stack)
  const toggle = (id: string) => setIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  return (
    <section className="blk paper">
      <div className="wrap">
        <div className="hr-accent" />
        <h1 className="sec">Stack Builder</h1>
        <p className="lead">
          Add tools to estimate monthly cost and catch category overlaps. Custom-priced tools are listed
          separately, never counted as $0.
        </p>
        <div className="stackgrid">
          <div style={{display: 'grid', gap: 4}}>
            {tools.map((t) => {
              const on = ids.includes(t.id)
              return (
                <div className="addrow" key={t.id}>
                  <ToolLogo domain={t.domain} name={t.name} size={32} radius={9} />
                  <div style={{minWidth: 0}}>
                    <div className="nm">{t.name}</div>
                    <div className="ms">
                      {t.primaryCategory.name} · {t.pricingPlans[0]?.priceDisplay || 'Pricing not verified'}
                    </div>
                  </div>
                  <button className={`btn ${on ? 'btn--ghost' : 'btn--primary'} addbtn`} onClick={() => toggle(t.id)}>
                    {on ? 'Remove' : 'Add'}
                  </button>
                </div>
              )
            })}
          </div>

          <aside className="stack-summary">
            <div style={{fontSize: 12, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em'}}>
              Estimated monthly
            </div>
            <div className="total">${cost.monthly.toLocaleString()}</div>
            <div style={{fontSize: 12, color: 'var(--muted)'}}>{cost.countedTools.length} priced tools counted</div>
            {cost.excluded.length > 0 && (
              <div className="warn">Custom-priced (excluded from total): {cost.excluded.join(', ')}</div>
            )}
            {overlaps.map((o, i) => (
              <div className="warn" key={i}>
                Overlap in {o.categoryName}: {o.tools.join(', ')} — you may not need both.
              </div>
            ))}
            {stack.length === 0 && (
              <div style={{fontSize: 13, color: 'var(--muted)', marginTop: 10}}>Add tools to build your stack.</div>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
