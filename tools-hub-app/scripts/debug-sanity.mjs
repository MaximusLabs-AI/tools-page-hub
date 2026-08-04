const pid = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const ds = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const v = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-08-01'

const CAT = `{"id":_id,"code":categoryCode,"name":name,"slug":slug.current,"level":level,"parentCode":parent->categoryCode,"definition":definition,"indexable":indexable,"minimumProductCount":minimumProductCount,"updateFrequency":updateFrequency,"order":order}`
const TOOL = `{"id":_id,"name":name,"slug":slug.current,"officialUrl":officialUrl,"oneLineDescription":oneLineDescription,"productType":productType,"status":status,"logoUrl":logo.asset->url,"primaryCategory":primaryCategory->${CAT},"secondaryCategories":secondaryCategories[]->${CAT},"quickVerdict":quickVerdict,"pricingPlans":pricingPlans,"capabilities":capabilities,"alternatives":alternatives[]{"toolSlug":tool->slug.current,"toolName":tool->name,"relationshipType":relationshipType,"reason":reason},"strengths":strengths,"limitations":limitations,"aiConfidence":aiConfidence,"faq":faq,"lastVerifiedAt":lastVerifiedAt}`
const Q = {
  categories: `*[_type=="category"]|order(level asc, order asc)${CAT}`,
  tools: `*[_type=="tool" && publicationStatus in ["approved","published"]]|order(name asc)${TOOL}`,
}

async function run(name, groq, useGet) {
  const host = 'apicdn.sanity.io'
  let res
  if (useGet) {
    const url = new URL(`https://${pid}.${host}/v${v}/data/query/${ds}`)
    url.searchParams.set('query', groq)
    res = await fetch(url.toString(), {headers: {}})
  } else {
    res = await fetch(`https://${pid}.${host}/v${v}/data/query/${ds}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query: groq}),
    })
  }
  const j = await res.json().catch(() => ({}))
  const n = Array.isArray(j.result) ? j.result.length : 'n/a'
  console.log(`${name} [${useGet ? 'GET' : 'POST'}] status=${res.status} count=${n}` + (j.error ? ` ERROR=${JSON.stringify(j.error).slice(0, 200)}` : ''))
  console.log(`  GET url length would be ~${encodeURIComponent(groq).length + 60} chars`)
}

await run('categories', Q.categories, true)
await run('tools', Q.tools, true)
await run('tools', Q.tools, false)
