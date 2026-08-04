import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import {repo} from '@/lib/repository'
import {buildComparison} from '@/lib/core/comparison'
import ComparisonTable from '@/components/ComparisonTable'
import ToolLogo from '@/components/ToolLogo'
import {FIT_LABEL_TEXT} from '@/lib/types'

type Props = {params: {pair: string}}

export async function generateStaticParams() {
  const tools = await repo.getTools()
  const pairs = new Set<string>()
  for (const t of tools) {
    for (const a of t.alternatives) {
      const [x, y] = [t.slug, a.toolSlug].sort()
      pairs.add(`${x}-vs-${y}`)
    }
  }
  return [...pairs].map((pair) => ({pair}))
}

function splitPair(pair: string): [string, string] | null {
  const i = pair.indexOf('-vs-')
  if (i < 0) return null
  return [pair.slice(0, i), pair.slice(i + 4)]
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const p = splitPair(params.pair)
  if (!p) return {}
  const [a, b] = await Promise.all([repo.getToolBySlug(p[0]), repo.getToolBySlug(p[1])])
  if (!a || !b) return {}
  return {title: `${a.name} vs ${b.name}`, description: `A side-by-side comparison of ${a.name} and ${b.name}.`}
}

export default async function VersusPage({params}: Props) {
  const p = splitPair(params.pair)
  if (!p) notFound()
  const [a, b] = await Promise.all([repo.getToolBySlug(p[0]), repo.getToolBySlug(p[1])])
  if (!a || !b) notFound()
  const cmp = buildComparison([a, b])

  return (
    <section className="blk paper">
      <div className="wrap">
        <div className="crumb"><Link href="/tools">Tools</Link> › <b>{a.name} vs {b.name}</b></div>
        <div className="hr-accent" style={{marginTop: 16}} />
        <h1 className="sec">
          {a.name} vs {b.name}
        </h1>
        {cmp.positioningNote && <p className="lead">{cmp.positioningNote}</p>}
        <ComparisonTable cmp={cmp} />

        <div className="sl" style={{marginTop: 24}}>
          {[a, b].map((t) => (
            <div className="slcard pos" key={t.slug} style={{borderColor: 'var(--line)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8}}>
                <ToolLogo domain={t.domain} name={t.name} size={36} />
                <h4 style={{color: 'var(--blue)', fontSize: 15, textTransform: 'none', letterSpacing: 0}}>
                  Choose {t.name} if
                </h4>
              </div>
              <p style={{fontSize: 14, color: 'var(--text-2)', margin: 0, lineHeight: 1.55}}>
                {t.oneLineDescription} {t.quickVerdict && <>Rated {FIT_LABEL_TEXT[t.quickVerdict.fitLabel]}.</>}
              </p>
              <Link className="btn btn--ghost" href={`/tools/${t.slug}`} style={{marginTop: 12}}>
                Full {t.name} profile →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
