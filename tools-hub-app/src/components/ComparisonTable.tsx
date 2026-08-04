import Link from 'next/link'
import type {Comparison} from '@/lib/core/comparison'
import ToolLogo from './ToolLogo'

export default function ComparisonTable({cmp, highlightSlug}: {cmp: Comparison; highlightSlug?: string}) {
  return (
    <div className="cmp">
      <table className="cmp__t">
        <thead>
          <tr>
            <th scope="col">&nbsp;</th>
            {cmp.tools.map((t) => (
              <th scope="col" key={t.slug} className={t.slug === highlightSlug ? 'me' : ''}>
                <Link className="toollogo" href={`/tools/${t.slug}`}>
                  <ToolLogo domain={t.domain} name={t.name} size={24} radius={7} />
                  {t.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cmp.rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {cmp.tools.map((t) => (
                <td key={t.slug} className={t.slug === highlightSlug ? 'me' : ''}>
                  {r.values[t.slug]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
