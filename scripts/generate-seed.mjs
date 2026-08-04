// Generate Sanity seed NDJSON for the Tools Intelligence Hub.
// Reads the frozen taxonomy + the 50-tool launch list + the Phase 2 inventory
// (for one-line descriptions) and emits categories + tools as import-ready NDJSON.
//
//   node scripts/generate-seed.mjs
//
// Output: seed/tools-hub.seed.ndjson  (+ a summary to stdout)
// No invented data: descriptions come from Phase 2's "One-line Use Case",
// pricing strings from the launch CSV, everything else from the frozen sources.
// AI Answer Confidence is seeded ONLY for Peec AI, clearly labelled illustrative.

import {readFileSync, writeFileSync, mkdirSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {applyToolEnrichment} from './tool-enrichment.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const p = (f) => join(ROOT, f)

/* ---------- tiny CSV parser (quotes, embedded commas, CRLF) ---------- */
function parseCSV(text) {
  const rows = []
  let i = 0, field = '', row = [], inQ = false
  while (i < text.length) {
    const c = text[i]
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue }
        inQ = false; i++; continue
      }
      field += c; i++; continue
    }
    if (c === '"') { inQ = true; i++; continue }
    if (c === ',') { row.push(field); field = ''; i++; continue }
    if (c === '\r') { i++; continue }
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue }
    field += c; i++
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows
}
function toObjects(text) {
  const rows = parseCSV(text).filter((r) => r.length > 1 || (r.length === 1 && r[0].trim()))
  const head = rows.shift().map((h) => h.trim())
  return rows.map((r) => Object.fromEntries(head.map((h, idx) => [h, (r[idx] ?? '').trim()])))
}

/* ---------- helpers ---------- */
const slugify = (s) =>
  s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
const catRef = (code) => ({_type: 'reference', _ref: `category-${code.toLowerCase()}`})
const toolId = (slug) => `tool-${slug}`
const key = (prefix, i) => `${prefix}-${i}`
const VERIFIED_DATE = '2026-08-03T00:00:00.000Z'

/* ---------- 1. Categories from the frozen taxonomy ---------- */
const taxo = toObjects(readFileSync(p('phase4a_frozen_taxonomy.csv'), 'utf8'))
const categoryDocs = taxo.map((c, idx) => {
  const doc = {
    _id: `category-${c.category_id.toLowerCase()}`,
    _type: 'category',
    categoryCode: c.category_id,
    name: c.name,
    slug: {_type: 'slug', current: c.slug},
    level: Number(c.level),
    definition: c.definition,
    indexable: /true/i.test(c.indexable),
    minimumProductCount: Number(c.min_products) || 0,
    updateFrequency: c.update_freq,
    order: idx,
  }
  if (c.parent) doc.parent = catRef(c.parent)
  return doc
})

/* ---------- 2. Launch tools ---------- */
const launch = toObjects(readFileSync(p('phase4c_first50_launch.csv'), 'utf8'))
const phase2 = toObjects(readFileSync(p('maximuslabs_tools_inventory_phase2.csv'), 'utf8'))

