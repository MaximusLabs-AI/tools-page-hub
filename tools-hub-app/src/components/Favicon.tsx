'use client'
import {useState} from 'react'
import {faviconUrl} from '@/lib/util'

/** Loads a real favicon; hides itself on error so the monogram behind it shows. */
export default function Favicon({domain, size = 128}: {domain: string; size?: number}) {
  const [ok, setOk] = useState(false)
  return (
    <img
      src={faviconUrl(domain, size)}
      alt=""
      aria-hidden="true"
      referrerPolicy="no-referrer"
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
