# MaximusLabs Tools Page — Design Plan & Build Spec

*Synthesis of the ColdIQ reference, your 5 planning docs (Phase 1–3 + inventory), the live MaximusLabs brand, and your "AI Answer Confidence" idea. Companion file: `tools-page-design-template.html` (open in a browser to see it live).*

---

## 1. The idea in one line

A ColdIQ-style **tools directory** for the GEO/AEO/AI-search niche, where every tool carries a signature **"AI Answer Confidence"** graph — showing how much the AI engines (ChatGPT, Claude, Perplexity, Google AI Mode, Gemini) actually trust/recommend that tool for a job, next to what the tool's own website claims and what independent web reviews say. The page itself becomes a live demonstration of the RAEO/R-GEO service MaximusLabs sells.

## 2. Why this wins (your insight, made concrete)

People no longer pick tools by reading one website — they ask an AI. So a directory that only lists tools competes with 50 other listicles. A directory that shows **"here's how confident ChatGPT / Claude / Perplexity are about this tool, and where the marketing site oversells vs where reviews agree"** is:

- **Genuinely new** — nobody's tools directory shows AI-consensus confidence per tool.
- **On-brand** — it *is* AI visibility measurement, which is Maximus's whole product.
- **Citation bait** — an extractable, sourced "answer nugget" per tool is exactly what gets a page cited back into AI answers (the outcome Maximus sells to clients).

## 3. Two page types (from Phase 3 IA)

| Page | Route | Job | Carries the AI Confidence module? |
|---|---|---|---|
| **Directory Hub** | `/tools` | Discover categories + tools, ColdIQ-style | Compact "AI pick" badges on cards |
| **Tool Profile** | `/tools/[slug]` | Evaluate one tool deeply | **Yes — full module (the centerpiece)** |

(Later: Category, Versus, Alternatives, Best-of, Free-tools pages — all already specced in your Phase 3 doc. Start with these two.)

## 4. Directory Hub — section map (ColdIQ-adapted, Maximus-branded)