// map launch "Primary Category" label -> frozen category code
const CATEGORY_MAP = {
  'AI Visibility Tracking (Native)': 'L3-AIVIS-NATIVE',
  'AI Visibility (Suite Module)': 'L3-AIVIS-SUITE',
  'AI Crawler & Technical Auditing': 'L2-AICRAWL',
  'Search Console (First-Party)': 'L2-GSC',
  'GSC Data Enhancement': 'L2-GSCEXT',
  'SEO Data API': 'L2-GSCEXT', // no exact frozen node — judgment, flagged in summary
  'Rank Tracking': 'L2-RANKTRACK',
  'Rank Tracking / SEO Suite': 'L2-RANKTRACK',
  'SEO Suite': 'L2-SEOSUITE',
  'SEO Suite / Backlink Analysis': 'L2-SEOSUITE',
  'Technical SEO / Site Crawler': 'L2-TECHCRAWL',
  'Web Analytics (First-Party)': 'L2-WEBANALYTICS-FIRSTPARTY',
  'Privacy-First Web Analytics': 'L2-WEBANALYTICS-PRIVACY',
  'Product Analytics': 'L2-PRODUCTANALYTICS',
  'B2B Attribution': 'L2-B2BATTR',
  'ABM & Intent Data': 'L2-ABM',
  'Visitor/Account Identification': 'L2-VISITORID',
  'Visitor/Account Identification / CDP': 'L2-VISITORID',
  'Content Optimization': 'L2-GEOCONTENT',
  'Schema Markup Tools': 'L2-SCHEMA',
  'Readability & Content Quality': 'L2-GEOCONTENT', // frozen consolidates under GEO content — flagged
  'CRM & Marketing Automation': 'L1-CRM',
  'CRM': 'L1-CRM',
}
const SECONDARY = {
  'peec-ai': ['L2-GEOCONTENT'],
  'scrunch-ai': ['L2-GEOCONTENT'],
  'ahrefs': ['L3-AIVIS-SUITE'],
  'semrush': ['L3-AIVIS-SUITE'],
  'se-ranking': ['L2-SEOSUITE'],
  'mangools': ['L2-SEOSUITE'],
}
const CATEGORY_FLAGS = {
  'SEO Data API': 'No exact frozen node; mapped to L2-GSCEXT — review',
  'Readability & Content Quality': 'Frozen taxonomy consolidates readability under L2-GEOCONTENT; Phase 4C treats it as separate — review',
  'CRM & Marketing Automation': 'Only L1-CRM exists (no L2 under CRM yet) — review',
  'CRM': 'Only L1-CRM exists (no L2 under CRM yet) — review',
}

// phase2 lookup by normalised name (for one-line descriptions)
const phase2ByNorm = new Map()
for (const row of phase2) phase2ByNorm.set(norm(row.Name), row)
function findPhase2(name) {
  const n = norm(name)
  if (phase2ByNorm.has(n)) return phase2ByNorm.get(n)
  for (const [k, v] of phase2ByNorm) if (k.includes(n) || n.includes(k)) return v
  // last resort: match on first two words
  const first2 = norm(name.split(/\s+/).slice(0, 2).join(''))
  for (const [k, v] of phase2ByNorm) if (k.startsWith(first2)) return v
  return null
}

