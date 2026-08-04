import type {Metadata} from 'next'

export const metadata: Metadata = {title: 'Methodology & evidence standards'}

export default function MethodologyPage() {
  return (
    <section className="blk paper">
      <div className="wrap" style={{maxWidth: 820}}>
        <span className="kicker">How this directory works</span>
        <h1 className="sec" style={{fontSize: 38}}>Methodology &amp; evidence standards</h1>
        <p className="lead">
          Every tool is verified against primary sources, tagged by category and job-to-be-done, and scored for
          how confidently today’s AI engines recommend it. Where a claim can’t be verified, we label it rather
          than guess.
        </p>
        <h3 style={{marginTop: 28}}>Evidence &amp; verification</h3>
        <p className="lead">
          Facts trace to a tiered source hierarchy (official sources first). A claim is <b>Verified</b> only with
          two or more independent sources, <b>Partially verified</b> with one, and <b>Not publicly verified</b>{' '}
          otherwise. Pricing is re-checked monthly for the top tools; features quarterly.
        </p>
        <h3 style={{marginTop: 28}}>Fit labels, not hype</h3>
        <p className="lead">
          Rankings lead with qualitative fit labels (Best fit, Strong fit, Conditional fit, Weak fit,
          Insufficient evidence). The same tool can be a Best fit for one buyer and a Weak fit for another. No
          vendor can purchase a fit label.
        </p>
        <h3 style={{marginTop: 28}}>AI Answer Confidence</h3>
        <p className="lead">
          Our signature score measures how often and how positively AI engines recommend a tool for a specific
          job, against the tool’s own claims and independent reviews. These figures are currently{' '}
          <b>illustrative sample data</b> and are labeled as such until wired to a live prompt-panel measurement
          run.
        </p>
      </div>
    </section>
  )
}
