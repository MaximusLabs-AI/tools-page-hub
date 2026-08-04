import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import {repo} from '@/lib/repository'
import ToolLogo from '@/components/ToolLogo'
import {AiPill} from '@/components/badges'

type Props = {params: {slug: string}}

export async function generateStaticParams() {
  const tools = await repo.getTools()
  return tools.filter((t) => t.alternatives.length >= 1).map((t) => ({slug: t.slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const tool = await repo.getToolBySlug(params.slug)
  if (!tool) return {}
  return {title: `${tool.name} alternatives`, description: `The best verified alternatives to ${tool.name}.`}
}

export default async function AlternativesPage({params}: Props) {
  const [tool, all] = await Promise.all([repo.getToolBySlug(params.slug), repo.getTools()])
  if (!tool) notFound()
  const bySlug = new Map(all.map((t) => [t.slug, t]))
  const alts = tool.alternatives.map((a) => bySlug.get(a.toolSlug)).filter(Boolean)

  return (
    <section className="blk paper">
      <div className="wrap">
        <div className="crumb">
          <Link href="/tools">Tools</Link> › <Link href={`/tools/${tool.slug}`}>{tool.name}</Link> › <b>Alternatives</b>
        </div>
        <div className="hr-accent" style={{marginTop: 16}} />
        <h1 className="sec">{tool.name} alternatives</h1>
        <p className="lead">
          {alts.length} verified alternatives to {tool.name} by the same job-to-be-done. Each links to its full
          profile with AI-answer confidence and pricing.
        </p>
        <div className="altgrid">
          {alts.map((a) =>
            a ? (
              <Link key={a.id} className="altcard" href={`/tools/${a.slug}`}>
                <div className="altcard__top">
                  <ToolLogo domain={a.domain} name={a.name} size={42} />
                  <div>
                    <h4>{a.name}</h4>
                    <div className="meta">{a.primaryCategory.name}</div>
                  </div>
                </div>
                <p>{a.oneLineDescription}</p>
                <div className="altcard__foot">
                  <AiPill tool={a} />
                  <span>View →</span>
                </div>
              </Link>
            ) : null,
          )}
        </div>
      </div>
    </section>
  )
}
