## 1. Input Audit — Decision Register

### Approved Decisions (carried forward unchanged from Phase 1-3)
- 12 Level-1 department families; priority scope = AI Visibility/GEO, GSC alternatives, GA alternatives, B2B Attribution, core SEO/content tools.[^1]
- Native AI-visibility platforms (Peec AI, Profound, Scrunch AI, Otterly.AI, AthenaHQ, ZipTie.dev, LLMrefs) must be tagged separately from suite-embedded modules (Ahrefs Brand Radar, Semrush AI Toolkit).[^1]
- No tool fully replaces Google Search Console/Bing Webmaster Tools first-party data — all others are extensions or independent complements.[^1]
- Google Analytics alternatives split into two non-interchangeable subcategories: Privacy-First Web Analytics (marketing traffic) vs. Product Analytics (behavioral/feature usage).[^1]
- Attribution, ABM, and Visitor Identification are three distinct primary categories, not one merged "attribution" bucket.[^1]
- Six-tier capability labeling system (Verified/Integration-dependent/Beta/Announced/Discontinued/Unverified marketing claim) governs all tool-profile claims.[^1]
- Fit labels (Best fit/Strong fit/Conditional fit/Weak fit/Insufficient evidence) are the primary ranking UI signal; numeric scores are secondary.[^1]
- Sponsorship/affiliate placements must never blend into organic ranking scores.[^1]

### Conflicting Decisions

| # | Source Reports | Conflicting Statements | Recommended Resolution | Reason | Effect on Product/Data Model | Human Approval Required |
|---|---|---|---|---|---|---|
| C1 | Phase 2 vs. Phase 3 | Phase 2 lists Ahrefs Brand Radar/Semrush AI Toolkit as rows in the same flat "AI Visibility Tracking" category table. Phase 3 mandates these be structurally separated as "Suite Module" vs. "Native Platform" with a dedicated market-map split. | Adopt Phase 3's definition — introduce `L3-AIVIS-NATIVE` and `L3-AIVIS-SUITE` as Level-3 subcategories under `L2-AIVIS`. | Phase 3 is the more recent, deliberately-resolved decision; Phase 1 explicitly flagged this exact overlap as a resolution risk. | Requires a `product_type` enum field (`native`/`suite_module`) on the Tools table and Level-3 taxonomy nodes not present in Phase 2's flat table. | No — this is a taxonomy-structure decision already resolved by Phase 3's explicit instruction; safe to implement without further sign-off. |
| C2 | Phase 2 vs. Phase 3 | Phase 2 treats "Attribution" as one heading covering Factors.ai/Dreamdata/HockeyStack/Ruler AND 6sense/Demandbase/Warmly/Dealfront/RB2B/Salespanel together. Phase 3 explicitly separates B2B Attribution from ABM/Intent Data from Visitor/Account Identification as three primary categories. | Adopt Phase 3's three-way split (`L2-B2BATTR`, `L2-ABM`, `L2-VISITORID`). | Phase 3 is the later, explicitly-reasoned resolution addressing a Phase 1-flagged overlap risk. | Tool-category assignments for 6sense, Demandbase, Warmly, Dealfront, RB2B, Salespanel must be reassigned from generic "Attribution" to `L2-ABM` or `L2-VISITORID` per their actual primary function. | Yes — reassigning primary categories for 6 already-published tool records is a data change that should be confirmed before the launch dataset is finalized. |
| C3 | Phase 2 evidence vs. itself (internal) | Dreamdata pricing appears as "~$599-999/mo entry" in one citation cluster and "$15,000-75,000+/yr" (enterprise contract range) in another citation cluster within the same Phase 2 report, without reconciling whether these represent different tiers or conflicting third-party estimates. | Store both figures as separate `PricingPlans` rows with distinct `source_evidence_id` values and a `pricing_model = "custom"` flag rather than collapsing into one number. | Neither figure is vendor-confirmed; collapsing them would create false precision Phase 3's comparison rules explicitly prohibit. | Requires the append-only, multi-source pricing model described in Phase 3 Deliverable 10 to be enforced at data-entry time, not summarized. | Yes — before publish, editorial must decide whether to display a range, "Custom — contact sales," or both figures with attribution. |
| C4 | Phase 2 vs. Phase 3 | Phase 2's tool inventory table has no explicit "Suite Module" secondary tag field; Phase 3's tool-profile template assumes this tag exists and displays it prominently on category pages. | Add `product_type` and `is_suite_module` (boolean) as required fields on the Tools entity in the production schema (Section 4 below), backfilled for all 70 Phase 2 tools before launch. | The field is structurally required by an approved Phase 3 deliverable but was never added to Phase 2's actual data. | Blocks tool-profile publication for Ahrefs Brand Radar and Semrush AI Toolkit until backfilled. | No — this is a data-completeness gap, not a policy conflict; safe to backfill during implementation. |

