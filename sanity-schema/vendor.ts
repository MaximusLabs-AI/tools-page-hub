import {defineType, defineField} from 'sanity'

/** Vendor — parent company (many tools can share one, e.g. future HubSpot sub-products). */
export default defineType({
  name: 'vendor',
  title: 'Vendor',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'officialUrl', title: 'Official URL', type: 'url', validation: (r) => r.required()}),
    defineField({name: 'hqLocation', title: 'HQ location', type: 'string'}),
    defineField({name: 'foundedYear', title: 'Founded year', type: 'number'}),
  ],
  preview: {select: {title: 'name', subtitle: 'officialUrl'}},
})
