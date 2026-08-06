# Worker Setup Checklist

Step-by-step to attach `tools-hub-app` to `www.maximuslabs.ai/resources/ai-tool-directory/*` — a **subdirectory** of the main domain, not a subdomain. Companion to [About-the-Project.md](About-the-Project.md) §8 and [wrangler.toml](wrangler.toml). Do these **in order** — later steps depend on earlier ones.

This checklist covers only the **Worker + route** side. Provisioning the Vercel origin itself (custom domain, DNS, whatever hostname you point the Worker at) is left to your own process — the same one you already use for the other MaximusLabs Cloudflare-fronted apps. Nothing here prescribes or hardcodes a specific origin hostname.

---

## Before you start

- [ ] You have access to the **Cloudflare account** managing the `maximuslabs.ai` zone.
- [ ] You have a working origin URL for the `tools-page-hub` Vercel deployment — however you've chosen to set that up.
- [ ] `wrangler` CLI installed (`npm install -g wrangler`) if you want to deploy from the terminal instead of pasting into the dashboard.

---

## Step 1 — Deploy the Worker

Option A — CLI (recommended, repeatable):
```bash
wrangler login
```
Open [wrangler.toml](wrangler.toml) and fill in the two placeholders:
- `account_id` — Cloudflare dashboard → any zone overview → right sidebar → **Account ID**.
- `[vars] ORIGIN` — the host (no scheme) your Vercel deployment is actually reachable at. Not prescribed here; use whatever you've set up.

Then from the repo root:
```bash
wrangler deploy
```

Option B — Dashboard (manual, one-off):
1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Worker**.
2. Name it `maximus-tools-proxy`.
3. Paste the contents of `cloudflare-worker-tools.js` into the editor, replacing the default template.
4. Worker → **Settings** → **Variables** → add `ORIGIN` = your origin host.
5. **Save and deploy.**

- [ ] Worker `maximus-tools-proxy` exists and shows as deployed
- [ ] `ORIGIN` variable is set (worker returns a 500 with a clear message if it's missing — that's the self-check)

---

## Step 2 — Attach the Worker to a route on the zone

If you deployed via `wrangler deploy` with the `routes` block in `wrangler.toml`, **this step is already done** — skip to Step 3.

If you deployed via the dashboard (Option B), add the route manually:

1. Cloudflare dashboard → your zone (`maximuslabs.ai`) → **Workers Routes** (or Workers & Pages → the worker → Triggers → Routes).
2. Add this one route, pointing to `maximus-tools-proxy`:

   | Route pattern |
   |---|
   | `www.maximuslabs.ai/resources/ai-tool-directory*` |

   This single route covers both pages and static assets — `basePath` scopes both under the same prefix (see §7/§8 of `About-the-Project.md`), so there's no separate asset route to add.

   **Do not** add a bare `www.maximuslabs.ai/resources*` route — Webflow already serves other pages under `/resources/` (e.g. `/resources/reports` for Industry Reports), and a bare prefix would hijack those.

- [ ] The route is attached to the Worker
- [ ] The route is NOT a bare `/resources*` pattern

---

## Step 3 — Test every path type

Load each of these on the **real domain** and confirm:

| URL | Expect |
|---|---|
| `https://www.maximuslabs.ai/resources/ai-tool-directory` | Tools collection page, **fully styled** — CSS/JS live under the same `/resources/ai-tool-directory/_next/*` prefix as the page, so if the route is attached at all, styling comes with it |
| `https://www.maximuslabs.ai/resources/ai-tool-directory/tools/<any tool slug>` | Tool review page, styled, header/footer match the main site |
| `https://www.maximuslabs.ai/resources/ai-tool-directory/stacks` | Stack Builder page from the app |
| `https://www.maximuslabs.ai/resources/ai-tool-directory/methodology` | Static policy page from the app |
| `https://www.maximuslabs.ai/resources/reports` | Existing Webflow page (Industry Reports) — **must be unaffected**; proves the route isn't swallowing the rest of `/resources/` |
| `https://www.maximuslabs.ai/tools/ai-content-humanizer` | Still the Webflow free-tool page — unaffected, this app never touches `/tools/*` anymore |
| `https://www.maximuslabs.ai/anything-unrelated` | Normal Webflow page (proves the Worker doesn't swallow unrelated paths) |

- [ ] Collection page loads styled at the new path
- [ ] A tool review page loads styled
- [ ] `/resources/reports` still shows its normal Webflow content
- [ ] The Webflow free tools at `/tools/*` are unaffected
- [ ] An unrelated page (e.g. the homepage) is unaffected

---

## Step 4 — Point the main-site nav at it

In Webflow, update the nav dropdown's **"AI Tool Directory"** link (Resources → Tools → AI Tool Directory, per the menu design) to `https://www.maximuslabs.ai/resources/ai-tool-directory`. No Webflow page build needed — the Worker handles everything under that path. The four **Free AI Tools** links in the same dropdown keep pointing at their existing `/tools/<slug>` Webflow pages, untouched.

- [ ] Webflow "AI Tool Directory" nav link updated
- [ ] "Free AI Tools" links in the same dropdown left as-is

---

## Step 5 — Optional: redeploy Sanity Studio

The Sanity schema had an internal reserved-slug validation rule removed (it's no longer needed — see the note in §8 of `About-the-Project.md`). This is a description/validation cleanup, not a new field, so it's not required for the URL rewrite to work — but to pick it up in the Studio UI:

```bash
cd sanity-studio
npx sanity login   # once, opens a browser to authenticate
npx sanity deploy
```

- [ ] (Optional) Studio redeployed

---

## If something's wrong

| Symptom | Likely cause |
|---|---|
| Worker returns "ORIGIN env var is not set" | `[vars] ORIGIN` missing from `wrangler.toml` (or the dashboard Variables tab) |
| Page loads with no CSS/styling | The `/resources/ai-tool-directory*` route isn't attached to the Worker at all (this one route covers assets too) |
| `/resources/reports` (or other existing Webflow `/resources/*` pages) now show the Next app | A route was added as bare `/resources*` instead of `/resources/ai-tool-directory*` — fix the route pattern |
| 522/523 error on any proxied path | Your `ORIGIN` host isn't actually reachable — check however you provisioned it |
| Changes to the worker script don't show up | Forgot to `wrangler deploy` (or re-save in the dashboard) after editing |
| Links on the page point to the old `/tools/...` paths | Old cached build — confirm the Vercel deployment includes the `basePath` change in `next.config.mjs` |
| CSS/JS 404s on Vercel but worked with `npm start` locally | A stale custom `assetPrefix`/rewrite config reappeared — this app should have neither; `basePath` alone must own both pages and `/_next/*` |
