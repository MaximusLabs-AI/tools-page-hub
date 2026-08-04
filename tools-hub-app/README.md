# MaximusLabs Tools Intelligence Hub — local app

A fully local, runnable Next.js build of the tools directory. It reads **local
seed data by default** (no Sanity, Vercel, or DNS required) behind a repository
layer, so the same UI later switches to Sanity with zero component changes.

## Run it locally
```bash
npm install
npm run dev        # http://localhost:3000
```
Other scripts:
```bash
npm run build      # production build (also lints + typechecks) — statically generates every page
npm start          # serve the production build
npm run test       # vitest unit tests (data layer + core logic)
npm run lint       # next lint
npm run typecheck  # tsc --noEmit
```

## What's in the box
- **Homepage** hero + search, featured tools, browse-by-category, CTA.
- **Directory** `/tools` — ColdIQ-style medal-ranked category blocks.
- **Department** `/tools/[dept]` and **Category** `/tools/[dept]/[category]/…` pages.
- **Tool profile** `/tools/[slug]` — hero + quick-facts, verdict, the **AI Answer Confidence** module, head-to-head comparison, alternatives, pricing, evidence ledger.
- **Versus** `/vs/[a]-vs-[b]`, **Alternatives** `/alternatives/[slug]`.
- **Search** `/search` (live, filters + sort), **Tool Finder** `/tool-finder`, **Stack Builder** `/stacks`.
- **Methodology / Corrections / Disclosures** static pages.

## Architecture (data source is swappable)
```
UI (app/, components/)  →  repository (src/lib/repository)  →  local seed  (default)
                                                            └→  Sanity (GROQ over HTTP)  when DATA_SOURCE=sanity
```
- `src/lib/types.ts` — domain types both repositories return.
- `src/lib/repository/{local,sanity,groq,index}.ts` — the swappable data layer + factory (local fallback when no Sanity project id).
- `src/lib/core/*` — pure logic: search, filters, comparison engine, Tool Finder, Stack Builder, taxonomy/ranking. Unit-tested.
- `src/data/seed.json` — generated from the CSVs by `../scripts/generate-seed.mjs` (regenerate with `node scripts/generate-seed.mjs` from the parent folder).

## Switch to Sanity later
Copy `.env.example` to `.env.local`, set `DATA_SOURCE=sanity` and your project id/dataset,
import the seed, and restart. Full steps in [`../SANITY-SETUP.md`](../SANITY-SETUP.md).
No UI code changes required.

## Honest status of the data
- Tool identity, category, pricing summary, verdict fit label, and alternatives are seeded from the verified inventory.
- **AI Answer Confidence** is populated for **Peec AI only**, labeled `illustrative` — the other tools show it once a real prompt-panel run exists.
- Evidence/sources, capabilities, multi-tier pricing, strengths/limitations are intentionally empty until the editorial Research stage.
