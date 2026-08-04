import Favicon from './Favicon'
import {monogram} from '@/lib/util'

/** Brand logo tile: monogram base + real favicon overlay (loads live). */
export default function ToolLogo({
  domain,
  name,
  size = 44,
  radius = 11,
  green = false,
}: {
  domain: string
  name: string
  size?: number
  radius?: number
  green?: boolean
}) {
  return (
    <span
      className={`logo${green ? ' green' : ''}`}
      style={{width: size, height: size, fontSize: Math.round(size * 0.4), borderRadius: radius}}
    >
      {monogram(name)}
      <Favicon domain={domain} />
    </span>
  )
}
