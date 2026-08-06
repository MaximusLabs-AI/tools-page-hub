# About the Project — MaximusLabs Tools Intelligence Hub

A complete reference for the **Tools directory** that lives in `tools-hub-app/`, written so it can be used to plan a **Cloudflare URL rewrite** that attaches this app under **`www.maximuslabs.ai/resources/ai-tool-directory/*`** (Webflow main site), matching the "Resources → Tools → AI Tool Directory" nav item in the live menu design.

_Last updated: 2026-08. Catalog: **31 tools / 13 categories**._

> **Ready to deploy?** See [wrangler.toml](wrangler.toml) (the Worker deploy config) and [DNS-and-Worker-Checklist.md](DNS-and-Worker-Checklist.md) (step-by-step setup) alongside this doc.

---

## 1. What this project is

A standalone **Next.js web app** that renders a curated directory of **AI-search / GEO / AEO / SEO tools**, plus per-tool "review" pages. It is a separate deployment from the Webflow marketing site, but is designed to be served **under the same domain** (`maximuslabs.ai/resources/ai-tool-directory/*`) via a reverse proxy so it looks and feels like part of the main site.

- **Signature feature:** an **"AI Answer Confidence"** module on each tool page — how much AI engines (ChatGPT, Claude, Gemini, Perplexity, Google AI Mode) trust a tool, versus the vendor's own claims and independent web reviews. (Currently seeded with clearly-labelled *illustrative sample data* until a live measurement run is wired in.)
- **Chrome parity:** the header and footer are exact replicas of the live `maximuslabs.ai` header/footer (Satoshi font, navy palette), so the embedded pages blend into the main site.

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 14.2.5** (App Router, React Server Components) |
| Language | **TypeScript 5.5.4**, **React 18.3.1** |
| CMS / data | **Sanity** (project `asrqfhiu`, dataset `production`, API `2024-08-01`) |
| Styling | Hand-written CSS (`globals.css`, `components.css`) — no framework; **Satoshi** font via Fontshare |
| Tests | **Vitest** (`npm run test`) |
| Hosting | **Vercel** (native Git deploys) |
| Edge/proxy | **Cloudflare Worker** (reverse proxy into the main domain) |
| Content editing | **Sanity Studio** at `https://maximuslabs-tools-hub.sanity.studio/` |

**Key scripts** (`tools-hub-app/package.json`): `dev`, `build`, `start`, `lint`, `typecheck`, `test`.

---

## 3. Repository layout

```
Tools Page/                         (git root — repo: MaximusLabs-AI/tools-page-hub)
├─ tools-hub-app/                    ← the Next.js app (Vercel Root Directory)
│  ├─ src/
│  │  ├─ app/                        ← App Router routes (see §5)
│  │  │  ├─ page.tsx                 ← collection (home) page
│  │  │  ├─ layout.tsx               ← <Header/> + children + <Footer/>
│  │  │  ├─ tools/[[...slug]]/       ← tool detail + category views
│  │  │  ├─ search/ , tool-finder/ , stacks/
│  │  │  ├─ vs/[pair]/ , alternatives/[slug]/
│  │  │  ├─ methodology/ , corrections/ , disclosures/
│  │  │  ├─ api/revalidate/          ← on-demand ISR webhook
│  │  │  ├─ globals.css , components.css
│  │  ├─ components/                 ← Header, Footer, ToolProfileView, EveryoneUses,
│  │  │                                UltimateDirectory, HeroSearch, AIConfidence, …
│  │  ├─ lib/
│  │  │  ├─ types.ts                 ← domain types (Tool, Category, …)
│  │  │  ├─ repository/              ← data layer (local + sanity) — see §4
│  │  │  └─ core/                    ← search, filters, comparison, toolFinder, stackBuilder
│  │  └─ data/seed.json              ← generated local catalog (fallback / dev)
│  ├─ next.config.mjs                ← assetPrefix + rewrites (see §7)
│  ├─ vercel.json                    ← { framework: nextjs }
│  ├─ .env.production                ← PUBLIC Sanity config (committed)
│  └─ .env.local                     ← secrets (gitignored)
├─ sanity-studio/                    ← deployable Sanity Studio
├─ sanity-schema/ , scripts/         ← schema + seed generators
└─ cloudflare-worker-tools.js        ← the reverse-proxy worker (see §8)
```

