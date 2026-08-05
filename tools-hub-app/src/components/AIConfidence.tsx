import type {AiConfidence} from '@/lib/types'
import {AI_ENGINE_LABELS} from '@/lib/types'
import {Motif} from './Logo'
import Favicon from './Favicon'

const EVIDENCE_BAND_LABEL = {
  strong: 'Strong evidence coverage',
  good: 'Good evidence coverage',
  partial: 'Partial evidence coverage',
  limited: 'Limited evidence coverage',
} as const

function EvidenceConfidence({ai, toolName}: {ai: AiConfidence; toolName: string}) {
  const deg = `${Math.round((ai.aggregatePct / 100) * 360)}deg`
  const breakdown =
    ai.evidenceBreakdown ??
    ai.dimensions.map((dimension) => ({
      name: dimension.name,
      scorePct: dimension.webVerifiedPct,
      weightPct: 25,
      note: 'Coverage calculated from the evidence recorded in this profile.',
    }))
  const band =
    ai.evidenceBand ??
    (ai.aggregatePct >= 85
      ? 'strong'
      : ai.aggregatePct >= 70
        ? 'good'
        : ai.aggregatePct >= 55
          ? 'partial'
          : 'limited')

  return (
    <div className="mod mod--evidence">
      <Motif className="motif a" />
      <Motif className="motif b" />
      <div className="mod__head">
        <div>
          <span className="kicker">Evidence audit</span>
          <h2>{toolName} evidence coverage</h2>
        </div>
        <span className="methodpill">Deterministic source audit</span>
      </div>
      <p className="mod__sub">
        This score measures how much of the profile is supported by traceable and recent evidence. It does not
        rate product quality, predict results, or mean that a higher-scoring tool is the better choice.
      </p>

      <div className="gaugewrap">
        <div className="gauge" style={{['--deg' as string]: deg} as React.CSSProperties}>
          <div className="gauge__val">
            <b>{ai.aggregatePct}%</b>
            <span>evidence coverage</span>
          </div>
        </div>
        <div>
          <p className="lead">
            <b>{EVIDENCE_BAND_LABEL[band]}.</b> The profile earned {ai.aggregatePct} of 100 available evidence
            points across the weighted rubric below.
          </p>
          <div className="evidence-meaning">
            <span><b>It means:</b> more claims can be checked from recorded sources.</span>
            <span><b>It does not mean:</b> {toolName} is {ai.aggregatePct}% good or best in its category.</span>
          </div>
        </div>
      </div>

      <div className="evidence-grid">
        {breakdown.map((dimension) => (
          <article className="evidence-card" key={dimension.name}>
            <div className="evidence-card__head">
              <b>{dimension.name}</b>
              <strong>{dimension.scorePct}%</strong>
            </div>
            <div className="track">
              <div
                className="bar__fill bar__fill--web"
                style={{width: `${dimension.scorePct}%`}}
              />
            </div>
            <p>{dimension.note}</p>
            <span className="evidence-card__weight">{dimension.weightPct}% of total score</span>
          </article>
        ))}
      </div>

      {(ai.evidenceSources?.length ?? 0) > 0 && (
        <div className="evidence-sources">
          <div>
            <span className="kicker">Recorded sources</span>
            <p>Open the exact product, pricing, and publisher-owned video pages used by this profile.</p>
          </div>
          <div className="evidence-sources__links">
            {ai.evidenceSources!.map((source) => (
              <a key={`${source.kind}-${source.url}`} href={source.url} target="_blank" rel="noreferrer">
                {source.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="srcline">
        <b>Method:</b> {ai.methodologyNote}
      </div>
    </div>
  )
}

/** The signature "AI Answer Confidence" module. Bars render at final width. */
export default function AIConfidence({ai, toolName}: {ai: AiConfidence; toolName: string}) {
  if (ai.dataStatus === 'estimated') return <EvidenceConfidence ai={ai} toolName={toolName} />

  const deg = `${Math.round((ai.aggregatePct / 100) * 360)}deg`
  return (
    <div className="mod">
      <Motif className="motif a" />
      <Motif className="motif b" />
      <div className="mod__head">
        <div>
          <span className="kicker">🔬 AI Answer Confidence</span>
          <h2>
            {toolName} for “{ai.jobContext}”
          </h2>
        </div>
        {ai.dataStatus === 'illustrative' && <span className="methodpill">ⓘ Illustrative sample data</span>}
      </div>
      <p className="mod__sub">
        How confident are the AI engines that {toolName} is right for “{ai.jobContext}”? We prompt each engine,
        measure how often and how positively it recommends the tool, then compare that with the tool’s own claims
        and independent reviews.
      </p>

      <div className="gaugewrap" style={{marginTop: 20}}>
        <div className="gauge" style={{['--deg' as string]: deg} as React.CSSProperties}>
          <div className="gauge__val">
            <b>{ai.aggregatePct}%</b>
            <span>AI confidence</span>
          </div>
        </div>
        <div>
          <p className="lead">
            Across {ai.engineScores.length} engines, AI answers recommend {toolName} with{' '}
            <b>{ai.aggregatePct}% aggregate confidence</b>.
          </p>
          <div className="legend">
            <span><i style={{background: 'var(--sky)'}} />AI-stated confidence</span>
            <span><i style={{background: '#34d399'}} />Web-verified</span>
            <span><i style={{background: '#fbbf24'}} />Website self-claim</span>
          </div>
        </div>
      </div>

      <div className="engines">
        {ai.engineScores.map((e) => (
          <div className="eng" key={e.engine}>
            <div className="eng__name">
              <span className="eng__ic">
                <Favicon domain={AI_ENGINE_LABELS[e.engine].domain} />
              </span>{' '}
              {AI_ENGINE_LABELS[e.engine].label}
            </div>
            <div className="track">
              <div className="bar__fill" style={{width: `${e.confidencePct}%`}} />
            </div>
            <div className="eng__rt">
              <b>{e.confidencePct}%</b>
              <span>{e.mentionRate}% of answers</span>
            </div>
          </div>
        ))}
      </div>

      <div className="sot">
        {ai.sourcesOfTruth.map((s) => {
          const tag = s.kind === 'website' ? 'tag--self' : s.kind === 'ai-consensus' ? 'tag--ai' : 'tag--web'
          const label =
            s.kind === 'website' ? 'Website claims' : s.kind === 'ai-consensus' ? 'AI consensus' : 'Web reviews'
          const bg =
            s.kind === 'website'
              ? 'linear-gradient(90deg,#b7791f,#fbbf24)'
              : s.kind === 'web-reviews'
                ? 'linear-gradient(90deg,#0f8b5f,#34d399)'
                : 'var(--grad-bar-2)'
          return (
            <div className="sotcard" key={s.kind}>
              <h4>
                <span className={`tag ${tag}`}>{label}</span>
              </h4>
              <p>“{s.claim}”</p>
              <div className="conf">
                <b>{s.confidencePct}%</b>
                <div className="track">
                  <div className="bar__fill" style={{width: `${s.confidencePct}%`, background: bg}} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {ai.dimensions.length > 0 && (
        <div className="dims">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
            <h3 style={{color: '#fff', fontSize: 16}}>Feature confidence: AI-stated vs web-verified</h3>
            <span style={{fontSize: 12, color: '#9fc3f5'}}>
              <i style={{display: 'inline-block', width: 9, height: 9, borderRadius: 2, background: 'var(--sky)', marginRight: 5}} />
              AI{' '}
              <i style={{display: 'inline-block', width: 9, height: 9, borderRadius: 2, background: '#34d399', margin: '0 5px 0 8px'}} />
              Web
            </span>
          </div>
          {ai.dimensions.map((d) => (
            <div className="dim" key={d.name}>
              <div className="dim__name">{d.name}</div>
              <div className="dim__bars">
                <div className="dim__row">
                  <span>AI</span>
                  <div className="track"><div className="bar__fill bar__fill--ai" style={{width: `${d.aiStatedPct}%`}} /></div>
                  <b>{d.aiStatedPct}</b>
                </div>
                <div className="dim__row">
                  <span>Web</span>
                  <div className="track"><div className="bar__fill bar__fill--web" style={{width: `${d.webVerifiedPct}%`}} /></div>
                  <b>{d.webVerifiedPct}</b>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {ai.citations.length > 0 && (
        <div style={{marginTop: 24}}>
          <span className="kicker" style={{color: 'var(--sky)'}}>Sources the AI cited</span>
          <div className="cites">
            {ai.citations.map((c) => (
              <span className="cite" key={c.domain}>{c.domain}</span>
            ))}
          </div>
        </div>
      )}

      <div className="srcline">
        <b>Source:</b> {ai.methodologyNote}
        {ai.dataStatus === 'illustrative' && <b> Not yet wired to live data.</b>}
      </div>
    </div>
  )
}
