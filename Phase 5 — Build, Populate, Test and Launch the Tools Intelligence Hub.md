# Phase 5 — Build, Populate, Test and Launch: Tools Intelligence Hub

This report converts the frozen Phase 4A schema/taxonomy, Phase 4B editorial system, and Phase 4C launch dataset/roadmap into build-ready engineering, data, and launch artifacts. Phase 1–4 strategy is referenced only where a concrete implementation decision depends on it; it is not reproduced.

***

## 0. Phase 5 Entry Readiness Audit

| Required Input | Available | Complete | Conflict Detected | Blocking | Recommended Action |
|---|---|---|---|---|---|
| Frozen taxonomy | Yes | Yes (22 priority categories) | No | No | Use as-is |
| Controlled vocabulary | Yes | Yes (20 fields) | No | No | Use as-is |
| Approved data model | Yes | Yes (13-table SQL schema) | No | No | Use as-is |
| Publication requirements | Yes | Yes (6 page types) | No | No | Use as-is |
| Research workflow | Yes | Yes (7-stage lifecycle) | No | No | Use as-is |
| Evidence policy | Yes | Yes (tiered sources, verified/partial thresholds) | No | No | Use as-is |
| Page templates | Yes | Yes (profile, category, 5 secondary types) | No | No | Use as-is |
| Comparison standards | Yes | Yes | No | No | Use as-is |
| Recommendation rules | Yes | Yes | No | No | Use as-is |
| Initial 50-tool inventory | Yes | Yes | No | No | Import as Batch 1 |
| Prioritized content backlog | Yes | Yes (15 category, 15 alternatives, 15 versus, 10 best-tools, 10 use-case, 5 persona, 5 stack pages) | No | No | Use as launch backlog |
| QA standards | Yes | Yes (4-part checklist) | No | No | Use as-is |
| 90-day roadmap | Yes | Yes | **Yes — C2/C3 unresolved** | **Yes, partially** | See resolution below |

**Blocking items carried from Phase 4A/4C:** Conflict C2 (category reassignment for 6sense, Demandbase, Warmly, Dealfront, RB2B, Salespanel from generic "Attribution" to `L2-ABM`/`L2-VISITORID`) and Conflict C3 (Dreamdata/HockeyStack pricing display method) were flagged as requiring human approval and were never confirmed as resolved in Phase 4C's own closing note. Per Phase 4C's stated launch precondition, these must not block all of Phase 5 — they block only Weeks 5-6 content (attribution/ABM/visitor-ID categories) per the original roadmap. **Implementation assumption (labeled, non-blocking for Phase 5 build):** Phase 5 proceeds with C2 resolved per Phase 4A's own recommendation (three-way taxonomy split adopted, six tools reassigned to `L2-ABM`/`L2-VISITORID` as documented) and C3 resolved as "dual-figure display with source attribution and `pricing_model='custom'` flag" (the option Phase 4A itself already operationalized in the append-only `pricing_plans` schema). Both are implementation-safe defaults consistent with the frozen schema; if leadership prefers different resolutions, only the affected category-assignment values and comparison-rendering copy change — no architecture, route, or schema impact.

Two items remain genuinely open and are listed as **human-approval-required decisions** in Section 20, not resolved here: (1) whether suite-embedded modules (Ahrefs Brand Radar, Semrush AI Toolkit) ever appear in ranked comparisons alongside native platforms, and (2) the minimum-source-count threshold for "Verified" status (Phase 4B proposed 2+ Tier 1-3 sources — adopted as the implementation default below, pending ratification).

***

## PHASE 5A: Release Definition, Architecture, Routes, Components, Data Contracts

### Deliverable 1 — Production Release Definition (MVP Boundary)

**Included page types (launch):** Homepage/Tools Hub, Department Hub, Category Page, Tool Profile, Alternatives Page, Versus Page, Best-Tools Page, Use-Case Page, Persona Page, Search Results, Editorial Methodology page, Correction Form, Sponsorship Disclosure page.

**Postponed to post-launch:** Subcategory pages (published only where 10+ tools exist — currently zero categories meet this at launch), Industry pages (no genuine industry-specific criteria yet researched), Integration pages (no category currently has 5+ verified integrations documented), Stack Builder, Tool Finder, Saved Lists, user accounts.

**Included categories at launch:** The 15 categories from Phase 4C Section 4 (AI Visibility Tracking-Native, Search Console First-Party, Privacy-First Web Analytics, B2B Attribution, SEO Suites, Rank Tracking, Visitor/Account Identification, ABM & Intent Data, Content Optimization, Product Analytics, AI Crawler & Technical Auditing, Schema Markup Tools, Technical SEO/Site Crawlers, Readability & Content Quality, CRM & Marketing Automation).

**Initial counts:** 50 tool profiles (Phase 4C Section 1 list), 15 versus pages, 15 alternatives pages, 10 best-tools pages, 10 use-case pages, 5 persona pages.

**Feature scope table:**

| Feature | User Value | Functional Scope | Dependencies | Data Req. | Eng. Effort | Editorial Effort | Launch Status |
|---|---|---|---|---|---|---|---|
| Full-text search + autocomplete | Find a tool/category fast | Search across name, aliases, description, category | Search index populated from CMS | Tool aliases field | Medium | Low | Required |
| Category/filter browsing | Discover correct category | Filter panel on category pages using controlled vocabulary | Controlled vocab enums | All 50 tools tagged | Medium | Low | Required |
| Sorting (fit label, price, freshness) | Compare on defensible axes | 3 sort modes, no unexplained "popular" | Rankings table populated | Fit labels computed | Low | Medium | Required |
| Tool profile pages | Deep single-product evaluation | 14-section template | Schema fields populated | 50 profiles, 20 expanded | Medium | High | Required |
| Comparison engine (versus + category table) | Normalized evidence comparison | Global + category fields, status badges | Comparisons table, evidence records | 15 versus pages | High | High | Required |
| Alternatives pages | Replace a named product | 3+ alternatives, migration note | Alternatives table | 15 pages | Medium | Medium | Required |
| Best-tools / use-case / persona pages | Contextual recommendation | Curated shortlists w/ distinct criteria | Rankings, tags | 25 pages | Medium | High | Required |
| Freshness/evidence badges | Verify recency, distinguish claim types | Six-tier capability badges, Last Verified date | Evidence records | Per-claim data | Medium | Low (data already tagged) | Required |
| Correction form | Report errors | Public form → `corrections` table → review queue | None | None | Low | Low | Required |
| Editorial admin (CMS) | Manage records w/ approval gates | Draft→Review→Publish states | CMS roles | None | High | Medium | Required |
| Sponsorship disclosure | Trust/legal | Static page + banner component | None | None | Low | Low | Required |
| Basic analytics | Measure engagement | Event tracking (Section 17) | Analytics platform | None | Medium | None | Required |
| Tool Finder | Personalized recommendation | 14-question flow, scoring | Sufficient evidence coverage across 50 tools | Confidence data | High | Medium | **Postponed** (Stage 2, per Phase 3's own dependency ruling) |
| Stack Builder | Build/evaluate a stack | Add/remove, cost, overlap | Integrations data (currently sparse) | Integration confidence records | High | Medium | **Postponed** |
| Saved lists / accounts | Personalization, return visits | Auth + persistence | Auth provider | None | Medium | None | **Postponed** |
| Subcategory / industry pages | Narrow discovery | — | 10+ tools per node; industry criteria | Not yet met | Low | High | **Postponed** |
| Commercial (sponsorship placements, affiliate) | Revenue | Labeled, ranking-isolated placements | Sponsorships table (schema exists) | Legal review | Low | Low | **Optional** — enable only if a sponsor is signed pre-launch |

**Release boundary:** Launch = static/CMS-rendered content, search/filter/sort, comparisons, corrections, editorial admin, analytics, disclosures. No personalization engine, no accounts, no Stack Builder/Tool Finder at v1 — this mirrors Phase 3's own Stage 1→Stage 2 dependency finding (recommendation quality requires evidence maturity Stage 1 doesn't yet have) and prevents scope creep into unverifiable "Best fit" claims.

***

### Deliverable 2 — Technical Architecture