---

## 4. Data layer (how content is loaded)

The UI never talks to Sanity directly. It goes through a **repository interface** (`src/lib/repository/`) with two interchangeable implementations, chosen by the `DATA_SOURCE` env var:

- **`local`** — reads the generated `src/data/seed.json` (used for local dev / offline).
- **`sanity`** — reads Sanity via **GROQ** over the public HTTP query API (no client dependency). **This is what production uses** (`DATA_SOURCE=sanity`).

Both return the **same typed domain shapes** (`Tool`, `Category`, …), so pages are identical regardless of source. The production dataset is **public**, so reads need **no token** (served from the Sanity CDN). Content edits in Sanity Studio appear on the site within the ISR window, or instantly if the revalidate webhook (§7) is wired.

---

## 5. Pages & URL structure ⭐ (most important for the rewrite)

The app is mounted under **one single path** — `/resources/ai-tool-directory` — via Next.js's built-in **`basePath`** config (`next.config.mjs`, production only). This means every route the app renders internally still lives under `app/tools/…`, `app/vs/…`, etc. exactly as before, but Next.js automatically prefixes **every** generated link, `redirect()`, and client-side navigation with `/resources/ai-tool-directory` at build time — no component code references the path directly, so nothing can be missed or drift out of sync.

All routes are **statically generated** (`generateStaticParams`). When proxied, they appear under `maximuslabs.ai` at the paths below.

| Public URL (under maximuslabs.ai) | Route file | What it renders |
|---|---|---|
| `/resources/ai-tool-directory` | `app/page.tsx` | **Collection / directory home** |
| `/resources/ai-tool-directory/tools` | `app/tools/[[...slug]]/page.tsx` | redirects to the directory home |
| `/resources/ai-tool-directory/tools/<tool-slug>` | same (1 segment = tool) | **Tool detail ("review") page** |
| `/resources/ai-tool-directory/tools/<category-path>` | same (matches a category slug) | **Category view** (tools in that category) |
| `/resources/ai-tool-directory/search?q=…` | `app/search/page.tsx` | **Search & filter** results (noindex) |
| `/resources/ai-tool-directory/tool-finder` | `app/tool-finder/page.tsx` | guided "find the right tool" wizard |
| `/resources/ai-tool-directory/stacks` | `app/stacks/page.tsx` | **Stack Builder** (pick tools → monthly cost) |
| `/resources/ai-tool-directory/vs/<toolA-vs-toolB>` | `app/vs/[pair]/page.tsx` | head-to-head **comparison** page |
| `/resources/ai-tool-directory/alternatives/<tool-slug>` | `app/alternatives/[slug]/page.tsx` | **alternatives** to a tool |
| `/resources/ai-tool-directory/methodology` | `app/methodology/page.tsx` | how ratings/evidence work |
| `/resources/ai-tool-directory/corrections` | `app/corrections/page.tsx` | corrections policy |
| `/resources/ai-tool-directory/disclosures` | `app/disclosures/page.tsx` | disclosures |
| `/api/revalidate` | `app/api/revalidate/route.ts` | POST webhook to refresh ISR (called directly on the Vercel domain, not proxied) |
| **`/tools-static/_next/*`** | (static assets) | **CSS / JS / images** — see §6 & §7 (unrelated to the basePath — this is a separate `assetPrefix`) |

> **The set of top-level path prefixes owned by this app** (everything the proxy must forward) is now just **two**:
> `/resources/ai-tool-directory` and `/tools-static`.
> This same pair lives in the worker as `APP_PREFIXES`.

