## Executive Summary

The modern marketing/growth/AI-search tool landscape has fragmented into roughly **12 major department families** and **60+ distinct categories**, driven by three structural shifts: (1) AI-native search (ChatGPT, Perplexity, AI Overviews) creating an entirely new GEO/AEO measurement category that didn't exist before 2024, (2) privacy regulation pushing a parallel universe of Google Analytics alternatives, and (3) B2B buying committees demanding attribution beyond last-click, spawning the Factors.ai/Dreamdata/HockeyStack category. A buyer-oriented directory must resist becoming "yet another AI tools list" by organizing around **jobs-to-be-done** (e.g., "track brand citations in ChatGPT") rather than product categories alone, and by clearly separating genuine standalone platforms from features bundled inside larger suites (e.g., Ahrefs Brand Radar and Semrush AI Toolkit are modules inside existing SEO suites, not independent companies).[^1][^2][^3][^4][^5][^6]

Verified as of August 3, 2026: pricing and feature claims below are drawn from vendor sites and 2026-dated independent comparisons; anything not independently corroborated is labeled "Not publicly verified."

## Complete Level 1–4 Taxonomy

### Level 1: Major Department/Tool Families
1. AI Search & Answer Engine Intelligence (GEO/AEO)
2. Search & SEO Intelligence
3. Web & Product Analytics
4. Attribution, Account Intelligence & Buyer Journeys
5. Content & Creative (AI writing, image, video, audio)
6. Advertising & Paid Media
7. Social, Community & Reputation
8. CRM, Sales & Revenue
9. Data Infrastructure & BI
10. Automation, Agents & Developer/AI Platforms
11. CX & Support
12. Web Presence (CMS, landing pages, forms, personalization)

### Level 2–4 Taxonomy Table (Representative Sample — Priority Areas)

| L1 | L2 Category | L3 Subcategory | L4 Use Case Example |
|---|---|---|---|
| AI Search & Answer Engine Intelligence | AI Visibility Tracking | Multi-engine share-of-voice | Track brand citations across ChatGPT, Perplexity, Gemini [^1][^7] |
| AI Search & Answer Engine Intelligence | AI Visibility Tracking | Single-engine deep monitoring | Monitor ChatGPT-only mention frequency (e.g., Otterly Lite) [^8] |
| AI Search & Answer Engine Intelligence | Citation & Source Intelligence | Source-gap discovery | Find domains cited instead of yours for a prompt set [^2] |
| AI Search & Answer Engine Intelligence | AI Crawler & Technical Auditing | Bot access auditing | Verify GPTBot/PerplexityBot are not blocked by robots.txt |
| AI Search & Answer Engine Intelligence | AI Content Optimization | Answer-nugget structuring | Score content for AI-extractability |
| AI Search & Answer Engine Intelligence | Enterprise AI-Search Intelligence | Agency/multi-brand reporting | White-label AI visibility reports across client accounts [^8] |
| Search & SEO Intelligence | Search Console Alternatives/Complements | Data depth extension | Extend GSC's 16-month data window (e.g., via Semrush/Ahrefs import) [^9][^10] |
| Search & SEO Intelligence | Rank Tracking | SERP feature tracking | Track AI Overview trigger rate per keyword |
| Search & SEO Intelligence | Log-File Analysis | Crawl-budget auditing | Identify wasted crawl budget from log files |
| Web & Product Analytics | Privacy-First Web Analytics | Cookieless pageview tracking | Replace GA4 with consent-free analytics [^5][^6] |
| Web & Product Analytics | Product Analytics | Funnel/retention analysis | Track feature adoption cohorts (Mixpanel/Amplitude-style) |
| Attribution & Account Intelligence | B2B Multi-Touch Attribution | Revenue-linked touchpoints | Map ad spend to closed-won revenue [^4] |
| Attribution & Account Intelligence | Dark-Funnel/Account ID | Anonymous visitor identification | De-anonymize account-level website visits |

*Full L2-L4 taxonomy (60+ categories) to be expanded in Phase 2 tool inventory build-out.*

## Category Definitions & Boundaries (Priority Categories)

