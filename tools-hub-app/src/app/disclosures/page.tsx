import type {Metadata} from 'next'

export const metadata: Metadata = {title: 'Sponsorship & affiliate disclosures'}

export default function DisclosuresPage() {
  return (
    <section className="blk paper">
      <div className="wrap" style={{maxWidth: 820}}>
        <span className="kicker">Trust &amp; transparency</span>
        <h1 className="sec" style={{fontSize: 38}}>Sponsorship &amp; affiliate disclosures</h1>
        <p className="lead">
          Sponsored placements are visually labeled “Sponsored,” physically separated from organic rankings, and
          structurally blocked from affecting any ranking score. No vendor can purchase a fit label or a higher
          AI-confidence score.
        </p>
        <p className="lead">
          Affiliate links, where present, carry a visible above-the-fold disclosure. Vendor-submitted corrections
          require independent corroboration before acceptance, so a paid relationship can never inflate a tool’s
          claims or remove a documented limitation.
        </p>
      </div>
    </section>
  )
}