### Missing Decisions
- No approved decision exists on whether "Suite Module" tools (Brand Radar, AI Toolkit) should ever appear in a ranked comparison table alongside native platforms, or only as a cross-reference callout — flagged as an open research question in Phase 3 but never resolved.
- No approved decision on how to handle a tool that legitimately belongs to two Level-2 categories as a primary category (e.g., a hypothetical tool that is both a native AI-visibility platform and a content-optimization tool) — Phase 3 mandates "one primary category" but no tie-breaking rule was specified for genuinely dual-function products.
- No approved decision on the minimum number of independent sources required before a "Verified" pricing label (vs. "Partially verified") can be applied — Phase 2 used this distinction informally without a documented threshold.

### Assumptions Requiring Validation
- Assumption that Peec AI, Profound, and Scrunch AI's agency/white-label support status (referenced as "Not publicly verified" in Phase 2/3) will need direct vendor confirmation before any "Agency support: Yes" filter value is applied at launch.
- Assumption that the 10 missing categories flagged in Phase 2 Section 2 (paid media, CDP, sales engagement, reputation management, LLM observability, CMS, etc.) can be researched to the same evidence standard within the Phase 4B production calendar — not yet tested against research-team capacity.

### Time-Sensitive Information
- All AI-visibility tool pricing (Peec AI, Otterly.AI, AthenaHQ, ZipTie.dev, LLMrefs) was verified as of early-August 2026 and is explicitly flagged in Phase 2 as a fast-moving category requiring monthly re-verification — this is the single highest-decay-risk data segment in the launch dataset.
- Dreamdata/HockeyStack pricing figures are third-party-sourced and already show cross-source disagreement at time of research; these should be treated as stale-on-arrival rather than freshly verified.

### Recommendations Not Supported by Enough Evidence
- Phase 3's suggested stack-template cost bands (e.g., "SEO agency ~$310-355/mo base") are aggregate sums of individually-verified prices but have not themselves been validated as realistic bundled costs (no evidence of actual agencies purchasing exactly this combination) — label as illustrative, not empirically validated.
- Phase 3's Tool Finder "sample results" for 5 user profiles are worked examples demonstrating the scoring logic, not evidence-backed recommendations — must not be published as real user-facing recommendations until the scoring engine is built and tested against the full dataset.

### Items That Must Be Decided Before Development
- Resolution of Conflict C2 (attribution/ABM/visitor-ID category reassignment) — affects the Tools table schema and category taxonomy directly.
- Resolution of Conflict C3 (Dreamdata pricing display method) — affects the PricingPlans schema and comparison-engine rendering logic.
- Decision on the open "Suite Module in rankings" question — affects comparison-engine query logic (whether suite modules are filterable into/out of native-platform comparison tables).

### Items That Can Safely Be Decided During Implementation
- Exact update-frequency cron scheduling (Phase 3 gives cadence targets like "monthly," "quarterly" — the specific day-of-month is an implementation detail).
- Specific slug string formatting conventions beyond what's already specified.
- Backfilling `product_type`/`is_suite_module` fields for existing Phase 2 records (Conflict C4) — mechanical, not a policy decision.

***

## 2. Final Launch Taxonomy (Frozen)

The taxonomy below resolves Conflicts C1 and C2 per the recommendations above (Phase 3's structure adopted). It separates navigational categories (used for site navigation/hubs), product categories (a tool's assignable primary/secondary category), and use-case/persona/industry/filter/tag layers per Phase 3's Deliverable 2 architecture.