**AI Visibility Tracking** — Definition: Software that periodically sends prompts to AI models (ChatGPT, Perplexity, Gemini, Copilot, AI Overviews) and measures whether/how a brand is mentioned. Problems solved: invisible brand presence in zero-click AI answers. Primary buyers: SEO/marketing leads at brands and agencies. Company size: SMB to enterprise (segmented by vendor — Otterly/Peec skew SMB-mid, Profound/Scrunch skew enterprise). Related categories: Social listening, brand monitoring, SEO rank tracking. Confused with: traditional brand-mention/PR monitoring tools, which don't query LLMs directly. Recommended slug: `/tools/ai-visibility-tracking`. Search intent: commercial investigation ("best AI visibility tools"). Deserves standalone collection page: **Yes**.[^8][^7]

**Google Search Console Alternatives** — Definition: Tools that either replace, extend, or import GSC's first-party search performance data. Critical distinction (confirmed across sources): **no tool fully replaces GSC's first-party click/impression data** — all are complements or supersets. Recommended slug: `/tools/google-search-console-alternatives`. Standalone page: **Yes**, but must open with the "nothing replaces GSC's own data" caveat to avoid misleading buyers.[^9][^10][^11]

**Google Analytics Alternatives** — Definition: split into two genuinely different buyer intents: (1) privacy-first pageview analytics (Plausible, Fathom, Simple Analytics, Umami, Matomo) that are direct GA4 replacements, and (2) product/behavioral analytics (Mixpanel, Amplitude, PostHog, Heap) that serve a different job (feature usage, not marketing traffic) and should NOT be positioned as GA4 replacements. This is a common category-confusion point that must be resolved with two separate subcategories, not one.[^5][^6][^12]

**B2B Attribution & Account Intelligence** — Definition: Platforms that connect marketing/ad spend to CRM pipeline and revenue, often layering account identification (dark-funnel) on top. Factors.ai, Dreamdata, HockeyStack, Ruler Analytics are the primary competitive set; pricing at the top end is high (Dreamdata ~$599-999/mo). Distinct from ABM platforms (6sense, Demandbase) which focus on intent-based targeting/orchestration rather than attribution reporting — these should be a **secondary tag**, not merged into the same primary category.[^4]

## Areas With Excessive Overlap

1. **AI visibility tracking vs. traditional SEO suites with AI modules**: Ahrefs Brand Radar and Semrush AI Toolkit are add-on modules inside existing rank-tracking suites, not standalone AI-search companies, while Peec AI, Profound, Scrunch, Otterly are AI-visibility-native companies. The directory must tag these differently ("Native AI-search platform" vs. "SEO suite AI module") to avoid misrepresenting positioning.[^2][^3][^7]
2. **Attribution vs. ABM vs. Intent Data**: These three are routinely conflated in vendor marketing. 6sense/Demandbase (ABM/intent) vs. Factors.ai/Dreamdata (attribution) vs. Warmly/Albacross (visitor identification) solve related but distinct jobs and need separate primary categories with cross-linking.
3. **Privacy analytics vs. product analytics**: Both get called "Google Analytics alternatives" in vendor SEO content, but serve different buyers (marketing vs. product teams) — must be split.
4. **GSC alternatives vs. general SEO platforms**: Semrush/Ahrefs/Mangools are broad SEO suites that happen to include some GSC-adjacent data; true GSC alternatives (Bing Webmaster Tools) are a much smaller set.[^13][^9]

## Missing or Emerging Categories

- **LLM Observability & Prompt Evaluation** (for dev/product teams building AI features, distinct from AI-search visibility for marketers) — needs its own top-level placement under "Developer/AI Platforms," not folded into GEO.
- **AI Crawler Log Analysis** — an emerging niche (verifying GPTBot/ClaudeBot/PerplexityBot access patterns in server logs) distinct from generic log-file SEO analysis.
- **Agentic Commerce Optimization** — early-stage category (optimizing for AI shopping agents), not yet mature enough for standalone tools as of August 2026; flag as "emerging, monitor only."
- **AI Sentiment/Reputation Monitoring within LLM answers** (not just mention frequency but tone) — some AI-visibility tools claim this (Peec AI sentiment tracking ) but is inconsistently verified across vendors — flag as a filter/tag rather than standalone category until maturity increases.[^14]

