import Link from 'next/link'
import {repo} from '@/lib/repository'
import {featuredTools, rankTools, MEDALS} from '@/lib/core/taxonomy'
import ToolCard from '@/components/ToolCard'
import ToolRow from '@/components/ToolRow'
import DirectorySidebar from '@/components/DirectorySidebar'
import {Motif} from '@/components/Logo'

export default async function CollectionPage() {
  const [tools, categories] = await Promise.all([repo.getTools(), repo.getCategories()])
  const featured = featuredTools(tools, 8)
  const productCats = categories
    .map((category) => ({category, tools: tools.filter((t) => t.primaryCategory.code === category.code)}))
    .filter((x) => x.tools.length > 0)
    .sort((a, b) => b.tools.length - a.tools.length)

  return (
    <>
      {/* hero — navy */}
      <section className="hero dark">
        <Motif className="motif" style={{right: -120, top: -150, transform: 'rotate(16deg)', position: 'absolute', width: 460, height: 460, opacity: 0.06}} />
        <div className="wrap" style={{position: 'relative', zIndex: 1}}>
          <div className="hero__badge">
            <span className="dot" /> Updated August 2026 · {tools.length} tools verified against primary sources
          </div>
          <h1 className="hero__title">
            The Best <span className="hl">AI Search, GEO &amp; SEO</span> Tools of 2026
          </h1>
          <p className="hero__dek">
            The complete MaximusLabs directory. Search {tools.length} tools, compare them by category, and see how
            much <b>ChatGPT, Claude, Perplexity &amp; Google AI Mode</b> actually trust each one, not just what its
            marketing page claims.
          </p>
          <form className="searchbar" action="/search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input name="q" type="text" placeholder="Search for a tool… try “AI visibility”, “attribution”, “analytics”" />
            <button className="btn btn--sky" type="submit">Search</button>
          </form>
          <div style={{marginTop: 14, fontSize: 13.5, color: '#9fc3f5', display: 'flex', gap: 16, flexWrap: 'wrap'}}>
            <span>Or:</span>
            <Link href="/tool-finder" style={{fontWeight: 700, color: '#89c3ff'}}>Find my tools →</Link>
            <Link href="/stacks" style={{fontWeight: 700, color: '#89c3ff'}}>Build a stack →</Link>
          </div>
        </div>
      </section>

      {/* tools everyone uses — white */}
      <section className="blk paper" style={{paddingBottom: 40}}>
        <div className="wrap">
          <div className="hr-accent" />
          <div className="blk__head">
            <div>
              <h2 className="sec">The tools everyone’s using</h2>
              <p className="lead">The flagship platforms, each with its live AI-answer confidence score.</p>
            </div>
          </div>
          <div className="grid grid--feat">
            {featured.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </div>
      </section>

      {/* directory — sticky category sidebar + scrolling tool list */}
      <section className="blk grey">
        <div className="wrap">
          <div className="hr-accent" />
          <h2 className="sec">The ultimate AI-era tool directory</h2>
          <p className="lead" style={{marginBottom: 24}}>
            Every verified tool, split by category and ranked by fit. Pick a category on the left; the list scrolls.
          </p>
          <div className="dir">
            <DirectorySidebar
              items={productCats.map(({category, tools: ct}) => ({code: category.code, name: category.name, count: ct.length}))}
            />
            <div className="dir__main">
              {productCats.map(({category, tools: ct}) => {
                const ranked = rankTools(ct)
                return (
                  <section className="catsec" id={`cat-${category.code.toLowerCase()}`} key={category.id}>
                    <div className="catsec__head">
                      <h3>
                        <Link href={`/tools/${category.slug}`}>{category.name}</Link>
                      </h3>
                      <span className="count">{ct.length} tools</span>
                    </div>
                    <p className="catsec__def">{category.definition}</p>
                    <div className="toollist">
                      {ranked.map((t, i) => (
                        <ToolRow key={t.id} tool={t} medal={i < 3 ? MEDALS[i] : null} />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA — navy */}
      <section className="blk navy">
        <Motif className="motif" style={{left: -130, bottom: -160, transform: 'rotate(-14deg)'}} />
        <div className="wrap" style={{textAlign: 'center'}}>
          <span className="kicker">Not sure where to start?</span>
          <h2 className="sec" style={{maxWidth: '22ch', margin: '0 auto'}}>Let the Tool Finder match you to the right stack</h2>
          <p className="lead" style={{maxWidth: '56ch', margin: '12px auto 0'}}>Answer a few questions for an evidence-backed shortlist, or build and cost a full stack.</p>
          <div style={{display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22, flexWrap: 'wrap'}}>
            <Link className="btn btn--white" href="/tool-finder">Start Tool Finder</Link>
            <Link className="btn btn--outline" href="/stacks">Build a stack</Link>
          </div>
        </div>
      </section>
    </>
  )
}
