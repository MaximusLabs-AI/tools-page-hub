// Editorial enrichment for the curated AI-search / GEO catalog.
// Pricing and video facts are sourced from official vendor pages or channels
// where available. `videoOfficial: false` is deliberate: the UI must never
// present an independent overview as vendor-published.

const CHECKED = '2026-08-04'

const plan = (planName, priceDisplay, price, pricingModel, bestFor, features, extra = {}) => ({
  planName,
  priceDisplay,
  price,
  pricingModel,
  bestFor,
  features,
  verificationStatus: 'verified',
  priceLastChecked: CHECKED,
  ...extra,
})

const video = (id, title, publisher, official = true, sourceUrl) => ({
  videoUrl: `https://www.youtube.com/watch?v=${id}`,
  videoTitle: title,
  videoPublisher: publisher,
  videoOfficial: official,
  videoSourceUrl: sourceUrl || `https://www.youtube.com/watch?v=${id}`,
})

const GROUPS = {
  visibility: {
    noun: 'AI-search visibility platform',
    outcome: 'measure where a brand appears in answer engines and turn citation gaps into an action plan',
    capabilities: [
      ['Multi-engine monitoring', 'Tracks brand presence across selected AI answer engines on a repeatable prompt set.'],
      ['Share-of-voice benchmarking', 'Compares visibility against named competitors by topic, market, or prompt group.'],
      ['Citation source analysis', 'Shows the domains and pages that answer engines use to support their responses.'],
      ['Sentiment and position', 'Surfaces how a brand is described and where it appears inside generated answers.'],
      ['Trend reporting', 'Makes changes in visibility, mentions, and citations easier to report over time.'],
      ['Actionable content gaps', 'Connects missed prompts and competitor wins to pages or topics worth improving.'],
    ],
    strengths: ['Makes an unfamiliar AI-search channel measurable', 'Combines brand, competitor, and citation context', 'Creates repeatable reporting for GEO/AEO work'],
    limitations: ['Results depend on the prompts, regions, and engines included', 'AI answers vary naturally, so trend direction matters more than one reading'],
    ideal: 'Best for SEO, brand, content, and growth teams that already invest in discoverability and need a defensible way to measure visibility inside AI answers.',
    setup: 'Create a workspace, add the brand and competitors, then approve a representative prompt set. The first dashboard is quick; the higher-value work is refining prompts, regions, and reporting cadence with stakeholders.',
  },
  llmstxt: {
    noun: 'focused llms.txt utility',
    outcome: 'inspect or create a machine-readable index of important website content',
    capabilities: [
      ['llms.txt inspection', 'Checks whether a site publishes an llms.txt file and whether it can be fetched.'],
      ['Format validation', 'Flags common structural or formatting issues that make the file harder to use.'],
      ['URL extraction', 'Surfaces the pages referenced in the file for a quick editorial review.'],
      ['Guided generation', 'Helps assemble a standards-aligned file without writing it from scratch.'],
      ['Copy or download', 'Produces an output that can be copied, downloaded, and deployed at the site root.'],
      ['No-code workflow', 'Keeps the workflow accessible to marketers and site owners without developer tooling.'],
    ],
    strengths: ['Fast and narrowly scoped', 'Useful as a technical hygiene check', 'Low-friction way to create or review a file'],
    limitations: ['No major search or AI provider guarantees that llms.txt affects rankings or citations', 'A valid file cannot compensate for weak, inaccessible, or unhelpful site content'],
    ideal: 'Best for technical SEOs, developers, and content teams that want to test llms.txt as an emerging discovery convention without buying a full platform.',
    setup: 'Enter a domain or select the pages to include, review the generated output, then publish it as /llms.txt. Treat it as an experimental discovery aid and keep the underlying pages crawlable and useful.',
  },
  searchConsole: {
    noun: 'first-party search performance platform',
    outcome: 'inspect how a search engine crawls, indexes, and surfaces a site',
    capabilities: [
      ['Search performance reporting', 'Reports impressions, clicks, queries, pages, and average position from first-party search data.'],
      ['Index coverage', 'Shows indexed pages and the reasons other URLs were excluded or blocked.'],
      ['URL inspection', 'Provides a page-level view of discovery, crawl, indexing, and enhancement status.'],
      ['Sitemap submission', 'Lets site owners submit and monitor XML sitemaps.'],
      ['Issue alerts', 'Highlights important crawl, indexing, security, or enhancement problems.'],
      ['Data export and API', 'Supports downstream analysis in spreadsheets, BI tools, or custom applications.'],
    ],
    strengths: ['Authoritative first-party data', 'Free for verified site owners', 'Essential baseline for technical search diagnostics'],
    limitations: ['Reporting is scoped to the provider’s own search ecosystem', 'Aggregated data can require an external warehouse or specialist tool for deeper analysis'],
    ideal: 'Best for every verified website owner, with especially high value for SEO, engineering, analytics, and content teams.',
    setup: 'Verify domain ownership, submit a sitemap, and confirm important page templates are indexable. Data accumulates over time; connect the API or an export workflow when the native reports become limiting.',
  },
  rank: {
    noun: 'rank-tracking platform',
    outcome: 'monitor keyword positions across locations, devices, and search engines',
    capabilities: [
      ['Scheduled rank tracking', 'Refreshes tracked keyword positions on a defined daily or weekly cadence.'],
      ['Location and device targeting', 'Segments results by country, city, language, and desktop or mobile context.'],
      ['Competitor tracking', 'Benchmarks the same keyword set against competing domains.'],
      ['SERP feature monitoring', 'Records featured snippets, local results, AI features, and other result types when supported.'],
      ['Share-of-voice reporting', 'Rolls keyword positions into an easier-to-communicate visibility metric.'],
      ['Reporting and exports', 'Supports scheduled reports, CSV exports, and integrations for client or team workflows.'],
    ],
    strengths: ['Turns ranking movement into a consistent time series', 'Supports local and competitor segmentation', 'Useful for reporting the outcome of SEO work'],
    limitations: ['Keyword-based tracking does not represent every query a customer may use', 'High-frequency, multi-location tracking can become expensive'],
    ideal: 'Best for SEO teams, agencies, and multi-location brands that need dependable rank history and stakeholder reporting.',
    setup: 'Connect the domain, upload a representative keyword set, and define engines, devices, and locations before the first run. Keep branded, non-branded, commercial, and informational groups separate so changes remain interpretable.',
  },
  suite: {
    noun: 'all-in-one SEO suite',
    outcome: 'combine research, competitive intelligence, technical diagnostics, content, and reporting in one subscription',
    capabilities: [
      ['Keyword research', 'Finds search demand, difficulty, intent, and related topic opportunities.'],
      ['Competitive research', 'Shows the keywords, pages, and acquisition patterns driving competitor visibility.'],
      ['Backlink analysis', 'Indexes referring domains and links for authority and outreach analysis.'],
      ['Site auditing', 'Crawls sites for technical, on-page, and indexability issues.'],
      ['Rank tracking', 'Monitors selected keywords by location and device over time.'],
      ['AI-search visibility', 'Adds brand mentions, citations, or AI answer monitoring where the current suite supports it.'],
    ],
    strengths: ['Reduces tool switching across core SEO workflows', 'Large datasets make competitive research practical', 'Broad reporting coverage for in-house teams and agencies'],
    limitations: ['Breadth can make onboarding and navigation more complex', 'The best specialist tool may still go deeper in one narrow workflow'],
    ideal: 'Best for SEO teams and agencies that want one primary research and reporting system rather than a collection of narrowly focused tools.',
    setup: 'Start with a project for one domain, connect first-party data, and enable only the modules tied to current goals. Add competitors and reporting after the data model is clean; activating every module at once usually creates noise.',
  },
  crawler: {
    noun: 'technical SEO crawler',
    outcome: 'crawl websites like a search bot and expose technical or on-page problems at scale',
    capabilities: [
      ['Website crawling', 'Discovers internal URLs, response codes, directives, and link relationships.'],
      ['Metadata auditing', 'Checks titles, descriptions, headings, canonicals, and other on-page signals.'],
      ['Duplicate detection', 'Finds exact or near-duplicate pages and repeated metadata.'],
      ['Rendering controls', 'Supports JavaScript rendering and configurable user agents where the plan allows.'],
      ['Structured-data checks', 'Extracts and validates schema markup across crawled pages.'],
      ['Custom extraction and exports', 'Pulls page-level values into a dataset for deeper investigation.'],
    ],
    strengths: ['Detailed page-level technical evidence', 'Flexible enough for routine checks and forensic audits', 'Exports cleanly into specialist analysis workflows'],
    limitations: ['Large crawls require careful configuration and hardware or cloud capacity', 'Findings still need prioritization against business impact'],
    ideal: 'Best for technical SEOs, developers, and agencies responsible for diagnosing crawl, indexation, and template-level problems.',
    setup: 'Begin with a conservative crawl limit and default rendering, then add JavaScript, custom extraction, or external API integrations only when the audit question requires them. Save configuration profiles for repeatable monitoring.',
  },
  content: {
    noun: 'SEO and GEO content optimization platform',
    outcome: 'research topics, improve coverage, and make content more useful to both search engines and answer engines',
    capabilities: [
      ['Topic and SERP research', 'Analyzes competing pages and the entities, questions, and subtopics they cover.'],
      ['Content scoring', 'Scores a draft or live page against a topic model and practical coverage targets.'],
      ['Optimization guidance', 'Suggests missing concepts, sections, and supporting questions while writers edit.'],
      ['Brief generation', 'Turns research into a structured, shareable content brief.'],
      ['Content inventory', 'Audits existing pages to identify decay, gaps, cannibalization, or refresh opportunities.'],
      ['AI-search support', 'Adds GEO scoring, prompt tracking, citation context, or AI-search guidance where available.'],
    ],
    strengths: ['Makes research and editorial guidance repeatable', 'Helps teams improve existing content as well as new drafts', 'Creates a shared optimization standard for writers and editors'],
    limitations: ['Scores are guidance, not a guarantee of rankings or citations', 'Over-optimizing to a checklist can reduce clarity and originality'],
    ideal: 'Best for content strategists, SEO editors, writers, and agencies producing or refreshing search-led content at a consistent volume.',
    setup: 'Create a project, connect or import the content inventory, and test the scoring workflow on an existing priority page. Define editorial rules before scaling so recommendations support the brand voice instead of replacing judgment.',
  },
  schema: {
    noun: 'structured-data generator',
    outcome: 'turn page facts into valid JSON-LD schema markup without hand-writing it',
    capabilities: [
      ['Guided schema forms', 'Collects the fields required for the selected schema type.'],
      ['JSON-LD generation', 'Produces implementation-ready structured data.'],
      ['Multiple schema types', 'Supports common article, organization, FAQ, product, local, and event patterns.'],
      ['Copy-ready output', 'Makes generated markup easy to copy into a CMS or template.'],
      ['Validation guidance', 'Helps spot missing required or recommended properties before deployment.'],
      ['No-code workflow', 'Lets non-developers prepare markup while retaining a review step.'],
    ],
    strengths: ['Faster than writing JSON-LD manually', 'Reduces syntax mistakes', 'Useful for one-off pages and implementation handoffs'],
    limitations: ['Generated markup must still match visible page content', 'Eligibility for rich results is never guaranteed'],
    ideal: 'Best for SEOs, content managers, and developers implementing standard schema types on a small number of pages.',
    setup: 'Choose the schema type, enter only facts visible on the page, copy the JSON-LD, and validate it before publishing. Template-scale deployment should be reviewed by a developer.',
  },
  readability: {
    noun: 'readability and content-quality checker',
    outcome: 'estimate how easy a passage is to read and surface sentences worth simplifying',
    capabilities: [
      ['Readability scoring', 'Calculates established readability metrics from pasted text.'],
      ['Grade-level estimate', 'Translates text complexity into an approximate reading level.'],
      ['Sentence analysis', 'Highlights long or structurally complex sentences.'],
      ['Word and sentence counts', 'Provides basic length and composition statistics.'],
      ['Plain-language prompts', 'Points editors toward shorter, clearer constructions.'],
      ['Instant browser workflow', 'Returns feedback without a full content platform setup.'],
    ],
    strengths: ['Immediate feedback with no onboarding', 'Helpful editorial quality-control step', 'Makes complexity easier to discuss consistently'],
    limitations: ['A readability score cannot judge accuracy, usefulness, or brand voice', 'Technical audiences may legitimately require specialized language'],
    ideal: 'Best for writers, editors, marketers, and subject-matter experts who want a quick plain-language check before publication.',
    setup: 'Paste the final draft, inspect the sentences driving the score, and edit selectively. Recheck after revisions, but preserve necessary terminology and the audience’s expected level of detail.',
  },
  data: {
    noun: 'SEO data API platform',
    outcome: 'supply SERP, keyword, backlink, business, and on-page data to products and automated workflows',
    capabilities: [
      ['SERP APIs', 'Returns structured search results across engines, locations, languages, and devices.'],
      ['Keyword data', 'Provides search volume, related terms, intent, and historical metrics.'],
      ['Backlink data', 'Exposes referring-domain and link-level records for analysis.'],
      ['On-page API', 'Crawls and evaluates page or site-level technical signals.'],
      ['Business data', 'Provides maps, reviews, and business-listing datasets where supported.'],
      ['Sandbox and client libraries', 'Supports development and testing before production usage.'],
    ],
    strengths: ['Usage-based access to multiple SEO datasets', 'Designed for products and repeatable automation', 'Avoids operating a large search-data collection stack'],
    limitations: ['Requires engineering resources and cost monitoring', 'API outputs still need a product or analysis layer'],
    ideal: 'Best for SEO software companies, data teams, agencies with automated reporting, and developers building search intelligence into a product.',
    setup: 'Create an account, test requests in the sandbox, then set task limits and cost controls before production. Cache stable responses and monitor retries so pay-as-you-go usage remains predictable.',
  },
}