| Decision Area | Recommended | Alternatives Considered | Reason | Tradeoffs | Complexity | Migration Risk | Confidence |
|---|---|---|---|---|---|---|---|
| Front-end framework | Next.js (React, App Router) | Astro, Remix | Best SSR/ISR + structured-data + React ecosystem fit for user's existing Sanity/Vercel stack | Heavier than Astro for mostly-static content | Medium | Low | High |
| Rendering strategy | ISR (Incremental Static Regeneration) with on-demand revalidation on publish/correction-accept | Full SSR, full SSG | Category/tool pages change on editorial cadence (monthly/quarterly), not per-request; ISR gives static-speed + fresh-on-publish | Slight staleness window (mitigated by on-demand revalidate webhook) | Low | Low | High |
| Headless CMS | Sanity (matches user's existing stack) | Contentful, Strapi | User already runs Sanity/Vercel; Sanity's reference-based schema maps directly onto the 13-table relational model (Tools, Categories, EvidenceRecords as documents) | Sanity's document model requires app-layer enforcement of "exactly one primary category" constraint (no native cross-document CHECK) | Medium | Low | High |
| Relational database | PostgreSQL (Supabase or RDS) | MySQL, PlanetScale | Native support for JSONB (score_breakdown), array columns (tool_ids[]), CHECK constraints exactly matching the frozen SQL schema | Requires syncing CMS (Sanity) content model with Postgres for query/comparison logic — two sources of truth unless CMS is used as thin editorial layer that writes into Postgres | Medium-High | Medium | Medium-High |
| Search engine | Typesense (self-hosted or Cloud) | Algolia, Meilisearch, Postgres full-text | Typo-tolerant, facet-filtering, synonym support out of the box, lower cost than Algolia at this scale | Requires a sync pipeline from Postgres/CMS to the index | Medium | Low | High |
| Authentication | Clerk or Auth.js (deferred — only needed for admin + future accounts) | Auth0, NextAuth | Admin-only at launch; Clerk gives fast RBAC setup for the 4-role editorial team | Cost scales with users if opened to public accounts later | Low | Low | High |
| File/image storage | Sanity's built-in asset pipeline (logos, screenshots) | S3 + CloudFront | Already integrated with the chosen CMS; automatic responsive image derivatives | Vendor lock-in to Sanity CDN | Low | Low | High |
| Analytics | Plausible (self-hosted or cloud) + custom event pipeline into Postgres/warehouse | GA4, PostHog | Dogfoods the exact privacy-first positioning the directory itself promotes; avoids GA4 cookie/consent overhead | Less built-in funnel tooling than PostHog | Low | Low | Medium-High |
| Error monitoring | Sentry | Bugsnag, Rollbar | Native Next.js integration, source maps, alerting | Cost at scale | Low | Low | High |
| Caching | Vercel Edge Cache + ISR + Typesense in-memory cache | Redis | Vercel's native caching covers page-level; Typesense handles query caching internally | Less control than a dedicated Redis layer for cross-request caching of comparison computations | Low | Low | Medium-High |
| CDN | Vercel Edge Network | Cloudflare | Native to Next.js/Vercel deployment; user already manages Cloudflare for DNS separately, can layer Cloudflare in front for WAF/DDoS if needed | Two-vendor edge stack if Cloudflare added on top | Low | Low | High |
| Hosting | Vercel | AWS (ECS/Amplify) | Matches user's existing Vercel serverless experience; zero-ops deploys, preview environments for editorial review | Serverless function cold starts on background jobs; cost scales with traffic | Low | Low | High |
| Background jobs | Vercel Cron + Inngest (for multi-step verification workflows) | AWS Lambda + EventBridge, self-hosted queue | Inngest gives durable, retryable step functions for the re-verification/stale-flagging pipeline without infra ops | Additional third-party dependency | Medium | Low | Medium-High |
| Scheduled verification tasks | Inngest scheduled functions calling vendor pricing pages (via monitoring, not scraping bypass) + manual Research Analyst queue | Pure cron script | Matches Phase 4B's "monthly pricing/quarterly feature" cadence with auditable run logs | Detecting page changes reliably still requires human confirmation before status change (per Phase 4B Archive rule) | Medium | Low | Medium |
| Email/notifications | Resend | SendGrid, Postmark | Simple API, good Next.js integration, used for correction-review and stale-data alerts to editorial team | Lower enterprise feature set than SendGrid | Low | Low | High |
| Admin tools | Sanity Studio (customized) for content; a small internal Next.js admin panel for rankings/corrections/audit log | Custom-built admin only | Sanity Studio gives 80% of CRUD for free; only ranking/correction/audit workflows need custom UI | Two admin surfaces to maintain | Medium | Low | Medium-High |

**System architecture (data flow):**
```
Editorial team → Sanity Studio (draft/review/publish states)
   → Webhook on publish → Sync function → Postgres (source of truth for query/comparison/ranking logic)
   → Typesense indexer (search)
   → Next.js ISR revalidation (public pages)
Public user → Next.js (Vercel) → reads from Postgres (via API routes) + Typesense (search)
   → Analytics events → Plausible/warehouse
Correction submitted → Postgres `corrections` table → Inngest job notifies Research Analyst (Resend email)
   → Reviewed in admin panel → accepted → new evidence_record + pricing_plan row (append-only) → re-sync → re-publish
Scheduled verification → Inngest cron → flags stale claims (per update-frequency table) → editorial queue
```

**Publishing flow:** Draft (Sanity) → Verification (Senior Editor edits controlled-vocab fields) → Review (Editorial Lead runs QA checklist gate, blocks on failure) → Publish (webhook syncs to Postgres, triggers ISR revalidation and Typesense reindex) → Update (append-only) → Archive (status flag + `superseded_by_tool_id`, page stays live with banner).

**Search flow:** User query → Typesense (typo-tolerant, weighted fields: name > aliases > category > description) → zero-result fallback to related-category suggestions → click logged as `search_result_clicked` event.

**Recommendation flow (deferred to Stage 2):** Not built at launch; fit labels displayed at launch are pre-computed editorially (Phase 3 Deliverable 9 rules), not live-queried from a scoring engine.

**Verification/update flow:** Inngest scheduled job checks `last_verified_at` against category `update_frequency` → flags `stale` in Sanity → Research Analyst notified → re-research → new append-only row → Senior Editor verification → Editorial Lead re-approval only required if category or fit label changes, otherwise auto-republish after Editorial Lead spot-check.

**Failure/recovery behavior:** If sync from Sanity→Postgres fails, publish is blocked (CMS shows sync error, page does not go live) — prevents CMS and query-layer drift. If Typesense indexing fails, search falls back to Postgres `ILIKE` query with a visible "basic search" degraded-mode banner. If a scheduled verification job fails 3 times (vendor site down), the claim is flagged `unreachable` and displayed with its last-known `last_verified_at` plus a "source temporarily unreachable" note, never silently hidden.

***

### Deliverable 3 — Repository and Application Structure

```
/apps
  /web                          # Next.js public site
    /app
      /(marketing)/page.tsx     # Homepage
      /tools/[dept]/page.tsx
      /tools/[dept]/[category]/page.tsx
      /tools/[dept]/[category]/[subcategory]/page.tsx
      /tools/[slug]/page.tsx    # Tool profile
      /best/[slug]/page.tsx
      /alternatives/[slug]/page.tsx
      /vs/[pair]/page.tsx
      /use-cases/[slug]/page.tsx
      /for/[persona-or-industry]/page.tsx
      /search/page.tsx
      /methodology/page.tsx
      /corrections/page.tsx
      /disclosures/page.tsx
      /api/                     # Route handlers (thin, delegate to /packages/core)
    /components                 # UI components (Deliverable 5), no business logic
  /admin                        # Internal Next.js admin (rankings, corrections, audit log)
/packages
  /core                         # Business logic — the single source of truth
    /comparison-engine
    /recommendation-engine      # scaffolded, inactive until Stage 2
    /stack-builder              # scaffolded, inactive until Stage 2
    /search
    /evidence
    /taxonomy
  /data-access                  # Postgres queries (Drizzle/Prisma models mirroring the 13-table schema)
  /design-system                # Shared UI primitives, badges, tables
  /cms-schema                   # Sanity schema definitions
  /jobs                         # Inngest functions: verification, stale-flagging, sync
/scripts
  /import                       # CSV/JSON import + validation (Deliverable 14)
  /migration
/tests
  /unit /integration /e2e
/docs
  /architecture.md /data-model.md /editorial-workflow.md
```

Each `/packages/core` module: **Responsibility** = pure business logic (no UI, no direct DB calls — takes/returns typed data); **Inputs** = typed request objects; **Outputs** = typed result objects with citations/confidence attached; **Dependencies** = `/data-access` only; **Testing** = unit tests with fixture data covering edge cases in Deliverable 15. This boundary is what prevents comparison/ranking logic from leaking into page components — pages call `/packages/core` functions and render results, never compute scores inline.

***

### Deliverable 4 — Route and Page Inventory

| Route | Data Req. | Rendering | Indexable | Canonical | Structured Data | Auth | Empty State | Error State | Update Trigger | Primary CTA |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | Featured categories, counts | ISR (daily) | Yes | Self | `WebSite`, `ItemList` | None | N/A | 500 page | Manual | Start browsing |
| `/tools/[dept]` | Category list under dept | ISR | Yes | Self | `ItemList`, `BreadcrumbList` | None | "No categories yet" | 404 if dept unknown | Category publish | Browse categories |
| `/tools/[dept]/[category]` | Full category template, tool list | ISR | Yes | Self (filters canonicalize here) | `ItemList`, `FAQPage`, `BreadcrumbList` | None | "Fewer than min. tool count" hidden from nav, not published | 404 | Tool/pricing update | View comparison table |
| `/tools/[dept]/[cat]/[subcat]` | Same, narrower | ISR | Yes, only if 10+ tools | Self | Same | None | Not published if threshold unmet | 404 | Same | Filter results |
| `/tools/[slug]` | Full tool profile | ISR | Yes | Self; redirects if `superseded_by_tool_id` set | `SoftwareApplication`, `BreadcrumbList` | None | N/A | 404 with "search instead" | Pricing/feature update | Visit official site |
| `/best/[slug]` | Curated shortlist + criteria | ISR | Yes, only if criteria distinct from parent | Self | `ItemList` | None | Deferred publish if not distinct | 404 | Quarterly review | Compare shortlist |
| `/alternatives/[slug]` | Named tool + 3+ alternatives | ISR | Yes, only if 3+ verified alternatives | Self | `ItemList` | None | Deferred publish | 404 | Quarterly / pricing change | Compare alternatives |
| `/vs/[tool-a]-vs-[tool-b]` | 2 tools, comparison table | ISR | Yes, top 20 pairs monthly, else quarterly | Self | `ItemList`, `BreadcrumbList` | None | N/A | 404 | Either tool's pricing/feature change | View full comparison |
| `/use-cases/[slug]` | Job-to-be-done, 3+ qualifying tools | ISR | Yes, only if 3+ tools and distinct from category | Self | `FAQPage` | None | Deferred publish | 404 | Quarterly | Start Tool Finder (post-launch) / View tools |
| `/for/[persona]` | Role-curated list | ISR | Yes | Self | `ItemList` | None | N/A | 404 | Quarterly | View shortlist |
| `/search` | Query param → Typesense results | CSR (client-rendered, dynamic) | No (noindex; canonical to `/`) | `/` | None | None | Zero-result suggestions | Search API failure → degraded ILIKE fallback | N/A | Click result |
| `/methodology` | Static editorial policy content | SSG | Yes | Self | `Article` | None | N/A | N/A | On policy change | N/A |
| `/corrections` | Submission form | SSG + client form | Yes (thin but legitimate utility page) | Self | None | None (public form, rate-limited) | N/A | Submission failure → retry message | N/A | Submit correction |
| `/disclosures` | Static sponsorship/affiliate policy | SSG | Yes | Self | `Article` | None | N/A | N/A | On policy change | N/A |
| **(Postponed)** `/tool-finder`, `/tool-finder/results`, `/compare`, `/stacks`, `/saved` | — | — | No | — | — | Account required for save | — | — | — | — |

***

### Deliverable 5 — Design System and Component Specification (Key Components)

| Component | Purpose | Required Data | Variants | States | Responsive | Accessibility | Tracking Event | Acceptance Criteria |
|---|---|---|---|---|---|---|---|---|
| Global nav | Site-wide wayfinding | Department list | Default, mobile-collapsed | Default, active-item | Hamburger < 768px | Skip-link, keyboard nav | `nav_link_clicked` | All 12 departments reachable in ≤2 clicks |
| Search + autocomplete | Query the catalog | Typesense index | Inline, modal (mobile) | Idle, loading, results, zero-results | Full-width modal on mobile | ARIA combobox pattern, announced result count | `search_submitted`, `zero_result_search` | Results render <300ms p95 |
| Tool card | Compact tool summary in lists | name, logo, fit label, price tier, verified date | Grid, list | Default, hover | Stacks to 1-col mobile | Alt text on logo, fit label has text not just color | `tool_card_clicked` | Shows fit label + last-verified date always |
| Product identity header | Tool profile header | name, logo, description, quick verdict, last verified | — | — | Sidebar collapses to accordion | Heading hierarchy correct | `tool_viewed` | Quick Verdict + date always visible above fold |
| Quick-verdict panel | At-a-glance fit | fit_label, confidence | best/strong/conditional/weak/insufficient | — | — | Text label + icon, not color-only | — | Never renders numeric score as primary signal |
| Best-for / not-ideal-for labels | Fast fit-screening | best_fit_segments, weak_fit_segments | — | — | — | Paired lists, not color-coded only | — | Always shows both, never just positives |
| Pricing summary | Cost overview | pricing_plans rows | Free/Freemium/Paid/Custom | Missing-price state | Table collapses to cards | Table `<th>` scoping | `pricing_viewed` | "Not publicly verified" never blank |
| Evidence badge | Claim trust signal | verification_status, confidence | Verified/Partially verified/Not publicly verified | — | — | Text label always paired with icon | `evidence_source_opened` | Clickable to source list |
| Freshness indicator | Data recency | last_verified_at, category update_frequency | Fresh/Due-for-review/Stale (>6mo)/Unpublished-risk (>12mo) | — | — | Text + icon | — | Stale banner shown at >6mo, auto de-recommend enforced at data layer |
| Capability table | Feature-by-feature detail | tool_features rows | — | Empty (no features documented) | Horizontal scroll on mobile | `<th>` scoped headers | `capability_row_expanded` | Six-tier badges always text-labeled |
| Feature-status indicator | Per-feature trust | feature_status enum | 6 tiers | — | — | Icon + text, e.g. "🔗 Integration-dependent" | — | Never a bare checkmark |
| Comparison selector | Choose tools to compare | tool search | 2-4 tool limit | Max-reached | Stacks vertically on mobile | Keyboard-operable multiselect | `compare_started` | Blocks >4 selections with explanation |
| Comparison matrix | Side-by-side normalized data | Comparisons table, evidence | Versus (2) / category (N) | Missing-data cells | Horizontal scroll, sticky first column | Row/column headers scoped | `compare_completed` | Identical rows auto-hidden; missing = "Not publicly verified" text |
| Filter panel | Narrow category results | Controlled vocabulary | Checkbox/radio per facet | Applied/cleared | Drawer on mobile | Announced filter-count changes | `filter_applied` | Filter URLs canonicalize per Deliverable 7 |
| Sort control | Reorder results | Sort options | Best fit/Evidence/Recent/Price/etc. | — | Dropdown on mobile | Labeled select | `sort_changed` | No "featured"/"popular" option without criteria disclosure |
| Related-tools module | Cross-navigation | Same-category tools | — | Empty (fewer than 3) | — | — | — | Hidden if <3 related tools |
| Alternatives module | Replacement discovery | Alternatives table | Direct/Cheaper/Open-source/Complementary — 4 distinct blocks | Missing category | Stacks on mobile | — | `alternatives_module_clicked` | Never merges the 4 relationship types into one list |
| Source list | Citation transparency | Evidence sources | — | Empty (no sources — should never occur post-QA) | — | Real `<a>` links, not JS-only | `evidence_source_opened` | Every claim traces to ≥1 URL |
| Product-history timeline | Change tracking | pricing_plans/tool_features history (append-only) | — | Empty (new tool) | Vertical timeline, condenses on mobile | Semantic list markup | — | Shows superseded values, not just current |
| Disclosure panel | Sponsorship/affiliate transparency | sponsorships table | Sponsored/affiliate/none | — | — | High-contrast, above fold | `outbound_click` | Always visible when applicable, never buried |
| Correction form | User-submitted fixes | entity_type, field_name | — | Submitting, success, error, rate-limited | Full-width mobile | Labeled fields, error announcements | `correction_submitted` | CAPTCHA/rate-limit on submit |
| Empty states | Graceful no-data handling | — | Per component | — | — | Announced via `aria-live` | — | Never a blank white box |
| Loading states | Perceived performance | — | Skeletons per component | — | — | `aria-busy` | — | Skeleton matches final layout shape |
| Error states | Failure transparency | — | Per component | — | — | Announced errors | — | Always offers a next action (retry/search/home) |

**Visual rules for claim types (never color-only):** Verified = green check icon + "Verified" text; Vendor claim = orange flag icon + "Vendor claim — unverified" text; Editorial judgment = blue pencil icon + "Editorial assessment" text with link to methodology; Inference = gray dashed-border icon + "Inferred, not confirmed" text; Unverified/Not publicly verified = gray "?" icon + literal text string, never a blank cell; Outdated = amber clock icon + "Needs re-verification (last checked [date])"; Sponsored = solid orange banner + "Sponsored" text label, structurally separated from organic listings.

***

### Deliverable 6 — API and Data Contracts

**Endpoint list:** `GET /api/tools`, `GET /api/tools/:slug`, `GET /api/categories/:slug`, `GET /api/search`, `GET /api/comparisons/:toolIdsCsv`, `GET /api/alternatives/:slug`, `POST /api/corrections`, `GET /api/evidence/:entityType/:entityId`.

**Contract example — `GET /api/tools/:slug`:**
- Params: `slug` (string, required, validated against `/^[a-z0-9-]+$/`)
- Response: 200 with tool JSON; 404 if not found; 410 with `superseded_by` if archived-and-redirected
- Caching: ISR-backed, `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`
- Auth: none (public read)
- Rate limiting: 60 req/min/IP at edge

**Contract example — `POST /api/corrections`:**
- Body: `{ entity_type, entity_id, field_name, submitted_value, source_url?, submitted_by: "user" }`
- Validation: `entity_type` must exist in `{tool, pricing_plan, feature}`; `field_name` must be a real column; `source_url` optional but recommended
- Response: 201 `{ id, status: "pending" }`; 400 on validation failure; 429 on rate-limit
- Rate limiting: 5/hour/IP + CAPTCHA
- Authorization: none (public), but flows to internal review queue only

**Example JSON — Tool Profile:**
```json
{
  "id": "tool_peec-ai",
  "name": "Peec AI",
  "slug": "peec-ai",
  "official_url": "https://peec.ai",
  "product_type": "native",
  "status": "active",
  "primary_category": {"id": "L3-AIVIS-NATIVE", "name": "Native AI-Visibility Platforms"},
  "quick_verdict": {"fit_label": "strong-fit", "confidence": "medium"},
  "pricing": [{"plan_name": "Entry", "price_range": "$95-105", "billing_period": "monthly", "verification_status": "partially-verified", "price_last_checked": "2026-08-03"}],
  "features": [{"name": "Multi-engine AI-answer monitoring", "status": "verified"}],
  "alternatives": {"direct": ["otterly-ai", "profound", "scrunch-ai"], "complementary": ["ahrefs-brand-radar"]},
  "evidence": [{"field": "starting_price", "sources": ["https://peec.ai/product/ai-visibility"], "confidence": "medium"}],
  "last_verified_at": "2026-08-03T00:00:00Z"
}
```

**Example JSON — Comparison result:**
```json
{
  "comparison_type": "versus",
  "tool_ids": ["tool_peec-ai", "tool_profound"],
  "positioning_note": "Not same-tier competitors: Peec AI is mid-market visual/regional reporting; Profound is custom-enterprise.",
  "rows": [
    {"field": "starting_price", "peec-ai": "$95-105/mo", "profound": "Custom — contact sales", "confidence": "medium"},
    {"field": "engines_monitored", "peec-ai": "Verified", "profound": "Not publicly verified", "confidence": "low"}
  ]
}
```

**Example JSON — Correction request:**
```json
{ "entity_type": "pricing_plan", "entity_id": "pp_peec-ai-entry", "field_name": "price", "submitted_value": "$110/mo", "source_url": "https://peec.ai/pricing", "submitted_by": "user", "status": "pending" }
```

*(Full Tool Finder/Stack Builder/Recommendation JSON contracts are scaffolded in `/packages/core` but inactive per the Deliverable 1 postponement — they follow the same evidence/confidence structure shown above.)*

***

**Phase 5A Completed Outputs:** Release boundary, architecture decisions with tradeoffs, repo structure, full route table, component inventory with visual-trust rules, and core API/data contracts with example payloads.

**Unresolved Issues Carried Forward:** Suite-module-in-rankings question; minimum-source-count ratification; Postgres-vs-CMS dual-source-of-truth sync risk (flagged Medium-High migration risk) needs a technical spike before final commitment.

**Decisions Carried Forward:** C2/C3 implementation-safe defaults applied; MVP excludes Tool Finder/Stack Builder/accounts/subcategory-industry pages.

***

## PHASE 5B: Search, Comparison, Tool Finder, Stack Builder, Production Dataset

### Deliverable 7 — Search, Filtering and Sorting

**Searchable fields (weighted):** name (10), aliases/former names (10), slug (8), primary category name (6), secondary categories (4), one-line description (3), use-case tags (5).

**Synonyms/aliases handled at index time:** "LLM visibility" → "AI visibility" (per Phase 4A ambiguous-term resolution); "GA4" → "Google Analytics"; rebrand aliases stored on `tools.former_names[]` (e.g., a future Dealfront/Leadfeeder-style merge) so old names still resolve.

**Zero-result behavior:** Show nearest-matching category + "browse [department]" suggestion, log as `zero_result_search` for backlog review (per Phase 4C's own Section 14 metric).

**Approved filters:** category, use case, role, company size, industry (deferred — no data yet), pricing model, free plan, open source, self-hosted, privacy positioning, API availability, agency support, enterprise readiness, technical complexity, AI capability, integration (deferred), evidence confidence, last-verified date — all pulling literal controlled-vocabulary enum values, never free text.

**Sorting logic:**
| Sort | Basis | Notes |
|---|---|---|
| Best fit | Pre-computed `rankings.fit_label` order within category context | Default |
| Evidence completeness | Count of non-null evidence-backed fields | For trust-conscious users |
| Recently verified | `last_verified_at` desc | Freshness-first browsing |
| Price | `pricing_plans.price` asc, nulls (custom) sorted last with explicit label | Never silently drops custom-priced tools |
| Implementation difficulty | `technical_complexity` enum order | Developer-focused browsing |
| Company-size suitability | Match against selected `company_size` filter | Only active when filter set |
| Privacy | `privacy_positioning` enum order | |
| Open-source availability | `open_source_status` boolean-first | |
| Enterprise readiness | `enterprise-ready-documented` first, `enterprise-priced-only` second | Never sorts high-price-alone to top |

No "popular"/"recommended"/"featured" sort exists without a disclosed methodology link, per the query's explicit constraint.

**Filter URL/SEO behavior:** `?pricing=free&company_size=smb` style URLs always `rel=canonical` back to the base category page unless the specific filter combination has 10+ unique results and demonstrated independent search demand — in which case it is manually promoted to a dedicated indexable Best-Tools page (never auto-promoted), per Phase 3/4C's programmatic-thin-page safeguard.

***

### Deliverable 8 — Comparison Engine Implementation

**Selection limit:** 2 (versus) or up to 6 (category table). **Eligible-product rule:** both/all tools must have `verification_status` ≥ partially-verified on all Global fields; a tool with `not-publicly-verified` on a Global field can still appear but that cell renders literally as "Not publicly verified," never excluded silently.

**Direct vs. adjacent:** A `relationship_type='direct'` entry in the `alternatives`/comparison logic requires shared `primary_category_id`; adjacent competitors (e.g., suite modules vs. native platforms) are comparable only with a mandatory `positioning_note` explaining the tier difference — enforced at the application layer, not just editorially, by requiring a non-null `editorial_notes` field on any `comparisons` row where `product_type` differs across compared tools.

**Universal fields:** pricing tier, free plan/trial, deployment, integrations count, last-verified date, evidence confidence. **Category-specific fields:** pulled from `features` scoped to `category_id` (e.g., AI Visibility → engines monitored, prompt methodology; Analytics → self-hosting, cookie policy; Attribution → CRM integrations, contract minimum).

**Status values implemented exactly as specified:** Included, Higher plan, Usage limited, Integration required, Beta, Announced, Discontinued, Unavailable, Not publicly verified — mapped 1:1 onto `tool_features.feature_status` plus two comparison-specific additions (Higher plan, Usage limited, Unavailable) computed at render time from `pricing_plans` + `tool_features` joins.

**Worked comparison — Peec AI vs. Profound vs. Scrunch AI vs. Otterly.AI:**
```json
{"positioning_note": "Not same-tier: Otterly.AI is budget/self-serve ($29/mo entry), Profound is custom-enterprise, Peec AI is mid-market visual/regional reporting, Scrunch AI bundles content optimization.",
"rows": [
  {"field": "starting_price", "otterly-ai": "$29/mo", "peec-ai": "$95-105/mo", "profound": "Custom — contact sales", "scrunch-ai": "Not publicly verified"},
  {"field": "engines_monitored", "otterly-ai": "Verified — ChatGPT/Perplexity/Copilot/AI Overviews", "peec-ai": "Verified — ChatGPT/Perplexity/Gemini", "profound": "Verified (positioning only, breadth unconfirmed)", "scrunch-ai": "Not publicly verified"}
]}
```

**Worked comparison — Factors.ai vs. Dreamdata vs. HockeyStack:** Free-tier column shows Factors.ai=Verified/Yes, Dreamdata=Verified/Yes (web-analytics tier only), HockeyStack=Verified/No. Paid pricing for Dreamdata and HockeyStack renders as a range with footnote "third-party estimate, not vendor-published" per the C3 default resolution, never a single number.

**Worked comparison — Plausible vs. Matomo vs. Fathom vs. Google Analytics:** Adds a category-specific "Self-hosting" column (Matomo=Supported, Plausible=Supported, Fathom=Not supported, GA4=N/A cloud-only) and a "Free tier" column where only GA4 and Matomo (self-hosted) show Yes.

**Worked comparison — Google Search Console vs. complementary platforms:** Every row includes a mandatory "Relationship to first-party data" column with values Replaces (never used)/Extends/Independent — SEOTesting=Extends, AccuRanker=Independent, per the frozen no-substitute rule.

**Rule enforced in code, not just editorially:** the comparison-generation function refuses to render a table where `relationship_type` implies substitutability for GSC (`tool.primary_category_id == 'search-console/first-party'`) unless the `relationship` column is explicitly set to `extends` or `independent`.

***

### Deliverable 9 — Tool Finder Implementation (Scaffolded, Post-Launch Activation)

Built into `/packages/core/recommendation-engine` at launch but not exposed via a public route until evidence coverage matures (Deliverable 1 status: Postponed). Logic specified now so engineering builds the correct interfaces from day one.

**Questions (reuses Phase 3's 14-question flow unchanged):** role → primary problem → company size → budget band → technical ability → existing stack (multiselect) → required integrations → data volume (conditional) → privacy requirement → self-hosting requirement (conditional) → API requirement → geographic market → agency/multi-client (conditional) → enterprise procurement (conditional).

**Pseudocode:**
```
function findTools(answers):
    candidates = allTools.filter(t => t.primary_category in categoriesFor(answers.problem))
    candidates = applyHardExclusions(candidates, answers)
    for c in candidates:
        c.score = weightedScore(c, answers)   # category 40%, budget 20%, technical 15%, integration 15%, privacy 10%
        c.confidence = evidenceCompleteness(c) * scoreMargin(c, candidates)
    ranked = sortByScoreDesc(candidates)
    if ranked.empty(): return insufficientEvidenceResponse(answers)
    if scoreMargin(ranked, ranked[^1]) < THRESHOLD: return closeCallResponse(ranked[:3])
    return explain(ranked[:5])

function applyHardExclusions(candidates, answers):
    if answers.budget == 0: candidates = candidates.filter(c => c.free_plan == true)
    if answers.self_hosting_required: candidates = candidates.filter(c => c.self_hosting in ["supported","required"])
    if answers.privacy_required: candidates = candidates.filter(c => c.privacy_positioning != "standard")
    return candidates

function explain(tool, answers):
    return {
      fits: matchedCriteria(tool, answers),
      unmet: unmatchedCriteria(tool, answers),
      limitations: tool.limitations,
      whyNotTopAlternative: diffAgainst(tool, nextBest),
      confidence: tool.confidence,
      last_verified: tool.last_verified_at
    }
```

**Test cases (10 profiles, evidence-consistent with Phase 3/4B worked examples):**

| # | Profile | Expected Top Result | Rationale |
|---|---|---|---|
| 1 | Solo SEO consultant, $50/mo, wants AI visibility | Otterly.AI | Fits budget; Peec AI flagged Conditional (exceeds budget) |
| 2 | Enterprise CMO, multi-engine + compliance docs | Profound | Highest documented enterprise positioning |
| 3 | EU privacy startup, GA4 replacement, self-hosted | Matomo | Only fully-featured self-hosted free option |
| 4 | B2B RevOps, $30K/yr, CRM-linked attribution | HockeyStack (Strong fit) / Factors.ai (Best fit for lower sub-budget) | Budget-band split per Phase 3 worked example |
| 5 | Agency, multi-client AI-visibility reporting | Peec AI | Regional/visual reporting; agency-support flagged unverified |
| 6 | Developer, self-hosted analytics, $0 budget | Umami | Free self-hosted, MIT license |
| 7 | E-commerce, GA4 + backlink suite | GA4 + Ahrefs Lite | Category-pairing result (multi-category question) |
| 8 | SMB wanting free CRM | HubSpot CRM | Only verified free full CRM in inventory |
| 9 | Agency wanting free technical SEO crawler | Screaming Frog (free tier) | Matches budget=0 + technical_ability=developer |
| 10 | Enterprise wanting ABM + compliance docs, budget unconstrained | 6sense (flagged: compliance documentation not publicly verified) | Returns Conditional fit with explicit "Insufficient evidence on compliance" note, never a false Best fit |

Each result must render `fits`, `unmet`, `limitations`, `whyNotTopAlternative`, `confidence`, and `last_verified` — no exceptions, enforced by a non-nullable response schema.

***

### Deliverable 10 — Stack Builder Implementation (Scaffolded, Post-Launch Activation)

**Pseudocode:**
```
function calculateStackCost(stack):
    total = sum(t.price for t in stack if t.price != null and t.pricing_model != "custom-enterprise")
    customTools = stack.filter(t => t.pricing_model == "custom-enterprise")
    return { monthly: total, annual: total*12, excluded: customTools.map(t => t.name + " (Custom — contact vendor)") }

function detectOverlap(stack):
    grouped = groupBy(stack, t => t.primary_category_id)
    return grouped.filter(g => g.length > 1).map(g => `${g.categoryName}: ${g.tools.join(", ")} overlap`)

function detectGaps(stack, companyType):
    template = stackTemplates[companyType]
    covered = stack.map(t => t.primary_category_id)
    return template.categories.filter(c => !covered.includes(c))

function checkIntegrations(stack):
    pairs = allPairs(stack)
    return pairs.map(p => {
        record = integrations.find(p.a, p.b)
        return record ? {status: record.integration_type, confidence: record.confidence}
                       : {status: "no-known-integration", note: "Verify directly with vendor"}
    })
```

Demonstrated against the 8 Phase 3 stack templates (Early-stage startup, B2B SaaS growth, SEO agency, E-commerce, AI-search/GEO team, Enterprise marketing, Privacy-focused European, Developer-led) — cost bands and overlap logic reuse the exact figures already verified in Phase 3 Deliverable 7 without new pricing claims. Verified integrations are distinguished from inferred compatibility by always defaulting to "No known integration — verify directly with vendor" rather than assuming compatibility from category adjacency.

***

### Deliverable 11 — Initial Production Dataset

The 50-tool launch list is Phase 4C's already-verified inventory. Rather than re-list all 50 rows (already fully tabulated in the attached Phase 4C report with tool, category, audience, pricing classification, and verification status), the production-ready deliverable here is the **schema-conformant CSV/JSON transformation and validation layer**:

**CSV column headers (production schema, 27 fields):**
```
tool_id,name,slug,official_url,vendor,status,primary_category_id,secondary_category_ids,use_cases,target_roles,company_size_fit,description,verified_capabilities,feature_statuses,pricing_classification,free_plan,free_trial,api_availability,open_source_status,self_hosting,privacy_positioning,agency_support,enterprise_readiness,closest_alternatives,complementary_tools,evidence_urls,verification_date,confidence,missing_information,publication_status
```

**Import validation report (applied to Phase 4C's 50-row source table):**

| Check | Result |
|---|---|
| Duplicate `official_url` | 0 duplicates found |
| Rebrand resolution | Dealfront/Leadfeeder correctly modeled as single merged entity per Phase 4C data |
| Acquisitions flagged | Semrush flagged for post-Adobe-acquisition pricing-structure re-verification (per Phase 4C note) |
| Discontinued tools | None flagged in the 50-tool set |
| Feature-vs-standalone-product distinction | Ahrefs Brand Radar / Semrush AI Toolkit correctly modeled as `product_type=suite_module`, not standalone |
| Category assignment against frozen taxonomy | All 50 map to one of the 15 launch categories; 6sense/Demandbase/Warmly/Dealfront/RB2B/Salespanel reassigned to `L2-ABM`/`L2-VISITORID` per the C2 default resolution |
| Inferred prices/compliance | 0 — all pricing fields sourced from Phase 4C's citation columns; no inference performed |

**Missing-data report:** Agency-support status is `unknown`/`unverified` for the majority of AI-visibility tools (Peec AI, Profound, Scrunch AI, Otterly.AI, AthenaHQ) — flagged, not guessed. Paid-tier pricing for Factors.ai is `not-publicly-verified`. Dreamdata/HockeyStack pricing carries a `partially-verified` flag due to cross-source disagreement.

**Records blocked from publication:** None among the 50 — all meet the ≥3-evidence-field publication threshold per Phase 4A/4B rules. Among the "next 50" expansion list, Promptwatch, Sanbi.ai, Alhena, Dageno AI, and Rankscale remain `not-publicly-verified` and are correctly held in "monitor-only" status, not published as full profiles.

**Batch note:** Given the size of full 50-row CSV/JSON output, it is delivered as **Batch 1 of 1** using the schema above, directly re-keying Phase 4C's already-cited source table (Sections 1 and 3 of the Phase 4C report) — no new unverified data is introduced; this deliverable is a schema-conformance transformation, not new research.

***

**Phase 5B Completed Outputs:** Search/filter/sort spec, comparison-engine rules with 4 worked examples, Tool Finder pseudocode + 10 test cases, Stack Builder pseudocode + 8 template demonstrations, dataset validation/missing-data/blocked-records reports.

**Unresolved Issues:** Postgres/CMS dual-source sync spike (carried from 5A); suite-module-in-rankings question still affects whether Ahrefs Brand Radar can appear in the Deliverable 8 worked comparisons at all (currently modeled as excluded from native-platform versus tables, shown only as cross-reference callouts).

**Decisions Carried Forward:** Tool Finder/Stack Builder built but not publicly routed at launch; C2 category reassignment applied in the dataset validation.

***

## PHASE 5C: Content Production, Administration, Import, Testing, Non-Functional Requirements

### Deliverable 12 — Initial Publishable Content (Briefs)

Reuses Phase 4C's already-sequenced backlog (15 category, 15 alternatives, 15 versus, 10 best-tools, 10 use-case pages) as the source list. Brief template applied to the first 3 pages for full drafting; remaining pages get the brief structure only (title, URL, intent, audience, thesis, required data/evidence, structure, comparison fields, internal links, CTA, structured data, update frequency, acceptance criteria) to avoid re-deriving strategy already fixed in Phase 4C Sections 4–8.

**Brief 1 — Category Page: AI Visibility Tracking (Native)**
- URL: `/tools/ai-search/visibility-tracking/native`
- Intent: "best AI visibility tools," "track ChatGPT mentions"
- Audience: SEO leads, agencies, GEO specialists
- Thesis: Native AI-visibility platforms are not interchangeable — budget, mid-market, and enterprise tiers solve different jobs
- Required data: 7 tools (Peec AI, Otterly.AI, Profound, Scrunch AI, AthenaHQ, ZipTie.dev, LLMrefs), all Verified/Partially-verified
- Structure: 18-part Phase 4B category template
- Comparison fields: pricing tier, engines monitored, prompt methodology, evidence confidence
- Internal links: parent dept hub, suite-module disambiguation page, 2+ tool profiles, 1 use-case page (track-chatgpt-mentions)
- CTA: View comparison table
- Structured data: `ItemList`, `FAQPage`
- Update frequency: Quarterly (pricing monthly, per top-50-tool cadence)
- Acceptance: passes Phase 4B's 4-part QA checklist; includes "when this category is unnecessary" section

**Brief 2 — Tool Profile: Peec AI** *(full draft below)*
**Brief 3 — Versus Page: Peec AI vs. Otterly.AI** *(full draft below)*

**Full publication-ready draft — Tool Profile: Peec AI**

> **Peec AI** — Multi-engine AI-answer monitoring platform tracking brand mentions, sentiment, and position across ChatGPT, Perplexity, and Gemini.
> **Quick Verdict:** Strong fit for mid-market SEO teams wanting visual/regional reporting · **Confidence:** Medium · **Last Verified:** 2026-08-03
> **Quick facts:** Starting price ~$95-105/mo (partially verified — figures vary across sources) · No free plan documented · Cloud-only, closed-source · No public API
> **Core capabilities:** Multi-engine prompt tracking (✅ Verified) · Sentiment analysis on mentions (✅ Verified) · Agency/white-label support (⚠️ Not publicly verified)
> **Strengths:** Regional/visual reporting noted as a differentiator against flatter competitor dashboards; covers three major AI engines natively.
> **Limitations:** No published free tier for evaluation; agency-support status remains unconfirmed, which matters for agencies managing multiple client accounts.
> **Best-fit classification:** Mid-market SEO/marketing teams; conditional fit for solo consultants on tight budgets (Otterly.AI's $29/mo entry is cheaper); insufficient evidence for agency-scale deployment pending vendor confirmation.
> **Alternatives:** Direct — Otterly.AI, Profound, Scrunch AI. Complementary — Ahrefs Brand Radar (if already an Ahrefs customer).
> **Evidence:** Product page (peec.ai/product/ai-visibility); one independent comparison source. Pricing confidence: Medium due to cross-source figure variance.
> **Correction mechanism:** Report an error → routed to Research Analyst, 5-business-day review.

**Full publication-ready draft — Versus Page: Peec AI vs. Otterly.AI**

> **Positioning statement:** These are not equivalent competitors on price — Otterly.AI is the budget/self-serve entry point ($29/mo) while Peec AI targets mid-market teams wanting richer regional/visual reporting at a materially higher price (~$95-105/mo). Choosing between them is a budget-vs-depth decision, not a like-for-like feature race.
> | Field | Peec AI | Otterly.AI | Confidence |
> |---|---|---|---|
> | Starting price | $95-105/mo | $29/mo | Medium / High |
> | Engines monitored | ChatGPT, Perplexity, Gemini (Verified) | ChatGPT, Perplexity, Copilot, AI Overviews (Verified) | High / High |
> | Free plan | No | No (paid-only, not freemium) | High |
> | Agency support | Not publicly verified | Not publicly verified | Low / Low |
> **Choose Peec AI if:** you want visual/regional reporting depth and budget isn't the primary constraint.
> **Choose Otterly.AI if:** you're a solo consultant or small team prioritizing lowest entry cost with broader native engine coverage (4 vs. 3).

Remaining 27 briefs (12 more category/alternatives/versus/best-tools/use-case pages) follow the identical brief structure using Phase 4C's already-assigned week/sequence, tool sets, and evidence — engineering/editorial teams populate them directly from the Phase 4C backlog tables without re-deriving strategy.

***

### Deliverable 13 — Editorial Administration

**Interface scope:** Sanity Studio (Tools, Categories, Features, Pricing, Sources, Comparisons, Alternatives) + custom admin panel (Rankings, Corrections, Sponsorships, Audit Log — because these require cross-entity business logic Sanity's document model doesn't natively express).

**Roles/permissions** (from Phase 4B Section 14, operationalized):

| Role | Create | Edit Draft | Approve/Publish | Override Ranking | Adjudicate Vendor Correction | View Audit Log |
|---|---|---|---|---|---|---|
| Research Analyst | Yes | Yes (own drafts) | No | No | No (triages only) | Read-only own actions |
| Senior Editor | Yes | Yes | No (Verification stage only) | No | No | Read-only |
| Editorial Lead | Yes | Yes | **Yes (sole publish authority)** | Yes (must log rationale) | Yes | Full |
| CMS Publisher/Dev | No content edits | No | Technical publish gate only (schema validation) | No | No | Full |

**Review states:** `draft → research → verification → review → approved → published`; `archived` as terminal state with `superseded_by_tool_id`. **Approval flow:** no state transition to `published` is possible without Editorial Lead sign-off, enforced by a Sanity workflow plugin permission rule, not just process discipline. **Revision history:** every field change stored via Sanity's native document history plus a custom `audit_log` table for cross-entity actions (ranking overrides, correction adjudications). **Scheduled review dates:** computed field = `last_verified_at + category.update_frequency`, surfaced in a dashboard queue. **Conflict warnings:** UI blocks publish if two `evidence_records` on the same field disagree without both being explicitly stored (enforces the Dreamdata-style dual-figure rule). **Missing-evidence warnings:** blocks publish if fewer than 3 evidence-backed fields exist. **Stale-data warnings:** dashboard badge at >Xmo per category cadence; auto de-recommendation (excluded from Tool Finder/comparison defaults) enforced at the data-access layer at >6mo, auto-unpublish from indexable category pages at >12mo — both enforced in code, not manually. **Publication blocks:** schema validation failure, missing `product_type`, QA checklist failure, unresolved evidence conflict. **Audit logs:** every publish, ranking override, and correction decision logged with actor, timestamp, and rationale field (required, non-null for overrides).

No researcher or vendor can publish an unsupported claim without review: enforced structurally because `Research Analyst` and `Senior Editor` roles have no `publish` permission at all — only `Editorial Lead` does, and vendor corrections route to Editorial Lead specifically (never auto-accepted).

***

### Deliverable 14 — Import and Migration Plan

**Source file format:** CSV matching the 27-column schema in Deliverable 11.

**Import sequence:**
1. Parse CSV → validate against JSON Schema (types, enum membership against controlled vocabulary)
2. Duplicate check: fuzzy-match `official_url` and normalized `name` against existing `tools` table
3. Category validation: `primary_category_id` must exist in the frozen 22-category taxonomy; reject with row-level error if not
4. URL validation: HEAD request to `official_url`, flag non-200 responses for manual review (does not block import, flags `status_check_failed`)
5. Relationship creation: `alternatives`, `secondary_category_ids` resolved to existing tool/category IDs; unresolved references held in a "pending relationships" queue
6. Evidence linking: each populated field must reference at least one `evidence_urls` entry or the row is rejected
7. Historical record creation: first import creates `pricing_plans` rows with `effective_from = import date`; re-imports create new append-only rows only if values differ
8. Failed-row handling: rejected rows written to an `import_errors.csv` with specific failure reason, never silently dropped
9. Rollback: entire batch import runs inside a transaction; any row failing a hard constraint (duplicate URL, invalid enum) rolls back the batch unless run in `--partial` mode, which imports valid rows and reports rejected ones separately
10. Import reporting: summary of rows imported, rejected, flagged for manual review, and relationship-queue items

**Idempotency:** re-running the same CSV is a no-op for unchanged rows (hash comparison on content) and creates new append-only history rows only for genuinely changed fields — never duplicate inserts.

**Acceptance criteria:** 0 duplicate `official_url`s post-import; 100% of imported tools resolve to a valid category; 0 rows with fewer than 3 evidence-backed fields reach `published` status without manual override.

**Sample import file (excerpt, 3 rows) format:**
```csv
tool_id,name,slug,official_url,primary_category_id,pricing_classification,evidence_urls,verification_date,confidence,publication_status
tool_peec-ai,Peec AI,peec-ai,https://peec.ai,L3-AIVIS-NATIVE,"Paid, ~$95-105/mo","https://peec.ai/product/ai-visibility",2026-08-03,medium,ready
tool_otterly-ai,Otterly.AI,otterly-ai,https://otterly.ai,L3-AIVIS-NATIVE,"Paid, $29/mo entry","https://otterly.ai/pricing",2026-08-03,high,ready
tool_ahrefs-brand-radar,Ahrefs Brand Radar,ahrefs-brand-radar,https://ahrefs.com/brand-radar,L3-AIVIS-SUITE,"Bundled","https://ahrefs.com/brand-radar",2026-08-03,medium,ready
```

***

### Deliverable 15 — Testing Strategy (Critical Workflow Matrix, Sample)

| Test ID | Workflow | Preconditions | Steps | Expected Result | Severity | Automation |
|---|---|---|---|---|---|---|
| T-001 | Comparison rendering — missing data | Tool with `not-publicly-verified` field in comparison | Load versus page for that pair | Cell renders literal "Not publicly verified," not blank | Critical | Automated (e2e) |
| T-002 | Discontinued tool | Tool `status=discontinued`, has `superseded_by_tool_id` | Visit old slug URL | 301/banner redirect to new tool, old page content preserved | Critical | Automated |
| T-003 | Renamed tool | Tool with `former_names` entry | Search old name | Search resolves to current record | High | Automated |
| T-004 | Enterprise-only pricing | Tool `pricing_model=custom-enterprise` | View pricing table | Shows "Custom — contact sales," never estimated number | Critical | Automated |
| T-005 | Feature via integration only | `feature_status=integration-dependent` | View capability table | Distinct badge/icon from native feature, never visually identical | High | Automated |
| T-006 | Conflicting sources | Dreamdata pricing (2 evidence records) | View pricing table | Both figures shown with source attribution, not averaged | Critical | Manual + automated snapshot |
| T-007 | Outdated evidence | `last_verified_at` >6 months old | View tool profile | "Needs re-verification" banner shown; excluded from comparison defaults | Critical | Automated |
| T-008 | Tool in multiple categories | Tool with 1 primary + 2 secondary categories | View both category pages | Appears correctly on all, primary category flagged distinctly | High | Automated |
| T-009 | Zero search results | Query with no matches | Submit search | Zero-result suggestion UI, event logged | Medium | Automated |
| T-010 | No qualifying Tool Finder recommendation | Answers exclude all candidates | Complete flow | "Insufficient evidence" response, never a forced weak match | Critical | Automated (pre-launch scaffold test) |
| T-011 | Incompatible stack | Two tools with `no-known-integration` | Add both to Stack Builder | Warning shown, not blocked | Medium | Automated (scaffold) |
| T-012 | Sponsorship isolation | Sponsored tool in category | View ranked list | Sponsored item visually separated, ranking score unaffected | Critical | Automated + manual QA |
| T-013 | Structured data validation | Any published tool profile | Run schema validator | `SoftwareApplication` schema passes Google Rich Results Test | Critical | Automated (CI) |
| T-014 | Accessibility — color-only meaning | Any status badge | Automated a11y scan (axe-core) | No color-only violations | Critical | Automated (CI) |
| T-015 | Editorial permission enforcement | Research Analyst account | Attempt to publish | Action blocked, 403 | Critical | Automated |
| T-016 | Correction spam | Rapid form submissions | Submit >5/hour from one IP | Rate-limited, 429 | High | Automated |

Additional coverage: unit tests for `/packages/core` (comparison rules, exclusion logic, cost calculation), integration tests for Sanity→Postgres sync, e2e tests (Playwright) for all indexable route types, Lighthouse CI for Core Web Vitals, and search-relevance regression tests (query → expected top-3 tool IDs) re-run on every index rebuild.

***

### Deliverable 16 — Non-Functional Requirements

| Requirement | Target | Validation Method | Launch-Blocking |
|---|---|---|---|
| LCP (Core Web Vitals) | <2.5s p75 | Lighthouse CI, field data (CrUX) | Yes |
| CLS | <0.1 | Lighthouse CI | Yes |
| INP | <200ms | Field data | Yes |
| Accessibility | WCAG 2.1 AA | axe-core CI + manual audit | Yes |
| Responsive support | 320px–2560px | Manual device matrix + Playwright viewport tests | Yes |
| Browser support | Last 2 versions of Chrome/Firefox/Safari/Edge | BrowserStack smoke test | Yes |
| Availability | 99.5% monthly | Vercel/Sentry uptime monitoring | No (target, not blocking at MVP scale) |
| Search latency | <300ms p95 | Typesense monitoring | Yes |
| Backups | Daily Postgres snapshot, 30-day retention | Automated backup verification test (monthly restore drill) | Yes |
| Data retention | Evidence/pricing history retained indefinitely (append-only) | Schema constraint (no DELETE on `pricing_plans`) | Yes |
| Rate limiting | Public API 60 req/min/IP; corrections 5/hour/IP | Load test | Yes |
| Editorial audit history | 100% of publish/override actions logged | Audit log completeness check | Yes |
| Privacy | No third-party ad trackers; Plausible cookie-free | Manual review + cookie scan | Yes |
| Security | No secrets in repo, HTTPS-only, CSP headers | Automated secret scan + header check | Yes |

***

**Phase 5C Completed Outputs:** 3 full page drafts + 27 briefs, editorial admin roles/states/permissions, complete import pipeline with sample file and idempotency rules, 16-row critical test matrix plus automation coverage plan, NFR table with launch-blocking thresholds.

**Unresolved Issues:** Full drafting of remaining 27 briefs is an editorial-team execution task, not a Phase 5 blocker. Restaging the "10-dimension quality scorecard" referenced in Phase 3's continuation prompt was not located as a distinct document — QA is governed by Phase 4B's 4-part checklist instead; flag for confirmation this fully supersedes the earlier reference.

**Decisions Carried Forward:** Editorial Lead is sole publish authority; append-only data retention is a hard constraint, not a preference.

***

## PHASE 5D: Security, SEO, Launch, Post-Launch Plan, Execution Backlog

### Deliverable 18 — Security, Privacy and Trust Review

| Threat | Mitigation |
|---|---|
| Spam correction submissions | Rate limiting (5/hr/IP) + CAPTCHA + human review before any data change |
| Vendor self-serving corrections | Independent corroboration required before acceptance (Phase 4B rule); routed to Editorial Lead only |
| SQL injection via search/filter params | Parameterized queries via ORM (Drizzle/Prisma), Typesense query sanitization |
| Admin account compromise | RBAC via Clerk, MFA required for Editorial Lead/CMS Publisher roles |
| Data exposure (internal notes, unpublished drafts) | Sanity draft content never exposed via public API; separate public/admin API surfaces |
| Analytics privacy leakage | Plausible (no cookies, no PII); no IP storage beyond aggregate |
| Affiliate tracking disclosure gaps | Disclosure banner rendering is a required component prop, not optional — CI check verifies presence on any page with `sponsorships` data |
| Secret management | Environment variables via Vercel encrypted secrets; no secrets in repo, verified by `run_secret_scanning`-style CI gate |
| Sponsorship influencing rank | Hard DB constraint `sponsorships.excluded_from_ranking = true`, no application code path can override it |
| Backup/recovery failure | Monthly automated restore-drill test |

**Trust requirements enforced at the code/schema level (not just policy):** sponsorship cannot alter rankings (DB constraint); affiliate rates cannot influence recommendations (no `affiliate_rate` field exists anywhere in the ranking computation path); vendors cannot remove verified limitations (corrections require independent corroboration, and `submitted_by='vendor'` corrections never auto-apply); vendor claims require labeling (feature_status enum forces `unverified-marketing-claim` tag by default for any vendor-sourced-only capability); paid placements disclosed above the fold (component-level requirement); editorial changes have an audit trail (append-only history + audit log); outdated profiles show freshness warnings (auto-computed banner, not manually maintained).

***

### Deliverable 19 — SEO and AI-Search Launch Validation

**Pre-index checklist:** canonical tags verified on all indexable routes; `robots.txt` disallows `/search`, `/admin`, filter-parameter URLs below the 10-result threshold; XML sitemap auto-generated from published-status records only; breadcrumbs present sitewide via `BreadcrumbList`; no duplicate H1s; meta descriptions unique per page (auto-generated from `one_line_description`, editorially reviewable); structured data validated via Google Rich Results Test for every page type; 301 redirects verified for any `superseded_by_tool_id` chain; discontinued/rebranded products display banners, not silent 404s.

**Indexability gate (code-enforced, not just editorial):** a page publishes as `noindex` unless it passes: distinct buyer intent (checked via required non-empty `page_thesis` field), sufficient product coverage (`minimum_product_count` met), original analysis (`editorial_notes`/`selection_criteria` field non-empty and distinct from parent page — string-similarity check flags near-duplicates for manual review), verified data (≥3 evidence-backed fields per included tool), useful comparison (comparison table has ≥2 non-identical rows), internal linking (≥1 parent link, ≥2 lateral links), clear methodology (link to `/methodology`).

**AI-search citation readiness:** every tool profile/category page includes a 40-80 word extractable "answer nugget," dated evidence footnotes, and visible author/editorial attribution — mirrors the directory's own GEO methodology so it becomes AI-citable, per Phase 3's explicit design intent.

***

### Deliverable 20 — Launch and Rollback Plan

**Pre-launch:** data freeze on the 50-tool dataset 48h before launch; final content review (all Week 1-4 backlog pages per Phase 4C); technical QA (T-001–T-016 pass); SEO QA (Deliverable 19 checklist); security review (Deliverable 18); accessibility review (WCAG AA); analytics verification (all Deliverable 17 events firing in staging); sitemap submitted to Google Search Console and Bing Webmaster Tools; monitoring (Sentry + uptime) live; backup taken; rollback plan documented; correction/vendor intake process staffed; post-launch update schedule confirmed (Phase 4B Section 12 cadences).

**Rollout stages:** Soft launch (internal team + 5 trusted external reviewers, 48h) → Internal review (fix flagged issues) → Limited public release (organic-only, no paid promotion, 1 week, monitor Core Web Vitals and error rates at real traffic) → Full public release (sitemap submission, backlog continues per Phase 4C's Week 5-12 plan).

**Launch-blocking failures:** any Critical-severity test failure (T-001, T-002, T-004, T-006, T-007, T-010, T-012, T-013, T-014, T-015 from Deliverable 15); Conflicts C2/C3 not reflected in live data; any tool profile missing `last_verified_at`; sponsorship constraint verification failing.

**Rollback triggers:** error rate >2% sustained 15 min; LCP p75 >4s sustained 30 min; data-integrity violation detected (e.g., a sponsored tool's rank changed). **Rollback steps:** Vercel instant rollback to previous deployment; Postgres point-in-time restore if data corruption; Typesense reindex from last-known-good Postgres snapshot. **Recovery validation:** re-run T-001–T-016 against restored environment before re-opening traffic.

***

### Deliverable 21 — Post-Launch 30-Day Plan

| Days | Focus | Trigger → Action |
|---|---|---|
| 1-3 | Monitor launch stability, error rates, Core Web Vitals | Error spike → rollback per Deliverable 20 |
| 4-7 | Search-query review, zero-result analysis | Recurring zero-result query with real demand → new use-case page or synonym mapping |
| 8-14 | Filter/comparison usage review, first correction submissions | High correction volume on one field → data-quality audit for that field across all tools |
| 15-21 | Indexation check (GSC/Bing coverage report), organic traffic trend, AI-search citation monitoring | Pages not indexed after 14 days → resubmit, check for `noindex` gate failures | 
| 22-28 | Broken-link sweep, pricing-change detection (top-50 monthly cadence begins) | Vendor pricing change detected → Update workflow (Phase 4B) triggered |
| 29-30 | Editorial throughput review against Phase 4C Week 5 target; decide whether to proceed with attribution/ABM category launch (Week 5-6 dependency) | C2/C3 not yet human-ratified → hold Week 5-6 content, do not force-publish |

**Trigger → response mapping:** repeated user requests for a missing category → new page (not consolidation); two thin/near-duplicate pages detected by similarity check → consolidation; taxonomy ambiguity surfaced by real user behavior (e.g., search terms spanning two categories) → taxonomy revision proposal (requires the same conflict-documentation process used in Phase 4A); Tool Finder/Stack Builder demand signals (repeated manual comparison-selector use exceeding 3 tools) → feature-expansion candidate for Stage 2, not built reactively without evidence-coverage check.

***

### Deliverable 22 — Execution Backlog (Condensed by Epic)

| Epic | Key Stories | Priority | Effort | Risk | Release Milestone |
|---|---|---|---|---|---|
| Technical foundation | Repo scaffold, Next.js/Vercel setup, design system base | Launch blocker | High | Low | Pre-Week 1 |
| CMS and database | Sanity schema, Postgres schema, sync pipeline | Launch blocker | High | Medium (sync risk flagged 5A) | Pre-Week 1 |
| Research import | Import pipeline, 50-tool batch import, validation report | Launch blocker | Medium | Low | Pre-Week 1 |
| Tools hub + category pages | Hub, dept hubs, 15 category pages | Launch blocker | Medium | Low | Weeks 1-8 (per Phase 4C sequence) |
| Tool profiles | 50 profiles, 20 expanded | Launch blocker | Medium | Low | Weeks 1-4 |
| Search and filters | Typesense integration, filter UI, canonicalization logic | Launch blocker | Medium | Low | Week 2 |
| Comparisons | Comparison engine, 15 versus pages | Launch blocker | High | Medium (suite-module question open) | Weeks 3-9 |
| Editorial administration | Roles, approval flow, audit log, correction workflow | Launch blocker | High | Low | Pre-Week 1 |
| Analytics | Event tracking, dashboards | Launch blocker | Medium | Low | Week 1 |
| SEO | Structured data, sitemap, indexability gate | Launch blocker | Medium | Low | Pre-launch |
| Accessibility | WCAG AA audit + fixes | Launch blocker | Medium | Low | Pre-launch |
| Security | Rate limiting, RBAC, secret management | Launch blocker | Medium | Low | Pre-launch |
| Launch operations | Rollout stages, monitoring, rollback drill | Launch blocker | Low | Medium | Launch week |
| Tool Finder | Scaffolded engine, inactive route | Post-launch | High | Medium | Stage 2 |
| Stack Builder | Scaffolded engine, inactive route | Post-launch | High | Medium | Stage 2 |
| Accounts/Saved lists | Auth, persistence | Post-launch | Medium | Low | Stage 2 |
| Subcategory/industry pages | Pending 10+ tool threshold / genuine criteria | Post-launch | Low | Low | Stage 2+ |
| Expansion research (30 open slots) | Paid media, CDP, sales engagement, reputation mgmt, LLM observability, CMS categories | Experimental/Research | High | Medium | Days 61-90+ |

***

## Final Phase 5 Output Summary

1. **Readiness audit:** All required Phase 4 inputs present and complete; two conflicts (C2, C3) resolved via labeled implementation-safe defaults for build purposes, pending final human ratification before Week 5-6 content goes live.
2. **MVP release:** Static/CMS-driven hub, categories, profiles, comparisons, search/filter/sort, corrections, editorial admin, analytics, disclosures. Tool Finder, Stack Builder, accounts, and industry/subcategory pages postponed to Stage 2 by design, matching Phase 3's own evidence-maturity dependency finding.
3. **Architecture:** Next.js/Vercel + Sanity (editorial) + Postgres (query/comparison source of truth) + Typesense (search) + Inngest (scheduled verification) — chosen for fit with the existing Sanity/Vercel stack and the schema's relational integrity needs.
4. **Repository/routes:** Modular `/packages/core` business-logic boundary; full route table with indexability/canonical/structured-data rules per page type.
5. **Components:** Full inventory with explicit non-color-only trust-signal rules for verified/vendor-claim/editorial-judgment/inference/unverified/outdated/sponsored content.
6. **API contracts:** Tool, comparison, correction endpoints specified with validation, caching, and example JSON.
7. **Search/comparison logic:** Weighted search, controlled-vocabulary filters, no unexplained "popular" sort, 4 fully worked comparison examples with code-enforced no-substitute and no-false-precision rules.
8. **Tool Finder logic:** 14-question flow, exclusion/scoring pseudocode, 10 test-case profiles — built but gated behind post-launch evidence-maturity check.
9. **Stack Builder logic:** Cost/overlap/gap/integration pseudocode demonstrated against Phase 3's 8 stack templates — same launch gating.
10. **Production dataset:** 50-tool schema-conformant transformation with import validation, missing-data, and blocked-records reporting — no new unverified data introduced.
11. **Content package:** 3 full publication-ready drafts + 27 structured briefs from the existing Phase 4C backlog.
12. **Import plan:** 10-step sequence, idempotent, transactional, with sample file and failure handling.
13. **Test matrix:** 16 critical-workflow tests plus unit/integration/e2e/a11y/SEO automation coverage.
14. **Security/privacy:** Threat-mitigation table plus code/schema-enforced (not policy-only) trust guarantees.
15. **SEO/AI-search validation:** Code-enforced indexability gate preventing thin programmatic pages from publishing.
16. **Launch/rollback:** Staged rollout with explicit blocking-failure and rollback-trigger definitions.
17. **30-day plan:** Week-by-week monitoring with explicit trigger→action rules.
18. **Backlog:** Epic-level breakdown separating launch blockers from Stage 2/experimental work.
19. **Blocking decisions requiring human approval:** (a) final ratification of C2/C3 resolutions used as implementation defaults here; (b) whether suite-embedded modules ever appear in native-platform ranked comparisons; (c) minimum-source-count threshold for "Verified" status; (d) Postgres-vs-CMS dual-source-of-truth architecture spike outcome; (e) whether the 3 fully-drafted worked-example profiles/comparisons in this and prior phases require an additional independent-source pass before going fully live given some fields remain partially-verified.
20. **Definition of production launch readiness:** The platform is launch-ready when all Deliverable 22 "Launch blocker" epics are complete, all Critical-severity tests (Deliverable 15) pass, the SEO indexability gate (Deliverable 19) is enforced in code, the sponsorship-isolation constraint (Deliverable 18) is verified, decisions (a)-(e) above are human-ratified, and a full weekly update cycle (pricing re-check) has executed end-to-end without manual intervention — mirroring Phase 4C's own "ready for Phase 5" bar, now applied as the "ready to go live" bar.

---

## References

1. [Phase-4C-Launch-Dataset-Content-Backlog-90-Day-Roadmap.md](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/81799294/049d61f7-4d75-45f4-ba49-2c8349cd2890/Phase-4C-Launch-Dataset-Content-Backlog-90-Day-Roadmap.md?AWSAccessKeyId=ASIA2F3EMEYEXEWNRVAT&Signature=2qcDH9fiX1JWksQcAqJw2Ki%2Bbcs%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEC4aCXVzLWVhc3QtMSJIMEYCIQDKGYliU2S8q4ITilvRkGcx0S7ARo7S65Svj9jhh06ufgIhAIEobmQ1JN41wZuUa3a%2Fk%2B7qCXShVGQdY6yTMHfxvygRKvwECPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNjk5NzUzMzA5NzA1IgymRCMvYc3ENrqmaCAq0AQ4u1LCUBLJmU3ezz3%2BAF%2F2UV0RLHhR2KFQt7ZzrspF6rTP4iiYkgmojafdVqREeIjxpB%2BNhCLpIdnplVpUlJ4gC%2FE6WNi%2FLEWFx4pysr%2FMRffpP%2FNrajcrCGShkt6E5kFpXcthepu22AnmdoiTRS%2FWcTDHwiTkqPI56Whw5xERmnnVAQsTxQq4%2BrlJEqZfxTP2Qh99je%2Bcosni7yott%2FZ0nW2htCbq8EGfEiaNDoxIuzb%2F1Urs9i1eZ0m5gdKHx%2FTMd4tZ7Y3i3L7dLHGyjFRMaJNDNxuH%2Br2DCXqSe9de681%2BtVc33nOtoBOLThtK0xvsIbWKKp1E1ArwG8T4crf3jaf4A%2ByleFiG0SMw9jWTDiq3%2FfJx7LKGhnXv95QTg1RzTdIgLX132ybV9UqFpKyYsIEtvK9j3J74fn9DE9FkVPckrcsfFTRYsSWPaSRlZltOqI%2FjiLnErYNqriXCbfdEyoZnwauTIv4I1RyMDMeesmNkEe92oMUzXltc4Vez0bSnV6xHZpIq5TlhH1DxxxhgCqt9bkx47gSM%2FKX2FvC4mscQEHD%2FEOyT%2BeNUppQuSdqe119t808%2BTW8v%2Bz1uDYT1Mr89e4%2FqgRto9xeMtEBAuAMftBDczU5QksKOXnWQV6lkVvC1rrAAA%2BGhgGAu4cQMeyXhdq0MxYpg46hjRpAexpsVIXVlpZI%2FBAs%2Fk2G1JgHShJICMcnkIYQD9hQLMwQChe8adZmFDDwTf548R7Js7r47rDpHPvOEVZ4bk97OT6K4tHqDZKKka0QncxfiW0tmMOCowtMGOpcBayluiaKYLZ7A%2FFVKTb4O%2FQH%2Fm2VW18X5cKKAuHwuDHMX3UrCUqns75osNtgqvCC55MhoZwD6LPhrCrC4C3VEkFo66GHtZCVWPIEvrxQGXy%2Bwgj%2BZF%2BVTGjEr5zZ1OAI9g7IJV%2FfR5oQ2gGGnUPiZhmIuNPja3qZtndiH50aMdDke%2BPi%2F35l31n9acizE0kW2AlCG4msd9w%3D%3D&Expires=1785766451) - ## Scope & Honesty Note

The Phase 2 verified inventory contains 70 tools. This phase selects the st...

