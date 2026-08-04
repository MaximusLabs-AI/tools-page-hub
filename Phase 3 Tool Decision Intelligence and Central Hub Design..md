## Scope Note

This phase is primarily an information-architecture and system-design deliverable built on the verified taxonomy (Phase 1) and 70-tool inventory (Phase 2). Product-specific claims below reuse only previously verified evidence; where Phase 3 introduces new positioning judgments (e.g., category-fit boundaries), these are marked as editorial reasoning, not new vendor claims.[^1]

***

## Deliverable 1 — User & Buyer Journeys

### Audience Profiles (abbreviated matrix)

| Audience | Main Job-to-be-Done | Key Question | Entry Point | Key Filters | Conversion Action |
|---|---|---|---|---|---|
| Founder | Build minimum viable marketing stack cheaply | "What do I actually need at my stage?" | "Best tools for startups" page | Budget, free plan, company size | Save stack template |
| CMO | Validate/consolidate stack, reduce overlap | "Are we paying for redundant tools?" | Stack Builder | Enterprise-ready, integrations | Export stack audit |
| Marketing leader | Pick category leader for a new initiative | "Which tool fits our team?" | Category page | Team size, use case | Compare shortlist |
| Growth marketer | Find attribution/analytics tightly tied to revenue | "What ties spend to pipeline?" | Attribution category | CRM integration, pricing model | Tool Finder |
| SEO professional | Track rankings + AI visibility together | "Do I need a new tool or does my suite cover this?" | AI Visibility category | Suite-module vs. native | Comparison table |
| AI-search/GEO specialist | Monitor citations across engines | "Which engines does this track?" | Peec AI profile / AI Visibility category | Engine coverage, prompt volume | Alternatives page |
| Performance marketer | Manage ad attribution/CRO | "What's the ROI-proof stack?" | Attribution category | Ad-platform integration | Stack template |
| Content marketer | Optimize content for SEO+GEO | "Which content tool covers both?" | Content Optimization category | GEO scoring included | Comparison table |
| Marketing ops leader | Ensure integrations don't break | "Will this connect to our CRM/warehouse?" | Integration page | API availability, data model | Integration compatibility check |
| RevOps leader | Own the attribution/CRM data layer | "What's the true cost of ownership?" | Attribution deep-dive | Pricing transparency, contract terms | Request stack audit |
| Agency | Manage multi-client reporting | "Which tools support white-label/multi-account?" | Persona: Agency collection | Agency support flag | Agency-compatible shortlist |
| Product manager | Track product usage, not marketing traffic | "Is this GA4 or product analytics?" | Product Analytics category | Event-based vs. pageview | Category disambiguation page |
| Developer | Self-host or API-integrate | "Is this open-source/self-hostable?" | Open-source collection | Self-hosting, API, license | GitHub/docs link-out |
| Data/analytics pro | Avoid duplicate data collection | "What's redundant in this stack?" | Stack Builder overlap detector | Data source overlap | Overlap report |
| Enterprise/IT buyer | Vet security/compliance | "What's the deployment/compliance posture?" | Tool profile Security section | Compliance certs, deployment model | Security questionnaire export |

### Ten Core User Journeys

1. **Discovering an unfamiliar category** → Hub → Department page → Category page (definition-first) → "who this is for" → market map → shortlist
2. **Comparing known products** → Search/autocomplete → Versus page → normalized comparison table → decision rationale
3. **Finding an alternative** → Tool profile → "Alternatives" module → Alternatives page (`/alternatives/[tool]`) → filtered by price/feature gap
4. **Replacing an existing tool** → Stack Builder → flag tool for replacement → system suggests cheaper/privacy-friendly/open-source substitutes with migration-complexity note
5. **Building a new stack** → Tool Finder questionnaire → Stack template suggestion → customize → save/export
6. **Reducing tool costs** → Stack Builder → cost breakdown → overlap detector flags redundant categories → cheaper-alternative suggestions
7. **Finding privacy-friendly products** → Filter: Privacy-friendly → cross-category results (analytics, CDP, visitor ID) with GDPR/self-host badges
8. **Finding open-source products** → Filter: Open-source → results with license type, self-host instructions
9. **Selecting an enterprise platform** → Filter: Enterprise-ready → profiles show compliance/deployment/SLA fields prioritized, pricing marked "Custom — contact sales"
10. **Selecting an agency-compatible platform** → Filter: Agency support → results show white-label/multi-client capability flags