## Recommended Scope for First Release

Given resource constraints, launch scope should prioritize the categories with the highest current buyer search intent and the clearest competitive tool sets already verified:
1. AI Visibility/GEO/AEO tracking (highest priority — most active vendor landscape, most comparison content already published)[^15][^16][^17][^1][^8]
2. Google Search Console alternatives/complements[^10][^11][^9]
3. Google Analytics alternatives (both privacy-first and product-analytics subcategories)[^6][^12][^18][^5]
4. B2B Attribution & Account Intelligence[^4]
5. Core SEO tooling (rank tracking, schema, technical auditing)

Defer to later releases: full paid-media/advertising taxonomy, CRM/sales-engagement taxonomy, and the long tail of AI writing/image/video tools — these categories are extremely crowded with low differentiation and lower buyer research intent relative to AI-search categories.

## Research Risks and Information Gaps

- **Pricing volatility**: AI visibility tools are repricing frequently (Peec AI shows $95-105/mo across different 2026 sources, suggesting regional/currency variance or recent changes)  — every price must be re-verified at time of publish, not assumed stable.[^7][^8]
- **Prompt-volume claims are frequently unverifiable**: Several vendors (e.g., Profound's enterprise tier) cite prompt-volume figures that independent sources describe as "panel-derived" rather than fully transparent — flag these as vendor-claimed, not independently verified.[^8]
- **Category-boundary disputes**: Whether Ahrefs/Semrush's AI modules should be classified alongside native AI-visibility platforms is a genuine judgment call the directory must state explicitly, since the underlying engine coverage and methodology differ significantly (AI Overviews prompt-panel scale, e.g., Ahrefs' 411M+ prompt index, dwarfs boutique competitors' custom-prompt-only models).[^2]
- **New entrants appearing monthly**: This space (Sanbi.ai, Promptwatch, Ayzeo, AnswerMentions, Alhena) is adding credible new competitors faster than most directories can track — the tool inventory will need a defined re-verification cadence (recommend quarterly) built into the editorial workflow.
- **Attribution platform pricing opacity**: Enterprise attribution tools (Dreamdata, 6sense, Demandbase) frequently gate pricing behind "contact sales" — Phase 2 will need to mark these as "Custom pricing — not publicly verified" rather than estimating figures.

***

## Handoff Prompt for Phase 2

*Use this prompt to continue the research without losing Phase 1's taxonomy and standards:*

> Continue the MaximusLabs/global marketing tools directory research from Phase 1 (Market Map, delivered August 3, 2026). Using the same taxonomy (12 L1 department families, priority categories: AI Visibility/GEO/AEO, Google Search Console alternatives, Google Analytics alternatives — split privacy-first vs. product analytics, B2B Attribution/Account Intelligence, core SEO tooling), the same research standards (official sources first, label unverified claims explicitly, distinguish standalone platforms from suite-embedded modules, note pricing volatility), and the same tool record schema (name, URL, category, pricing, ICP, strengths/limitations, closest alternatives, evidence + verification date) — proceed to **Phase 2: Prioritized Tool Inventory**. Build a table of at least 150 credible products grouped by category (not alphabetically), covering: AI visibility platforms (Peec AI, Profound, Scrunch AI, Otterly.ai, Ahrefs Brand Radar, Semrush AI Toolkit, Athena, Goodie, ZipTie, Promptwatch, Ayzeo, Sanbi.ai, Alhena, AnswerMentions and others discovered), GSC alternatives/complements, GA alternatives (both subcategories), attribution/account-intelligence platforms (Factors.ai, Dreamdata, HockeyStack, Ruler Analytics, 6sense, Demandbase, Warmly, Albacross, Leadfeeder/Dealfront, Common Room), and core SEO/content tools. Flag shutdowns, rebrands, and acquisitions found during research. Preserve all Phase 1 category boundaries and overlap resolutions.

---

## References

1. [Profound vs Peec vs Scrunch vs Alhena: 2026 Compare](https://alhena.ai/blog/profound-vs-peec-vs-scrunch-vs-alhena/) - Profound is the enterprise category leader with the broadest engine coverage. Peec AI is the best-va...

2. [Ahrefs Brand Radar: See ANY brand's AI visibility](https://ahrefs.com/brand-radar) - Map your full AI funnel across 6 AI tools. Get breadth from 210M+ search-backed prompts, depth from ...

3. [Ahrefs Brand Radar vs Semrush AI Toolkit: Honest 2026 ...](https://rankbits.com/blog/ahrefs-brand-radar-vs-semrush-ai-toolkit) - Honest comparison of Ahrefs Brand Radar vs Semrush AI Toolkit. Pricing, engine coverage, documented ...

4. [Dreamdata vs. Hockeystack: Features, Pricing, Reviews & ...](https://www.factors.ai/blog/dreamdata-vs-hockeystack) - - Dreamdata: Starts at $999/month. - HockeyStack: Offers a free tier, with paid plans starting at $9...

5. [Best Privacy-Friendly Analytics in 2026](https://privacytools.io/stats) - Web analytics that measure your traffic without cookies, consent banners, or shipping your visitors ...

6. [7 Privacy-First Google Analytics Alternatives You Need to ...](https://www.databuddy.cc/blog/7-privacy-first-google-analytics-alternatives-you-need-to-know-in-2026) - Google Analytics is a privacy and compliance mess. Privacy first analytics now give you real insight...

7. [Peec AI vs Profound: Which is Better? | AEO Compare - Scrunch](https://scrunch.com/aeo-tools/compare/peec-ai-vs-profound/) - Compare Peec AI vs Profound. Pricing, features, ratings, and which tool is right for your team.

8. [GEO Platforms Compared 2026: Profound, Peec, Scrunch & More](https://ayzeo.com/comparisons/geo-platforms-compared) - Side-by-side 2026 comparison of 8 GEO / AI visibility platforms: AI engines, prompts, agency feature...

9. [Best Google Search Console Alternatives 2026 · SR](https://www.smarterranking.com/software/best-google-search-console-alternatives-2026/) - Seven Google Search Console alternatives scored on data, competitive view and value. Semrush leads a...

10. [Google Search Console Alternatives in 2026](https://www.seo-stack.io/blog/google-search-console-alternatives-in-2026)

11. [7 Best Alternatives to Google Search Console in 2026](https://searchspine.com/google-search-console/alternatives) - Explore top Google Search Console alternatives for advanced SEO insights, site auditing, and compreh...

12. [Google Analytics Privacy Focused Alternatives: Complete 2026 ...](https://swetrix.com/blog/google-analytics-privacy-focused-alternatives) - Discover GDPR-compliant Google Analytics alternatives that capture 40-50% more traffic while protect...

13. [Best Google Search Console Alternatives 2026](https://optiwing.com/alternatives/google-search-console-alternatives) - Compare tools that go beyond Google Search Console with honest pros, cons, and pricing.

14. [Peec.ai Review & Tutorial 2026 — Full Beginner’s Guide](https://www.youtube.com/watch?v=1O0U0oemB84) - Peec.ai Review + Full Tutorial. In this video I go deep on Peec.ai, an AI visibility tool that track...

15. [Scrunch AI vs Profound vs Peec AI vs Promptwatch: Four Platforms ...](https://toolsolved.com/guides/scrunch-ai-vs-profound-vs-peec-ai-vs-promptwatch-four-platforms-one-goal-which-actually-improves-your-ai-search-visibility-in-2026) - Four platforms, one goal: getting your brand cited by ChatGPT, Perplexity, and Gemini. We break down...

16. [Peec vs Profound vs Scrunch vs Otterly: How to Choose](https://citedindex.com/blog/choosing-an-ai-visibility-platform-2026/) - Four AI-visibility platforms span $29/month self-serve to custom enterprise. A side-by-side comparis...

17. [Alternatives to Peec.ai, Profound & Scrunch in 2026](https://sanbi.ai/blog/ai-visibility-platform-comparison-peec-profound-scrunch) - Profound vs Peec.ai the two platforms serve different workflow styles (Profound = analyst-heavy data...

18. [Best Google Analytics Alternatives in 2026 (Compared)](https://clicky.com/blog/best-google-analytics-alternatives) - The best Google Analytics alternatives in 2026, with real pros, cons, and pricing. Find the best web...

