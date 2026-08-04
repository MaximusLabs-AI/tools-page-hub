import {defineType, defineField} from 'sanity'

/**
 * Category — the frozen Phase 4A taxonomy node (L1 to L4).
 * Codes + slugs come verbatim from phase4a_frozen_taxonomy.csv
 * (e.g. L3-AIVIS-NATIVE, ai-search/visibility-tracking/native).
 * A tool has exactly one primary category (enforced app-side) + N secondary.
 */
export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({name: 'categoryCode', title: 'Category code', type: 'string', description: 'Frozen code, e.g. "L3-AIVIS-NATIVE".', validation: (r) => r.required()}),
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug (full path)',
      type: 'slug',
      description: 'Full frozen path, e.g. "ai-search/visibility-tracking/native".',
      options: {source: 'name', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({name: 'level', title: 'Level', type: 'number', options: {list: [1, 2, 3, 4]}, validation: (r) => r.required().min(1).max(4)}),
    defineField({name: 'parent', title: 'Parent category', type: 'reference', to: [{type: 'category'}], description: 'Empty for L1.'}),
    defineField({name: 'definition', title: 'Definition', type: 'text', rows: 3, validation: (r) => r.required()}),
    defineField({name: 'inclusionCriteria', title: 'Inclusion criteria', type: 'text', rows: 2}),
    defineField({name: 'exclusionCriteria', title: 'Exclusion criteria', type: 'text', rows: 2}),
    defineField({name: 'buyerIntent', title: 'Buyer intent', type: 'string'}),
    defineField({name: 'frequentlyConfusedWith', title: 'Frequently confused with', type: 'array', of: [{type: 'reference', to: [{type: 'category'}]}]}),
    defineField({name: 'productType', title: 'Product-type constraint', type: 'string', options: {list: ['any', 'native', 'suite_module']}, initialValue: 'any', description: 'e.g. L3-AIVIS-SUITE only holds suite_module tools.'}),
    defineField({name: 'indexable', title: 'Indexable', type: 'boolean', initialValue: true}),
    defineField({name: 'minimumProductCount', title: 'Minimum product count', type: 'number', initialValue: 5}),
    defineField({name: 'updateFrequency', title: 'Update frequency', type: 'string', description: 'e.g. "monthly", "quarterly".'}),
    defineField({name: 'order', title: 'Order', type: 'number', initialValue: 0}),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        {name: 'metaTitle', type: 'string'},
        {name: 'metaDescription', type: 'text', rows: 2},
      ],
    }),
  ],
  orderings: [{title: 'Level then order', name: 'levelOrder', by: [{field: 'level', direction: 'asc'}, {field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', code: 'categoryCode', slug: 'slug.current'},
    prepare: ({title, code, slug}) => ({title: `${code} · ${title}`, subtitle: `/tools/${slug}`}),
  },
})
