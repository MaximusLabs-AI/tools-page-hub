import Link from 'next/link'
import type {Tool, FeatureStatus} from '@/lib/types'
import {FIT_LABEL_TEXT} from '@/lib/types'
import ToolLogo from './ToolLogo'
import AIConfidence from './AIConfidence'
import ComparisonTable from './ComparisonTable'
import Comments from './Comments'
import {Motif} from './Logo'
import {AiPill} from './badges'
import {buildComparison} from '@/lib/core/comparison'

const REL_LABEL: Record<string, string> = {
  direct: 'Direct alternative',
  cheaper: 'Cheaper',
  'open-source': 'Open source',
  complementary: 'Complementary',
}
const vtagFor = (s: FeatureStatus): {cls: string; label: string} => {
  if (s === 'verified') return {cls: 'verified', label: 'Verified'}
  if (s === 'integration-dependent') return {cls: 'suite', label: 'Integration-dependent'}
  if (s === 'unverified-marketing-claim') return {cls: 'unverified', label: 'Not publicly verified'}
  return {cls: 'unverified', label: s.replace(/-/g, ' ')}
}

export default function ToolProfileView({tool, allTools}: {tool: Tool; allTools: Tool[]}) {
  const bySlug = new Map(allTools.map((t) => [t.slug, t]))
  const altTools = tool.alternatives.flatMap((a) => {
    const at = bySlug.get(a.toolSlug)
    return at ? [{tool: at, rel: a.relationshipType, reason: a.reason}] : []
  })
  const price = tool.pricingPlans[0]?.priceDisplay || 'Not publicly verified'
  const hasFree = tool.pricingPlans.some((p) => p.freePlan)
  const score = tool.quickVerdict?.numericScore
  const fit = tool.quickVerdict ? FIT_LABEL_TEXT[tool.quickVerdict.fitLabel] : 'Under review'
  const cmp = altTools.length ? buildComparison([tool, ...altTools.slice(0, 3).map((a) => a.tool)]) : null

  return (
    <>
      <section className="blk paper" style={{paddingTop: 0, paddingBottom: 26}}>
        <div className="toolpage">
          <div className="tback">
            <Link className="backlink" href="/">← All tools</Link>
          </div>

          {/* hero */}
          <div className="thero">
            <div>
              <div className="thero__head">
                <ToolLogo domain={tool.domain} name={tool.name} size={64} radius={16} />
                <div>
                  <span className="eyebrow">{tool.primaryCategory.name}</span>
                  <h1>{tool.name}</h1>
                </div>
              </div>
              <p className="thero__sub">{tool.oneLineDescription}</p>
              <div className="chips">
                <span className="chip-s v">✓ {fit}</span>
                <span className="chip-s cat">{tool.primaryCategory.name}</span>
                {tool.secondaryCategories.map((c) => (
                  <span className="chip-s" key={c.id}>{c.name}</span>
                ))}
                <span className="chip-s">{tool.productType === 'suite_module' ? 'Suite module' : 'Native platform'}</span>
                {hasFree && <span className="chip-s v">Free plan</span>}
              </div>
              {tool.aiConfidence && (
                <div className="rate">
                  <b style={{color: 'var(--ink)'}}>{tool.aiConfidence.aggregatePct}%</b> AI-answer confidence across{' '}
                  {tool.aiConfidence.engineScores.length} engines
                </div>
              )}
            </div>

            <aside className="qf">
              <div className="qf__score">
                <div>
                  <div className="lb">MaximusLabs verdict</div>
                  <div className="vd">{fit}</div>
                </div>
              </div>
              <dl>
                <div className="row"><dt>Entry price</dt><dd>{price}</dd></div>
                <div className="row"><dt>Free plan</dt><dd>{hasFree ? 'Yes' : 'No'}</dd></div>
                <div className="row"><dt>Type</dt><dd>{tool.productType === 'suite_module' ? 'Suite module' : 'Native'}</dd></div>
                <div className="row"><dt>Category</dt><dd style={{maxWidth: 160}}>{tool.primaryCategory.name}</dd></div>
                {tool.lastVerifiedAt && (
                  <div className="row"><dt>Last verified</dt><dd>{new Date(tool.lastVerifiedAt).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</dd></div>
                )}
              </dl>
              <div className="qf__cta">
                <a className="btn btn--sky" href={tool.officialUrl} target="_blank" rel="noreferrer">Visit {tool.domain} →</a>
                {altTools.length > 0 && <a className="btn btn--ghost" href="#compare">Compare alternatives</a>}
              </div>
            </aside>
          </div>

          {/* compact verdict strip */}
          {tool.quickVerdict?.verdictText && (
            <div className="tverdict">
              <Motif style={{position: 'absolute', right: -60, top: -70, width: 200, height: 200, opacity: 0.07, transform: 'rotate(16deg)'}} />
              {score && (
                <div className="tverdict__sc">
                  <b>{score}</b>
                  <span>/ 100</span>
                </div>
              )}
              <div className="tverdict__body">
                <span className="kicker">The MaximusLabs verdict</span>
                <p>{tool.quickVerdict.verdictText}</p>
              </div>
            </div>
          )}

          {/* what is it */}
          <section className="tsec">
            <h2>What is {tool.name}?</h2>
            <p className="lead">
              {tool.oneLineDescription} It sits in the <b>{tool.primaryCategory.name}</b> category
              {tool.secondaryCategories.length ? ` and also touches ${tool.secondaryCategories.map((c) => c.name).join(', ')}` : ''}.
            </p>
            <dl className="glance">
              <div><dt>Type</dt><dd>{tool.productType === 'suite_module' ? 'Suite module' : 'Native platform'}</dd></div>
              <div><dt>Entry price</dt><dd style={{fontSize: 15}}>{price}</dd></div>
              <div><dt>Free to start</dt><dd>{hasFree ? 'Yes' : 'No'}</dd></div>
              <div><dt>Best fit</dt><dd style={{fontSize: 15}}>{fit}</dd></div>
            </dl>
          </section>

          {/* key features */}
          {tool.capabilities.length > 0 && (
            <section className="tsec">
              <h2>Key features</h2>
              <div className="feat feat--tight">
                {tool.capabilities.map((c, i) => {
                  const v = vtagFor(c.featureStatus)
                  return (
                    <div className="fcard fcard--tight" key={i}>
                      <h4>{c.name} <span className={`vtag ${v.cls}`}>{v.label}</span></h4>
                      {c.description && <p>{c.description}</p>}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* AI confidence */}
          {tool.aiConfidence && (
            <section className="tsec" id="ai-confidence">
              <span className="kicker" style={{color: 'var(--accent)'}}>Signature analysis</span>
              <h2 style={{marginTop: 8}}>How much do AI engines trust {tool.name}?</h2>
              <p className="lead">How often and how positively each AI engine recommends this tool, next to its own claims and independent reviews.</p>
              <AIConfidence ai={tool.aiConfidence} toolName={tool.name} />
            </section>
          )}

          {/* pricing */}
          <section className="tsec">
            <h2>Pricing</h2>
            <p className="lead">From the verified inventory. Confirm exact tiers live, as they vary by region.</p>
            <div className="price">
              {tool.pricingPlans.map((p, i) => (
                <div className="pcard" key={i}>
                  <span className="pl">{p.planName}</span>
                  <div className="amt">{p.priceDisplay || 'Not publicly verified'}</div>
                  <ul style={{listStyle: 'none', margin: '12px 0 0', padding: 0, display: 'grid', gap: 8, fontSize: 13, color: 'var(--text-2)'}}>
                    <li>Model: {p.pricingModel.replace(/-/g, ' ')}</li>
                    <li>Free plan: {p.freePlan ? 'Yes' : 'No'}</li>
                    {p.thirdPartyEstimate && <li>Third-party estimate</li>}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* comparison */}
          {cmp && (
            <section className="tsec" id="compare">
              <h2>How {tool.name} compares</h2>
              {cmp.positioningNote && <p className="lead">{cmp.positioningNote}</p>}
              <ComparisonTable cmp={cmp} highlightSlug={tool.slug} />
            </section>
          )}

          {/* alternatives */}
          {altTools.length > 0 && (
            <section className="tsec">
              <h2>Alternatives to {tool.name}</h2>
              <p className="lead">The closest related tools by job. Each links to its own profile.</p>
              <div className="altgrid">
                {altTools.map(({tool: a, rel, reason}) => (
                  <Link key={a.id} className="altcard" href={`/tools/${a.slug}`}>
                    <div className="altcard__top">
                      <ToolLogo domain={a.domain} name={a.name} size={40} />
                      <div>
                        <h4>{a.name}</h4>
                        <div className="meta">{REL_LABEL[rel]}</div>
                      </div>
                    </div>
                    <p>{reason || a.oneLineDescription}</p>
                    <div className="altcard__foot">
                      <AiPill tool={a} />
                      <span>View →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {tool.faq.length > 0 && (
            <section className="tsec">
              <h2>Frequently asked questions</h2>
              <div className="faq" style={{marginTop: 14}}>
                {tool.faq.map((f, i) => (
                  <details key={i} open={i === 0}>
                    <summary>{f.question}</summary>
                    <p>{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* comments */}
          <section className="tsec">
            <h2>Comments</h2>
            <p className="lead">What teams say about {tool.name}. Sign in to add yours.</p>
            <Comments toolName={tool.name} />
          </section>

          <p className="foot-note" style={{marginTop: 22}}>
            Facts from the MaximusLabs verified inventory; AI-confidence figures are illustrative sample data pending
            a live measurement run. <Link href="/methodology" style={{color: 'var(--accent)'}}>Methodology →</Link>
          </p>
        </div>
      </section>

      {/* slim CTA */}
      <section className="blk navy" style={{paddingTop: 40, paddingBottom: 40}}>
        <Motif className="motif" style={{left: -120, bottom: -150, transform: 'rotate(-14deg)'}} />
        <div className="wrap" style={{textAlign: 'center'}}>
          <h2 className="sec" style={{maxWidth: '24ch', margin: '0 auto'}}>See how every tool scores in AI answers</h2>
          <div style={{display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap'}}>
            <Link className="btn btn--white" href="/">Browse all tools</Link>
            <a className="btn btn--sky" href={tool.officialUrl} target="_blank" rel="noreferrer">Visit {tool.name} →</a>
          </div>
        </div>
      </section>
    </>
  )
}