### Hierarchical Markdown (abbreviated to priority scope; full CSV/JSON below)

```
L1: AI Search & Answer Engine Intelligence (ai-search) [Navigational + Product]
  L2: AI Visibility Tracking (ai-search/visibility-tracking) [Product category]
    L3: Native AI-Visibility Platforms (ai-search/visibility-tracking/native) [Product subcategory]
    L3: Suite-Embedded AI Visibility Modules (ai-search/visibility-tracking/suite-modules) [Product subcategory]
  L2: AI Crawler & Technical Auditing (ai-search/technical-auditing) [Product category]
  L2: GEO/AEO Content Optimization (ai-search/content-optimization) [Product category]

L1: Search & SEO Intelligence (search-seo) [Navigational + Product]
  L2: Search Console (First-Party) (search-seo/search-console) [Product category]
  L2: Search Console Data Enhancement (search-seo/gsc-enhancement) [Product category]
  L2: Rank Tracking (search-seo/rank-tracking) [Product category]
  L2: SEO Suites (search-seo/suites) [Product category]
  L2: Technical SEO / Site Crawlers (search-seo/site-crawlers) [Product category]
  L2: Schema Markup Tools (search-seo/schema-tools) [Product category]

L1: Web & Product Analytics (analytics) [Navigational + Product]
  L2: Web Analytics (First-Party) (analytics/first-party) [Product category]
  L2: Privacy-First Web Analytics (analytics/privacy-first) [Product category]
  L2: Product Analytics (analytics/product-analytics) [Product category]

L1: Attribution, Account Intelligence & Buyer Journeys (attribution) [Navigational + Product]
  L2: B2B Multi-Touch Attribution (attribution/b2b-attribution) [Product category]
  L2: ABM & Intent Data (attribution/abm-intent) [Product category]
  L2: Visitor/Account Identification (attribution/visitor-identification) [Product category]

L1: CRM, Sales & Revenue (crm-sales) [Navigational + Product]
```

*(Remaining 7 L1 families from Phase 1 — Content & Creative, Advertising & Paid Media, Social/Community/Reputation, Data Infrastructure & BI, Automation/Agents/Developer Platforms, CX & Support, Web Presence — are frozen as navigational placeholders only; their L2-L4 breakdown is deferred to Phase 4B per the missing-category research gap identified in Phase 2 Section 2, and must not be treated as launch-ready.)*

### CSV-Compatible Table
A 22-row CSV covering category_id, name, parent, level, definition, slug, indexability, minimum product count, and update frequency for all priority-scope categories has been generated.
[^2]

### Machine-Readable JSON Example
```json
{
  "category_id": "L3-AIVIS-NATIVE",
  "name": "Native AI-Visibility Platforms",
  "parent_category_id": "L2-AIVIS",
  "level": 3,
  "definition": "Standalone companies built exclusively for AI-search visibility measurement (not modules of a broader SEO suite).",
  "inclusion_criteria": "Product's primary and sole business function is AI-answer monitoring across LLM platforms.",
  "exclusion_criteria": "Excludes products where AI visibility is a bundled feature of a pre-existing SEO/marketing suite.",
  "required_capabilities": ["multi-engine or single-engine prompt monitoring", "citation/source reporting"],
  "primary_buyer": "SEO/marketing leads, agencies, enterprise brand teams",
  "main_use_cases": ["track-chatgpt-mentions", "benchmark-ai-share-of-voice"],
  "adjacent_categories": ["L3-AIVIS-SUITE", "social-listening"],
  "frequently_confused_with": ["L3-AIVIS-SUITE", "traditional rank tracking"],
  "canonical_slug": "ai-search/visibility-tracking/native",
  "indexable": true,
  "minimum_product_count": 5,
  "update_frequency": "monthly",
  "example_tools": ["Peec AI", "Profound", "Scrunch AI", "Otterly.AI", "AthenaHQ"]
}
```
The full JSON array (22 category objects) has been generated as a machine-readable file.
[^3]

### Non-Product Layers (Frozen Definitions)

