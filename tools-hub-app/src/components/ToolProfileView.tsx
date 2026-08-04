import Link from 'next/link'
import type {Tool, FeatureStatus, PricingModel} from '@/lib/types'
import {FIT_LABEL_TEXT} from '@/lib/types'
import ToolLogo from './ToolLogo'
import AIConfidence from './AIConfidence'
import Comments from './Comments'
import {AiPill} from './badges'

const BILLING: Record<PricingModel, string> = {
  free: 'Free',
  freemium: 'Freemium',
  'flat-subscription': 'Subscription',
  'seat-based': 'Per seat',
  'usage-based': 'Usage-based',
  'custom-enterprise': 'Custom / enterprise',
}
const REL_LABEL: Record<string, string> = {direct: 'Direct alternative', cheaper: 'Cheaper', 'open-source': 'Open source', complementary: 'Complementary'}
const vtag = (s: FeatureStatus) =>
  s === 'verified' ? {cls: 'verified', label: 'Verified'}
  : s === 'unverified-marketing-claim' ? {cls: 'unverified', label: 'Not publicly verified'}
  : s === 'integration-dependent' ? {cls: 'suite', label: 'Integration-dependent'}
  : {cls: 'unverified', label: s.replace(/-/g, ' ')}

// fallback demo videos gathered in research (used when a tool has no videoUrl in Sanity)
const VIDEO: Record<string, string> = {'peec-ai': '1O0U0oemB84'}
function toEmbed(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|[?&]v=|embed\/)([\w-]{11})/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}

