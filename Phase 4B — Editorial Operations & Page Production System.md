## Compliance Note

No material implementation conflicts were discovered in Phase 4A during this build; the taxonomy, controlled vocabulary, schema, and publication rules are used as frozen. One minor clarification is proposed, not a revision: the `evidence_records.confidence` enum needs a documented minimum-source-count mapping to operationalize the "Verified" vs. "Partially verified" threshold flagged as unresolved in Phase 4A. This is proposed below in Section 3, not silently applied.

***

## 1. Tool Lifecycle Workflow

| Stage | Input | Responsible Role | Required Evidence | Validation | Output | Acceptance Criteria | Failure Conditions | Next Action |
|---|---|---|---|---|---|---|---|---|
| **Discovery** | Category gap list, competitor roundups, user submissions | Research Analyst | 1+ mention in a credible comparison source or official site existing | Confirm official URL resolves, product is not a duplicate (fuzzy-match against `tools.official_url`) | Candidate record in `tools` table, `status='draft'` | Unique official URL confirmed | Duplicate detected; URL dead/parked domain | Route to Research |
| **Research** | Draft tool record | Research Analyst | Official site, pricing page, docs — minimum 3 independently sourced fields per Phase 4A publication rule | Cross-check claims against 2nd source where possible; flag any field with only 1 source as `confidence='low'` | Populated `tools`, `pricing_plans`, `tool_features` rows, each with `evidence_records` | 3+ verified fields present | Fewer than 3 sourced fields found | Mark `status='insufficient-evidence'`, hold from publish queue |
| **Verification** | Populated draft record | Senior Editor | Same sources re-checked; category assignment checked against Phase 4A `product_type`/category rules | Confirm `primary_category_id` assignment resolves any native-vs-suite-module ambiguity; confirm controlled-vocabulary values used, not free text | Verified record, `verification_status` set per field | All controlled-vocabulary fields use approved enum values; primary category is singular | Category ambiguous (dual-function tool with no tie-break rule — per Phase 4A open question) | Escalate to Editorial Lead for manual category decision |
| **Review** | Verified record | Editorial Lead | Full tool-profile template populated (Section 4) | QA checklist pass (Section 11) | Approved record, `status='approved'` | Passes editorial + data + SEO + accessibility QA | Any QA checklist item fails | Return to Research/Verification with specific failure notes |
| **Publish** | Approved record | Editorial Lead / CMS Publisher | N/A | Final schema validation (required fields non-null) | Live tool profile page, `last_verified_at` set to publish date | Page renders, structured data validates, no broken canonical | Schema validation error | Block publish, return to Verification |
| **Update** | Scheduled re-verification trigger or correction request | Research Analyst | Re-checked against current official source | Diff against previous `pricing_plans`/`tool_features` row; if changed, new row appended (never overwritten) | New evidence_records + pricing_plans row, `superseded_at` set on prior row | Historical row preserved, new row dated | Source unreachable / vendor site down | Retry in 48h; if still down after 3 attempts, flag `status` for manual check |
| **Archive** | Confirmed shutdown/acquisition/rebrand signal | Senior Editor | News/official announcement confirming status change | Confirm via 2+ independent sources before status change (avoid false shutdown reports) | `status` updated to `discontinued`/`acquired`/`rebranded`; `superseded_by_tool_id` set if applicable | Old profile stays live with banner, redirects preserved (Phase 4A rule) | Only 1 unconfirmed source claims shutdown | Hold status change, monitor for 30 days |

***

## 2. Source Hierarchy & Confidence Levels

