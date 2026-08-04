import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="blk paper">
      <div className="wrap" style={{textAlign: 'center', padding: '40px 0'}}>
        <span className="kicker">404</span>
        <h1 className="sec" style={{fontSize: 40}}>We couldn’t find that page</h1>
        <p className="lead" style={{margin: '12px auto 24px'}}>
          The tool or category may have moved. Try browsing the directory or searching instead.
        </p>
        <div style={{display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link className="btn btn--primary" href="/tools">Browse all tools</Link>
          <Link className="btn btn--ghost" href="/search">Search</Link>
        </div>
      </div>
    </section>
  )
}