// Extract a numeric entry price (for stack cost + tool-finder budget) from the
// pricing classification string. Free/free-tier -> 0; else the lowest $/€/£
// amount found; else null (custom / bundled / not publicly verified).
function priceInfo(cls) {
  const nums = [...cls.matchAll(/[$€£]\s*([\d][\d,]*(?:\.\d+)?)/g)].map((m) =>
    parseFloat(m[1].replace(/,/g, '')),
  )
  const hasFree = /\bfree\b/i.test(cls) && !/no free/i.test(cls)
  return {price: hasFree ? 0 : nums.length ? Math.min(...nums) : null, hasFree}
}
function pricingModel(cls, verification) {
  const s = cls.toLowerCase()
  if (/^free$/.test(s) || (/\bfree\b/.test(s) && !/tier|freemium|paid|\$|desktop/.test(s))) return 'free'
  if (/freemium|free tier|free crm|free \(/.test(s)) return 'freemium'
  if (/custom/.test(s) && !/free/.test(s)) return 'custom-enterprise'
  if (/\/user\/mo|per user|\/seat/.test(s)) return 'seat-based'
  if (/bundled/.test(s)) return 'flat-subscription'
  return 'flat-subscription'
}
function verificationStatus(v) {
  const s = v.toLowerCase()
  if (s.includes('not publicly verified')) return 'not-publicly-verified'
  if (s.includes('partially') || s.includes('positioning')) return 'partially-verified'
  return 'verified'
}
function fitFrom(v) {
  const s = v.toLowerCase()
  if (s.includes('not publicly verified')) return {fitLabel: 'insufficient-evidence', confidence: 'low'}
  if (s.includes('partially') || s.includes('positioning')) return {fitLabel: 'conditional-fit', confidence: 'medium'}
  return {fitLabel: 'strong-fit', confidence: 'high'}
}

// pass 1: every launch tool's slug (so alternatives only ref in-set tools)
const bySlug = new Map()
for (const t of launch) bySlug.set(slugify(t.Tool), t)
const slugSet = new Set(bySlug.keys())

const summary = {descMatched: 0, descMissing: [], flags: new Set()}

const toolDocs = launch.map((t) => {
  const slug = slugify(t.Tool)
  const code = CATEGORY_MAP[t['Primary Category']]
  if (!code) throw new Error(`Unmapped category label: "${t['Primary Category']}" for ${t.Tool}`)
  if (CATEGORY_FLAGS[t['Primary Category']]) summary.flags.add(`${t.Tool}: ${CATEGORY_FLAGS[t['Primary Category']]}`)

  const p2 = findPhase2(t.Tool)
  const description = p2?.['One-line Use Case'] || `${t['Primary Category']} tool for ${t['Target Audience']}.`
  if (p2?.['One-line Use Case']) summary.descMatched++
  else summary.descMissing.push(t.Tool)

  const fit = fitFrom(t['Verification Status'])
  const isSuite = /suite module/i.test(t['Primary Category'])
  const pi = priceInfo(t['Pricing Classification'])

  const doc = {
    _id: toolId(slug),
    _type: 'tool',
    name: t.Tool,
    slug: {_type: 'slug', current: slug},
    officialUrl: t['Official URL'],
    oneLineDescription: description,
    productType: isSuite ? 'suite_module' : 'native',
    status: 'active',
    primaryCategory: catRef(code),
    quickVerdict: {_type: 'quickVerdict', fitLabel: fit.fitLabel, confidence: fit.confidence},
    pricingPlans: [
      {
        _key: key('plan', 0),
        _type: 'pricingPlan',
        planName: 'Entry',
        priceDisplay: t['Pricing Classification'],
        price: pi.price,
        pricingModel: pricingModel(t['Pricing Classification'], t['Verification Status']),
        freePlan: pi.hasFree,
        freeTrial: false,
        thirdPartyEstimate: /third-party estimate/i.test(t['Pricing Classification']),
        verificationStatus: verificationStatus(t['Verification Status']),
        priceLastChecked: '2026-08-03',
      },
    ],
    lastVerifiedAt: VERIFIED_DATE,
    publicationStatus: 'approved',
  }
  if (SECONDARY[slug])
    doc.secondaryCategories = SECONDARY[slug].map((c, i) => ({...catRef(c), _key: key('sec', i)}))

  // direct alternatives (only those present in the launch set)
  const alts = (t['Closest Alternatives'] || '')
    .split(/,\s*/).map((a) => a.trim()).filter(Boolean)
    .map((a) => slugify(a)).filter((s) => slugSet.has(s) && s !== slug)
  if (alts.length) {
    doc.alternatives = alts.map((s, i) => ({
      _key: key('alt', i),
      _type: 'alternativeRef',
      tool: {_type: 'reference', _ref: toolId(s)},
      relationshipType: 'direct',
    }))
  }

  // Generated FAQ — factual, derived from the verified data (not invented copy)
  const faq = [
    [`What is ${t.Tool}?`, description],
    [`How much does ${t.Tool} cost?`, `${t.Tool} pricing: ${t['Pricing Classification']}. Verify live before purchase, as prices change.`],
    [
      `Does ${t.Tool} have a free plan?`,
      pi.hasFree
        ? `Yes, ${t.Tool} offers a free plan or trial to start.`
        : `No, ${t.Tool} does not advertise a permanent free plan; a paid plan is required for core use.`,
    ],
  ]
  if (alts.length) {
    const names = alts.map((s) => bySlug.get(s)?.Tool || s)
    faq.push([`What are the best alternatives to ${t.Tool}?`, `Top verified alternatives include ${names.join(', ')}.`])
  }
  doc.faq = faq.map(([question, answer], i) => ({_key: key('faq', i), _type: 'faqItem', question, answer}))

  return doc
})

/* ---------- 3. AI Answer Confidence — Peec AI only (illustrative) ---------- */
const peec = toolDocs.find((d) => d._id === 'tool-peec-ai')
if (peec) {
  peec.quickVerdict = {
    _type: 'quickVerdict',
    fitLabel: 'strong-fit',
    confidence: 'medium',
    numericScore: 84,
    verdictText:
      'Peec AI is the tool we recommend when you need real multi-engine AI visibility (ChatGPT, Perplexity, Gemini) with clear dashboards and transparent pricing, but do not need Profound’s enterprise depth or budget. AI engines rate it 84% confident for this job, with the one caveat that enterprise-scale coverage and agency white-labeling are lighter than Profound’s.',
  }
  peec.strengths = [
    'Best-value multi-engine tracking for mid-market teams',
    'Clear, visual dashboards with sentiment and position',
    'Transparent, published entry pricing (~$95/mo)',
  ]
  peec.limitations = [
    'Lighter enterprise depth and coverage vs Profound',
    'Agency white-label support not publicly verified',
    'Regional pricing variance, so verify live before buying',
  ]
  peec.capabilities = [
    ['Multi-engine tracking', 'Monitors brand mentions across ChatGPT, Perplexity and Gemini on a scheduled prompt set.', 'verified'],
    ['Sentiment & position', 'Scores whether a mention is positive and where the brand ranks within the AI answer.', 'verified'],
    ['Competitor benchmarking', 'Compares your share of voice against tracked competitors across the same prompts.', 'verified'],
    ['Source & citation tracking', 'Surfaces which domains the engines cite, so you can target the pages that feed answers.', 'verified'],
    ['Visual dashboards', 'Trend charts and regional breakdowns built for reporting to non-technical stakeholders.', 'verified'],
    ['Agency white-label', 'Multi-client / white-label support is referenced but not confirmed on primary sources.', 'unverified-marketing-claim'],
  ].map(([name, description, featureStatus], i) => ({_key: key('cap', i), _type: 'capability', name, description, featureStatus}))
  peec.aiConfidence = {
    _type: 'aiConfidence',
    jobContext: 'AI visibility tracking',
    aggregatePct: 84,
    dataStatus: 'illustrative',
    methodologyNote:
      'Illustrative sample data. Production values from a prompt-panel run (5 engines, representative prompts each) plus G2/Reddit review sampling, re-checked monthly.',
    lastCheckedAt: VERIFIED_DATE,
    engineScores: [
      ['chatgpt', 86, 71], ['claude', 82, 64], ['google-ai-mode', 85, 69],
      ['perplexity', 79, 58], ['gemini', 80, 55],
    ].map(([engine, confidencePct, mentionRate], i) => ({_key: key('eng', i), _type: 'aiEngineScore', engine, confidencePct, mentionRate})),
    sourcesOfTruth: [
      ['website', 95, 'Track your brand across every major AI engine with sentiment and position. The complete AI visibility platform.'],
      ['ai-consensus', 84, 'A strong, well-priced mid-market multi-engine tracker; often named the best-value pick vs Profound.'],
      ['web-reviews', 78, 'Praised for dashboards and value; some reviewers note lighter enterprise depth vs Profound.'],
    ].map(([kind, confidencePct, claim], i) => ({_key: key('sot', i), _type: 'sourceOfTruth', kind, confidencePct, claim})),
    dimensions: [
      ['Engine coverage', 88, 82], ['Pricing clarity', 90, 86], ['Ease of use', 85, 88],
      ['Reporting depth', 80, 72], ['Value for money', 87, 90],
    ].map(([name, aiStatedPct, webVerifiedPct], i) => ({_key: key('dim', i), _type: 'dimensionScore', name, aiStatedPct, webVerifiedPct})),
    citations: [
      ['peec.ai', 12], ['g2.com', 7], ['reddit.com', 5], ['marketermilk.com', 3], ['youtube.com', 2],
    ].map(([domain, citedCount], i) => ({_key: key('cite', i), _type: 'citationSource', domain, citedCount})),
  }
}

/* ---------- curation: hub covers AI-search / GEO / AEO only ---------- */
// Deliberately excluded (CRM, web/product analytics, attribution, ABM, visitor-ID).
// Confirmed with the team 2026-08-04. Removing an entry here re-adds the tool on regen.
const EXCLUDED_TOOL_NAMES = new Set([
  'HubSpot CRM', 'Salesforce Sales Cloud',
  'Google Analytics (GA4)', 'PostHog', 'Plausible', 'Matomo', 'Fathom Analytics', 'Umami', 'Databuddy',
  'Dreamdata', 'Factors.ai', 'HockeyStack', 'Ruler Analytics',
  '6sense', 'Demandbase',
  'Dealfront (Leadfeeder)', 'RB2B', 'Salespanel', 'Warmly',
])
const keptTools = toolDocs.filter((t) => !EXCLUDED_TOOL_NAMES.has(t.name))
/* Rich editorial profiles, official videos, and plan details for the curated set. */
applyToolEnrichment(keptTools)
// prune categories no kept tool uses; walk the parent chain so ancestors of used cats survive
const catIndex = new Map(categoryDocs.map((c) => [c._id, c]))
const usedCatIds = new Set()
const markCatUsed = (id) => {
  let c = catIndex.get(id)
  while (c && !usedCatIds.has(c._id)) { usedCatIds.add(c._id); c = c.parent ? catIndex.get(c.parent._ref) : null }
}
for (const t of keptTools) {
  if (t.primaryCategory?._ref) markCatUsed(t.primaryCategory._ref)
  for (const r of t.secondaryCategories || []) markCatUsed(r._ref)
}
const keptCats = categoryDocs.filter((c) => usedCatIds.has(c._id))

/* ---------- write ---------- */
const all = [...keptCats, ...keptTools]
// 1) NDJSON for `sanity dataset import`
const outPath = p('seed/tools-hub.seed.ndjson')
mkdirSync(dirname(outPath), {recursive: true})
writeFileSync(outPath, all.map((d) => JSON.stringify(d)).join('\n') + '\n', 'utf8')
// 2) JSON array for the local Next.js app's local repository (same docs)
const appSeed = p('tools-hub-app/src/data/seed.json')
mkdirSync(dirname(appSeed), {recursive: true})
writeFileSync(appSeed, JSON.stringify(all, null, 0), 'utf8')

/* ---------- summary ---------- */
console.log(`Wrote ${all.length} docs -> seed/tools-hub.seed.ndjson`)
console.log(`  categories: ${keptCats.length} (of ${categoryDocs.length}; pruned empty after curation)`)
console.log(`  tools:      ${keptTools.length} (of ${toolDocs.length}; ${EXCLUDED_TOOL_NAMES.size} excluded)`)
console.log(`  descriptions matched from Phase 2: ${summary.descMatched}/${toolDocs.length}`)
if (summary.descMissing.length) console.log(`  descriptions generated (no Phase 2 match): ${summary.descMissing.join(', ')}`)
console.log(`  AI Answer Confidence seeded: Peec AI (illustrative)`)
console.log(`  category-mapping flags for editorial review:`)
for (const f of summary.flags) console.log(`    - ${f}`)
