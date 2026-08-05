import type {Metadata} from 'next'

export const metadata: Metadata = {title: 'Methodology & evidence standards'}

export default function MethodologyPage() {
  return (
    <section className="blk paper">
      <div className="wrap" style={{maxWidth: 820}}>
        <span className="kicker">How this directory works</span>
        <h1 className="sec" style={{fontSize: 38}}>Methodology &amp; evidence standards</h1>
        <p className="lead">
          Every tool is checked against recorded sources, tagged by category and job-to-be-done, and audited for
          evidence coverage. Where a claim cannot be traced, we reduce the score and show the gap rather than
          guessing.
        </p>
        <h3 style={{marginTop: 28}}>Evidence &amp; verification</h3>
        <p className="lead">
          Facts follow a tiered hierarchy: official product and pricing sources first, then publisher-owned videos,
          then independent evidence. Pricing and profile checks lose freshness points automatically as their dates
          age. A missing claim-level or independent citation can never receive full evidence credit.
        </p>
        <h3 style={{marginTop: 28}}>Evidence coverage score</h3>
        <p className="lead">
          The visible score is deterministic: feature evidence contributes 30%, pricing evidence 25%,
          decision-support depth 25%, and source breadth plus recency 20%. The score measures how much of our
          evidence rubric is supported. It is <b>not</b> a product-quality rating, a predicted outcome, or proof
          that one tool is better than another.
        </p>
        <p className="lead">
          A dimension reaches 100% only when every required input is present. For pricing, that means complete
          plan records, a current plan-specific official source, and a separately recorded corroboration link.
          Official-source-only pricing can score highly, but it does not receive the corroboration points.
        </p>
        <h3 style={{marginTop: 28}}>Fit labels, not hype</h3>
        <p className="lead">
          Rankings lead with qualitative fit labels (Best fit, Strong fit, Conditional fit, Weak fit,
          Insufficient evidence). The same tool can be a Best fit for one buyer and a Weak fit for another. No
          vendor can purchase a fit label.
        </p>
        <h3 style={{marginTop: 28}}>AI Answer Confidence</h3>
        <p className="lead">
          AI recommendation scores are displayed only when a live, reproducible prompt-panel dataset is connected.
          Illustrative sample data is excluded from tool pages and does not affect the evidence audit.
        </p>
      </div>
    </section>
  )
}
