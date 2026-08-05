'use client'

import type {ReactNode} from 'react'
import {useRef} from 'react'

export default function PricingRail({
  children,
  count,
  label,
}: {
  children: ReactNode
  count: number
  label: string
}) {
  const rail = useRef<HTMLDivElement>(null)
  const size = count >= 4 ? 'many' : String(Math.max(count, 1))

  const move = (direction: -1 | 1) => {
    const node = rail.current
    if (!node) return
    node.scrollBy({left: direction * Math.max(280, node.clientWidth * 0.82), behavior: 'smooth'})
  }

  return (
    <div className="pricing-rail">
      {count > 1 && (
        <div className="pricing-rail__controls" aria-label={`${label} carousel controls`}>
          <span>Scroll to compare every plan</span>
          <button type="button" onClick={() => move(-1)} aria-label={`Previous ${label} plans`}>
            ‹
          </button>
          <button type="button" onClick={() => move(1)} aria-label={`Next ${label} plans`}>
            ›
          </button>
        </div>
      )}
      <div
        ref={rail}
        className={`pricing-grid pricing-grid--${size}`}
        role="region"
        aria-label={`${label} pricing plans`}
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  )
}
