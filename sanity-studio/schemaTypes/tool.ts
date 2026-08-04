import {defineType, defineField} from 'sanity'

/**
 * Tool — the core document. Renders the frozen Phase 4B 14-section tool profile
 * PLUS the net-new AI Answer Confidence module.
 * URL: /tools/<slug>  (Next.js dynamic route, ISR).
 * Enum values are the frozen Phase 4A controlled vocabulary — do not rename.
 */
export default defineType({
  name: 'tool',
  title: 'Tool',
  type: 'document',
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'classification', title: 'Classification'},
    {name: 'verdict', title: 'Verdict & fit'},
    {name: 'capabilities', title: 'Capabilities & pricing'},
    {name: 'relations', title: 'Alternatives & integrations'},
    {name: 'ai', title: 'AI Answer Confidence'},
    {name: 'evidence', title: 'Evidence & meta'},
  ],
  fields: [
    /* ---- Identity ---- */
    defineField({name: 'name', title: 'Name', type: 'string', group: 'identity', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', group: 'identity', options: {source: 'name', maxLength: 60}, validation: (r) => r.required()}),
    defineField({name: 'officialUrl', title: 'Official URL', type: 'url', group: 'identity', validation: (r) => r.required()}),
    defineField({name: 'vendor', title: 'Vendor', type: 'reference', to: [{type: 'vendor'}], group: 'identity'}),
    defineField({name: 'logo', title: 'Logo', type: 'image', group: 'identity', options: {hotspot: false}}),
    defineField({name: 'oneLineDescription', title: 'One-line description', type: 'text', rows: 2, group: 'identity', validation: (r) => r.required()}),
    defineField({name: 'tagline', title: 'Tagline (short)', type: 'string', group: 'identity', description: 'Short line under the tool name on the landing page. Falls back to the description.'}),
    defineField({name: 'overview', title: 'Editorial overview', type: 'text', rows: 6, group: 'identity', description: 'Rich, factual introduction used in the “What is” section.'}),
    defineField({name: 'videoUrl', title: 'Demo video (YouTube URL)', type: 'url', group: 'identity', description: 'Embedded as a demo in the "What is" section. Leave empty to show a link to the official site.'}),
    defineField({name: 'videoTitle', title: 'Video title', type: 'string', group: 'identity'}),
    defineField({name: 'videoPublisher', title: 'Video publisher', type: 'string', group: 'identity'}),
    defineField({name: 'videoSourceUrl', title: 'Video verification source', type: 'url', group: 'identity'}),
    defineField({name: 'videoOfficial', title: 'Published by vendor', type: 'boolean', group: 'identity', initialValue: false}),
    defineField({name: 'formerNames', title: 'Former names / aliases', type: 'array', of: [{type: 'string'}], group: 'identity', description: 'Search aliases so rebrands still resolve (e.g. "Leadfeeder" -> Dealfront).'}),

    /* ---- Classification ---- */
    defineField({name: 'productType', title: 'Product type', type: 'string', group: 'classification', options: {list: ['native', 'suite_module', 'feature_module']}, validation: (r) => r.required()}),
    defineField({name: 'status', title: 'Status', type: 'string', group: 'classification', options: {list: ['active', 'beta', 'discontinued', 'acquired', 'rebranded']}, initialValue: 'active', validation: (r) => r.required()}),
    defineField({name: 'supersededBy', title: 'Superseded by', type: 'reference', to: [{type: 'tool'}], group: 'classification', description: 'Set on rebrand/acquisition; old page stays live with a banner + 301.'}),
    defineField({name: 'primaryCategory', title: 'Primary category', type: 'reference', to: [{type: 'category'}], group: 'classification', validation: (r) => r.required(), description: 'Exactly ONE (frozen rule).'}),
    defineField({name: 'secondaryCategories', title: 'Secondary categories', type: 'array', of: [{type: 'reference', to: [{type: 'category'}]}], group: 'classification'}),
    defineField({name: 'deploymentModel', title: 'Deployment', type: 'string', group: 'classification', options: {list: ['cloud-only', 'self-hosted', 'hybrid']}}),
    defineField({name: 'openSourceStatus', title: 'Open-source status', type: 'string', group: 'classification', options: {list: ['closed-source', 'open-source', 'source-available']}}),
    defineField({name: 'selfHosting', title: 'Self-hosting', type: 'string', group: 'classification', options: {list: ['not-supported', 'supported', 'required']}}),
    defineField({name: 'apiAvailability', title: 'API', type: 'string', group: 'classification', options: {list: ['none', 'public-api', 'partner-api-only']}}),
    defineField({name: 'privacyPositioning', title: 'Privacy positioning', type: 'string', group: 'classification', options: {list: ['standard', 'privacy-first', 'gdpr-documented']}}),
    defineField({name: 'technicalComplexity', title: 'Technical complexity', type: 'string', group: 'classification', options: {list: ['no-code', 'some-code', 'developer-required']}}),
    defineField({name: 'aiCapability', title: 'AI capability', type: 'string', group: 'classification', options: {list: ['none', 'ai-assisted-feature', 'ai-native-core-function']}}),
    defineField({name: 'useCases', title: 'Use-case tags', type: 'array', of: [{type: 'string'}], group: 'classification'}),
    defineField({name: 'targetRoles', title: 'Target roles', type: 'array', of: [{type: 'string'}], group: 'classification'}),

    /* ---- Verdict & fit ---- */
    defineField({name: 'quickVerdict', title: 'Quick verdict', type: 'quickVerdict', group: 'verdict'}),
    defineField({name: 'bestFit', title: 'Best-fit classification', type: 'bestFit', group: 'verdict'}),
    defineField({name: 'strengths', title: 'Strengths', type: 'array', of: [{type: 'string'}], group: 'verdict'}),
    defineField({name: 'limitations', title: 'Limitations', type: 'array', of: [{type: 'string'}], group: 'verdict'}),
    defineField({name: 'idealCustomer', title: 'Ideal Customer Profile', type: 'text', rows: 3, group: 'verdict', description: 'Who the tool is best for. Shown in the ICP section; falls back to a derived sentence.'}),
    defineField({name: 'setupSummary', title: 'Setup and onboarding', type: 'text', rows: 3, group: 'verdict'}),
    defineField({name: 'easeOfUse', title: 'Ease of use (0-100)', type: 'number', group: 'verdict', validation: (r) => r.min(0).max(100), description: 'Drives the "Is it easy to use?" gauge (80+ = Easy, 65-79 = Moderate, below = Advanced).'}),

    /* ---- Capabilities & pricing ---- */
    defineField({name: 'capabilities', title: 'Capabilities', type: 'array', of: [{type: 'capability'}], group: 'capabilities'}),
    defineField({name: 'pricingPlans', title: 'Pricing plans', type: 'array', of: [{type: 'pricingPlan'}], group: 'capabilities'}),

    /* ---- Alternatives & integrations (4 distinct relationship types) ---- */
    defineField({name: 'alternatives', title: 'Alternatives', type: 'array', of: [{type: 'alternativeRef'}], group: 'relations', description: 'Direct / cheaper / open-source / complementary — never merged.'}),
    defineField({name: 'integrations', title: 'Integrations', type: 'array', of: [{type: 'integrationRef'}], group: 'relations'}),

    /* ---- AI Answer Confidence (signature module) ---- */
    defineField({name: 'aiConfidence', title: 'AI Answer Confidence', type: 'aiConfidence', group: 'ai'}),

    /* ---- FAQ ---- */
    defineField({name: 'faq', title: 'FAQ', type: 'array', of: [{type: 'faqItem'}], group: 'evidence'}),

    /* ---- Evidence & meta ---- */
    defineField({name: 'evidence', title: 'Evidence claims', type: 'array', of: [{type: 'evidenceClaim'}], group: 'evidence', description: '>=3 evidence-backed fields required to publish.'}),
    defineField({name: 'lastVerifiedAt', title: 'Last verified at', type: 'datetime', group: 'evidence'}),
    defineField({
      name: 'publicationStatus',
      title: 'Publication status',
      type: 'string',
      group: 'evidence',
      options: {list: ['draft', 'research', 'verification', 'review', 'approved', 'published', 'archived']},
      initialValue: 'draft',
      description: 'Only Editorial Lead moves to "published" (enforced in admin).',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'evidence',
      options: {collapsible: true, collapsed: true},
      fields: [
        {name: 'metaTitle', type: 'string'},
        {name: 'metaDescription', type: 'text', rows: 2},
      ],
    }),
  ],
  preview: {
    select: {title: 'name', fit: 'quickVerdict.fitLabel', status: 'publicationStatus', media: 'logo'},
    prepare: ({title, fit, status, media}) => ({title, subtitle: `${fit || 'no verdict'} · ${status}`, media}),
  },
})