***

## Deliverable 2 — Central Hub Architecture

### Page-Type Specification (condensed)

| Page Type | Intent | Primary CTA | Indexable? | Update Frequency |
|---|---|---|---|---|
| Main Tools Hub (`/tools`) | Orientation, category discovery | Start Tool Finder | Yes | Monthly |
| Department Hub (`/tools/ai-search`) | Browse a major family | Browse categories | Yes | Monthly |
| Category Page (`/tools/ai-search/visibility-tracking`) | Understand + shortlist a category | View comparison table | Yes | Quarterly (pricing checked monthly) |
| Subcategory Page (`/tools/analytics/privacy-first`) | Narrow within a category | Filter results | Yes, if sufficient unique content (10+ tools, distinct buying criteria) | Quarterly |
| Tool Profile (`/tools/peec-ai`) | Deep single-product evaluation | Visit official site | Yes | Pricing monthly, features quarterly |
| Best-Tools Page (`/best/ai-visibility-tools-for-agencies`) | Curated shortlist for a specific intent | Compare shortlist | Yes, only if genuinely differentiated from parent category page | Quarterly |
| Use-Case Collection (`/use-cases/track-chatgpt-mentions`) | Job-to-be-done oriented discovery | Start Tool Finder | Yes | Quarterly |
| Persona Collection (`/for/agencies`) | Role-based curated list | View agency-compatible tools | Yes | Quarterly |
| Industry Collection (`/for/ecommerce`) | Industry-specific shortlist | View shortlist | Yes, only with genuine industry-specific criteria | Quarterly |
| Alternatives Page (`/alternatives/google-analytics`) | Replace a named product | Compare alternatives | Yes | Quarterly |
| Versus Page (`/vs/peec-ai-vs-profound`) | Direct 2-product decision | View full comparison | Yes | Monthly for top 20 pairs, quarterly otherwise |
| Integration Page (`/integrations/hubspot`) | Find tools compatible with X | Filter by integration | Yes, if 5+ verified integrating tools exist | Quarterly |
| Free-Tool Collection (`/free-tools`) | Zero-budget discovery | Try free tool | Yes | Quarterly |
| Open-Source Collection (`/open-source`) | Self-host discovery | View GitHub/docs | Yes | Quarterly |
| Stack Templates (`/stacks/b2b-saas-growth`) | Pre-built stack for a company type | Clone stack | Yes | Quarterly |
| Tool-Finder Results | Personalized recommendation | Save/export results | **No** (personalized, non-canonical) | N/A |
| Saved Comparisons | User-specific saved state | Share link | **No** (user-generated, low uniqueness) | N/A |

### Recommended URL Architecture

```
/tools                                    (hub)
/tools/[department]                       (e.g., /tools/ai-search)
/tools/[department]/[category]            (e.g., /tools/ai-search/visibility-tracking)
/tools/[department]/[category]/[subcat]   (e.g., /tools/analytics/privacy-first)
/tools/[tool-slug]                        (e.g., /tools/peec-ai)
/best/[intent-slug]                       (e.g., /best/ai-visibility-tools-for-agencies)
/use-cases/[job-slug]                     (e.g., /use-cases/track-chatgpt-mentions)
/for/[persona-or-industry]                (e.g., /for/agencies, /for/ecommerce)
/alternatives/[tool-slug]                 (e.g., /alternatives/google-analytics)
/vs/[tool-a]-vs-[tool-b]                  (e.g., /vs/peec-ai-vs-profound)
/integrations/[tool-slug]                 (e.g., /integrations/hubspot)
/free-tools
/open-source
/stacks/[template-slug]                   (e.g., /stacks/b2b-saas-growth)
```

Canonical rule: category and subcategory pages are canonical to themselves; any filter-parameter URL (`?pricing=free&company_size=smb`) canonicalizes back to the unfiltered category page unless the filtered view has 10+ unique results and independent search demand — in which case it graduates to a dedicated indexable Best-Tools page.

***

## Deliverable 3 — Tool Profile Template

### Content Order (Desktop)

