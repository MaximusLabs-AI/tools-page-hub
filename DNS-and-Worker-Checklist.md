# DNS & Worker Setup Checklist

Step-by-step to attach `tools-hub-app` to `www.maximuslabs.ai/resources/ai-tool-directory/*` via Cloudflare. Companion to [About-the-Project.md](About-the-Project.md) §8 and [wrangler.toml](wrangler.toml). Do these **in order** — later steps depend on earlier ones.

---

## Before you start

- [ ] You have access to the **Cloudflare account** managing the `maximuslabs.ai` zone.
- [ ] You have access to the **Vercel project** `tools-page-hub`.
- [ ] `wrangler` CLI installed (`npm install -g wrangler`) if you want to deploy from the terminal instead of pasting into the dashboard.

---

## Step 1 — Point `tools.maximuslabs.ai` at Vercel

This is the **origin** the Worker fetches from (`ORIGIN` in the script).

1. In **Vercel** → project `tools-page-hub` → Settings → Domains → **Add** → enter `tools.maximuslabs.ai`.
2. Vercel shows you a DNS record to create (usually a `CNAME` to `cname.vercel-dns.com`).
3. In **Cloudflare** → DNS for the `maximuslabs.ai` zone → **Add record**:
   - Type: `CNAME`
   - Name: `tools`
   - Target: whatever Vercel gave you
   - **Proxy status: DNS only (grey cloud)** — not orange/proxied.

   *Why DNS-only:* the Worker's `fetch()` call goes straight to `tools.maximuslabs.ai` as the real origin. Routing that hostname through Cloudflare's proxy too adds an unnecessary extra hop and can complicate SSL — Vercel's own guidance for custom domains behind another proxy is to leave the record unproxied.
4. Wait for Vercel to show the domain as **Verified** (SSL issued) — usually a few minutes.
5. **Test:** open `https://tools.maximuslabs.ai/resources/ai-tool-directory` directly. It should show the same site as `tools-page-hub.vercel.app/resources/ai-tool-directory` (this is the *un-rewritten* origin — fine that it's visible for now). Note the app now lives under that path even on the direct domain — it's mounted there via Next.js `basePath`, not just at `/`.

- [ ] `tools.maximuslabs.ai/resources/ai-tool-directory` loads the app directly
- [ ] Vercel shows the domain as verified/SSL active

---

## Step 2 — Deploy the Worker

Option A — CLI (recommended, repeatable):
```bash
wrangler login
```
Open [wrangler.toml](wrangler.toml) and fill in `account_id` (Cloudflare dashboard → any zone overview → right sidebar → **Account ID**). Then from the repo root:
```bash
wrangler deploy
```

Option B — Dashboard (manual, one-off):
1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Worker**.
2. Name it `maximus-tools-proxy`.
3. Paste the contents of `cloudflare-worker-tools.js` into the editor, replacing the default template.
4. **Save and deploy.**

- [ ] Worker `maximus-tools-proxy` exists and shows as deployed

---

## Step 3 — Attach the Worker to routes on the zone

If you deployed via `wrangler deploy` with the `routes` block in `wrangler.toml`, **this step is already done** — skip to Step 4.

If you deployed via the dashboard (Option B), add routes manually:

1. Cloudflare dashboard → your zone (`maximuslabs.ai`) → **Workers Routes** (or Workers & Pages → the worker → Triggers → Routes).
2. Add these two routes, both pointing to `maximus-tools-proxy`:

   | Route pattern |
   |---|
   | `www.maximuslabs.ai/resources/ai-tool-directory*` |
   | `www.maximuslabs.ai/tools-static/*` |

   **Do not** add a bare `www.maximuslabs.ai/resources*` route — Webflow already serves other pages under `/resources/` (e.g. `/resources/reports` for Industry Reports), and a bare prefix would hijack those.

- [ ] Both routes are attached to the Worker
- [ ] No route uses a bare `/resources*` pattern

---

## Step 4 — Confirm `www.maximuslabs.ai` itself is proxied (orange cloud)

Workers Routes only fire on requests that pass through Cloudflare's proxy. Check the existing DNS record for `www` (the one already pointing at Webflow):

1. Cloudflare → DNS → find the `www` record.
2. Confirm its proxy status is **Proxied (orange cloud)**. (It almost certainly already is, since Webflow traffic already flows through Cloudflare — just confirming, not changing anything.)

- [ ] `www` record is proxied (orange cloud) — unchanged, just verified

---

## Step 5 — Test every path type

Load each of these on the **real domain** (not the `.vercel.app` one) and confirm:

| URL | Expect |
|---|---|
| `https://www.maximuslabs.ai/resources/ai-tool-directory` | Tools collection page, **fully styled** (this is the real test that `/tools-static/*` is routed correctly — if it loads unstyled, that route is missing) |
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

## Step 6 — Point the main-site nav at it

In Webflow, update the nav dropdown's **"AI Tool Directory"** link (Resources → Tools → AI Tool Directory, per the menu design) to `https://www.maximuslabs.ai/resources/ai-tool-directory`. No Webflow page build needed — the Worker handles everything under that path. The four **Free AI Tools** links in the same dropdown keep pointing at their existing `/tools/<slug>` Webflow pages, untouched.

- [ ] Webflow "AI Tool Directory" nav link updated
- [ ] "Free AI Tools" links in the same dropdown left as-is

---

## Step 7 — Optional: redeploy Sanity Studio

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
| Page loads with no CSS/styling | `/tools-static/*` route missing or not attached to the Worker |
| `/resources/reports` (or other existing Webflow `/resources/*` pages) now show the Next app | A route was added as bare `/resources*` instead of `/resources/ai-tool-directory*` — fix the route pattern |
| 522/523 error on any proxied path | `tools.maximuslabs.ai` DNS record misconfigured, or Vercel domain not verified yet (Step 1) |
| Changes to the worker script don't show up | Forgot to `wrangler deploy` (or re-save in the dashboard) after editing |
| Links on the page point to the old `/tools/...` paths | Old cached build — confirm the Vercel deployment includes the `basePath` change in `next.config.mjs` |