export default function ToolProfileView({tool, allTools}: {tool: Tool; allTools: Tool[]}) {
  const bySlug = new Map(allTools.map((t) => [t.slug, t]))
  const altTools = tool.alternatives.flatMap((a) => {
    const at = bySlug.get(a.toolSlug)
    return at ? [{tool: at, rel: a.relationshipType, reason: a.reason}] : []
  })
  const plan = tool.pricingPlans[0]
  const price = plan?.priceDisplay || 'Not publicly verified'
  const hasFree = tool.pricingPlans.some((p) => p.freePlan)
  const fit = tool.quickVerdict ? FIT_LABEL_TEXT[tool.quickVerdict.fitLabel] : 'Under review'
  const billing = plan ? BILLING[plan.pricingModel] : 'Subscription'
  const ease = tool.easeOfUse ?? (hasFree ? 85 : tool.productType === 'suite_module' ? 60 : 72)
  const easeLabel = ease >= 80 ? 'Easy' : ease >= 65 ? 'Moderate' : 'Advanced'
  const videoEmbed = tool.videoUrl ? toEmbed(tool.videoUrl) : VIDEO[tool.slug] ? `https://www.youtube.com/embed/${VIDEO[tool.slug]}` : null
  const ytSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${tool.name} demo walkthrough`)}`
  const tagline = tool.tagline || tool.oneLineDescription
  const icp = tool.idealCustomer || `${tool.name} fits marketing, SEO and growth teams that need ${tool.primaryCategory.name.toLowerCase()}${
    hasFree ? ', from solo operators up to agencies' : tool.productType === 'suite_module' ? ', especially existing suite customers' : ', from mid-market teams to agencies'
  }. Rated ${fit.toLowerCase()} for this job.`

  return (
    <>
      <section className="blk paper" style={{paddingTop: 0, paddingBottom: 30}}>
        <div className="tpwrap">
          <div className="tpcrumb">
            <Link href="/">Home</Link> › <Link href="/">Tools</Link> › <b>{tool.name}</b>
          </div>
          <h1 className="tptitle">{tool.name} Review</h1>

          <div className="tp">
            {/* main column */}
            <div className="tp__main">
              {/* product hero card */}
              <div className="tpcard">
                <ToolLogo domain={tool.domain} name={tool.name} size={56} radius={14} />
                <div className="tpcard__id">
                  <h2>{tool.name}</h2>
                  <p>{tagline}</p>
                </div>
                <div className="tpcard__cta">
                  <a className="btn btn--sky" href={tool.officialUrl} target="_blank" rel="noreferrer">Get started →</a>
                  <a className="tpcard__claim" href={tool.officialUrl} target="_blank" rel="noreferrer">Claim this product</a>
                </div>
              </div>

              <div className="tags">
                <span className="tag-chip cat">{tool.primaryCategory.name}</span>
                {tool.secondaryCategories.map((c) => (<span className="tag-chip" key={c.id}>{c.name}</span>))}
                <span className="tag-chip">{tool.productType === 'suite_module' ? 'Suite module' : 'Native platform'}</span>
                {hasFree && <span className="tag-chip ok">Free plan</span>}
              </div>

              {/* what is */}
              <section className="tsec tsec--flush">
                <h2>What is {tool.name}?</h2>
                <p className="lead">{tool.oneLineDescription} It sits in the <b>{tool.primaryCategory.name}</b> category{tool.secondaryCategories.length ? ` and also touches ${tool.secondaryCategories.map((c) => c.name).join(', ')}` : ''}, and MaximusLabs rates it <b>{fit.toLowerCase()}</b> for that job.</p>
                {tool.capabilities.length > 0 && (
                  <div className="capchips">
                    {tool.capabilities.slice(0, 10).map((c, i) => (<span className="capchip" key={i}>{c.name}</span>))}
                  </div>
                )}
                {videoEmbed ? (
                  <div className="video"><iframe src={videoEmbed} title={`${tool.name} demo`} allowFullScreen loading="lazy" /></div>
                ) : (
                  <a className="video video--poster" href={ytSearch} target="_blank" rel="noreferrer" aria-label={`Watch ${tool.name} walkthroughs on YouTube`}>
                    <ToolLogo domain={tool.domain} name={tool.name} size={58} radius={14} />
                    <span className="video__play">▶</span>
                    <span className="video__cap">Watch {tool.name} walkthroughs on YouTube</span>
                  </a>
                )}
              </section>

              {/* ICP */}
              <section className="tsec">
                <h2>Ideal Customer Profile</h2>
                <p className="lead">{icp}</p>
              </section>

              {/* key features */}
              {tool.capabilities.length > 0 && (
                <section className="tsec">
                  <h2>Key Features</h2>
                  <div className="kf">
                    {tool.capabilities.map((c, i) => (
                      <div className="kf__item" key={i}>
                        <span className="kf__tick">✓</span>
                        <div>
                          <b>{c.name}</b> <span className={`vtag ${vtag(c.featureStatus).cls}`}>{vtag(c.featureStatus).label}</span>
                          {c.description && <p>{c.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* AI confidence (Maximus differentiator) */}
              {tool.aiConfidence && (
                <section className="tsec" id="ai-confidence">
                  <h2>How much do AI engines trust {tool.name}?</h2>
                  <p className="lead">Our signature analysis: how often and how positively each AI engine recommends this tool, versus its own claims and independent reviews.</p>
                  <AIConfidence ai={tool.aiConfidence} toolName={tool.name} />
                </section>
              )}

              {/* pricing */}
              <section className="tsec">
                <h2>Pricing</h2>
                <p className="lead">From the verified inventory. Confirm exact tiers live, as they vary by region.</p>
                <div className="pricerow">
                  {tool.pricingPlans.map((p, i) => (
                    <div className="pricecard" key={i}>
                      <div className="pricecard__nm">{p.planName}</div>
                      <div className="pricecard__amt">{p.priceDisplay || 'Not publicly verified'}</div>
                      <ul>
                        <li>Billing: {BILLING[p.pricingModel]}</li>
                        <li>Free plan: {p.freePlan ? 'Yes' : 'No'}</li>
                        <li>Evidence: {p.verificationStatus.replace(/-/g, ' ')}</li>
                        {p.thirdPartyEstimate && <li>Third-party estimate</li>}
                      </ul>
                      <a className="btn btn--ghost" href={tool.officialUrl} target="_blank" rel="noreferrer">Get started →</a>
                    </div>
                  ))}
                </div>
              </section>

              {/* alternatives */}
              {altTools.length > 0 && (
                <section className="tsec">
                  <h2>What are {tool.name} alternatives?</h2>
                  <div className="altlist">
                    {altTools.map(({tool: a, rel, reason}) => (
                      <Link key={a.id} className="altrow" href={`/tools/${a.slug}`}>
                        <ToolLogo domain={a.domain} name={a.name} size={40} radius={11} />
                        <div className="altrow__body">
                          <div className="altrow__nm">{a.name} <span className="altrow__rel">{REL_LABEL[rel]}</span></div>
                          <p>{reason || a.oneLineDescription}</p>
                          <div className="altrow__tags">
                            <span className="tag-chip sm">Pricing: {a.pricingPlans[0]?.priceDisplay || 'n/a'}</span>
                            <span className="tag-chip sm">{a.primaryCategory.name}</span>
                          </div>
                        </div>
                        <div className="altrow__rt"><AiPill tool={a} /></div>
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
                <Comments toolName={tool.name} />
              </section>
            </div>

            {/* sticky sidebar */}
            <aside className="tp__side">
              <div className="tpx">
                <div className="tpx__eyebrow">MaximusLabs</div>
                <b>Rank everywhere people search</b>
                <p>Get cited by ChatGPT, Perplexity and Gemini. Start with a free AI-visibility scan.</p>
                <a className="btn btn--white" href="https://maximuslabs.ai" target="_blank" rel="noreferrer">Get started →</a>
              </div>

              <div className="tpbox">
                <h4>{tool.name} core capabilities</h4>
                {tool.capabilities.length ? (
                  <ul className="tplist">{tool.capabilities.slice(0, 4).map((c, i) => (<li key={i}>{c.name}</li>))}</ul>
                ) : (
                  <p className="tpbox__muted">Capabilities being verified. See the official site.</p>
                )}
              </div>

              <div className="tpbox">
                <div className="tprow"><span>Billing</span><b>{billing}</b></div>
                <div className="tprow"><span>Entry price</span><b>{price}</b></div>
                <div className="tprow"><span>Free plan</span><b>{hasFree ? 'Yes' : 'No'}</b></div>
                <div className="tprow"><span>Best fit</span><b>{fit}</b></div>
              </div>

              {tool.aiConfidence && (
                <div className="tpbox tpbox--ai">
                  <h4>AI-answer confidence</h4>
                  <div className="tpai"><b>{tool.aiConfidence.aggregatePct}%</b><span>across {tool.aiConfidence.engineScores.length} engines</span></div>
                  <a href="#ai-confidence" className="tpbox__link">See the breakdown →</a>
                </div>
              )}

              <div className="tpbox">
                <h4>Is {tool.name} easy to use?</h4>
                <div className="gauge2"><div className="gauge2__fill" style={{width: `${ease}%`}} /></div>
                <div className="gauge2__label">{easeLabel}</div>
              </div>
            </aside>
          </div>

          <p className="foot-note" style={{marginTop: 20}}>
            Facts from the MaximusLabs verified inventory; AI-confidence figures are illustrative sample data pending a live measurement run. <Link href="/methodology" style={{color: 'var(--accent)'}}>Methodology →</Link>
          </p>
        </div>
      </section>

      {/* cross-sell footer band */}
      <section className="blk navy" style={{paddingTop: 40, paddingBottom: 40}}>
        <div className="wrap" style={{textAlign: 'center'}}>
          <h2 className="sec" style={{maxWidth: '26ch', margin: '0 auto'}}>Run your whole AI-search stack with MaximusLabs</h2>
          <div style={{display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap'}}>
            <Link className="btn btn--white" href="/">Browse all tools</Link>
            <a className="btn btn--sky" href={tool.officialUrl} target="_blank" rel="noreferrer">Visit {tool.name} →</a>
          </div>
        </div>
      </section>
    </>
  )
}
