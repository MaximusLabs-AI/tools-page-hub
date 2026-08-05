import Link from 'next/link'
import {repo} from '@/lib/repository'
import {featuredTools, rankTools} from '@/lib/core/taxonomy'
import EveryoneUses from '@/components/EveryoneUses'
import HeroSearch from '@/components/HeroSearch'
import UltimateDirectory, {type UltimateDirectoryGroup} from '@/components/UltimateDirectory'

export default async function CollectionPage() {
  const [tools, categories] = await Promise.all([repo.getTools(), repo.getCategories()])
  const featured = featuredTools(tools, 15)
  const productCats = categories
    .map((category) => ({category, tools: tools.filter((t) => t.primaryCategory.code === category.code)}))
    .filter((x) => x.tools.length > 0)
    .sort((a, b) => b.tools.length - a.tools.length)
  const directoryGroups: UltimateDirectoryGroup[] = productCats.map(({category, tools: categoryTools}) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    definition: category.definition,
    tools: rankTools(categoryTools).map((tool) => ({
      id: tool.id,
      name: tool.name,
      slug: tool.slug,
      domain: tool.domain,
      description: tool.oneLineDescription,
      free: tool.pricingPlans.some((plan) => plan.freePlan),
    })),
  }))

  return (
    <>
      {/* hero — centered, light */}
      <section className="chero">
        <div className="wrap">
          <h1 className="chero__title">
            The Best <span className="hl">AI Search, GEO &amp; SEO</span> Tools of 2026
          </h1>
          <p className="chero__dek">
            Discover the best AI-search, GEO and SEO tools in 2026. From tracking your brand across ChatGPT to
            auditing crawlability, this directory helps SaaS and enterprise teams compare software by editorial
            fit, pricing, capabilities, and the strength of its recorded evidence.
          </p>
          <HeroSearch
            tools={tools.map((t) => ({
              name: t.name,
              slug: t.slug,
              category: t.primaryCategory.name,
              domain: t.domain,
            }))}
          />
        </div>
      </section>

      {/* cross-sell strip */}
      <section className="wrap">
        <div className="xsell">
          <div>
            <b>Get your free AI-visibility scan</b>
            <span>See how ChatGPT, Perplexity &amp; Gemini rank your brand, in one click, with MaximusLabs.</span>
          </div>
          <a className="xsell__link" href="https://maximuslabs.ai" target="_blank" rel="noreferrer">Run a free scan →</a>
        </div>
      </section>

      {/* everyone uses — full-width category browser + richer card grid */}
      <section className="blk paper everyone-section" id="popular-tools">
        <div className="everyone-wrap">
          <h2 className="ctr-h2 directory-heading">Best AI-Era Tools Everyone Uses</h2>
          <EveryoneUses
            featured={featured}
            groups={productCats.map(({category, tools: t}) => ({code: category.code, name: category.name, tools: t}))}
          />
        </div>
      </section>

      {/* ultimate directory — sticky category table of contents + compact catalog */}
      <section className="blk grey directory-section" id="directory">
        <div className="directory-wrap">
          <h2 className="ctr-h2 directory-heading">The Ultimate AI-Era Tools Directory for 2026</h2>
          <p className="ctr-dek directory-dek">
            Compare the best AI-search, GEO, SEO, analytics and attribution tools in one place, split by category
            and ranked by fit, so your team can focus on results.
          </p>
          <UltimateDirectory groups={directoryGroups} />
        </div>
      </section>
    </>
  )
}