const FACTS = {
  'peec-ai': {
    group: 'visibility',
    tagline: 'Measure and improve how your brand appears across AI search.',
    ...video('WHP1jf8F_BA', 'Peec AI: Track and Improve Your AI Brand Visibility', 'Peec AI'),
    plans: [
      plan('Starter', '$95/mo', 95, 'flat-subscription', 'One brand starting AI visibility tracking', ['50 prompts', '3 AI models', '1 project'], {sourceUrl: 'https://peec.ai/pricing'}),
      plan('Pro', '$245/mo', 245, 'flat-subscription', 'Growing teams comparing brands and topics', ['150 prompts', '2 projects', 'Expanded reporting'], {popular: true, sourceUrl: 'https://peec.ai/pricing'}),
      plan('Advanced', '$495/mo', 495, 'flat-subscription', 'Agencies and multi-brand teams', ['350 prompts', '5 projects', 'Higher tracking capacity'], {sourceUrl: 'https://peec.ai/pricing'}),
      plan('Enterprise', 'Custom', null, 'custom-enterprise', 'Custom scale, procurement, and support', ['Custom projects and prompts', 'Enterprise onboarding', 'Commercial terms'], {sourceUrl: 'https://peec.ai/pricing'}),
    ],
  },
  'otterly-ai': {
    group: 'visibility',
    tagline: 'Monitor brand mentions, links, and sentiment in AI-generated answers.',
    ...video('edvaLP8L0b0', 'OtterlyAI – Search Monitoring and Optimization Platform', 'OtterlyAI', true, 'https://help.otterly.ai/learn-more'),
    plans: [
      plan('Lite', '$29/mo', 29, 'flat-subscription', 'A small prompt set for one brand', ['15 search prompts', 'Daily monitoring', 'Brand and link tracking'], {freeTrial: true, sourceUrl: 'https://help.otterly.ai/pricing-of-otterlyai'}),
      plan('Standard', 'See official pricing', null, 'flat-subscription', 'Teams expanding prompt coverage', ['100 search prompts', 'Daily monitoring', 'GEO audit and exports'], {popular: true, freeTrial: true, sourceUrl: 'https://help.otterly.ai/pricing-of-otterlyai'}),
      plan('Premium', 'See official pricing', null, 'flat-subscription', 'Agencies and established programs', ['400 search prompts', 'Higher reporting limits', 'Priority workflow capacity'], {freeTrial: true, sourceUrl: 'https://help.otterly.ai/pricing-of-otterlyai'}),
      plan('Enterprise', 'Custom', null, 'custom-enterprise', 'Custom prompt volume and service', ['Custom limits', 'Team onboarding', 'Enterprise support'], {sourceUrl: 'https://help.otterly.ai/pricing-of-otterlyai'}),
    ],
  },
  profound: {
    group: 'visibility',
    tagline: 'Enterprise AEO intelligence, AI traffic analytics, and execution in one system.',
    ...video('TTidorXLogM', 'Introducing Profound', 'Profound'),
    plans: [
      plan('Starter', '$99/mo, billed yearly', 99, 'flat-subscription', 'Small companies monitoring ChatGPT', ['50 prompts', 'ChatGPT tracking', '100 Agent credits/month'], {sourceUrl: 'https://www.tryprofound.com/pricing'}),
      plan('Growth', '$399/mo, billed yearly', 399, 'flat-subscription', 'Growing AEO and content teams', ['3 answer engines', '100 prompts', '400 Agent credits/month'], {popular: true, freeTrial: true, sourceUrl: 'https://www.tryprofound.com/pricing'}),
      plan('Enterprise', 'Custom', null, 'custom-enterprise', 'Large brands and agencies', ['Up to 9 answer engines', 'Custom prompts and companies', 'SSO, SOC 2, dedicated support'], {sourceUrl: 'https://www.tryprofound.com/pricing'}),
    ],
  },
  'scrunch-ai': {
    group: 'visibility',
    tagline: 'Help AI agents understand, cite, and recommend your brand accurately.',
    ...video('63EIEZ7zlbE', 'Scrunch: There’s a better way to win AI search', 'Scrunch'),
    plans: [
      plan('Brand Core', '$250/mo', 250, 'flat-subscription', 'One brand building an AI-search program', ['AI visibility analytics', 'Digital presence management', '7-day trial'], {freeTrial: true, popular: true, sourceUrl: 'https://scrunch.com/faqs/what-is-the-pricing-for-scrunch-plans/'}),
      plan('Brand Enterprise', 'Custom', null, 'custom-enterprise', 'Enterprise brand controls and scale', ['Custom visibility coverage', 'Enterprise governance', 'Dedicated support'], {sourceUrl: 'https://scrunch.com/faqs/what-is-the-pricing-for-scrunch-plans/'}),
      plan('Agency Core', '$500/mo', 500, 'flat-subscription', 'Agencies managing client brands', ['Multi-client workspace', 'Client AI visibility', 'Agency reporting'], {freeTrial: true, sourceUrl: 'https://scrunch.com/faqs/what-is-the-pricing-for-scrunch-plans/'}),
      plan('Agency Enterprise', 'Custom', null, 'custom-enterprise', 'Large agency portfolios', ['Custom client volume', 'Enterprise controls', 'Commercial support'], {sourceUrl: 'https://scrunch.com/faqs/what-is-the-pricing-for-scrunch-plans/'}),
    ],
  },
  athenahq: {
    group: 'visibility',
    tagline: 'Monitor AI visibility and deploy actions from one GEO command center.',
    ...video('j03AdwKYquE', 'Introducing Athena AI, our latest AI Agent', 'AthenaHQ AI'),
    plans: [
      plan('Essential', 'Free', 0, 'freemium', 'Testing AI visibility with a small credit pool', ['300 credits', '5 AI platforms', 'Unlimited members'], {freePlan: true, sourceUrl: 'https://athenahq.ai/plans'}),
      plan('Starter', '$295/mo', 295, 'flat-subscription', 'Self-guided SMBs running ongoing GEO', ['3,600 credits', 'Visibility across 9 models', 'Exports, integrations, and actions'], {popular: true, sourceUrl: 'https://athenahq.ai/plans'}),
      plan('Enterprise', 'Custom', null, 'custom-enterprise', 'Enterprises and agencies', ['Custom credits', 'SSO and audit logs', 'Multi-region reporting and enablement'], {sourceUrl: 'https://athenahq.ai/plans'}),
    ],
  },
  'ziptie-dev': {
    group: 'visibility',
    tagline: 'Track AI Overview, ChatGPT, and Perplexity visibility with practical content actions.',
    ...video('20cgRhmvuos', 'How to optimize content for AI using ZipTie.dev', 'Ziptie'),
    plans: [
      plan('Trial', 'Free for 14 days', 0, 'freemium', 'Evaluating the workflow', ['75 AI search checks', '3 AI success summaries', '5 content optimizations'], {freeTrial: true, sourceUrl: 'https://ziptie.dev/pricing/'}),
      plan('Basic', '$69/mo', 69, 'flat-subscription', 'Small teams monitoring a focused set', ['500 checks', '5 summaries', '10 content optimizations'], {sourceUrl: 'https://ziptie.dev/pricing/'}),
      plan('Standard', '$99/mo', 99, 'flat-subscription', 'Ongoing brand and content monitoring', ['1,000 checks', '50 summaries', '100 content optimizations'], {popular: true, sourceUrl: 'https://ziptie.dev/pricing/'}),
      plan('Pro', '$159/mo', 159, 'flat-subscription', 'Higher-volume GEO programs', ['2,000 checks', '100 summaries', '200 content optimizations'], {sourceUrl: 'https://ziptie.dev/pricing/'}),
    ],
  },
  llmrefs: {
    group: 'visibility',
    tagline: 'Track keyword visibility, citations, and fan-out queries across AI search.',
    ...video('j7rYK6ivMI0', 'LLMrefs – AI SEO Keyword Rank Tracker for LLM Search Engines', 'LLMrefs AI SEO'),
    plans: [
      plan('Free account', 'Free', 0, 'freemium', 'Trying the interface and free tools', ['Create an account without a card', 'Initial brand setup', 'Free AI SEO utilities'], {freePlan: true, sourceUrl: 'https://llmrefs.com/#pricing'}),
      plan('All in One', '$79/mo', 79, 'flat-subscription', 'Marketing and SEO teams', ['Track 500 prompts', 'All supported AI engines', 'CSV export and API access'], {popular: true, freeTrial: true, sourceUrl: 'https://llmrefs.com/#pricing'}),
    ],
  },
  'ahrefs-brand-radar': {
    group: 'visibility',
    tagline: 'Search a large answer database to benchmark brand visibility across AI platforms.',
    ...video('U9-zRV8az4A', 'Ahrefs Brand Radar: See ANY brand’s AI visibility', 'Ahrefs Tutorials'),
    plans: [
      plan('Select platforms', 'From £318/mo', 318, 'flat-subscription', 'Teams monitoring selected platforms', ['Brand mentions', 'Citation and topic analysis', 'Platform selection'], {sourceUrl: 'https://ahrefs.com/brand-radar'}),
      plan('All platforms', 'From £560/mo', 560, 'flat-subscription', 'Broad cross-platform intelligence', ['All available platforms', 'Large search-backed database', 'Competitive benchmarking'], {popular: true, sourceUrl: 'https://ahrefs.com/brand-radar'}),
    ],
  },
  'semrush-ai-toolkit': {
    group: 'visibility',
    tagline: 'Add AI visibility, perception, and citation analysis to the Semrush workflow.',
    ...video('nYykbUPQ9eo', 'What is Semrush? Digital Marketing Tool Explained', 'Semrush'),
    plans: [
      plan('Free', 'Free', 0, 'freemium', 'A basic AI visibility snapshot', ['Basic mentions and citations', 'AI visibility score', 'Limited AI audit'], {freePlan: true, sourceUrl: 'https://www.semrush.com/pricing/'}),
      plan('AI Visibility', 'From $99/mo', 99, 'flat-subscription', 'Dedicated AI-search monitoring', ['AI brand visibility', 'Citation and perception analysis', 'Competitor monitoring'], {popular: true, sourceUrl: 'https://www.semrush.com/pricing/'}),
      plan('Semrush One', 'From $199/mo', 199, 'flat-subscription', 'Combined SEO and AI-search teams', ['SEO Toolkit', 'AI Visibility Toolkit', 'Unified reporting'], {sourceUrl: 'https://www.semrush.com/pricing/'}),
    ],
  },
  'geo-toolbox-llms-txt-checker': {group: 'llmstxt', tagline: 'Check whether a domain publishes a reachable llms.txt file.', plans: [plan('Free checker', 'Free', 0, 'free', 'One-off llms.txt checks', ['No signup', 'Availability check', 'Immediate result'], {freePlan: true, sourceUrl: 'https://geotoolbox.ai/tools/llms-txt-checker'})]},
  'clunky-ai-llms-txt-generator': {group: 'llmstxt', tagline: 'Generate an llms.txt file from the pages that matter on your site.', plans: [plan('Free generator', 'Free', 0, 'free', 'Creating a basic llms.txt file', ['Browser-based generator', 'Copy-ready output', 'No platform subscription required'], {freePlan: true, sourceUrl: 'https://clunky.ai/llms-txt-generator'})]},
  'google-search-console': {
    group: 'searchConsole',
    tagline: 'Google’s first-party view of search performance, crawling, and indexing.',
    ...video('ONr5Z7VhNFI', 'Intro to Google Search Console – Search Console Training', 'Google Search Central'),
    plans: [plan('Free', 'Free', 0, 'free', 'Every verified website owner', ['Performance reports', 'Indexing and URL inspection', 'Sitemaps, alerts, and API'], {freePlan: true, sourceUrl: 'https://search.google.com/search-console/about'})],
  },
  'bing-webmaster-tools': {
    group: 'searchConsole',
    tagline: 'Microsoft’s first-party search diagnostics, indexing, and AI performance reporting.',
    ...video('CFxTu9PC2h0', 'Bing Webmaster Tools Overview', 'Rise Marketing Group', false),
    plans: [plan('Free', 'Free', 0, 'free', 'Sites targeting Bing and Copilot discovery', ['Search performance', 'URL inspection and IndexNow', 'Site scans and AI performance'], {freePlan: true, sourceUrl: 'https://www.bing.com/webmasters/about'})],
  },
  seotesting: {
    group: 'searchConsole',
    tagline: 'Run controlled SEO tests and annotations on Google Search Console data.',
    ...video('P33d4fRS00U', 'What you need to know about SEOTesting', 'SEOTesting'),
    plans: [
      plan('Single Site', '$50/mo', 50, 'flat-subscription', 'One-site SEO testing', ['1 site', 'Unlimited users', '14-day trial'], {freeTrial: true, sourceUrl: 'https://seotesting.com/home/pricing/'}),
      plan('Medium', '$125/mo', 125, 'flat-subscription', 'In-house teams with several sites', ['5 sites', 'Unlimited users', 'Higher testing capacity'], {popular: true, freeTrial: true, sourceUrl: 'https://seotesting.com/home/pricing/'}),
      plan('Large', '$375/mo', 375, 'flat-subscription', 'Agencies and larger portfolios', ['20 sites', 'Unlimited users', 'Expanded URL-inspection credits'], {freeTrial: true, sourceUrl: 'https://seotesting.com/home/pricing/'}),
      plan('Enterprise', 'Custom', null, 'custom-enterprise', 'Custom site volume and service', ['Custom limits', 'Enterprise onboarding', 'Commercial support'], {sourceUrl: 'https://seotesting.com/home/pricing/'}),
    ],
  },
  dataforseo: {
    group: 'data',
    tagline: 'Build products and automated workflows on pay-as-you-go SEO data APIs.',
    ...video('X2J0OIhtTzs', 'DataForSEO Explained', 'DataForSEO – Powerful SEO API Stack'),
    plans: [
      plan('Sandbox', 'Free', 0, 'freemium', 'Development and request testing', ['Free sandbox', 'Sample responses', 'API documentation and libraries'], {freePlan: true, sourceUrl: 'https://dataforseo.com/pricing'}),
      plan('Pay as you go', 'From $0.0006 per SERP', 0.0006, 'usage-based', 'Production workloads with variable volume', ['No monthly commitment', 'SERP, keyword, backlink, and on-page APIs', 'Usage-based billing'], {popular: true, sourceUrl: 'https://dataforseo.com/pricing'}),
      plan('Enterprise', 'Custom volume terms', null, 'custom-enterprise', 'Large predictable workloads', ['Volume pricing', 'Account support', 'Custom commercial terms'], {sourceUrl: 'https://dataforseo.com/pricing'}),
    ],
  },
  'seo-powersuite-rank-tracker': {
    group: 'rank',
    tagline: 'Desktop rank tracking with deep keyword research and flexible search-engine coverage.',
    ...video('bFi7ScOo7Mg', 'Rank Tracker features and settings', 'SEO PowerSuite'),
    plans: [
      plan('Free', 'Free', 0, 'freemium', 'Occasional desktop rank checks', ['Unlimited sites', 'Basic rank tracking', 'Local desktop storage'], {freePlan: true, sourceUrl: 'https://www.link-assistant.com/rank-tracker/pricing.html'}),
      plan('Professional', 'See official annual price', null, 'flat-subscription', 'In-house SEO workflows', ['Save projects', 'Scheduled tasks', 'Expanded research and exports'], {popular: true, sourceUrl: 'https://www.link-assistant.com/rank-tracker/pricing.html'}),
      plan('Enterprise', 'See official annual price', null, 'flat-subscription', 'Agencies producing client reports', ['White-label reports', 'Data export', 'Higher automation coverage'], {sourceUrl: 'https://www.link-assistant.com/rank-tracker/pricing.html'}),
    ],
  },
  accuranker: {
    group: 'rank',
    tagline: 'Fast, high-precision rank tracking for teams that need dependable daily data.',
    ...video('E6dYPZlir_U', 'How to get started with AccuRanker', 'AccuRanker'),
    plans: [
      plan('Professional', 'From $224/mo', 224, 'flat-subscription', 'Teams tracking 2,000+ keywords', ['2,000-keyword floor', 'Daily and on-demand updates', 'Unlimited users and domains'], {popular: true, sourceUrl: 'https://www.accuranker.com/pricing/'}),
      plan('Expert', 'From $764/mo', 764, 'flat-subscription', 'Agencies and high-volume teams', ['Higher keyword capacity', 'Advanced reporting', 'Priority scale'], {sourceUrl: 'https://www.accuranker.com/pricing/'}),
      plan('Enterprise', 'Custom', null, 'custom-enterprise', 'More than 25,000 keywords', ['Custom keyword volume', 'Enterprise service', 'Commercial terms'], {sourceUrl: 'https://www.accuranker.com/pricing/'}),
    ],
  },
  'se-ranking': {
    group: 'rank',
    tagline: 'Accessible rank tracking inside a broader SEO and AI-visibility platform.',
    ...video('2VrpHhnUvro', 'Overview of SE Ranking Tools, Features & Navigation', 'SE Ranking'),
    plans: [
      plan('Essential', 'See official pricing', null, 'flat-subscription', 'Freelancers and small teams', ['Rank tracking', 'Website audit', 'Competitive research'], {freeTrial: true, sourceUrl: 'https://seranking.com/subscription.html'}),
      plan('Pro', 'See official pricing', null, 'flat-subscription', 'Growing in-house teams and agencies', ['Higher limits', 'Expanded reporting', 'Team workflows'], {popular: true, freeTrial: true, sourceUrl: 'https://seranking.com/subscription.html'}),
      plan('Business', 'See official pricing', null, 'flat-subscription', 'High-volume agencies and brands', ['Large project limits', 'API access', 'Priority support'], {freeTrial: true, sourceUrl: 'https://seranking.com/subscription.html'}),
    ],
  },
  ahrefs: {
    group: 'suite',
    tagline: 'Deep backlink, competitive, keyword, content, and AI-search intelligence.',
    ...video('krzF3YhmSMw', 'What is Ahrefs?', 'Ahrefs'),
    plans: [
      plan('Ahrefs Free', 'Free', 0, 'freemium', 'Site owners using free webmaster tools', ['Site Explorer for verified sites', 'Site Audit', 'Limited free tools'], {freePlan: true, sourceUrl: 'https://ahrefs.com/pricing'}),
      plan('Starter', '£23/mo', 23, 'flat-subscription', 'Light personal research', ['Limited Site Explorer', 'Keywords Explorer', 'Site Audit access'], {sourceUrl: 'https://ahrefs.com/pricing'}),
      plan('Lite', '£99/mo', 99, 'flat-subscription', 'Small SEO teams', ['Core SEO tools', '6 months history', '5 projects'], {popular: true, sourceUrl: 'https://ahrefs.com/pricing'}),
      plan('Standard', '£199/mo', 199, 'flat-subscription', 'Full-time SEO practitioners', ['Expanded history and limits', 'Competitive and content research', 'Batch analysis'], {sourceUrl: 'https://ahrefs.com/pricing'}),
      plan('Advanced', '£359/mo', 359, 'flat-subscription', 'Larger teams and agencies', ['Higher limits', 'Looker Studio integration', 'More projects and history'], {sourceUrl: 'https://ahrefs.com/pricing'}),
      plan('Enterprise', 'From £1,199/mo', 1199, 'custom-enterprise', 'Enterprise governance and scale', ['SSO and audit log', 'API and custom limits', 'Enterprise support'], {sourceUrl: 'https://ahrefs.com/pricing'}),
    ],
  },
  semrush: {
    group: 'suite',
    tagline: 'A broad digital-marketing suite spanning SEO, content, competitive, and AI visibility.',
    ...video('nYykbUPQ9eo', 'What is Semrush? Digital Marketing Tool Explained', 'Semrush'),
    plans: [
      plan('Free', 'Free', 0, 'freemium', 'Limited research and site checks', ['Limited daily requests', 'One project', 'Basic AI visibility'], {freePlan: true, sourceUrl: 'https://www.semrush.com/pricing/'}),
      plan('Pro', '$139/mo', 139, 'flat-subscription', 'Freelancers and small teams', ['5 projects', 'Keyword and competitor research', 'Site audit and rank tracking'], {sourceUrl: 'https://www.semrush.com/pricing/'}),
      plan('Guru', '$249/mo', 249, 'flat-subscription', 'Agencies and mid-size teams', ['15 projects', 'Content marketing tools', 'Historical data'], {popular: true, sourceUrl: 'https://www.semrush.com/pricing/'}),
      plan('Business', '$499/mo', 499, 'flat-subscription', 'Large agencies and enterprises', ['40 projects', 'API access', 'Higher limits and share of voice'], {sourceUrl: 'https://www.semrush.com/pricing/'}),
    ],
  },
  mangools: {
    group: 'suite',
    tagline: 'A simpler SEO toolkit for keyword research, SERP analysis, links, and rank tracking.',
    ...video('SIlKGE3hyA8', 'Mangools SEO overview', 'Mangools'),
    plans: [
      plan('Basic', 'See official pricing', null, 'flat-subscription', 'Solopreneurs and freelance SEOs', ['Keyword research', 'SERP analysis', 'Rank tracking and backlinks'], {sourceUrl: 'https://mangools.com/plans-and-pricing'}),
      plan('Premium', 'See official pricing', null, 'flat-subscription', 'Marketing teams and specialists', ['Higher research limits', 'Additional seats available', 'Full Mangools toolkit'], {popular: true, sourceUrl: 'https://mangools.com/plans-and-pricing'}),
      plan('Agency', 'See official pricing', null, 'flat-subscription', 'Professional SEOs and agencies', ['Highest limits', 'Daily rank updates', 'Agency-scale usage'], {sourceUrl: 'https://mangools.com/plans-and-pricing'}),
    ],
  },
  'moz-pro': {
    group: 'suite',
    tagline: 'Approachable SEO research, site auditing, rank tracking, and link intelligence.',
    ...video('XzkykMGpYng', 'Quick Introduction to Moz Pro', 'Moz'),
    plans: [
      plan('Starter', 'From $49/mo', 49, 'flat-subscription', 'A single site and lightweight research', ['Keyword research', 'Site tracking', 'Core link metrics'], {freeTrial: true, sourceUrl: 'https://moz.com/products/pro/pricing'}),
      plan('Standard', 'From $99/mo', 99, 'flat-subscription', 'SEO beginners and small teams', ['Campaigns and rank tracking', 'Site crawl', 'Keyword and link research'], {freeTrial: true, sourceUrl: 'https://moz.com/products/pro/pricing'}),
      plan('Medium', 'From $179/mo', 179, 'flat-subscription', 'Growing teams', ['Higher limits', 'Branded reports', 'Expanded campaigns'], {popular: true, freeTrial: true, sourceUrl: 'https://moz.com/products/pro/pricing'}),
      plan('Large', 'From $299/mo', 299, 'flat-subscription', 'Agencies and larger portfolios', ['Highest standard limits', 'More campaigns and seats', 'Expanded reporting'], {freeTrial: true, sourceUrl: 'https://moz.com/products/pro/pricing'}),
    ],
  },
  'screaming-frog': {
    group: 'crawler',
    tagline: 'Crawl websites at page level to diagnose technical SEO problems.',
    ...video('Rm_hziAo14A', 'Screaming Frog SEO Spider', 'Screaming Frog'),
    plans: [
      plan('Free', 'Free', 0, 'freemium', 'Small sites and one-off checks', ['Crawl up to 500 URLs', 'Core link and metadata checks', 'XML sitemap generation'], {freePlan: true, sourceUrl: 'https://www.screamingfrog.co.uk/seo-spider/pricing/'}),
      plan('Paid licence', '£199/year per user', 199, 'flat-subscription', 'Professional technical SEO work', ['Unlimited crawl size subject to resources', 'JavaScript rendering and scheduling', 'Save crawls, custom extraction, and integrations'], {popular: true, sourceUrl: 'https://www.screamingfrog.co.uk/seo-spider/pricing/'}),
    ],
  },
  'surfer-seo': {
    group: 'content',
    tagline: 'Plan, optimize, and monitor content for Google and AI search.',
    ...video('IaC9ebHakcw', 'Surfer SEO Explained', 'Marketing Island', false),
    plans: [
      plan('Discovery', '$49/mo, billed yearly', 49, 'flat-subscription', 'Solo content creators', ['120 documents/year', 'Track 10 pages', 'AI SEO guidance'], {freeTrial: true, sourceUrl: 'https://surferseo.com/pricing/'}),
      plan('Standard', '$99/mo, billed yearly', 99, 'flat-subscription', 'Small teams and consistent publishing', ['360 documents/year', '25 AI prompts weekly', '1 brand workspace'], {freeTrial: true, sourceUrl: 'https://surferseo.com/pricing/'}),
      plan('Pro', '$182/mo, billed yearly', 182, 'flat-subscription', 'Agencies and multi-brand teams', ['50 AI prompts daily', '5 brand workspaces', 'Internal linking and content gaps'], {popular: true, freeTrial: true, sourceUrl: 'https://surferseo.com/pricing/'}),
      plan('Peace of Mind', '$299/mo, billed yearly', 299, 'flat-subscription', 'High-volume teams', ['Unlimited document optimization', '100 AI prompts daily', 'API and dedicated success support'], {sourceUrl: 'https://surferseo.com/pricing/'}),
      plan('Enterprise', 'From $999/mo', 999, 'custom-enterprise', 'Custom scale and security', ['Custom limits', 'SSO and legal onboarding', 'White-label and priority support'], {sourceUrl: 'https://surferseo.com/pricing/'}),
    ],
  },
  clearscope: {
    group: 'content',
    tagline: 'Optimize content and monitor discoverability across search and AI answers.',
    ...video('bIaGczn_w-Y', 'Introducing Clearscope 2.0', 'Clearscope'),
    plans: [
      plan('Essentials', '$129/mo', 129, 'flat-subscription', 'Teams starting content and prompt optimization', ['50 tracked prompts', '50 pages', '20 topic explorations and drafts/month'], {freeTrial: true, sourceUrl: 'https://www.clearscope.io/pricing'}),
      plan('Business', '$399/mo', 399, 'flat-subscription', 'Productive content teams', ['300 tracked prompts', '300 pages', 'Dedicated account manager'], {popular: true, freeTrial: true, sourceUrl: 'https://www.clearscope.io/pricing'}),
      plan('Enterprise', 'Custom', null, 'custom-enterprise', 'Content operations at scale', ['Custom credits', 'SSO and crawler whitelisting', 'Custom agreements'], {freeTrial: true, sourceUrl: 'https://www.clearscope.io/pricing'}),
    ],
  },
  frase: {
    group: 'content',
    tagline: 'Research, draft, optimize, publish, and refresh content for SEO and GEO.',
    ...video('pnhPovCtEGU', 'Introducing Frase: the Content Intelligence Platform for AI Search', 'Frase'),
    plans: [
      plan('Starter', '$49/mo or $39/mo yearly', 39, 'flat-subscription', 'Solos and single-site teams', ['10 articles and 50 audit pages/month', '1 seat and 1 site', 'SEO, GEO, and AI visibility'], {freeTrial: true, sourceUrl: 'https://www.frase.io/pricing'}),
      plan('Professional', '$129/mo or $103/mo yearly', 103, 'flat-subscription', 'In-house content teams', ['40 articles and 250 audit pages/month', '3 seats and 5 sites', 'Content calendar and crawler monitoring'], {popular: true, freeTrial: true, sourceUrl: 'https://www.frase.io/pricing'}),
      plan('Scale', '$299/mo or $239/mo yearly', 239, 'flat-subscription', 'Agencies and multi-site brands', ['100 articles and 1,000 audit pages/month', '5 seats and 10 domains', 'Client reports and broader AI coverage'], {freeTrial: true, sourceUrl: 'https://www.frase.io/pricing'}),
      plan('Enterprise', 'Custom', null, 'custom-enterprise', 'White-label and governed deployments', ['SSO and SAML', 'White-label portal', 'Custom limits and SLA'], {sourceUrl: 'https://www.frase.io/pricing'}),
    ],
  },
  marketmuse: {
    group: 'content',
    tagline: 'Use personalized topic models to prioritize and plan authoritative content.',
    ...video('VzI_x9xMYRE', 'MarketMuse Overview', 'MarketMuse'),
    plans: [
      plan('Free', 'Free', 0, 'freemium', 'Individuals with low content volume', ['1 user', '10 queries/month', 'Limited applications'], {freePlan: true, sourceUrl: 'https://www.marketmuse.com/pricing/'}),
      plan('Optimize', 'Contact sales', null, 'custom-enterprise', 'Individuals publishing regularly', ['100 tracked topics', '5 content briefs/month', '1 strategy document/month'], {sourceUrl: 'https://www.marketmuse.com/pricing/'}),
      plan('Research', 'Contact sales', null, 'custom-enterprise', 'Content teams increasing output', ['1,000 tracked topics', '10 content briefs/month', '3 users and unlimited queries'], {popular: true, sourceUrl: 'https://www.marketmuse.com/pricing/'}),
      plan('Strategy', 'Contact sales', null, 'custom-enterprise', 'Large teams and agencies', ['10,000 tracked topics', '20 content briefs/month', '5 users and all brief types'], {sourceUrl: 'https://www.marketmuse.com/pricing/'}),
    ],
  },
  neuronwriter: {
    group: 'content',
    tagline: 'Optimize and generate content with semantic analysis plus lightweight AI visibility.',
    ...video('O1oEa4tFujY', 'NeuronWriter: SEO Content Optimization Overview', 'NeuronWriter'),
    plans: [
      plan('Bronze', '$23/mo', 23, 'flat-subscription', 'Business owners', ['2 projects', '25 content analyses', '5 AI-monitored questions'], {freeTrial: true, sourceUrl: 'https://neuronwriter.com/pricing-neuron/'}),
      plan('Silver', '$45/mo', 45, 'flat-subscription', 'Freelance copywriters', ['5 projects', '50 analyses', '30,000 AI credits'], {freeTrial: true, sourceUrl: 'https://neuronwriter.com/pricing-neuron/'}),
      plan('Gold', '$69/mo', 69, 'flat-subscription', 'Small content teams and agencies', ['10 projects', '75 analyses', 'Integrations, API, and team sharing'], {popular: true, freeTrial: true, sourceUrl: 'https://neuronwriter.com/pricing-neuron/'}),
      plan('Platinum', '$93/mo', 93, 'flat-subscription', 'Larger multi-domain teams', ['25 projects', '100 analyses', '60,000 AI credits'], {freeTrial: true, sourceUrl: 'https://neuronwriter.com/pricing-neuron/'}),
      plan('Diamond', '$117/mo', 117, 'flat-subscription', 'Agencies with many projects', ['50 projects', '150 analyses', '75,000 AI credits'], {freeTrial: true, sourceUrl: 'https://neuronwriter.com/pricing-neuron/'}),
    ],
  },
  'gscpilot-schema-generator': {group: 'schema', tagline: 'Generate common JSON-LD schema types in a guided browser workflow.', plans: [plan('Free generator', 'Free', 0, 'free', 'One-off schema creation', ['Guided fields', 'JSON-LD output', 'Copy-ready markup'], {freePlan: true, sourceUrl: 'https://gscpilot.com/tools/schema-generator'})]},
  'seomator-schema-generator': {group: 'schema', tagline: 'Create copy-ready schema markup without hand-writing JSON-LD.', plans: [plan('Free generator', 'Free', 0, 'free', 'Marketers and SEOs creating standard markup', ['Multiple schema types', 'Browser-based generation', 'Copy-ready JSON-LD'], {freePlan: true, sourceUrl: 'https://seomator.com/schema-markup-generator'})]},
  'phrasera-readability-checker': {group: 'readability', tagline: 'Check reading level and sentence complexity before publishing.', plans: [plan('Free checker', 'Free', 0, 'free', 'Instant readability checks', ['Readability score', 'Grade-level estimate', 'Text statistics'], {freePlan: true, sourceUrl: 'https://phrasera.com/readability-checker'})]},
}