### No more reserved-slug collision
Earlier revisions of this app lived directly at `/tools/*`, which collided with four **free tools** Webflow already serves at that same path (`ai-content-humanizer`, `ai-content-optimizer`, `ai-crawlability-checker`, `llms-txt-generator`) — requiring a "reserved slugs" guard in both the worker and the Sanity schema to keep them from fighting over the same URL.

**That collision no longer exists.** Now that the app is mounted at `/resources/ai-tool-directory`, it never touches `/tools/*` at all — Webflow keeps that whole namespace, including all four free tools and any future ones, with zero coordination needed. The reserved-slug guard was removed from both `cloudflare-worker-tools.js` and `sanity-schema/tool.ts`.

> **New watch-item instead:** `/resources/*` is **not** exclusively owned by this app — Webflow already serves other content there (e.g. `/resources/reports` for Industry Reports). The worker/route pattern must match the **full** `/resources/ai-tool-directory` prefix, never a bare `/resources*`, or it will hijack those other pages.

---

## 6. How each page is designed

**Brand system (matches live maximuslabs.ai):** font **Satoshi**; navy palette — `#001c64` deep navy, `#1e3251` ink (primary text), `#0070e0` accent blue, `#449afb` sky, `#f3f3f6` page grey, white. Headings weight ~500–600 (light, like the main site); container max-width **1520px**.

**Header** (`components/Header.tsx`): white sticky bar, the **pinwheel mark** logo (no wordmark), mega-menu dropdowns (Services / Resources / Industries / Company), Pricing, navy pill **Contact Us**. All links absolute to `https://www.maximuslabs.ai/…` so they work embedded or standalone.

**Footer** (`components/Footer.tsx`): light `#f3f3f6`, MaximusLabs wordmark + tagline, Contact Us pill + LinkedIn, **6 columns** (Services + Industries stacked in col 1, then AEO, GEO, Tools, Resources, Company), copyright + legal. Absolute links.

**Collection page** (`app/page.tsx`):
1. **Navy hero** — big title + **live typeahead search** (suggests tools by name/category; Enter → `/search`).
2. Cross-sell strip ("free AI-visibility scan").
3. **"Best AI-Era Tools Everyone Uses"** — `EveryoneUses`: left category sidebar (scrollable, sticky) that **filters** a card grid on the right.
4. **"The Ultimate AI-Era Tools Directory"** — `UltimateDirectory`: sticky **table-of-contents** sidebar (jump-to-category) + category groups, each listing its tools.

**Tool detail / "review" page** (`components/ToolProfileView.tsx`, at `/resources/ai-tool-directory/tools/<slug>`): breadcrumb → product hero card (logo, name, tagline, CTA) → tag chips → **What is X** (overview + capability chips + optional demo video) → **Who is X for** (ICP) → **Key features** → **Benefits & trade-offs** → **AI Answer Confidence** module (the signature block) → **Pricing** cards → **Setup** → **Alternatives** → **FAQ** → **Comments**; plus a **sticky sidebar** (at-a-glance facts, core capabilities, AI-confidence summary, ease-of-use gauge) and a navy cross-sell footer band. Sections are light (no navy alternation on this page, by design).

**Search** (`/resources/ai-tool-directory/search`): breadcrumb (Home › Tools › Search: "…"), search box, facet filters + sort, results grid. `noindex`.

**Utility pages** — Tool Finder (wizard), Stack Builder (cost calculator), Comparison (`/vs`), Alternatives, Methodology / Corrections / Disclosures (static policy pages).

---

## 7. Deployment (Vercel)