1. Header: Name, logo, one-sentence factual description, Quick Verdict badge (Best fit / Strong fit / Conditional fit / Weak fit / Insufficient evidence — per Deliverable 9), Last Verified date
2. Primary + secondary category chips, "Suite Module" flag if applicable (e.g., Ahrefs Brand Radar)
3. Quick facts sidebar: pricing tier, free plan/trial, deployment, open-source status, API availability
4. Core capabilities (bulleted, each tagged: Verified / Integration-dependent / Beta / Announced / Discontinued / Unverified marketing claim)
5. AI-specific capabilities (engines/platforms monitored, prompt volume if verified)
6. Integrations list with confidence tags (native vs. via Zapier/API)
7. Pricing table with plan-by-plan breakdown and "price last checked" date
8. Strengths / Limitations (two-column)
9. Best-fit classification: company size, role, industry, agency support, enterprise readiness
10. Direct alternatives / cheaper alternatives / open-source alternatives / complementary products (four distinct modules, not merged)
11. Comparison links (Versus pages)
12. Product update history (changelog-style, dated entries)
13. Evidence & citations footer with source URLs and verification dates
14. Correction mechanism ("Report an error") + sponsorship/affiliate disclosure banner if applicable

### Mobile Order
Collapse sidebar into an expandable "Quick Facts" accordion directly under the header; move Alternatives module up (position 4) since mobile users scan-and-bounce faster; keep evidence/citations footer last.

### Capability Labeling System
Each capability claim carries one of six tags, rendered as a colored badge: **Verified** (primary-source confirmed), **Integration-dependent** (works only via third-party connector), **Beta**, **Announced** (not yet shipped), **Discontinued**, **Unverified marketing claim** (vendor-stated, no independent confirmation) — this directly operationalizes Phase 1's "Not publicly verified" standard at the claim level, not just the product level.

***

## Deliverable 4 — Category Page Template (Fully Demonstrated: "AI Search Visibility Tools")

**Definition**: Software that systematically queries AI models (ChatGPT, Perplexity, Gemini, Copilot, Google AI Overviews) with representative prompts and measures whether/how a brand is mentioned, cited, or ranked in the response.[^1]

**Problems solved**: Invisible brand presence in zero-click AI answers; inability to measure "share of voice" the way rank position measures traditional SEO.

**Intended buyers**: SEO/marketing leads, agencies managing multiple client brands, enterprise brand teams.

**When this category is unnecessary**: Pre-product-market-fit startups with no brand search volume yet; businesses in categories AI models rarely answer questions about (e.g., highly regulated/local-only services with minimal AI-answer presence — verify per-vertical before assuming irrelevance).

**Frequently confused with**: Social listening/UGC brand monitoring (measures social mentions, not LLM-generated answers); traditional rank tracking (measures Google SERP position, not AI answer inclusion); suite-embedded AI modules (Ahrefs Brand Radar, Semrush AI Toolkit) which are positioned similarly but are add-ons to existing SEO subscriptions rather than standalone platforms.[^1]

**Essential buying criteria**: number of AI engines monitored; custom vs. panel-only prompts; citation/source-level reporting (not just mention frequency); competitor benchmarking; historical trend data.

**Optional advanced capabilities**: sentiment analysis on mentions; content optimization recommendations tied to visibility gaps; agency/multi-client white-labeling.

**Typical pricing models**: credit/prompt-based tiers (Otterly.AI, AthenaHQ) ranging from ~$29/mo to $2,000+/mo enterprise; suite-bundled (Ahrefs/Semrush) with no standalone price.[^1]

**Market map** (native platforms vs. suite modules — critical Phase 1 distinction preserved): Native — Peec AI, Profound, Scrunch AI, Otterly.AI, AthenaHQ, ZipTie.dev, LLMrefs. Suite modules — Ahrefs Brand Radar, Semrush AI Toolkit.

**Best tools by use case**: Budget/solo — Otterly.AI ($29/mo entry); Enterprise — Profound; Existing-suite users — Ahrefs Brand Radar or Semrush AI Toolkit depending on incumbent subscription.

**Common purchasing mistakes**: assuming a suite-embedded AI module provides the same custom-prompt depth as native platforms; comparing prompt-volume claims across vendors without confirming methodology (panel-derived vs. custom) — flagged as a real evidence gap in Phase 2.