| Layer | Definition | Examples | Public Filter? | Indexable Collection? |
|---|---|---|---|---|
| Use Cases | A specific job-to-be-done a buyer is trying to solve | "track-chatgpt-mentions," "replace-google-analytics" | Yes | Yes, if genuinely unique content exists |
| Features | A discrete product capability, tracked at claim-level with verification status | "multi-engine prompt monitoring," "self-hosting" | Yes (as filter) | No (features are not standalone pages) |
| Filters | Any controlled-vocabulary facet applied to narrow category results | Pricing model, company size, privacy-friendly | Yes | No by default; promotable per Phase 3's 10+ result threshold |
| Tags | Secondary, non-hierarchical descriptors applied to a tool | "Budget," "Enterprise," "Free tier" | Yes | No |
| Personas | A buyer-role-based curated collection | "For Agencies," "For Developers" | Yes | Yes |
| Industries | An industry-specific curated collection | "For E-commerce" | Yes | Yes, only with genuine industry-specific criteria |

**Duplicate/overlap resolution rule (frozen)**: A tool has exactly one `primary_category_id` (must be a Level-2 or Level-3 product category) and zero or more `secondary_category_ids` plus unlimited `tags`. Suite-embedded modules (Ahrefs Brand Radar, Semrush AI Toolkit) have `primary_category_id = L3-AIVIS-SUITE`, never `L3-AIVIS-NATIVE`, resolving Conflict C1.

***

## 3. Controlled Vocabulary

| Field | Canonical Values | Definitions/Notes | Public Filter | Indexable Collection |
|---|---|---|---|---|
| Company Size | `startup` (1-50), `smb` (51-200), `mid-market` (201-1000), `enterprise` (1000+) | Employee-count bands; a tool can list multiple as "best-fit" | Yes | Yes (e.g., "/for/startups") |
| Buyer Role | `founder`, `cmo`, `marketing-leader`, `growth-marketer`, `seo-specialist`, `geo-specialist`, `performance-marketer`, `content-marketer`, `marketing-ops`, `revops`, `agency`, `product-manager`, `developer`, `data-analyst`, `enterprise-it` | Matches Phase 3's 15 audience profiles exactly | Yes | Yes (persona pages) |
| Department | Maps 1:1 to the 12 Phase 1 L1 families | — | Yes | Yes (department hubs) |
| Industry | `ecommerce`, `b2b-saas`, `agency`, `enterprise`, `local-business` (extensible) | Only industries with genuine differentiated buying criteria get dedicated pages | Yes | Conditional |
| Use Case | Free-text controlled list, one per job-to-be-done | e.g., `track-chatgpt-mentions` | Yes | Yes |
| Pricing Model | `free`, `freemium`, `flat-subscription`, `seat-based`, `usage-based`, `custom-enterprise` | See disambiguation below (Free vs. Freemium) | Yes | No |
| Deployment Model | `cloud-only`, `self-hosted`, `hybrid` | — | Yes | Yes (self-hosted collection) |
| Technical Complexity | `no-code`, `some-code`, `developer-required` | — | Yes | No |
| Product Maturity | `emerging`, `established`, `market-leader` | Editorial judgment, documented per Phase 3 Deliverable 9 | No (internal ranking input only) | No |
| Product Status | `active`, `beta`, `discontinued`, `acquired`, `rebranded` | Drives the `superseded_by_tool_id` logic | No (drives UI banners, not a filter) | No |
| API Availability | `none`, `public-api`, `partner-api-only` | — | Yes | No |
| Open-Source Status | `closed-source`, `open-source`, `source-available` | See disambiguation below | Yes | Yes (open-source collection) |
| Self-Hosting | `not-supported`, `supported`, `required` | — | Yes | Yes |
| Privacy Positioning | `standard`, `privacy-first`, `gdpr-documented` | Requires documented evidence, not vendor claim alone | Yes | Yes |
| Agency Support | `unknown`, `no`, `yes-unverified-claim`, `yes-verified` | Most Phase 2 AI-visibility tools currently sit at `unknown` | Yes | Yes (agency collection, verified-only) |
| Enterprise Readiness | `unknown`, `enterprise-priced-only`, `enterprise-ready-documented` | See disambiguation below | Yes | Yes |
| AI Capability | `none`, `ai-assisted-feature`, `ai-native-core-function` | — | Yes | No |
| Evidence Confidence | `high`, `medium`, `low`, `insufficient` | Drives whether a numeric score displays at all (Phase 3 Deliverable 9) | No | No |
| Verification Status | `verified`, `partially-verified`, `not-publicly-verified` | Applied per-claim, not just per-product | No | No |
| Feature Status | `verified`, `integration-dependent`, `beta`, `announced`, `discontinued`, `unverified-marketing-claim` | The six-tier system from Phase 3 | No | No |