function keyed(items, type, prefix) {
  return items.map((item, i) => ({_key: `${prefix}-${i}`, _type: type, ...item}))
}

function editorialOverview(doc, profile, facts) {
  const caps = profile.capabilities.slice(0, 3).map(([name]) => name.toLowerCase())
  return `${doc.name} is a ${profile.noun} built to ${profile.outcome}. ${doc.oneLineDescription} In practical use, the product brings together ${caps[0]}, ${caps[1]}, and ${caps[2]} so a team can move from raw signals to a clearer decision without stitching together an ad hoc spreadsheet workflow. It is most useful when the team defines the audience, market, and reporting question before collecting data. MaximusLabs evaluates the product on the job it is designed to do—not on the number of features in its menu—and checks pricing against the official source linked below.`
}

export function applyToolEnrichment(toolDocs) {
  for (const doc of toolDocs) {
    const slug = doc.slug?.current
    const facts = FACTS[slug]
    if (!facts) throw new Error(`Missing enrichment record for ${doc.name} (${slug})`)
    const profile = GROUPS[facts.group]
    if (!profile) throw new Error(`Unknown enrichment group "${facts.group}" for ${doc.name}`)

    doc.tagline = facts.tagline
    doc.overview = facts.overview || editorialOverview(doc, profile, facts)
    doc.idealCustomer = facts.idealCustomer || profile.ideal
    doc.setupSummary = facts.setupSummary || profile.setup
    doc.easeOfUse = facts.easeOfUse ?? (facts.group === 'data' || facts.group === 'crawler' ? 58 : facts.group === 'schema' || facts.group === 'readability' || facts.group === 'llmstxt' ? 92 : 76)
    for (const field of ['videoUrl', 'videoTitle', 'videoPublisher', 'videoOfficial', 'videoSourceUrl']) {
      if (facts[field] !== undefined) doc[field] = facts[field]
    }

    doc.capabilities = profile.capabilities.map(([name, description], i) => ({
      _key: `cap-${i}`,
      _type: 'capability',
      name,
      description,
      featureStatus: 'verified',
    }))
    doc.strengths = facts.strengths || profile.strengths
    doc.limitations = facts.limitations || profile.limitations
    doc.pricingPlans = keyed(facts.plans, 'pricingPlan', 'plan')

    const hasFree = doc.pricingPlans.some((p) => p.freePlan)
    const firstPaid = doc.pricingPlans.find((p) => !p.freePlan && p.priceDisplay)
    const faq = [
      {question: `What is ${doc.name}?`, answer: doc.overview},
      {question: `Who is ${doc.name} best for?`, answer: doc.idealCustomer},
      {question: `Does ${doc.name} have a free plan?`, answer: hasFree ? `${doc.name} has a permanent free plan or free utility tier. Review the limits in the pricing cards above.` : `${doc.name} does not currently advertise a permanent free plan. ${doc.pricingPlans.some((p) => p.freeTrial) ? 'A time-limited trial is available.' : 'Use the official pricing link to confirm any evaluation access.'}`},
      {question: `How much does ${doc.name} cost?`, answer: firstPaid ? `The first paid option shown in the official inventory is ${firstPaid.planName} at ${firstPaid.priceDisplay}. Pricing was checked on ${CHECKED}; confirm the live page before purchase.` : `The product is free or uses custom pricing. Confirm current terms on the official page.`},
      {question: `How do you set up ${doc.name}?`, answer: doc.setupSummary},
      {question: `What should I check before choosing ${doc.name}?`, answer: `Validate engine, region, project, user, and usage limits against your real workflow. The main trade-offs are: ${doc.limitations.join('; ')}.`},
    ]
    doc.faq = keyed(faq, 'faqItem', 'faq')
    doc.lastVerifiedAt = `${CHECKED}T00:00:00.000Z`
  }

  // Give every profile a useful alternative set with an explicit choose-if reason.
  const bySlug = new Map(toolDocs.map((d) => [d.slug.current, d]))
  const pools = {
    visibility: Object.keys(FACTS).filter((s) => FACTS[s].group === 'visibility'),
    rank: Object.keys(FACTS).filter((s) => FACTS[s].group === 'rank'),
    suite: Object.keys(FACTS).filter((s) => FACTS[s].group === 'suite'),
    content: Object.keys(FACTS).filter((s) => FACTS[s].group === 'content'),
    searchConsole: ['google-search-console', 'bing-webmaster-tools', 'seotesting', 'dataforseo'],
    llmstxt: ['geo-toolbox-llms-txt-checker', 'clunky-ai-llms-txt-generator', 'gscpilot-schema-generator', 'seomator-schema-generator'],
    schema: ['gscpilot-schema-generator', 'seomator-schema-generator', 'geo-toolbox-llms-txt-checker', 'clunky-ai-llms-txt-generator'],
    readability: ['phrasera-readability-checker', 'frase', 'clearscope', 'neuronwriter'],
    crawler: ['screaming-frog', 'dataforseo', 'ahrefs', 'semrush'],
    data: ['dataforseo', 'google-search-console', 'bing-webmaster-tools', 'screaming-frog'],
  }
  for (const doc of toolDocs) {
    const slug = doc.slug.current
    const pool = pools[FACTS[slug].group] || []
    const existing = (doc.alternatives || []).map((a) => a.tool?._ref?.replace(/^tool-/, '')).filter(Boolean)
    const candidates = [...new Set([...existing, ...pool])].filter((s) => s !== slug && bySlug.has(s)).slice(0, 4)
    doc.alternatives = candidates.map((s, i) => {
      const alt = bySlug.get(s)
      const cheaper = (alt.pricingPlans?.some((p) => p.freePlan) && !doc.pricingPlans.some((p) => p.freePlan))
      return {
        _key: `alt-${i}`,
        _type: 'alternativeRef',
        tool: {_type: 'reference', _ref: `tool-${s}`},
        relationshipType: cheaper ? 'cheaper' : 'direct',
        reason: cheaper
          ? `Choose ${alt.name} if a permanent free starting point matters more than matching every ${doc.name} workflow.`
          : `Choose ${alt.name} if its limits, workflow, or specialist focus fit your team better than ${doc.name}.`,
      }
    })
  }
}