**FAQs**: "Does this replace my SEO tool?" — No, it's complementary; AI visibility and traditional rank tracking measure different surfaces.

***

## Deliverable 5 — Comparison System

### Global vs. Category-Specific Fields
**Global** (every comparison table): Pricing tier, free plan/trial, deployment, integrations count, last-verified date, confidence rating.
**Category-specific**: AI Visibility → engines monitored, prompt volume methodology; Analytics → self-hosting, cookie policy; Attribution → CRM integrations, contract minimum.

### Handling Rules
- **Missing information**: render "Not publicly verified" — never a blank cell or an assumed default.
- **Usage-based pricing**: show as a range with the triggering metric explicit (e.g., "$9-69/mo, scales by pageview volume") rather than a single number.
- **Native vs. integration-dependent**: separate columns/icons — a feature "via Zapier" is never shown identically to a native feature.
- **Enterprise-only products**: pricing cell reads "Custom — contact sales," never estimated; feature comparison still proceeds using publicly documented capabilities only.
- **Evidence confidence**: each row/cell carries a small confidence indicator (High/Medium/Low) tied to source count and recency.
- **False precision**: never display "$99.47/mo" style false precision from third-party estimates — round and label as approximate when the source itself is an estimate (e.g., Dreamdata/HockeyStack third-party pricing figures from Phase 2, which varied $599-999/mo across sources).
- **Identical/irrelevant rows**: auto-hide comparison rows where all compared products score identically (e.g., "Has a website: Yes" is never shown).

### Priority Comparison Frameworks

**Peec AI vs. Profound vs. Scrunch AI vs. Otterly.AI**: These four are NOT direct like-for-like competitors on inspection — Otterly.AI is explicitly positioned as the budget/self-serve option ($29/mo entry), Profound as the enterprise analyst-grade platform (custom pricing, no public SMB tier), Peec AI as the mid-market visual/regional-reporting tool, and Scrunch AI as monitoring-plus-content-optimization hybrid. The comparison page must lead with this segmentation rather than presenting a flat feature grid, since a $29/mo tool and a custom-enterprise tool are not actually competing for the same buyer.[^1]

**Factors.ai vs. Dreamdata vs. HockeyStack**: Verified positioning shows Factors.ai leads with a genuine free tier (differentiator vs. both competitors), Dreamdata targets $5M+ ARR B2B companies with 6+ month sales cycles, and HockeyStack has no free tier and skews toward dedicated RevOps teams with $25K+ budgets. Do not present as three interchangeable "attribution tools" — Dreamdata and HockeyStack pricing figures are third-party estimates only, per Phase 2's evidence flag, and must be labeled as such in any comparison table, not stated as confirmed.[^1]

**Plausible vs. Matomo vs. Fathom vs. Google Analytics**: The critical differentiator is self-hosting and open-source status — Matomo is the only one of the three alternatives offering a fully-featured self-hosted free option; Plausible and Fathom are both paid-only (no free tier) with Plausible open-source/self-hostable and Fathom closed-source cloud-only. GA4 remains the only fully free option but carries the privacy tradeoffs the entire alternative category exists to solve.[^1]

**Google Search Console vs. Bing Webmaster Tools vs. complementary platforms**: This comparison must open with the Phase 1 caveat restated: no listed product replaces GSC/Bing's first-party data — SEOTesting, AccuRanker, SE Ranking, etc. are enhancement/extension layers, not substitutes. The comparison table should have a distinct "Relationship to first-party data" column (Replaces / Extends / Independent) rather than implying substitutability.[^1]

**Traditional SEO tools vs. AI-search visibility tools**: These solve adjacent but distinct jobs — traditional tools (Ahrefs, Semrush, Moz) measure Google SERP position and backlinks; AI-visibility tools measure LLM answer inclusion. The suite-module additions (Brand Radar, AI Toolkit) are the bridge point and should be flagged in both category's comparison pages as the "if you already own one, start here" option.

***

## Deliverable 6 — Tool Finder