1. **Header / nav** — matches live site: Services · Platforms · Resources · Industries · Pricing + pill CTA.
2. **Hero** — H1 "Best AI Search, GEO & SEO Tools (2026)", one-line value prop, **search bar**, cross-sell chip to Maximus free tools.
3. **Sticky "Popular Categories"** jump-nav strip.
4. **Featured tools** — 8–10 flagship tools as logo cards with a one-line value prop (Peec AI, Profound, Otterly, AthenaHQ, Ahrefs Brand Radar, Semrush, Surfer, Frase…).
5. **Category blocks** (8–10, from your inventory) — each = name + 1-line definition + 🥇🥈🥉 ranked top 3 + remaining tools. Free/Maximus tools carry a "Free Tool" badge and rank first.
6. **Newsletter capture** — "Founder's Voice" framing (Krishna's take), mid-page.
7. **SEO copy + footer** — authority paragraph, breadcrumbs, source discipline.

## 5. Tool Profile — the signature module: "AI Answer Confidence"

Rendered inside the standard 14-section profile (Phase 3, Deliverable 3). The module has five parts:

1. **Aggregate gauge** — one big number, e.g. `84%`: "AI engines recommend [tool] for [job]." Conic-gradient gauge, counts up on scroll.
2. **Per-engine bars** — ChatGPT / Claude / Perplexity / Google AI Mode / Gemini, each an animated bar + % + "mentioned in X% of answers." (This is literally share-of-voice per engine.)
3. **Three sources of truth** — three columns compared side by side:
   - *Website claims* (self-reported) — what the marketing site says.
   - *AI consensus* — what the engines actually say.
   - *Web reviews* (G2/Reddit/independent) — third-party reality.
   Each carries a confidence pill so agreement/disagreement is visible at a glance.
4. **Feature-dimension breakdown** — grouped bars per dimension (Engine coverage, Pricing clarity, Ease of use, Reporting, Value) with two series: **AI-stated vs Web-verified** — surfacing exactly where marketing outruns reality.
5. **Citation sources** — the domains AI cited when forming its view (chips), + a `Source:` line and "Last checked" date.

**Honesty rule:** all AI-confidence numbers ship as **illustrative sample data** with a visible methodology note until wired to a real measurement source (Peec-style prompt panel, or Maximus's own pipeline). This matches the strict "Not publicly verified" evidence standard in your Phase 1–3 docs.

## 6. Brand system (locked — confirmed live on maximuslabs.ai)

- **Font:** Satoshi — 900 for headings, 400 body, 500/700 for UI. Fontshare link.
- **Text:** `#1e3251` on `#f3f3f6`. Paper `#fff`, marble `#fbfbfb`.
- **Blue ramp:** navy `#001c64` → medium `#003087` → accent `#0070e0` → light `#449afb`. Highlight `#a8d4ff`.
- **Dark sections:** gradient `linear-gradient(160deg,#001129,#001c64,#003087)` + low-opacity rotated white logo watermark (the signature Maximus motif).
- **Buttons:** pill (`border-radius:48px`), navy bg, white text.
- **Semantic (sparingly):** green `#0f8b5f`, red `#c0392b`, amber `#fbbf24` — for deltas/pills only.
- **House style:** tabular numbers, animate on scroll, every exhibit cites its source, no gold, no em/en dashes.

## 7. Data model add-on (extends Phase 3, Deliverable 10)

Add to the `Tools` entity an `AIConfidence` child:
```
AIConfidence (id, tool_id, job_context, aggregate_pct, last_checked_at, methodology_note)
AIEngineScore (id, ai_confidence_id, engine[chatgpt|claude|perplexity|google_ai|gemini], confidence_pct, mention_rate)
SourceOfTruth (id, ai_confidence_id, kind[website|ai_consensus|web_reviews], claim_text, confidence_pct)
DimensionScore (id, ai_confidence_id, dimension, ai_stated_pct, web_verified_pct)
CitationSource (id, ai_confidence_id, domain, cited_count)
```
Everything else (Tools, Categories, PricingPlans, EvidenceClaims…) reuses your Phase 3 schema unchanged.

## 8. Recommended architecture (the best-suggested setup)

Two page types, two different tools, connected by one design language. This mirrors how MaximusLabs already runs `maximuslabs.ai/ai-search-101` (Sanity + Next.js behind a Cloudflare proxy).

### 8a. Collection / hub page → **Webflow**
- The directory (`/tools`) is a marketing/browse page that changes slowly and benefits from Webflow's editor. Build it in Webflow.
- Use Webflow **CMS Collections**: `Categories` and `Tools` (fields: name, slug, logo, one-liner, category ref, pricing entry, free-tier, AI-confidence %, verdict, medal/rank, is-free-maximus).
- Hub = a Collection List grouped by category with the medal-ranked top 3 + the rest. The featured row and the AI-confidence pill bind to CMS fields.
- Port the visual design from `tools-page-design-template.html` (the file is the blueprint: header, hero, jump nav, category blocks, badges, footer).
- Each tool card links out to that tool's landing page (see 8b).

### 8b. Tool landing pages → **Sanity + Next.js** (same stack as AI Search 101)
There will be 70+ tool pages, each data-rich (AI-confidence per engine, comparison rows, features with verification tags, pricing tiers) and re-verified monthly. That is a headless-CMS job, not a hand-built-in-Webflow job. Reuse the proven hub stack:

```
maximuslabs.ai/resources/ai-tool-directory  ->  Cloudflare Worker (reverse proxy)
                                     -> Vercel, Next.js, noindex origin (hostname set via Worker env var, own setup)
                                        -> Sanity Content Lake (the CMS)
```
- One Next.js dynamic route `app/tools/[slug]/page.tsx` renders every tool from one template (port `tool-landing-page-template.html` into React components sharing the brand CSS).
- Editors manage tools, scores, comparisons and pricing in Sanity Studio; ISR re-renders with no redeploy.
- Per-page canonical to `maximuslabs.ai/tools/[slug]`, `SoftwareApplication` + `FAQPage` JSON-LD, dynamic sitemap. Origin `X-Robots-Tag: noindex`, proxy strips it (identical pattern to AI Search 101).
- The AI Answer Confidence module becomes a reusable React component bound to the `aiConfidence` fields below.

**Alternative if you want everything in one place:** Webflow CMS *can* host the landing pages too (a `Tools` Collection Page template), but you hit Webflow's limits fast: one dynamic URL segment, per-plan CMS item caps, and clumsy nested data (per-engine scores, comparison rows). Sanity is the better long-term home for the structured, frequently-updated tool data. Recommended split: **Webflow for the hub, Sanity for the tool pages.**

### 8c. Sanity schema (extends Phase 3 data model)
```
tool: { name, slug, logo(image), category(ref), oneLiner, verdict(text),
        overallScore(number), quickVerdict(enum), pricingEntry, freeOption,
        deployment, bestFor, engines[], lastVerifiedAt,
        strengths[], limitations[], features[ {name, description, verification(enum)} ],
        pricingPlans[ {name, amount, popular(bool), features[]} ],
        competitors[ref->tool], alternatives[ {tool(ref), reason} ],
        aiConfidence -> object below }

aiConfidence: { jobContext, aggregatePct, methodologyNote, lastCheckedAt,
                engineScores[ {engine(enum), confidencePct, mentionRate} ],
                sourcesOfTruth[ {kind(website|ai_consensus|web_reviews), claim, confidencePct} ],
                dimensions[ {name, aiStatedPct, webVerifiedPct} ],
                citations[ {domain, citedCount} ] }
```

### 8d. Sequencing
1. **Now** (done): two HTML blueprints, on-brand, real logos, real footer, the AI Confidence module. `tools-page-design-template.html` (hub) + `tool-landing-page-template.html` (Peec AI profile).
2. **Hub in Webflow**: build Categories + Tools collections, rebuild the hub design, wire cards to link to `/tools/[slug]`.
3. **Landing pages in Sanity + Next.js**: stand up the `tool` schema + Studio, port the landing template to the catch-all route under the Cloudflare proxy (prereqs: Sanity project, Vercel, and a Cloudflare Worker + origin set up per your own process — see `About-the-Project.md`).
4. **Real logos**: upload high-res tool + AI-platform logos to the CMS (favicons in the templates are placeholders that resolve live).
5. **Live AI data**: replace the illustrative confidence numbers with a real prompt-panel run (Peec/Profound-style, or Maximus's own), on the monthly cadence from Phase 3, Deliverable 8.

## 9. What's real vs illustrative in the template

- **Real:** brand tokens, nav, tool names/categories/taglines/pricing (from your verified Phase 2 CSV), page structure.
- **Illustrative (labeled):** all AI-confidence percentages, per-engine/mention rates, dimension scores, citation counts — sample data pending a live measurement source.