- **Repo:** `github.com/MaximusLabs-AI/tools-page-hub`, production branch **`main`**.
- **Integration:** Vercel **native Git** — every push to `main` builds & deploys automatically. (No GitHub Actions; the old workflow is disabled/manual-only.)
- **Project settings:** **Root Directory = `tools-hub-app`**, Framework = **Next.js**. _(Do not change Root Directory back to repo root — native builds would produce an empty site.)_
- **Public production URL:** `https://tools-page-hub.vercel.app/resources/ai-tool-directory` (note the `basePath` below means even the direct Vercel URL requires this prefix in production — there's no unprefixed `/` route anymore). Intended **origin host for the proxy: `tools.maximuslabs.ai`** (a Vercel custom domain / DNS record that points at this deployment — see §8).
- **Env vars:** public Sanity config is committed in `.env.production` (`DATA_SOURCE=sanity`, `NEXT_PUBLIC_SANITY_PROJECT_ID=asrqfhiu`, dataset `production`, API `2024-08-01`). Optional runtime secret **`SANITY_REVALIDATE_SECRET`** (Vercel env) powers the `/api/revalidate` webhook for instant content updates.

### basePath — how the app is mounted at `/resources/ai-tool-directory`
`next.config.mjs`, production only:
```js
basePath: '/resources/ai-tool-directory'
```
This is the whole mechanism behind §5 — Next.js's own router prefixes every internal link, redirect, and client navigation with this path automatically. Verified in the production build: every internal `href` in the rendered HTML carries the prefix, with zero leftover unprefixed links.

### assetPrefix — why `/tools-static/` exists (a separate, independent mechanism)
Two Next.js apps share `maximuslabs.ai`, and both would want `/_next/*`. To avoid the collision, this app sets (in `next.config.mjs`, **production only**):

```js
assetPrefix: '/tools-static'
```

So the HTML references its assets at **`/tools-static/_next/…`** instead of `/_next/…`. Because the Vercel origin still *serves* those files at `/_next/…`, `next.config.mjs` also adds a **rewrite** so the origin resolves the prefixed URLs directly:

```js
async rewrites() {
  return { beforeFiles: [{ source: '/tools-static/_next/:path*', destination: '/_next/:path*' }] }
}
```

**Consequence for the proxy:** anything under **`/tools-static/*`** must also be forwarded to the origin, or the site loads with **no CSS/JS**.

---

## 8. The Cloudflare URL rewrite (the whole point)

The reverse proxy is already written: **`cloudflare-worker-tools.js`** (repo root). It serves the Vercel app under `www.maximuslabs.ai/resources/ai-tool-directory*` while leaving the rest of the domain to Webflow — including `/resources/reports` and everything else already under `/resources/`.

**Config in the worker:**
- `ORIGIN = 'tools.maximuslabs.ai'` — the Vercel deployment host.
- `APP_PREFIXES` — now just two entries: `/resources/ai-tool-directory` and `/tools-static` (see §5).

**Routing logic, in order (per request):**
1. If path equals or starts with an `APP_PREFIXES` entry → **proxy to the Vercel origin**:
   - Strip the `/tools-static` prefix so the origin gets `/_next/…` (`originPath`). The `/resources/ai-tool-directory` prefix on page routes is **not** stripped — the origin's own `basePath` (§7) expects to receive it as-is.
   - `fetch('https://' + ORIGIN + originPath + search)` with the original method/headers/body, `redirect: 'manual'`.
   - On the way back: delete `x-robots-tag` (origin is noindex; the public URL stays indexable) and add `x-served-by`.
2. Everything else → **Webflow** (the main marketing site, including other `/resources/*` pages).

There is no reserved-slug fallthrough step anymore — see §5 for why that guard was removed.

### Step-by-step plan to attach it in Webflow + Cloudflare

1. **Point the origin subdomain at Vercel.** Add `tools.maximuslabs.ai` as a **custom domain on the Vercel project** and create the DNS record Vercel gives you. This subdomain must reach Vercel **directly** (in Cloudflare, set that record **DNS-only / grey cloud**) so the Worker's `fetch()` doesn't loop back through itself.
2. **Keep the app's own domain noindex** (already handled: the origin sends `x-robots-tag: noindex`, which the Worker strips only for the public `maximuslabs.ai` path — so only the canonical URL is indexable).
3. **Create the Worker** in the Cloudflare dashboard (or `wrangler`), pasting `cloudflare-worker-tools.js`. Confirm `ORIGIN` and `APP_PREFIXES` are correct.
4. **Add Worker Routes** on the `maximuslabs.ai` zone (Workers → Routes) — just two:
   - `www.maximuslabs.ai/resources/ai-tool-directory*`
   - `www.maximuslabs.ai/tools-static/*`
   - **Never** a bare `www.maximuslabs.ai/resources*` — that would swallow `/resources/reports` and any other existing Webflow content under `/resources/`.
5. **Webflow side:** nothing to build — Webflow keeps serving `/`, `/resources/reports`, `/tools/<free-tool>`, and everything else, untouched.
6. **Link into it from Webflow:** point the "AI Tool Directory" item in the Resources → Tools nav dropdown at `https://www.maximuslabs.ai/resources/ai-tool-directory` (the collection page). The "Free AI Tools" links in that same dropdown stay pointed at their existing `/tools/<slug>` Webflow pages, unaffected.
7. **Test after cutover:** load `maximuslabs.ai/resources/ai-tool-directory` (collection), a tool review page under it (confirm CSS loads via `/tools-static/_next/…`), `/resources/reports` (must be unchanged Webflow content), and a `/tools/<free-tool>` page (must still be Webflow, unaffected since this app no longer touches `/tools/*` at all).

> **Failure mode to watch:** if pages render **unstyled** through the proxy, it's the `/tools-static/*` route missing or not being forwarded — that path carries all CSS/JS.
> **Second failure mode to watch:** if `/resources/reports` (or other existing `/resources/*` Webflow pages) start showing the tools app, a route was added as a bare `/resources*` pattern instead of the full `/resources/ai-tool-directory*`.

Full step-by-step with checkboxes: **[DNS-and-Worker-Checklist.md](DNS-and-Worker-Checklist.md)**.

---

## 9. Editing content (Sanity Studio)

- **Studio:** `https://maximuslabs-tools-hub.sanity.studio/` — sign in with the account that owns project `asrqfhiu`.
- Editable per tool: name, slug, tagline, overview, demo video URL, ICP, ease-of-use, capabilities, pricing plans, alternatives, FAQ, AI-confidence data, etc.
- **Publish → live:** appears within the ISR refresh window, or instantly if the Sanity→`/api/revalidate` webhook is configured with `SANITY_REVALIDATE_SECRET`.
- **Security:** the write token is only needed for imports/Studio deploys and lives in `.env.local` (gitignored). Public reads use no token.

---

## 10. Quick facts (cheat sheet)

| | |
|---|---|
| App root | `tools-hub-app/` (Vercel Root Directory) |
| Repo / branch | `MaximusLabs-AI/tools-page-hub` / `main` |
| Vercel URL | `tools-page-hub.vercel.app/resources/ai-tool-directory` |
| Proxy origin | `tools.maximuslabs.ai` |
| Public mount | `www.maximuslabs.ai/resources/ai-tool-directory` (via `basePath`) |
| Asset path | `/tools-static/_next/*` (`assetPrefix`, independent of the mount point above) |
| Webflow `/tools/*` | Untouched — this app no longer lives there; no reserved-slug guard needed |
| Watch-item | `/resources/*` also serves other Webflow pages (e.g. `/resources/reports`) — always match the full `/resources/ai-tool-directory` prefix, never bare `/resources*` |
| Sanity | project `asrqfhiu`, dataset `production` |
| Studio | `maximuslabs-tools-hub.sanity.studio` |
| Catalog | 31 tools, 13 categories |
| Font / palette | Satoshi; `#001c64` / `#1e3251` / `#0070e0` / `#f3f3f6` |