| Source Tier | Examples | Acceptable Use | Default Confidence |
|---|---|---|---|
| Tier 1 — Official | Vendor pricing page, product docs, official changelog | Primary basis for all pricing/feature/status claims | High (if single-sourced), Verified once cross-checked |
| Tier 2 — Official secondary | Vendor blog, press release, official social account | Corroborating evidence, or sole source for recent announcements | Medium |
| Tier 3 — Independent technical review | Named-author comparison articles with disclosed methodology, dated within 12 months | Acceptable for pricing/feature corroboration when Tier 1 is ambiguous or opaque (e.g., "contact sales" enterprise tools) | Medium |
| Tier 4 — Aggregator/review platforms | G2, Capterra, TrustRadius | Supplementary user-sentiment evidence only; never sole source for pricing/feature facts | Low-Medium |
| Tier 5 — Practitioner discussion | Reddit, forums, X/Twitter threads | Qualitative signal only (e.g., "users report X limitation") — never used for factual claims like pricing or feature existence | Low, and must be explicitly labeled as qualitative, not factual |
| Tier 6 — Unverifiable/single third-party mention | A tool named only in one roundup article with no independent confirmation | Do not publish a full tool profile; may appear as "emerging — monitor" per Phase 4A's Promptwatch/Sanbi.ai/Alhena precedent | Insufficient |

**Rule**: Vendor marketing claims (any tier) describing capability without a corroborating documentation page are tagged `feature_status='unverified-marketing-claim'` regardless of source tier — tier governs pricing/status confidence, not automatic feature verification.

***

## 3. Claim-Level Evidence Policy

