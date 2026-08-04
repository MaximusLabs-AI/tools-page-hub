# Tools Intelligence Hub — Sanity schema

The CMS backbone for the MaximusLabs Tools directory, authored in the same idiom
as the AI Search 101 hub (`defineType`/`defineField`, Sanity v3). This is the
pre-Week-1 launch blocker from Phase 5 (Deliverable 2 / Epic "CMS and database").

## Files
- `category.ts` — frozen Phase 4A taxonomy node (L1–L4). Codes/slugs from `phase4a_frozen_taxonomy.csv`.
- `vendor.ts` — parent company.
- `source.ts` — tiered evidence source (Phase 4B source hierarchy).
- `objects.ts` — reusable objects: `quickVerdict`, `bestFit`, `pricingPlan`, `capability`, `integrationRef`, `alternativeRef`, `evidenceClaim`, and the **AI Answer Confidence** set (`aiConfidence` + `aiEngineScore`, `sourceOfTruth`, `dimensionScore`, `citationSource`).
- `tool.ts` — the core document; renders the frozen 14-section profile + the AI module.
- `index.ts` — exports `schemaTypes`.

## How it maps to the frozen model
The 13-table Phase 4A SQL schema becomes 4 Sanity documents (category, vendor,
source, tool) with the join/child tables (pricing_plans, tool_features,
alternatives, integrations, evidence_records) modeled as inline arrays on `tool`,
exactly as Phase 4A's CMS note prescribes. Enum values are copied verbatim from
the frozen controlled vocabulary — do not rename them.

## The AI Answer Confidence extension
`aiConfidence` is **net-new** (not in Phases 1–5). `dataStatus` defaults to
`illustrative` and MUST stay that way until wired to a real prompt-panel run;
it drives the on-page "sample data" label. Per-engine scores use the frozen
engine set (chatgpt, claude, google-ai-mode, perplexity, gemini).

## Install
```
# in the Sanity studio project
cp -r sanity-schema  studio/schemas/tools-hub
```
```ts
// sanity.config.ts
import {schemaTypes} from './schemas/tools-hub'
export default defineConfig({ /* ... */ schema: { types: schemaTypes } })
```

## Next build steps (Phase 5 sequence)
1. Stand up the Studio with these types; seed the 22 categories, then the 50 launch tools (`phase4c_first50_launch.csv`).
2. Next.js catch-all routes (`/tools/[...]`, `/tools/[slug]`, `/vs/[pair]`, …) + GROQ queries; port the two HTML blueprints into React components sharing the brand CSS.
3. Postgres sync + Typesense index + Inngest re-verification jobs.
4. Cloudflare reverse-proxy under `maximuslabs.ai/tools/*` (same pattern as AI Search 101).

## Prerequisites (yours to provide)
Sanity project id + dataset + write token; Vercel project + repo; `tools.maximuslabs.ai` DNS on Cloudflare.
