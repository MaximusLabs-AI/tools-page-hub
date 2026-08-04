# Connecting the Tools Hub to Sanity (and going live)

The local app runs today with zero infrastructure. When you're ready to move to
a real CMS + production deploy, do these steps **in this order**. Each is yours
to run (they need accounts/tokens the app never stores).

## Prerequisites you provide
1. A **Sanity** project — `projectId` + dataset name (e.g. `production`) + a **write token** (kept by you).
2. A **Vercel** project + a connected Git repo.
3. **DNS** control for `tools.maximuslabs.ai` on Cloudflare.

## Step 1 — Stand up the Sanity Studio
Reuse your existing Studio or create one, then add the schema:
```bash
# copy the schema into your Studio project
cp -r sanity-schema  <studio>/schemas/tools-hub
```
```ts
// sanity.config.ts
import {schemaTypes} from './schemas/tools-hub'
export default defineConfig({ /* projectId, dataset */ schema: {types: schemaTypes} })
```
Deploy the Studio (`npx sanity deploy`).

## Step 2 — Import the seed dataset (22 categories + 50 tools)
```bash
npx sanity dataset import seed/tools-hub.seed.ndjson production --replace
```
This is the same data the local app uses. Categories and tools resolve their
references automatically. Re-run `node scripts/generate-seed.mjs` first if you
change the source CSVs.

## Step 3 — Point the app at Sanity
In `tools-hub-app/.env.local` (never commit it):
```
DATA_SOURCE=sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=<your_project_id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-08-01
# only needed to read drafts/preview:
SANITY_READ_TOKEN=<optional_read_token>
```
Restart `npm run dev`. The repository factory now serves Sanity via GROQ; if the
project id is missing it silently falls back to local seed data. No UI changes.

## Step 4 — Deploy to Vercel
Connect the repo, set the same env vars in Vercel project settings, deploy.
Add an on-publish webhook from Sanity → a revalidation route so edits go live
via ISR without a redeploy (mirrors the AI Search 101 setup).

## Step 5 — Serve under maximuslabs.ai/tools/*
Add a Cloudflare Worker reverse-proxy from `maximuslabs.ai/tools/*` to the Vercel
origin (origin stays `noindex`; the proxy strips it), exactly like the AI Search
101 hub. Users and Google see one domain.

## Order of operations (recap)
Local approve → connect Sanity (steps 1–3) → validate the production dataset →
deploy to Vercel (step 4) → configure DNS/proxy (step 5). Do not skip ahead:
each step depends on the previous one being verified.