- Every factual field (pricing, feature, integration, status) traces to one or more `evidence_records`, each with its own `sources` array — never a bare value.
- **Proposed clarification (flagged per compliance note above)**: "Verified" requires 2+ independent Tier 1-3 sources agreeing; "Partially verified" = exactly 1 Tier 1-3 source, or 2+ sources that disagree (e.g., Dreamdata's conflicting price figures per Phase 4A Conflict C3); "Not publicly verified" = 0 Tier 1-3 sources, or Tier 4-6 only.
- Conflicting sources are never averaged or silently reconciled — both figures are stored as separate evidence records with a `verification_status='partially-verified'` and displayed with attribution (per Phase 4A's Conflict C3 resolution).
- Claims older than the category's update-frequency window (Section 12) are auto-flagged `stale` in the CMS, triggering a re-verification task, without being removed from the live page until the freshness-policy threshold (6/12 months) is breached.

***

## 4. Production-Ready Tool Profile Template

```
[Header]
  Name | Logo | One-sentence factual description
  Quick Verdict badge: {best-fit|strong-fit|conditional-fit|weak-fit|insufficient-evidence}
  Last Verified: {date} | Confidence: {high|medium|low|insufficient}

[Quick Facts Sidebar]
  Primary category: {slug} | Secondary categories | Product type: {native|suite_module}
  Starting price | Free plan: Y/N | Free trial: Y/N | Deployment | Open-source status | API

[Core Capabilities] — each line tagged with a colored status badge:
  ✅ Verified   🔗 Integration-dependent   🧪 Beta   📢 Announced   ⛔ Discontinued   ⚠️ Unverified marketing claim

[AI-Specific Capabilities] (if applicable to category)
  Engines/platforms monitored | Prompt volume methodology (panel vs. custom) — flagged if unverified

[Integrations]
  Tool name | integration_type (native/api/third-party-connector/unconfirmed)

[Pricing]
  Plan-by-plan table | Price last checked: {date} | Pricing model badge

[Strengths] / [Limitations] — two column

[Best-Fit Classification]
  Company size | Role fit | Industry fit | Agency support: {unknown|no|yes-unverified|yes-verified} | Enterprise readiness

[Alternatives] — four distinct modules:
  Direct alternatives | Cheaper alternatives | Open-source alternatives | Complementary products

[Comparison Links] → Versus pages
[Product Update History] — dated changelog entries
[Evidence & Citations] — source list with verified dates
[Correction Mechanism] — "Report an error" form
[Disclosures] — sponsorship/affiliate banner if applicable
```

***

## 5. Production-Ready Category Page Template

```
[H1] {Category Name}
[Definition] 1-2 sentence factual definition
[Problems Solved] bullet list
[Intended Buyers] roles + company sizes
[When This Category Is Unnecessary] explicit exclusion guidance
[Adjacent & Frequently Confused Categories] cross-links with disambiguation
[Essential Buying Criteria] / [Optional Advanced Capabilities]
[Typical Pricing Models]
[Implementation Requirements] / [Privacy & Compliance Considerations]
[Market Map] — native vs. suite-module (or equivalent split) visual/table
[Comparison Table] — normalized fields (Section 7)
[Best Tools by Use Case] / [Best Tools by Company Size] / [Best Free & Open-Source]
[Selection Methodology] — links to Ranking Methodology page
[Common Purchasing Mistakes]
[FAQs] — structured data eligible
[Related Categories]
[Sources] [Revision History]
```

***

## 6. Additional Page Templates (Condensed)

| Page Type | Core Content Blocks |
|---|---|
| Best-Tools | Distinct selection criteria statement (not a copy of category page) → filtered shortlist → per-tool rationale (2-3 sentences, not just a table row) |
| Alternatives | Named tool being replaced → "why people look for alternatives" (cost/feature/positioning gap) → 3+ alternatives with direct comparison → migration-complexity note |
| Versus | Positioning statement first (are these actually same-tier competitors?) → normalized comparison table → "choose X if / choose Y if" verdict blocks |
| Use-Case | Job-to-be-done statement → qualifying criteria → 3+ tools that satisfy the specific use case (not just the parent category) → worked example |
| Persona | Role-specific jobs-to-be-done → filtered/curated tool list → objection-handling FAQ specific to that role |
| Industry | Industry-specific buying criteria (must be genuinely distinct, not generic) → curated shortlist → compliance/regulatory notes if relevant |
| Integration | Named tool → confirmed integrating tools list with `integration_type` badges → setup complexity note |

***

## 7. Normalized Comparison-Data Standard

- **Global fields** (every table): pricing tier, free plan/trial, deployment, integrations count, last-verified date, evidence confidence.
- **Category-specific fields**: pulled from `features` scoped to the category (e.g., AI Visibility → engines monitored; Analytics → self-hosting, cookie policy).
- **Missing data**: render literal "Not publicly verified" — never blank, never a dash implying zero.
- **Usage-based pricing**: display as range + triggering metric (e.g., "$9-69/mo, scales by pageview volume"), never a single midpoint number.
- **Native vs. integration**: separate icon/column; a Zapier-dependent feature is never visually equal to a native one.
- **Enterprise-only**: pricing cell = "Custom — contact sales"; feature comparison proceeds from public docs only, never estimated.
- **Evidence confidence**: small inline indicator per cell (H/M/L), not just per table.
- **False precision guard**: any single-source, third-party-estimated figure (e.g., Dreamdata's $599-999/mo) renders as a range with a footnote "third-party estimate, not vendor-published," never a bare number.
- **Identical/irrelevant rows**: auto-hidden if all compared tools return the same value.

***

## 8. Recommendation-Engine Rules

**Hard exclusions** (remove from candidate set before scoring): budget=$0 and free_plan=false; self-hosting required and self_hosting≠supported/required; privacy-required and privacy_positioning=standard (no documentation).

**Soft preferences** (weighted, not exclusionary): integration with named existing stack tool; agency support when role=agency; API availability when technical_ability=developer.

**Missing-data treatment**: a candidate with `insufficient-evidence` confidence on a criterion the user weighted heavily is downgraded to "Conditional fit" with an explicit note, never silently excluded or silently assumed to pass.

**Confidence thresholds**: recommendation only surfaces as "Best fit" if evidence_confidence ≥ medium on all hard-exclusion-relevant fields; otherwise the system returns "Conditional fit — some criteria unverified" with the specific unverified field named.

***

## 9. Tool Finder Operational Logic

Reuses the Phase 3 14-question conditional flow unchanged. Operational addition: each question's answer writes to a session-scoped filter object; scoring runs only after all hard-exclusion-relevant questions are answered; if a user skips a question tied to a hard exclusion, that exclusion rule is suspended (not defaulted true or false) and the result set displays a banner: "Results may include tools that don't meet unanswered criteria — answer all questions for a precise match."

***

## 10. Stack Builder Logic

- **Overlap detection**: two tools sharing the same `primary_category_id` → flag with a specific message naming the overlapping category, not a generic "overlap detected."
- **Pricing**: sum only rows where `price` is non-null and `pricing_model≠custom-enterprise`; custom-priced tools display "+ Custom (excluded from total)" appended to the sum, never treated as $0.
- **Compatibility**: cross-reference `integrations` table; unconfirmed pairs show "No known integration — verify directly with vendor" rather than assuming compatibility.
- **Missing-capability detection**: compares user's stack's category coverage against the relevant Stack Template (Phase 3 Deliverable 7) for their declared company type; gaps surfaced as suggestions, not auto-added.

***

## 11. QA Checklists

**Editorial QA**: Description is factual, not vendor-copy-paraphrased; no unsupported superlatives ("best," "leading") without evidence; fit label matches documented criteria.

**Data QA**: All required schema fields populated; controlled-vocabulary enums used (no free text in enum fields); at least 3 evidence-backed fields present; `primary_category_id` is singular and non-null.

**SEO QA**: Structured data validates (SoftwareApplication/ItemList/FAQPage as applicable); canonical tag correct; no duplicate H1; internal links to parent category and 2+ alternatives present.

**Accessibility QA**: Alt text on all images/logos; comparison tables have proper `<th>` scoping; color-coded status badges (✅🔗🧪📢⛔⚠️) also carry text labels, not color alone; keyboard-navigable filter controls.

***

## 12. Update Schedules (Reaffirmed from Phase 4A, Operationalized)

| Data Type | Frequency | Trigger for Off-Cycle Update |
|---|---|---|
| Pricing (top 50 tools) | Monthly | Vendor changelog/pricing-page change detected |
| Pricing (long tail) | Quarterly | Correction request accepted |
| Features/Capabilities | Quarterly | Announced feature ships (Announced→Verified transition) |
| Integrations | Quarterly | New integration announced |
| Security/Compliance | Semi-annually | Disclosed breach or new certification |
| Product Status (shutdown/acquisition/rebrand) | Continuous monitoring | News alert (2-source confirmation required before status change) |
| Comparisons/Rankings | Quarterly | Any compared tool's pricing/feature change |

***

## 13. Corrections, Sponsorships & Disclosures

- **User corrections**: submitted via `corrections` table, `submitted_by='user'`; reviewed by Research Analyst within 5 business days; requires 1 corroborating source before acceptance.
- **Vendor corrections**: `submitted_by='vendor'`; routed directly to Editorial Lead; still requires independent corroboration before acceptance — vendor self-report alone does not override existing evidence (prevents marketing-claim inflation).
- **Sponsorships**: `sponsorships.excluded_from_ranking` is a hard database constraint always `true` — no code path allows a sponsored placement to alter `rankings.numeric_score` or `fit_label`.
- **Affiliate disclosures**: rendered as a visible banner on any page containing an affiliate link, placed above the fold, not buried in a footer.

***

## 14. Roles & Responsibilities (Small Production Team)

| Role | Responsibilities |
|---|---|
| Research Analyst | Discovery, initial research, evidence collection, correction triage |
| Senior Editor | Verification, category-assignment judgment calls, archive/status-change confirmation |
| Editorial Lead | Final review, QA sign-off, publish authorization, editorial-override documentation, vendor-correction adjudication |
| CMS Publisher/Dev | Schema enforcement, structured data validation, page rendering QA |

For a small team, Research Analyst and Senior Editor roles may be combined; Editorial Lead sign-off must remain a separate checkpoint regardless of team size to preserve the sponsorship/ranking-independence guarantee.

***

## Worked Examples

### AI-Search Visibility Tool: Peec AI

- **Input**: Candidate from Phase 2 inventory, already has draft evidence.
- **Research**: Official product page confirms multi-engine tracking (ChatGPT, Perplexity, Gemini); pricing corroborated across two independent sources (~$95-105/mo entry, source variance noted).[^1]
- **Verification**: `primary_category_id = L3-AIVIS-NATIVE` (not suite-module — confirmed standalone company); pricing marked `verification_status='partially-verified'` due to cross-source figure variance.
- **Review**: Passes QA — 3+ evidence fields present (pricing, engines monitored, category), fit label `strong-fit` for mid-market SEO teams pending agency-support field which remains `unknown`.
- **Output**: Published tool profile with Quick Verdict "Strong fit for mid-market multi-engine AI visibility tracking," Confidence: Medium (pricing variance flagged).
- **Acceptance**: Met. **Next action**: Scheduled monthly pricing re-check (top-50 tool).

### Web Analytics Tool: Matomo

- **Research**: Official site confirms self-hosted core is free, Cloud from ~€29/mo, AGPL... actually Matomo core license is GPL — verify exact license before publishing "open-source" tag; per Phase 2 evidence, Matomo is documented as offering "self-hosted free; Cloud from ~€29/mo"  with configurable privacy controls.[^1]
- **Verification**: `primary_category_id = L2-WEBANALYTICS-PRIVACY`; `self_hosting='supported'`; `deployment_model='hybrid'` (both self-hosted and cloud options exist).
- **Review**: Passes QA. Fit label `best-fit` for "privacy-focused European company" persona and `strong-fit` generally, per Phase 3's stack-template precedent.
- **Output**: Published with GA4-replacement tag applied (correctly scoped per Phase 4A's disambiguation rule, since Matomo sits in `L2-WEBANALYTICS-PRIVACY`, not `L2-PRODUCTANALYTICS`).
- **Next action**: Quarterly feature re-check.

### Marketing Attribution Tool: Factors.ai

- **Research**: Confirmed free tier exists, positioned explicitly against Dreamdata's higher entry cost; paid tier pricing not fully detailed in available sources.[^1]
- **Verification**: `primary_category_id = L2-B2BATTR` (not ABM, not visitor-ID — per Phase 4A's Conflict C2 resolution); free-tier claim `verification_status='verified'` (2+ sources agree); paid pricing `verification_status='not-publicly-verified'`.
- **Review**: Fit label `best-fit` for "growth-stage B2B wanting attribution below Dreamdata's cost" use case; flagged with a visible "paid pricing not publicly disclosed" note rather than omitted.
- **Output**: Published profile; pricing table shows Free tier fully detailed, paid tiers marked "Not publicly verified — contact vendor."
- **Next action**: Quarterly re-check; escalate to Research Analyst if a paid-tier price becomes independently verifiable.

***

## Final Operating Procedure
The 7-stage lifecycle (Discovery→Research→Verification→Review→Publish→Update→Archive) in Section 1 is the binding operating procedure; no tool may skip Verification or Review regardless of source quality.

## Final Page-Production Templates
Sections 4-6 constitute the frozen templates for tool profiles, category pages, and the five secondary page types.

## QA System
Section 11's four-part checklist (Editorial/Data/SEO/Accessibility) is mandatory pre-publish for every page type; failure on any item blocks publish per Section 1's Review stage.

## Trust and Disclosure Policy
Sections 2, 3, and 13 together constitute the trust policy: tiered source hierarchy, claim-level evidence with multi-source conflict handling, and a hard database-level guarantee that sponsorship never touches ranking logic.

## Explicit Inputs Required for Phase 4C
1. Confirmation of the proposed evidence-confidence source-count clarification (Section 3) — this resolves one of Phase 4A's five unresolved decisions and should be ratified before Phase 4C content production begins.
2. Staffing confirmation for the 4-role structure (or the combined-role small-team variant) to model realistic editorial throughput in Phase 4C's production calendar.
3. Decision on whether the Peec AI/Factors.ai/Matomo worked examples in this report may be published as-is or require an additional independent-source pass before going live, given some fields remain `partially-verified`.
4. Final approval on Phase 4A's still-open Conflict C2 (category reassignment for 6sense, Demandbase, Warmly, Dealfront, RB2B, Salespanel) and Conflict C3 (Dreamdata pricing display), both of which directly affect which tool records Phase 4C can safely schedule for production.

---

## References

1. [04_MaximusLabs_Services_FINAL.md](04_MaximusLabs_Services_FINAL.md)