### Ambiguous Term Resolutions

- **AI visibility vs. LLM visibility**: Treated as synonyms; canonical term is "AI visibility" (matches existing category naming); "LLM visibility" is an allowed synonym for search/filter matching only, not a separate category.
- **Free vs. freemium**: `free` = the entire usable product is permanently free with no paid tier required for core function (e.g., Google Search Console). `freemium` = a genuinely limited free tier exists alongside required paid tiers for full functionality (e.g., Otterly.AI has no free tier — it is NOT freemium, it is paid-only with a low entry price; AthenaHQ's free Essential tier IS freemium). This distinction must be applied per verified pricing page, not assumed.
- **Open source vs. source-available**: `open-source` requires an OSI-approved license (e.g., Umami's MIT license, Plausible's AGPL). `source-available` means code is publicly viewable but under a restrictive/non-OSI license — these must never be merged into one filter value, since self-hosting legal rights differ materially.
- **Native feature vs. integration**: A feature is `native` only if it functions without a third-party connector or the vendor's own API being called by an external tool; anything requiring Zapier, Make, or a documented "integrates via API" statement is `integration-dependent` regardless of how the vendor markets it.
- **Enterprise-ready vs. enterprise-priced**: `enterprise-priced-only` means the vendor gates pricing behind "contact sales" but provides no documented security/compliance/SLA evidence (e.g., Demandbase, Lead Forensics per Phase 2's "opacity confirmed" flags). `enterprise-ready-documented` requires published compliance certifications, SLA terms, or security documentation. High price alone never qualifies a product for the latter label.
- **Google Search Console alternative vs. complementary SEO tool**: Per the frozen Phase 1/3 caveat, no tool is labeled a true "alternative" to GSC — the category itself is renamed `Search Console Data Enhancement` in the frozen taxonomy (not "alternatives") to prevent this exact mislabeling at the schema level.
- **Google Analytics replacement vs. adjacent analytics product**: Only tools in `L2-WEBANALYTICS-PRIVACY` (Plausible, Fathom, Umami, Matomo, Simple Analytics, Databuddy) may carry a "GA4 replacement" tag. Product analytics tools (Mixpanel, Amplitude, PostHog, Heap) are structurally barred from this tag at the schema level via their distinct `L2-PRODUCTANALYTICS` category.

***

## 4. Implementation-Ready Data Model

### Entity Relationship Explanation
The schema centers on `Tools`, which links to `Vendors` (many tools can share a parent vendor, e.g., future HubSpot sub-products), `Categories` (via a `ToolCategories` join table supporting one primary + many secondary), and `Features` (via `ToolFeatures`, carrying per-feature verification status). All factual claims — pricing, features, integrations — are never stored as bare values; they route through `EvidenceRecords`, which links to one or more `Sources`, enabling multi-source citation and historical tracking. `PricingPlans` is append-only (new row per change) rather than updated in place, preserving price history. `Comparisons` and `Alternatives` are derived/curated tables referencing `Tools`, not recalculated live from raw features alone, to allow editorial override per Phase 3's documented-judgment rule.

### SQL-Style Schema (Core Entities)

```sql
CREATE TABLE vendors (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  official_url TEXT NOT NULL UNIQUE,
  hq_location TEXT,
  founded_year INT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE tools (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  official_url TEXT NOT NULL,
  vendor_id UUID REFERENCES vendors(id),
  one_line_description TEXT NOT NULL,
  product_type TEXT CHECK (product_type IN ('native','suite_module','feature_module')) NOT NULL,
  status TEXT CHECK (status IN ('active','beta','discontinued','acquired','rebranded')) NOT NULL DEFAULT 'active',
  superseded_by_tool_id UUID REFERENCES tools(id),
  deployment_model TEXT CHECK (deployment_model IN ('cloud-only','self-hosted','hybrid')),
  open_source_status TEXT CHECK (open_source_status IN ('closed-source','open-source','source-available')),
  self_hosting TEXT CHECK (self_hosting IN ('not-supported','supported','required')),
  api_availability TEXT CHECK (api_availability IN ('none','public-api','partner-api-only')),
  primary_category_id UUID REFERENCES categories(id) NOT NULL,
  last_verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(official_url)
);

CREATE TABLE categories (
  id UUID PRIMARY KEY,
  category_code TEXT NOT NULL UNIQUE,  -- e.g., 'L3-AIVIS-NATIVE'
  name TEXT NOT NULL,
  parent_category_id UUID REFERENCES categories(id),
  level INT CHECK (level BETWEEN 1 AND 4) NOT NULL,
  definition TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  indexable BOOLEAN DEFAULT true,
  minimum_product_count INT DEFAULT 5,
  update_frequency TEXT
);

CREATE TABLE tool_categories (          -- supports many secondary categories
  tool_id UUID REFERENCES tools(id),
  category_id UUID REFERENCES categories(id),
  relationship TEXT CHECK (relationship IN ('primary','secondary')) NOT NULL,
  PRIMARY KEY (tool_id, category_id)
);
-- Constraint enforced at application layer: exactly one 'primary' row per tool_id

CREATE TABLE sources (
  id UUID PRIMARY KEY,
  url TEXT NOT NULL,
  source_type TEXT CHECK (source_type IN ('official','independent-review','aggregator','g2-capterra')) NOT NULL,
  publish_date DATE,
  retrieved_at TIMESTAMP DEFAULT now()
);

CREATE TABLE evidence_records (
  id UUID PRIMARY KEY,
  entity_type TEXT NOT NULL,             -- 'tool','feature','pricing_plan', etc.
  entity_id UUID NOT NULL,
  field_name TEXT NOT NULL,
  claimed_value TEXT NOT NULL,
  confidence TEXT CHECK (confidence IN ('high','medium','low','insufficient')) NOT NULL,
  verification_status TEXT CHECK (verification_status IN ('verified','partially-verified','not-publicly-verified')) NOT NULL,
  verified_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE evidence_sources (          -- many-to-many: one claim, multiple sources
  evidence_record_id UUID REFERENCES evidence_records(id),
  source_id UUID REFERENCES sources(id),
  PRIMARY KEY (evidence_record_id, source_id)
);

CREATE TABLE pricing_plans (             -- append-only; never UPDATE, always INSERT
  id UUID PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) NOT NULL,
  plan_name TEXT NOT NULL,
  price DECIMAL(10,2),                   -- NULL if custom/unpublished
  currency TEXT DEFAULT 'USD',
  billing_period TEXT CHECK (billing_period IN ('monthly','annual','usage','custom')),
  pricing_model TEXT CHECK (pricing_model IN ('free','freemium','flat-subscription','seat-based','usage-based','custom-enterprise')) NOT NULL,
  usage_metric TEXT,                     -- e.g., 'per pageview', 'per prompt'
  region TEXT DEFAULT 'global',
  free_plan BOOLEAN DEFAULT false,
  free_trial BOOLEAN DEFAULT false,
  evidence_record_id UUID REFERENCES evidence_records(id) NOT NULL,
  effective_from TIMESTAMP DEFAULT now(),
  superseded_at TIMESTAMP                -- NULL if current
);

CREATE TABLE features (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id)
);

CREATE TABLE tool_features (
  tool_id UUID REFERENCES tools(id),
  feature_id UUID REFERENCES features(id),
  feature_status TEXT CHECK (feature_status IN ('verified','integration-dependent','beta','announced','discontinued','unverified-marketing-claim')) NOT NULL,
  evidence_record_id UUID REFERENCES evidence_records(id),
  PRIMARY KEY (tool_id, feature_id)
);

CREATE TABLE integrations (
  id UUID PRIMARY KEY,
  tool_a_id UUID REFERENCES tools(id),
  tool_b_id UUID REFERENCES tools(id),
  integration_type TEXT CHECK (integration_type IN ('native','api','third-party-connector','unconfirmed')) NOT NULL,
  evidence_record_id UUID REFERENCES evidence_records(id)
);

CREATE TABLE alternatives (
  tool_id UUID REFERENCES tools(id),
  alternative_tool_id UUID REFERENCES tools(id),
  relationship_type TEXT CHECK (relationship_type IN ('direct','cheaper','open-source','complementary')) NOT NULL,
  PRIMARY KEY (tool_id, alternative_tool_id, relationship_type)
);

CREATE TABLE comparisons (
  id UUID PRIMARY KEY,
  comparison_type TEXT CHECK (comparison_type IN ('versus','category-table')) NOT NULL,
  category_id UUID REFERENCES categories(id),
  tool_ids UUID[] NOT NULL,
  editorial_notes TEXT,
  generated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE rankings (
  id UUID PRIMARY KEY,
  tool_id UUID REFERENCES tools(id),
  category_id UUID REFERENCES categories(id),
  use_case_slug TEXT,                     -- e.g., 'for-agencies'; NULL = general category ranking
  fit_label TEXT CHECK (fit_label IN ('best-fit','strong-fit','conditional-fit','weak-fit','insufficient-evidence')) NOT NULL,
  numeric_score DECIMAL(5,2),
  score_breakdown JSONB,
  editorial_override_reason TEXT,
  evidence_confidence TEXT CHECK (evidence_confidence IN ('high','medium','low','insufficient')),
  computed_at TIMESTAMP DEFAULT now()
);

CREATE TABLE corrections (
  id UUID PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  field_name TEXT NOT NULL,
  submitted_value TEXT,
  submitted_by TEXT,                      -- 'user' or 'vendor'
  status TEXT CHECK (status IN ('pending','accepted','rejected')) DEFAULT 'pending',
  reviewed_at TIMESTAMP,
  reviewer_notes TEXT
);

CREATE TABLE sponsorships (
  tool_id UUID REFERENCES tools(id),
  placement_type TEXT NOT NULL,
  disclosed BOOLEAN DEFAULT true,
  excluded_from_ranking BOOLEAN DEFAULT true,  -- enforced constraint: always true
  start_date DATE,
  end_date DATE
);
```

### CMS-Oriented Schema (Content-Model Summary)
For a headless-CMS implementation (Sanity-style, matching MaximusLabs' existing stack), model `Tool`, `Category`, `EvidenceClaim`, `PricingPlan`, and `Comparison` as top-level document types with the same field constraints above expressed as Sanity schema validation rules (e.g., `Rule.required()`, `Rule.valid(['native','suite_module'])`); `ToolCategories` and `ToolFeatures` become array-of-reference fields on the `Tool` document rather than separate join documents, since Sanity handles many-to-many via references natively.

### Example Complete Tool Record
```json
{
  "id": "tool_peec-ai",
  "name": "Peec AI",
  "slug": "peec-ai",
  "official_url": "https://peec.ai",
  "product_type": "native",
  "status": "active",
  "primary_category_id": "L3-AIVIS-NATIVE",
  "secondary_category_ids": ["L2-GEOCONTENT"],
  "deployment_model": "cloud-only",
  "open_source_status": "closed-source",
  "self_hosting": "not-supported",
  "api_availability": "none",
  "last_verified_at": "2026-08-03T00:00:00Z"
}
```

### Example Evidence Record
```json
{
  "id": "ev_peec-ai-pricing-001",
  "entity_type": "pricing_plan",
  "entity_id": "pp_peec-ai-entry",
  "field_name": "starting_price",
  "claimed_value": "$95-105/mo",
  "confidence": "medium",
  "verification_status": "partially-verified",
  "verified_at": "2026-08-03T00:00:00Z",
  "sources": ["https://peec.ai/product/ai-visibility", "youtube.com/watch?v=1O0U0oemB84"]
}
```

### Example Comparison Record
```json
{
  "id": "cmp_peec-vs-profound-vs-scrunch-vs-otterly",
  "comparison_type": "versus",
  "category_id": "L3-AIVIS-NATIVE",
  "tool_ids": ["tool_peec-ai","tool_profound","tool_scrunch-ai","tool_otterly-ai"],
  "editorial_notes": "Not same-tier competitors: Otterly.AI is budget/self-serve, Profound is custom-enterprise, Peec AI is mid-market visual reporting, Scrunch AI bundles content optimization."
}
```

***

## 5. Publication Requirements

| Page Type | Mandatory Fields | Min. Evidence | Min. Original Analysis | Min. Tool Count | Freshness Req. | Publication Blockers |
|---|---|---|---|---|---|---|
| Tool Profile | name, url, category, one-line description, pricing (or "custom-verified-opacity"), status | 3+ independently sourced fields (Phase 3 rule) | 2+ sentences of editorial context beyond vendor copy | N/A | Verified within 6 months | Missing `product_type`; fewer than 3 evidence fields; no `last_verified_at` |
| Category Page | definition, buyer, criteria, market map | 5+ verified tools with sourced pricing | Full 18-part template (Deliverable 4) populated, not templated boilerplate | Meets category's `minimum_product_count` | Quarterly | Fewer tools than `minimum_product_count`; no "situations where unnecessary" section (thin-content signal) |
| Best-Tools Page | distinct selection criteria vs. parent category page | Same as category page | Must state why this differs from the base category page | 5+ | Quarterly | No differentiated criteria from category page (auto-reject per Phase 3 canonicalization rule) |
| Alternatives Page | named tool being replaced, 3+ alternatives | Each alternative verified | Explains gap/differentiator vs. the named tool | 3+ | Quarterly | Fewer than 3 verified alternatives |
| Versus Page | 2 named tools, full comparison table | Both tools independently verified | Explicit positioning statement (e.g., "not same-tier competitors") | 2 (exactly) | Monthly for top 20 pairs, quarterly otherwise | Either tool has `verification_status = not-publicly-verified` on core fields |
| Use-Case Page | job-to-be-done statement, 3+ qualifying tools | Tools verified against the specific use case, not just the general category | Must justify why this use case needs a distinct page vs. the category page | 3+ | Quarterly | Fewer than 3 qualifying tools; duplicates an existing use-case page's content |

***

## Final Output

### 1. Frozen Taxonomy
22 priority-scope categories delivered (hierarchical Markdown, CSV, JSON) — Section 2 above.
[^2][^3]

### 2. Controlled-Vocabulary Dictionary
20 canonical fields with resolved ambiguous-term definitions — Section 3 above.

### 3. Final Data Schema
Full SQL-style schema (13 core tables) plus CMS-model summary and 3 example records — Section 4 above.

### 4. Publication-Readiness Rules
6 page types with mandatory fields, minimum evidence, and explicit publication blockers — Section 5 above.

### 5. Unresolved Decisions
- Whether suite-embedded modules ever appear in native-platform ranked comparisons (open since Phase 3).
- Tie-breaking rule for genuinely dual-function tools needing two primary categories (newly identified in this audit).
- Minimum independent-source count required for a "Verified" (vs. "Partially verified") pricing label (newly identified in this audit).
- Conflict C2's category reassignment for 6 already-published attribution/ABM/visitor-ID tools — requires human approval before Phase 4B data migration.
- Conflict C3's Dreamdata pricing display method (dual-figure display vs. "Custom" label) — requires human approval before publish.

### 6. Explicit Inputs Required for Phase 4B
1. Human approval on Conflict C2 (category reassignment for 6sense, Demandbase, Warmly, Dealfront, RB2B, Salespanel).
2. Human approval on Conflict C3 (Dreamdata/HockeyStack pricing display method).
3. Decision on the suite-module-in-rankings open question.
4. Decision on the dual-primary-category tie-breaking rule.
5. Decision on the minimum-source-count threshold for "Verified" status.
6. Confirmation of research-team capacity to close the 10 missing L1-family category gaps (paid media, CDP, sales engagement, reputation management, LLM observability, CMS, etc.) before Phase 4B content production planning begins.

---

## References

1. [04_MaximusLabs_Services_FINAL.md](04_MaximusLabs_Services_FINAL.md)

2. [02_MaximusLabs_USP_FINAL.md](02_MaximusLabs_USP_FINAL.md)

3. [MaximusLabs _ SEO_GEO Knowledge Base (1).md](MaximusLabs _ SEO_GEO Knowledge Base (1).md)

