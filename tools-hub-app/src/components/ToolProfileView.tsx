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
  const cmp = altTools.length ? buildComparison([tool, ...altTools.slice(0, 3).map((a) => a.tool)]) : null

  return (
    <>
      {/* hero */}
      <section className="blk paper phero" style={{paddingTop: 0}}>
        <div className="wrap">
          <div className="crumb" style={{paddingTop: 20}}>
            <Link className="backlink" href="/">← All tools</Link>
          </div>
        </div>
        <div className="wrap phero__grid" style={{marginTop: 18}}>
          <div>
            <div className="phero__head">
              <ToolLogo domain={tool.domain} name={tool.name} size={76} radius={19} />
              <div>
                <span className="eyebrow">{tool.primaryCategory.name}</span>
                <h1>{tool.name}</h1>
              </div>
            </div>
            <p className="phero__sub">{tool.oneLineDescription}</p>
            <div className="chips">
              {tool.quickVerdict && <span className="chip-s v">✓ {FIT_LABEL_TEXT[tool.quickVerdict.fitLabel]}</span>}
              <span className="chip-s cat">{tool.primaryCategory.name}</span>
              <span className="chip-s">{tool.productType === 'suite_module' ? 'Suite module' : 'Native platform'}</span>
              {hasFree && <span className="chip-s v">Free plan</span>}
            </div>
            {tool.aiConfidence && (
              <div className="rate">
                <b style={{color: 'var(--ink)'}}>{tool.aiConfidence.aggregatePct}%</b> AI-answer confidence ·
                measured across {tool.aiConfidence.engineScores.length} engines
              </div>
            )}
          </div>

          <aside className="qf">
            <div className="qf__score">
              {score ? (
                <div className="qf__ring" style={{['--deg' as string]: `${Math.round((score / 100) * 360)}deg`} as React.CSSProperties}>
                  <b>{(score / 10).toFixed(1)}</b>
                </div>
              ) : null}
              <div>
                <div className="lb">MaximusLabs verdict</div>
                <div className="vd">{tool.quickVerdict ? FIT_LABEL_TEXT[tool.quickVerdict.fitLabel] : 'Under review'}</div>
              </div>
            </div>
            <dl>
              <div className="row"><dt>Entry price</dt><dd>{price}</dd></div>
              <div className="row"><dt>Free plan</dt><dd>{hasFree ? 'Yes' : 'No'}</dd></div>
              <div className="row"><dt>Product type</dt><dd>{tool.productType === 'suite_module' ? 'Suite module' : 'Native'}</dd></div>
              <div className="row"><dt>Category</dt><dd style={{maxWidth: 170}}>{tool.primaryCategory.name}</dd></div>
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
      </section>

      {/* verdict */}
      {tool.quickVerdict?.verdictText && (
        <section className="blk navy">
          <Motif className="motif" style={{right: -110, top: -140, transform: 'rotate(16deg)'}} />
          <div className="wrap verdict__grid">
            {score && (
              <div className="bigscore">
                <b>{score}</b>
                <span className="out">/100</span>
                <span className="lb">Overall</span>
              </div>
            )}
            <div>
              <span className="kicker">The MaximusLabs verdict</span>
              <p>{tool.quickVerdict.verdictText}</p>
            </div>
          </div>
        </section>
      )}

      {/* what it is + at a glance */}
      <section className="blk grey">
        <div className="wrap">
          <div className="hr-accent" />
          <span className="kicker">What it is</span>
          <h2 className="sec">What is {tool.name}?</h2>
          <p className="lead">
            {tool.oneLineDescription} It sits in the <b>{tool.primaryCategory.name}</b> category
            {tool.secondaryCategories.length ? ` and also touches ${tool.secondaryCategories.map((c) => c.name).join(', ')}` : ''}.
            {' '}Use the facts below to judge fit at a glance, then dig into features, pricing and alternatives.
          </p>
          <dl className="glance">
            <div><dt>Type</dt><dd>{tool.productType === 'suite_module' ? 'Suite module' : 'Native platform'}</dd></div>
            <div><dt>Entry price</dt><dd style={{fontSize: 15}}>{price}</dd></div>
            <div><dt>Free to start</dt><dd>{hasFree ? 'Yes' : 'No'}</dd></div>
            <div><dt>Best fit</dt><dd style={{fontSize: 15}}>{tool.quickVerdict ? FIT_LABEL_TEXT[tool.quickVerdict.fitLabel] : 'Under review'}</dd></div>
          </dl>
        </div>
      </section>

      {/* AI confidence */}
      {tool.aiConfidence && (
        <section className="blk tint" id="ai-confidence">
          <div className="wrap">
            <span className="kicker">Signature analysis</span>
            <h2 className="sec">How much do AI engines trust {tool.name}?</h2>
            <p className="lead">
              The analysis you won’t find on other directories: how often and how positively each AI engine
              recommends this tool, next to its own claims and independent reviews.
            </p>
            <AIConfidence ai={tool.aiConfidence} toolName={tool.name} />
          </div>
        </section>
      )}

      {/* key features */}
      <section className="blk paper">
        <div className="wrap">
          <div className="hr-accent" />
          <span className="kicker">What it does</span>
          <h2 className="sec">Key features</h2>
          {tool.capabilities.length ? (
            <div className="feat">
              {tool.capabilities.map((c, i) => {
                const v = vtagFor(c.featureStatus)
                return (
                  <div className="fcard" key={i}>
                    <h4>{c.name} <span className={`vtag ${v.cls}`}>{v.label}</span></h4>
                    {c.description && <p>{c.description}</p>}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="lead">
              Detailed, verified capabilities for {tool.name} are being documented. In the meantime, see the{' '}
              <a href={tool.officialUrl} target="_blank" rel="noreferrer" style={{color: 'var(--accent)', fontWeight: 700}}>official site</a>{' '}
              for the current feature set. We only publish capabilities once they’re source-verified.
            </p>
          )}
        </div>
      </section>

      {/* pricing */}
      <section className="blk grey">
        <div className="wrap">
          <div className="hr-accent" />
          <span className="kicker">What it costs</span>
          <h2 className="sec">Pricing</h2>
          <p className="lead">Pricing summary from the verified inventory. Confirm exact tiers live, as they vary by region.</p>
          <div className="price">
            {tool.pricingPlans.map((p, i) => (
              <div className="pcard" key={i}>
                <span className="pl">{p.planName}</span>
                <div className="amt">{p.priceDisplay || 'Not publicly verified'}</div>
                <ul style={{listStyle: 'none', margin: '12px 0 0', padding: 0, display: 'grid', gap: 8, fontSize: 13, color: 'var(--text-2)'}}>
                  <li>Model: {p.pricingModel.replace(/-/g, ' ')}</li>
                  <li>Free plan: {p.freePlan ? 'Yes' : 'No'}</li>
                  <li>Evidence: {p.verificationStatus.replace(/-/g, ' ')}</li>
                  {p.thirdPartyEstimate && <li>Third-party estimate, not vendor-published</li>}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* comparison */}
      {cmp && (
        <section className="blk paper" id="compare">
          <div className="wrap">
            <div className="hr-accent" />
            <span className="kicker">Head to head</span>
            <h2 className="sec">How {tool.name} compares</h2>
            {cmp.positioningNote && <p className="lead">{cmp.positioningNote}</p>}
            <ComparisonTable cmp={cmp} highlightSlug={tool.slug} />
            <p className="foot-note">Pricing is from the verified inventory; AI-confidence figures are illustrative sample data. Re-verify live before purchase.</p>
          </div>
        </section>
      )}

      {/* alternatives (card view) */}
      {altTools.length > 0 && (
        <section className="blk grey">
          <div className="wrap">
            <div className="hr-accent" />
            <span className="kicker">Related tools</span>
            <h2 className="sec">Alternatives to {tool.name}</h2>
            <p className="lead">The closest related tools by job. Each links to its own profile.</p>
            <div className="altgrid">
              {altTools.map(({tool: a, rel, reason}) => (
                <Link key={a.id} className="altcard" href={`/tools/${a.slug}`}>
                  <div className="altcard__top">
                    <ToolLogo domain={a.domain} name={a.name} size={42} />
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
          </div>
        </section>
      )}

      {/* FAQ */}
      {tool.faq.length > 0 && (
        <section className="blk paper">
          <div className="wrap">
            <div className="hr-accent" />
            <span className="kicker">Good to know</span>
            <h2 className="sec">Frequently asked questions</h2>
            <div className="faq" style={{marginTop: 18}}>
              {tool.faq.map((f, i) => (
                <details key={i} open={i === 0}>
                  <summary>{f.question}</summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* comments */}
      <section className="blk grey">
        <div className="wrap">
          <div className="hr-accent" />
          <span className="kicker">Community</span>
          <h2 className="sec">Comments</h2>
          <p className="lead">What teams say about {tool.name}. Sign in to add yours.</p>
          <Comments toolName={tool.name} />
        </div>
      </section>

      {/* CTA */}
      <section className="blk navy">
        <Motif className="motif" style={{left: -120, bottom: -150, transform: 'rotate(-14deg)'}} />
        <div className="wrap" style={{textAlign: 'center'}}>
          <span className="kicker">Make the AI-era decision with confidence</span>
          <h2 className="sec" style={{maxWidth: '24ch', margin: '0 auto'}}>See how every tool scores in AI answers</h2>
          <p className="lead" style={{maxWidth: '56ch', margin: '12px auto 0'}}>Browse the full directory, or let the Tool Finder match you to the right stack.</p>
          <div style={{display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22, flexWrap: 'wrap'}}>
            <Link className="btn btn--white" href="/">Browse all tools</Link>
            <a className="btn btn--sky" href={tool.officialUrl} target="_blank" rel="noreferrer">Visit {tool.name} →</a>
          </div>
        </div>
      </section>
    </>
  )
}
