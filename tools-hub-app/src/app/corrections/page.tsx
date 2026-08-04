import type {Metadata} from 'next'

export const metadata: Metadata = {title: 'Report an error'}

export default function CorrectionsPage() {
  return (
    <section className="blk paper">
      <div className="wrap" style={{maxWidth: 640}}>
        <span className="kicker">Help us stay accurate</span>
        <h1 className="sec" style={{fontSize: 38}}>Report an error</h1>
        <p className="lead">
          Spotted a stale price or a wrong detail? Tell us and include a source. Submissions are reviewed by a
          research analyst before any data changes. (This form is a local demo and does not submit anywhere yet.)
        </p>
        <form style={{display: 'grid', gap: 12, marginTop: 8}} action="/corrections" method="get">
          <input className="select" name="tool" placeholder="Tool name" style={{padding: 12}} />
          <input className="select" name="field" placeholder="What’s wrong (e.g. price)" style={{padding: 12}} />
          <input className="select" name="correct" placeholder="Correct value" style={{padding: 12}} />
          <input className="select" name="source" placeholder="Source URL" style={{padding: 12}} />
          <button className="btn btn--primary" type="button" style={{justifySelf: 'start'}}>
            Submit correction
          </button>
        </form>
      </div>
    </section>
  )
}
