import Link from 'next/link'
import {notFound, redirect} from 'next/navigation'
import type {Metadata} from 'next'
import {repo} from '@/lib/repository'
import type {Category} from '@/lib/types'
import {categoriesInDepartment, rankTools} from '@/lib/core/taxonomy'
import {buildComparison} from '@/lib/core/comparison'
import CategoryBlock from '@/components/CategoryBlock'
import ToolCard from '@/components/ToolCard'
import ComparisonTable from '@/components/ComparisonTable'
import ToolProfileView from '@/components/ToolProfileView'

type Props = {params: {slug?: string[]}}

export async function generateStaticParams() {
  const [tools, categories] = await Promise.all([repo.getTools(), repo.getCategories()])
  return [
    ...categories.map((c) => ({slug: c.slug.split('/')})),
    ...tools.map((t) => ({slug: [t.slug]})),
  ]
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const slug = params.slug || []
  if (slug.length === 0) return {title: 'All tools'}
  const path = slug.join('/')
  const cat = await repo.getCategoryBySlug(path)
  if (cat) return {title: cat.name, description: cat.definition}
  if (slug.length === 1) {
    const tool = await repo.getToolBySlug(slug[0])
    if (tool) return {title: `${tool.name} review`, description: tool.oneLineDescription}
  }
  return {}
}

export default async function ToolsCatchAll({params}: Props) {
  const slug = params.slug || []
  if (slug.length === 0) redirect('/')
  const [tools, categories] = await Promise.all([repo.getTools(), repo.getCategories()])

  const path = slug.join('/')
  const cat = await repo.getCategoryBySlug(path)
  if (cat) {
    if (cat.level === 1) return <DepartmentView dept={cat} tools={tools} categories={categories} />
    const catTools = await repo.getToolsByCategorySlug(cat.slug)
    return <CategoryView category={cat} tools={catTools} />
  }

  if (slug.length === 1) {
    const tool = await repo.getToolBySlug(slug[0])
    if (tool) return <ToolProfileView tool={tool} allTools={tools} />
  }

  notFound()
}

/* ---------- department hub ---------- */
function DepartmentView({dept, tools, categories}: {dept: Category; tools: Awaited<ReturnType<typeof repo.getTools>>; categories: Category[]}) {
  const cats = categoriesInDepartment(dept, categories, tools)
  return (
    <section className="blk paper">
      <div className="wrap">
        <div className="crumb"><Link href="/tools">Tools</Link> › <b>{dept.name}</b></div>
        <div className="hr-accent" style={{marginTop: 16}} />
        <h1 className="sec">{dept.name}</h1>
        <p className="lead">{dept.definition}</p>
        <div style={{display: 'grid', gap: 20}}>
          {cats.map(({category}) => (
            <CategoryBlock key={category.id} category={category} tools={tools.filter((t) => t.primaryCategory.code === category.code)} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- category page ---------- */
function CategoryView({category, tools}: {category: Category; tools: Awaited<ReturnType<typeof repo.getTools>>}) {
  const ranked = rankTools(tools)
  const cmp = ranked.length >= 2 ? buildComparison(ranked.slice(0, 4)) : null
  return (
    <>
      <section className="blk paper">
        <div className="wrap">
          <div className="crumb"><Link href="/tools">Tools</Link> › <b>{category.name}</b></div>
          <div className="hr-accent" style={{marginTop: 16}} />
          <h1 className="sec">{category.name}</h1>
          <p className="lead">{category.definition}</p>
          <div className="grid grid--feat">
            {ranked.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </div>
      </section>
      {cmp && (
        <section className="blk grey">
          <div className="wrap">
            <div className="hr-accent" />
            <span className="kicker">Head to head</span>
            <h2 className="sec">Top {category.name} compared</h2>
            {cmp.positioningNote && <p className="lead">{cmp.positioningNote}</p>}
            <ComparisonTable cmp={cmp} />
          </div>
        </section>
      )}
    </>
  )
}
