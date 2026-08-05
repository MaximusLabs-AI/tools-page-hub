import Link from 'next/link'
import type {FeatureStatus, PricingModel, Tool} from '@/lib/types'
import {FIT_LABEL_TEXT} from '@/lib/types'
import ToolLogo from './ToolLogo'
import AIConfidence from './AIConfidence'
import Comments from './Comments'
import {AiPill} from './badges'
import VideoPlayer from './VideoPlayer'
import PricingRail from './PricingRail'
import {resolveProfileConfidence} from '@/lib/core/confidence'

const BILLING: Record<PricingModel, string> = {
  free: 'Free',
  freemium: 'Freemium',
  'flat-subscription': 'Subscription',
  'seat-based': 'Per seat',
  'usage-based': 'Usage-based',
  'custom-enterprise': 'Custom / enterprise',
}

const REL_LABEL: Record<string, string> = {
  direct: 'Direct alternative',
  cheaper: 'Lower-cost option',
  'open-source': 'Open source',
  complementary: 'Complementary',
}

const vtag = (status: FeatureStatus) =>
  status === 'verified'
    ? {cls: 'verified', label: 'Verified'}
    : status === 'unverified-marketing-claim'
      ? {cls: 'unverified', label: 'Not publicly verified'}
      : status === 'integration-dependent'
        ? {cls: 'suite', label: 'Integration-dependent'}
        : {cls: 'unverified', label: status.replace(/-/g, ' ')}

function youtubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|[?&]v=|embed\/)([\w-]{11})/)
  return match?.[1] || null
}

