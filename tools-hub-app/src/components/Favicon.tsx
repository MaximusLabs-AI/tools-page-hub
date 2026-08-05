'use client'
import {useEffect, useRef, useState} from 'react'
import {faviconUrl} from '@/lib/util'

/**
 * Loads a real favicon; hides itself on error so the monogram behind it shows.
 * Cached images (on revisit or client-side navigation) are already `complete`
 * when this mounts, so their onLoad never fires — we check on mount too, which
 * fixes the "logo only appears after a refresh" flicker.
 */
export default function Favicon({domain, size = 128}: {domain: string; size?: number}) {
  const ref = useRef<HTMLImageElement>(null)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const img = ref.current
    if (img && img.complete) {
      if (img.naturalWidth > 1) setOk(true)
      else if (img.naturalWidth === 0) img.style.display = 'none'
    }
  }, [])

  return (
    <img
      ref={ref}
      src={faviconUrl(domain, size)}
      alt=""
      aria-hidden="true"
      referrerPolicy="no-referrer"
      decoding="async"
      className={ok ? 'ok' : ''}
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth > 1) setOk(true)
      }}
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}
