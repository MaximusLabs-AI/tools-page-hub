import {defineType, defineField} from 'sanity'

/**
 * Source — a citable evidence source, tiered per Phase 4B's source hierarchy.
 * Reused across evidence claims, pricing plans, and capabilities so one URL is
 * entered once and referenced everywhere.
 */
export default defineType({
  name: 'source',
  title: 'Source',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'url', title: 'URL', type: 'url', validation: (r) => r.required()}),
    defineField({
      name: 'sourceTier',
      title: 'Source tier',
      type: 'string',
      options: {
        list: [
          {title: 'Tier 1 — Official', value: 'official'},
          {title: 'Tier 2 — Official secondary', value: 'official-secondary'},
          {title: 'Tier 3 — Independent review', value: 'independent-review'},
          {title: 'Tier 4 — Aggregator (G2/Capterra)', value: 'aggregator'},
          {title: 'Tier 5 — Practitioner discussion', value: 'practitioner'},
          {title: 'Tier 6 — Single unverified mention', value: 'single-mention'},
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({name: 'publishDate', title: 'Publish date', type: 'date'}),
    defineField({name: 'retrievedAt', title: 'Retrieved at', type: 'datetime'}),
  ],
  preview: {select: {title: 'title', subtitle: 'url'}},
})