export default function ToolProfileView({tool, allTools}: {tool: Tool; allTools: Tool[]}) {
  const bySlug = new Map(allTools.map((candidate) => [candidate.slug, candidate]))
  const altTools = tool.alternatives.flatMap((alternative) => {
    const candidate = bySlug.get(alternative.toolSlug)
    return candidate
      ? [{tool: candidate, rel: alternative.relationshipType, reason: alternative.reason}]
      : []
  })

  const hasFree = tool.pricingPlans.some((plan) => plan.freePlan)
  const entryPlan = tool.pricingPlans.find((plan) => plan.freePlan) || tool.pricingPlans[0]
  const entryPrice = entryPlan?.priceDisplay || 'Not publicly verified'
  const fit = tool.quickVerdict ? FIT_LABEL_TEXT[tool.quickVerdict.fitLabel] : 'Under review'
  const billing = entryPlan ? BILLING[entryPlan.pricingModel] : 'Not published'
  const ease = tool.easeOfUse ?? 72
  const easeLabel = ease >= 80 ? 'Easy' : ease >= 65 ? 'Moderate' : 'Advanced'
  const videoId = tool.videoUrl ? youtubeId(tool.videoUrl) : null
  const tagline = tool.tagline || tool.oneLineDescription
  const overview =
    tool.overview ||
    `${tool.oneLineDescription} It sits in the ${tool.primaryCategory.name} category, and MaximusLabs rates it ${fit.toLowerCase()} for that job.`
  const icp =
    tool.idealCustomer ||
    `${tool.name} fits marketing, SEO, and growth teams that need ${tool.primaryCategory.name.toLowerCase()}.`
  const setup =
    tool.setupSummary ||
    `Start with one representative project and validate the output against a real workflow before expanding coverage.`
  const confidence = resolveProfileConfidence(tool)
  const confidenceIsEstimate = confidence.dataStatus === 'estimated'

  return (
    <>
      <section className="blk paper tool-profile">
        <div className="tpwrap">
          <nav className="tpcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/#directory">Tools</Link>
            <span>›</span>
            <b>{tool.name}</b>
          </nav>

          <div className="tp">
            <main className="tp__main">
              <div className="tpcard">
                <ToolLogo domain={tool.domain} name={tool.name} size={64} radius={16} />
                <div className="tpcard__id">
                  <span className="tpcard__eyebrow">{tool.primaryCategory.name}</span>
                  <h1>{tool.name}</h1>
                  <p>{tagline}</p>
                </div>
                <div className="tpcard__cta">
                  <a className="btn btn--sky" href={tool.officialUrl} target="_blank" rel="noreferrer">
                    Visit official site →
                  </a>
                </div>
              </div>

              <div className="tags">
                <span className="tag-chip cat">{tool.primaryCategory.name}</span>
                {tool.secondaryCategories.map((category) => (
                  <span className="tag-chip" key={category.id}>{category.name}</span>
                ))}
                <span className="tag-chip">{tool.productType === 'suite_module' ? 'Suite module' : 'Native platform'}</span>
                {hasFree && <span className="tag-chip ok">Permanent free option</span>}
                {tool.lastVerifiedAt && <span className="tag-chip">Checked Aug 2026</span>}
              </div>

              <section className="tsec tsec--flush">
                <div className="tsec__head">
                  <span className="section-kicker">Product overview</span>
                  <h2>What is {tool.name}?</h2>
                </div>
                <p className="lead lead--rich">{overview}</p>
                <div className="capchips">
                  {tool.capabilities.slice(0, 10).map((capability) => (
                    <span className="capchip" key={capability.name}>{capability.name}</span>
                  ))}
                </div>

                {videoId ? (
                  <div className="video-wrap">
                    <VideoPlayer
                      videoId={videoId}
                      title={tool.videoTitle || `${tool.name} product overview`}
                    />
                    <div className="video-meta">
                      <div>
                        <span className={`video-meta__badge${tool.videoOfficial ? ' official' : ''}`}>
                          {tool.videoOfficial ? 'Vendor-published intro' : 'Independently published overview'}
                        </span>
                        <b>{tool.videoTitle || `${tool.name} overview`}</b>
                        {tool.videoPublisher && <span>Published by {tool.videoPublisher}</span>}
                      </div>
                      <a href={tool.videoSourceUrl || tool.videoUrl} target="_blank" rel="noreferrer">
                        Verify on YouTube ↗
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="official-preview">
                    <div className="official-preview__bar">
                      <span aria-hidden="true"><i /><i /><i /></span>
                      <b>{tool.domain}</b>
                    </div>
                    <div className="official-preview__body">
                      <ToolLogo domain={tool.domain} name={tool.name} size={60} radius={15} />
                      <div className="official-preview__copy">
                        <span className="section-kicker">Official product website</span>
                        <h3>Explore {tool.name} at the source</h3>
                        <p>
                          No exact vendor-published intro video was found, so this profile links directly to the
                          official product page instead of showing an unrelated tutorial.
                        </p>
                        <div className="official-preview__chips">
                          {tool.capabilities.slice(0, 3).map((capability) => (
                            <span key={capability.name}>{capability.name}</span>
                          ))}
                        </div>
                      </div>
                      <a className="btn btn--sky" href={tool.officialUrl} target="_blank" rel="noreferrer">
                        Visit {tool.name} →
                      </a>
                    </div>
                  </div>
                )}
              </section>

              <section className="tsec">
                <div className="tsec__head">
                  <span className="section-kicker">Best fit</span>
                  <h2>Who is {tool.name} for?</h2>
                </div>
                <p className="lead lead--rich">{icp}</p>
              </section>

              <section className="tsec">
                <div className="tsec__head">
                  <span className="section-kicker">Capabilities</span>
                  <h2>Key features</h2>
                </div>
                <div className="kf">
                  {tool.capabilities.map((capability) => {
                    const tag = vtag(capability.featureStatus)
                    return (
                      <article className="kf__item" key={capability.name}>
                        <span className="kf__tick">✓</span>
                        <div>
                          <div className="kf__title">
                            <b>{capability.name}</b>
                            <span className={`vtag ${tag.cls}`}>{tag.label}</span>
                          </div>
                          {capability.description && <p>{capability.description}</p>}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>

              <section className="tsec">
                <div className="tsec__head">
                  <span className="section-kicker">Decision support</span>
                  <h2>Benefits and trade-offs</h2>
                </div>
                <div className="proscons">
                  <div className="proscons__card proscons__card--pros">
                    <h3>Where {tool.name} is strongest</h3>
                    <ul>{tool.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div className="proscons__card">
                    <h3>What to validate first</h3>
                    <ul>{tool.limitations.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                </div>
              </section>

              <section className="tsec" id="ai-confidence">
                <div className="tsec__head">
                  <span className="section-kicker">MaximusLabs analysis</span>
                  <h2>
                    {confidenceIsEstimate
                      ? `How confident is the evidence for ${tool.name}?`
                      : `How much do AI engines trust ${tool.name}?`}
                  </h2>
                </div>
                <p className="lead">
                  {confidenceIsEstimate
                    ? 'A transparent editorial score based on verified capabilities, official pricing sources, profile depth, and evidence recency.'
                    : 'A transparent comparison of AI recommendations, product claims, and independent web evidence.'}
                </p>
                <AIConfidence ai={confidence} toolName={tool.name} />
              </section>

              <section className="tsec" id="pricing">
                <div className="tsec__head tsec__head--split">
                  <div>
                    <span className="section-kicker">Plans and inclusions</span>
                    <h2>{tool.name} pricing</h2>
                  </div>
                  <span className="price-checked">Checked August 4, 2026</span>
                </div>
                <p className="lead">
                  Free, paid, usage-based, and enterprise options are shown separately. Prices can vary by billing term, currency, usage, and region.
                </p>
                <PricingRail count={tool.pricingPlans.length} label={tool.name}>
                  {tool.pricingPlans.map((plan) => (
                    <article
                      className={`pricecard${plan.popular ? ' pricecard--popular' : ''}${plan.freePlan ? ' pricecard--free' : ''}`}
                      key={plan.planName}
                    >
                      {(plan.popular || plan.freePlan) && (
                        <span className="pricecard__flag">{plan.freePlan ? 'Free option' : 'Most popular'}</span>
                      )}
                      <div className="pricecard__nm">{plan.planName}</div>
                      <div className="pricecard__amt">{plan.priceDisplay || 'Not publicly verified'}</div>
                      {plan.bestFor && <p className="pricecard__best">Best for: {plan.bestFor}</p>}
                      {plan.description && <p>{plan.description}</p>}
                      <ul className="pricecard__features">
                        {(plan.features || []).map((feature) => <li key={feature}>{feature}</li>)}
                      </ul>
                      <div className="pricecard__meta">
                        <span>{BILLING[plan.pricingModel]}</span>
                        {plan.freeTrial && <span>Trial available</span>}
                        <span>{plan.verificationStatus.replace(/-/g, ' ')}</span>
                      </div>
                      <a
                        className="btn btn--ghost"
                        href={plan.sourceUrl || tool.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Check official plan →
                      </a>
                    </article>
                  ))}
                </PricingRail>
              </section>

              <section className="tsec">
                <div className="tsec__head">
                  <span className="section-kicker">Implementation</span>
                  <h2>Setup and onboarding</h2>
                </div>
                <div className="setup-card">
                  <span className="setup-card__num">01</span>
                  <div>
                    <h3>Start with one real workflow</h3>
                    <p>{setup}</p>
                  </div>
                </div>
              </section>

              {altTools.length > 0 && (
                <section className="tsec">
                  <div className="tsec__head">
                    <span className="section-kicker">Compare before buying</span>
                    <h2>Best {tool.name} alternatives</h2>
                  </div>
                  <div className="altlist">
                    {altTools.map(({tool: alternative, rel, reason}) => (
                      <Link key={alternative.id} className="altrow" href={`/tools/${alternative.slug}`}>
                        <ToolLogo domain={alternative.domain} name={alternative.name} size={44} radius={11} />
                        <div className="altrow__body">
                          <div className="altrow__nm">
                            {alternative.name}
                            <span className="altrow__rel">{REL_LABEL[rel]}</span>
                          </div>
                          <p>{reason || alternative.oneLineDescription}</p>
                          <div className="altrow__tags">
                            <span className="tag-chip sm">From {alternative.pricingPlans[0]?.priceDisplay || 'n/a'}</span>
                            <span className="tag-chip sm">{alternative.primaryCategory.name}</span>
                          </div>
                        </div>
                        <div className="altrow__rt"><AiPill tool={alternative} /></div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {tool.faq.length > 0 && (
                <section className="tsec">
                  <div className="tsec__head">
                    <span className="section-kicker">Plain answers</span>
                    <h2>Frequently asked questions</h2>
                  </div>
                  <div className="faq">
                    {tool.faq.map((item, index) => (
                      <details key={item.question} open={index === 0}>
                        <summary>{item.question}</summary>
                        <p>{item.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              <section className="tsec">
                <div className="tsec__head">
                  <span className="section-kicker">Community notes</span>
                  <h2>Comments</h2>
                </div>
                <Comments toolName={tool.name} />
              </section>
            </main>

            <aside className="tp__side">
              <div className="tpx">
                <div className="tpx__eyebrow">MaximusLabs</div>
                <b>Rank everywhere people search</b>
                <p>Get cited by ChatGPT, Perplexity, and Gemini. Start with a free AI-visibility scan.</p>
                <a className="btn btn--white" href="https://maximuslabs.ai" target="_blank" rel="noreferrer">
                  Get started →
                </a>
              </div>

              <div className="tpbox">
                <h3>{tool.name} at a glance</h3>
                <div className="tprow"><span>Entry</span><b>{entryPrice}</b></div>
                <div className="tprow"><span>Billing</span><b>{billing}</b></div>
                <div className="tprow"><span>Free plan</span><b>{hasFree ? 'Yes' : 'No'}</b></div>
                <div className="tprow"><span>Best fit</span><b>{fit}</b></div>
                <a className="tpbox__link" href="#pricing">See every plan →</a>
              </div>

              <div className="tpbox">
                <h3>Core capabilities</h3>
                <ul className="tplist">
                  {tool.capabilities.slice(0, 5).map((capability) => <li key={capability.name}>{capability.name}</li>)}
                </ul>
              </div>

              <div className="tpbox tpbox--ai">
                <h3>{confidenceIsEstimate ? 'Evidence confidence' : 'AI-answer confidence'}</h3>
                <div className="tpai">
                  <b>{confidence.aggregatePct}%</b>
                  <span>
                    {confidenceIsEstimate
                      ? 'editorial evidence estimate'
                      : `across ${confidence.engineScores.length} engines`}
                  </span>
                </div>
                <a href="#ai-confidence" className="tpbox__link">See the breakdown →</a>
              </div>

              <div className="tpbox">
                <h3>Is {tool.name} easy to use?</h3>
                <div className="gauge2"><div className="gauge2__fill" style={{width: `${ease}%`}} /></div>
                <div className="gauge2__label">{easeLabel}</div>
              </div>
            </aside>
          </div>

          <p className="foot-note">
            Product facts and prices were checked against linked official sources. Video attribution is shown explicitly.
            Peec AI confidence remains illustrative until a live measurement run is connected. Other profile
            confidence scores are editorial evidence estimates, not live AI-engine measurements.{' '}
            <Link href="/methodology">Methodology →</Link>
          </p>
        </div>
      </section>

      <section className="blk navy profile-footer">
        <div className="wrap">
          <span className="section-kicker section-kicker--light">Keep comparing</span>
          <h2 className="sec">Build an AI-search stack around the job—not the logo.</h2>
          <div className="profile-footer__actions">
            <Link className="btn btn--white" href="/#directory">Browse all tools</Link>
            <a className="btn btn--sky" href={tool.officialUrl} target="_blank" rel="noreferrer">
              Visit {tool.name} →
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