### Question Flow (Conditional Logic)
1. Role → 2. Primary problem (branches by department) → 3. Company size → 4. Budget band → 5. Technical ability (no-code / some-code / developer) → 6. Existing stack (multi-select autocomplete) → 7. Required integrations → 8. Data volume (if analytics/attribution branch triggered) → 9. Privacy requirements (Yes/No/Unsure) → 10. Self-hosting requirement (only shown if privacy=Yes or technical ability=developer) → 11. API requirement → 12. Geographic market → 13. Agency/multi-client (only shown if role=Agency) → 14. Enterprise procurement needs (only shown if company size=Enterprise)

### Scoring Model
Each candidate tool receives a weighted match score: Category fit (40%) + Budget fit (20%) + Technical fit (15%) + Integration fit (15%) + Privacy/deployment fit (10%). Tools failing a hard-exclusion rule (e.g., no self-hosting when required, no free tier when budget=$0) are removed before scoring, not down-ranked.

### Exclusion Rules
- Budget = $0 and free plan = No → excluded
- Self-hosting required and self-host = No → excluded
- Privacy-friendly required and product has no privacy/GDPR documentation → excluded
- Enterprise procurement flagged and product has no security/compliance page → flagged "Insufficient evidence" rather than excluded (avoid false negatives on under-documented but viable enterprise tools)

