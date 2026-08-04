# Tools Intelligence Hub — seed dataset

`tools-hub.seed.ndjson` — 72 import-ready Sanity documents: **22 categories** (the
frozen Phase 4A taxonomy) + **50 tools** (the Phase 4C launch list). Regenerate
any time with:

```bash
node scripts/generate-seed.mjs
```

The generator ([scripts/generate-seed.mjs](../scripts/generate-seed.mjs)) reads
three source CSVs and transforms them to the `sanity-schema` shape — this is the
Phase 5 "import/transform layer," reproducible and free of invented data:
- `phase4a_frozen_taxonomy.csv` → category documents
- `phase4c_first50_launch.csv` → tool skeletons (name, url, category, pricing string, verification, alternatives)
- `maximuslabs_tools_inventory_phase2.csv` → the one-line descriptions (all 50 matched)

## Import into a Sanity dataset
```bash
# categories resolve before tools automatically (single file, refs within it)
npx sanity dataset import seed/tools-hub.seed.ndjson <dataset> --replace
```

## What is and isn't in the seed (honesty ledger)
- **Included:** identity, primary/secondary category refs, product type (Ahrefs Brand Radar + Semrush AI Toolkit = `suite_module`), a one-line pricing summary plan, a seed `quickVerdict` fit label, direct alternatives (only those inside the 50-set), `lastVerifiedAt`, `publicationStatus: approved`.
- **AI Answer Confidence:** seeded for **Peec AI only**, `dataStatus: illustrative` — the on-page "sample data" label. The other 49 are intentionally empty until a real prompt-panel run exists. No fake per-engine scores.
- **Not seeded (added in the editorial Research/Verification stage):** logos (need asset upload), `evidence` claims + `source` docs, full multi-tier pricing plans, capabilities, integrations, best-fit detail. `publicationStatus` is `approved`, not `published`, because the ≥3-evidence-field publish rule isn't met by the skeleton alone.

## Category-mapping flags for editorial review (surfaced, not silently resolved)
- **DataForSEO** → `L2-GSCEXT`: no exact frozen node for "SEO Data API".
- **Phrasera (Readability)** → `L2-GEOCONTENT`: the frozen taxonomy consolidates readability under GEO content; Phase 4C lists it as a separate category.
- **HubSpot / Salesforce** → `L1-CRM`: no L2 under CRM exists yet (CRM L2 breakdown deferred in Phase 4A).

The seed `quickVerdict` fit labels are conservative defaults derived from verification status (Verified → strong-fit, Partially/positioning → conditional-fit, Not-publicly-verified → insufficient-evidence). Editorial refines these in the Verification stage.