### Confidence Calculation
Recommendation confidence = (evidence completeness for top candidates) × (score margin between #1 and #2 result). Low differentiation between top 3 results triggers a "these are close — compare directly" prompt instead of a single confident recommendation.

### Sample Results (5 Profiles)

1. **Solo SEO consultant, $50/mo budget, wants AI visibility**: Otterly.AI Lite ($29/mo) ranked Best fit; Peec AI ranked Conditional fit (exceeds budget); explanation: "Otterly fits your budget with 15 prompts; Peec AI offers richer reporting but starts above your stated budget."
2. **Enterprise CMO, needs multi-engine AI tracking + compliance docs**: Profound ranked Best fit; Peec AI ranked Strong fit; Ahrefs Brand Radar ranked Conditional fit ("only if you're already an Ahrefs customer").
3. **European privacy-focused startup, needs GA4 replacement, self-hosted**: Matomo ranked Best fit (only fully-featured self-hosted free option); Plausible ranked Strong fit (open-source but no free self-host cost advantage over Matomo... actually Plausible is self-hostable too, both similar) — Umami ranked Strong fit for lowest-cost self-hosted entry; Fathom excluded (no self-host option, hard exclusion triggered).
4. **B2B SaaS RevOps lead, $30K/yr budget, needs CRM-linked attribution**: HockeyStack ranked Strong fit (matches budget band); Dreamdata ranked Conditional fit (third-party pricing suggests near/above budget ceiling); Factors.ai ranked Best fit for lower budget sub-segment given its free tier as an evaluation path.
5. **Agency needing multi-client AI visibility reporting**: Peec AI ranked Best fit (regional/visual reporting noted in evidence); Profound ranked Conditional fit (enterprise-oriented, may exceed per-client budget); explanation flags that agency-specific white-label confirmation is "Not publicly verified" for both, recommending direct vendor confirmation before purchase.

***

## Deliverable 7 — Stack Builder

### Core Logic
- **Overlap detection**: flags when two added tools share a primary category (e.g., both Ahrefs and Semrush added → "these overlap significantly in rank tracking and backlink data — consider whether you need both").
- **Missing-category detection**: cross-references added tools' categories against a defined "essential stack" checklist per company-size template; flags gaps (e.g., attribution tool present but no AI-visibility tool → suggested addition).
- **Pricing calculation**: sums confirmed monthly prices; usage-based/enterprise entries display as a range or "Custom — excluded from total, contact vendor" rather than $0 (which would understate cost).
- **Integration confidence**: cross-check against the Integrations data model (Deliverable 10) — shows "Confirmed integration," "Possible via Zapier/API (unconfirmed native)," or "No known integration."
- **Redundant data collection**: flags when two analytics-layer tools (e.g., GA4 + Plausible) are both active, since this is a common but often unintentional redundancy.

### Example Stack Templates

| Template | Core Tools (by category) | Est. Monthly Cost Band |
|---|---|---|
| Early-stage startup | GA4 (free) + Google Search Console (free) + Otterly.AI ($29) + Frase ($39-45) | ~$70-75/mo |
| B2B SaaS growth team | HubSpot CRM (Starter $20/seat) + Factors.ai (free tier) + Semrush ($117+) + Peec AI (~$100) | ~$240-300+/mo |
| E-commerce company | GA4 (free) + Matomo Cloud (~€29) + Ahrefs Lite (~$99-129) + Ruler Analytics (from £199) | ~$330-460/mo |
| SEO agency | Ahrefs (~$99-129) + SE Ranking (~$87-103) + Peec AI (~$100, per-client scaling) + Screaming Frog (~$22) | ~$310-355/mo base (excl. per-client scaling) |
| AI-search/GEO team | AthenaHQ ($295+) + Ahrefs Brand Radar (bundled) + Frase ($39-45) + GEO Toolbox/Clunky.ai (free) | ~$335-345/mo |
| Enterprise marketing team | Salesforce (from $175/user) + Profound (custom) + 6sense (custom, avg. $123,711/yr) + Semrush ($140+) | Custom — largely enterprise-priced |
| Privacy-focused European company | Matomo (self-hosted, free) + Dealfront/Leadfeeder (free tier, €99+ paid) + Databuddy (free/$9.99) | ~$0-110/mo |
| Developer-led product company | PostHog (free tier/$49.99) + Umami (free self-hosted) + DataForSEO (API, $250/1M keywords) | ~$50-300/mo depending on API usage |

***

## Deliverable 8 — Trust and Freshness System

### Governance Fields (per claim, not just per product)
Last reviewed date; pricing last checked; feature last checked; product status (Active/Beta/Discontinued/Acquired/Rebranded); evidence URL(s); source type (Official/Independent review/Aggregator); confidence rating (High/Medium/Low); correction log.

### Recommended Update Schedules
- **Pricing**: monthly for top 50 published tools; quarterly for the long tail
- **Features**: quarterly, or immediately upon a detected changelog/announcement
- **Integrations**: quarterly
- **Security/compliance**: semi-annually, or immediately upon a disclosed breach/certification change
- **Product status** (shutdown/acquisition/rebrand): continuous monitoring via news alerts, verified within 7 days of detection
- **Comparisons/rankings**: quarterly, or triggered by a pricing/feature change in any compared product
- **Editorial recommendations**: quarterly review cycle

### Outdated Profile Handling
Profiles unverified for >6 months display a visible "Needs re-verification" banner and are automatically excluded from Tool Finder recommendations and comparison-table defaults (though still viewable) until re-verified. Profiles unverified for >12 months are unpublished from indexable category pages entirely.

***

## Deliverable 9 — Ranking & Recommendation Methodology

### Score Components (category-weighted, not universal)
Category-specific capability (weight varies 20-30% by category); Data reliability (10-20%); Ease of use (5-15%); Integrations/ecosystem (5-15%); Reporting/exportability (5-10%); Pricing/value (10-15%); Privacy/security (5-15%, weighted higher for analytics/attribution categories); Scalability (5%); Support/documentation (5%); Market maturity (5-10%).

### Rules
- **Minimum evidence threshold**: a product needs at least 3 independently sourced fields (pricing, core feature, one differentiator) before receiving any numeric score; otherwise it displays "Insufficient evidence" rather than a score.
- **Sponsorship isolation**: sponsored placements are visually separated (labeled "Sponsored") and never factored into or blended with the organic ranking score.
- **Editorial judgment documentation**: any manual ranking override (e.g., promoting a newer tool ahead of score due to demonstrated momentum) must be logged with a written rationale visible via an "About this ranking" link.
- **Company-size/use-case variance**: the same product can show different fit labels across different "Best tools for X" pages — a tool ranked "Best fit" for enterprise can be "Weak fit" for solo founders on budget grounds, and both labels coexist without contradiction because they're context-specific.
- **False precision avoidance**: display qualitative fit labels (Best fit/Strong fit/Conditional fit/Weak fit/Insufficient evidence) as the primary UI signal; numeric scores are secondary/expandable detail, never the headline.

***

## Deliverable 10 — Data Model (Relational Schema, Key Entities)

```
Tools (id, name, slug, official_url, parent_company_id, status[active/beta/discontinued/acquired/rebranded],
       founded_year, hq_location, one_line_description, primary_category_id, deployment_model,
       open_source[bool], self_hostable[bool], api_available[bool], last_verified_at)

Categories (id, name, slug, level[1-4], parent_category_id, definition, buyer_intent, deserves_standalone_page[bool])

Features (id, tool_id, category_id, feature_name, verification_status[verified/integration-dependent/beta/announced/discontinued/unverified], evidence_claim_id)

PricingPlans (id, tool_id, plan_name, price, billing_period, currency, pricing_model[flat/seat/usage/custom],
              free_plan[bool], free_trial[bool], price_last_checked_at, source_evidence_id)

EvidenceClaims (id, entity_type, entity_id, field_name, value, source_url, source_type, confidence[high/medium/low], verified_at)

Integrations (id, tool_a_id, tool_b_id, integration_type[native/api/third-party-connector], confidence, evidence_claim_id)

Alternatives (id, tool_id, alternative_tool_id, relationship_type[direct/cheaper/open-source/complementary])

Comparisons (id, tool_ids[], category_id, generated_at, comparison_type[versus/category-table])

StackTemplates (id, name, target_persona, tools[], estimated_monthly_cost_range)

SavedStacks (id, user_id, tools[], created_at) -- non-indexable, user-generated

CorrectionRequests (id, entity_type, entity_id, field_name, submitted_value, source, status[pending/accepted/rejected], reviewed_at)
```

**Duplicate prevention**: unique constraint on (official_url, normalized_name); fuzzy-match check on new tool submission against existing slugs.
**Rebrand/acquisition handling**: `status` field plus a `superseded_by_tool_id` self-referencing column; old profile stays live with a banner redirecting to the new entity, never silently deleted (preserves backlinks/citations).
**Historical pricing**: PricingPlans table is append-only (new row per price change, not overwritten) to support "pricing history" display and trend analysis.

***

## Deliverable 11 — SEO & Discovery Strategy

- **Indexable**: Hub, department, category, subcategory (if 10+ unique tools and distinct criteria), tool profiles, best-tools pages (if genuinely differentiated), use-case/persona/industry collections (if genuine unique criteria exist — not auto-generated for every persona×category combination), alternatives pages, versus pages for the top ~20 most-searched pairs, integration pages (5+ verified integrations), free-tool and open-source collections.
- **Non-indexable**: Tool Finder personalized results, Saved Comparisons, filter-parameter URLs that don't meet the 10+ unique result threshold, any auto-generated persona×industry×category combination page without distinct editorial content (this is the core "programmatic thin-page" safeguard).
- **Canonicalization**: all filtered/sorted views of a category canonicalize to the base category URL unless promoted to a standalone Best-Tools page per the threshold rule above.
- **Structured data**: `SoftwareApplication` schema on tool profiles (with `offers` for pricing), `ItemList` on category/best-tools pages, `FAQPage` on category FAQ sections, `BreadcrumbList` sitewide.
- **AI-search citation readiness**: every tool profile and category page should include an extractable 40-80 word "answer nugget" summarizing the product/category, dated evidence footnotes, and clear author/editorial attribution — directly mirroring MaximusLabs' own GEO methodology, so the directory itself becomes AI-citable.
- **Duplicate-content prevention**: versus pages must contain unique comparative analysis, not a reassembly of two tool profiles; category pages must not duplicate hub-page copy.

***

## Deliverable 12 — Implementation Roadmap

### Stage 1: Minimum Useful Hub
**Features**: Tools hub, department/category pages, 50-70 tool profiles (Phase 2 inventory), basic comparison tables, static best-tools pages for top 5 categories.
**Content**: All Phase 2 verified data published; category definitions from Phase 1/3.
**Engineering**: Static/CMS-driven pages, no personalization logic.
**Risks**: Thin coverage outside priority categories (per Phase 2 Section 2 gaps).
**Success metric**: organic sessions to category pages, time-on-page.

### Stage 2: Decision & Comparison Platform
**Features**: Full comparison engine (Deliverable 5), Versus pages for top 20 pairs, Alternatives pages, integration pages, trust/freshness badges live.
**Content**: Expand inventory toward 150+ (Phase 2 gap categories).
**Engineering**: Normalized comparison data model (Deliverable 10), correction-request workflow.
**Risks**: Evidence gaps for enterprise/custom-priced tools slow comparison completeness.
**Success metric**: comparison-table engagement, correction submissions (signals trust).

### Stage 3: Personalized Tool-Stack Intelligence
**Features**: Tool Finder questionnaire, Stack Builder with overlap/cost/integration logic, saved stacks, stack templates.
**Content**: Persona/industry collections, stack templates for 8+ company types.
**Engineering**: Scoring engine, user accounts for saved stacks, integration-confidence data maintenance.
**Risks**: Recommendation quality depends entirely on evidence completeness from Stage 1-2 — must not launch before evidence coverage is sufficient.
**Success metric**: Tool Finder completion rate, Stack Builder exports/shares.

***

## Final Output Summary

**1. Central-hub navigation**: Tools Hub → Department → Category → Subcategory → Tool Profile, with parallel cross-cutting entry points (Persona, Industry, Use-case, Free/Open-source, Alternatives, Versus) — see URL architecture above.

**2. Tool-profile spec**: 14-section template with six-tier capability labeling (Verified/Integration-dependent/Beta/Announced/Discontinued/Unverified) — Deliverable 3.

**3. Category-page spec**: 18-part template fully demonstrated on AI Search Visibility Tools — Deliverable 4.

**4. Comparison-engine spec**: global vs. category-specific fields, missing-data/false-precision/enterprise-pricing handling rules, five priority comparison frameworks with corrected positioning (e.g., Otterly.AI vs. Profound are not same-tier competitors) — Deliverable 5.

**5. Tool-finder spec**: 14-question conditional flow, weighted scoring model, hard-exclusion rules, five sample profile results — Deliverable 6.

**6. Stack-builder spec**: overlap/missing-category/pricing/integration-confidence logic, 8 example stack templates with real cost bands — Deliverable 7.

**7. Trust and freshness policy**: claim-level evidence fields, category-specific update cadences, automatic de-recommendation after 6 months, unpublishing after 12 months — Deliverable 8.

**8. Database/CMS model**: 10-entity relational schema with append-only pricing history and rebrand-handling via `superseded_by_tool_id` — Deliverable 10.

**9. First 90-day roadmap**: Stage 1 (Minimum Useful Hub) as the 90-day target, given Stage 2/3 depend on evidence completeness Stage 1 alone cannot deliver.

**10. Features not to build initially**: Stack Builder, Tool Finder scoring engine, user accounts/saved stacks, sponsorship program, historical pricing trend charts — all deferred to Stage 2-3 since they require data maturity Stage 1 doesn't yet have.

**11. Open research questions**: (a) whether Ahrefs Brand Radar/Semrush AI Toolkit should ever appear in the same ranked list as native AI-visibility platforms or only as a cross-reference; (b) confirmed agency/white-label support for Peec AI and Profound — currently unverified; (c) true current pricing for Dreamdata/HockeyStack (third-party estimates conflict); (d) the ~10+ missing categories flagged in Phase 2 Section 2 remain unresearched.

**12. Continuation prompt for Phase 4** below.

***

### Continuation Prompt for Phase 4

> Continue the marketing/AI-search tools directory project from Phase 3 (decision-intelligence system architecture, delivered August 3, 2026). Preserve the Phase 1 taxonomy, Phase 2's 70-tool verified inventory and evidence standards, and Phase 3's full system specification (tool-profile template, category-page template, comparison-engine rules, Tool Finder logic, Stack Builder logic, trust/freshness policy, data model, and SEO/indexability rules). Proceed to **Phase 4: Content Production & Editorial Workflow**, covering: (1) a detailed editorial style guide and voice for tool profiles/category pages consistent with MaximusLabs' research-first, primary-source-first content standards; (2) a prioritized content production calendar for closing the Phase 2 Section 2 category gaps (paid media, CDP, sales engagement, reputation management, LLM observability, CMS, etc.) targeting 40+ additional verified tools; (3) the correction-request and vendor-response workflow in operational detail; (4) a QA checklist per page type before publish, mirroring MaximusLabs' 10-dimension quality scorecard; (5) launch-sequence content briefs for the first 20 category pages, first 20 versus pages, and first 20 best-tools pages identified in Phase 2/3, each with target keyword, search intent, content difficulty, and publishing priority.

---

## References

1. [04_MaximusLabs_Services_FINAL.md](04_MaximusLabs_Services_FINAL.md)

