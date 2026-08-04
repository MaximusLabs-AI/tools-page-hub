// GROQ projections that shape Sanity documents into the exact domain-type field
// names the UI expects, so the Sanity repository needs almost no post-mapping.

export const CATEGORY_PROJECTION = /* groq */ `{
  "id": _id,
  "code": categoryCode,
  "name": name,
  "slug": slug.current,
  "level": level,
  "parentCode": parent->categoryCode,
  "definition": definition,
  "indexable": indexable,
  "minimumProductCount": minimumProductCount,
  "updateFrequency": updateFrequency,
  "order": order
}`

export const TOOL_PROJECTION = /* groq */ `{
  "id": _id,
  "name": name,
  "slug": slug.current,
  "officialUrl": officialUrl,
  "oneLineDescription": oneLineDescription,
  "tagline": tagline,
  "overview": overview,
  "videoUrl": videoUrl,
  "videoTitle": videoTitle,
  "videoPublisher": videoPublisher,
  "videoSourceUrl": videoSourceUrl,
  "videoOfficial": videoOfficial,
  "idealCustomer": idealCustomer,
  "setupSummary": setupSummary,
  "easeOfUse": easeOfUse,
  "productType": productType,
  "status": status,
  "logoUrl": logo.asset->url,
  "primaryCategory": primaryCategory->${CATEGORY_PROJECTION},
  "secondaryCategories": secondaryCategories[]->${CATEGORY_PROJECTION},
  "quickVerdict": quickVerdict,
  "pricingPlans": pricingPlans,
  "capabilities": capabilities,
  "alternatives": alternatives[]{
    "toolSlug": tool->slug.current,
    "toolName": tool->name,
    "relationshipType": relationshipType,
    "reason": reason
  },
  "strengths": strengths,
  "limitations": limitations,
  "aiConfidence": aiConfidence,
  "faq": faq,
  "lastVerifiedAt": lastVerifiedAt
}`

const PUBLISHED = `publicationStatus in ["approved","published"]`

export const Q = {
  categories: /* groq */ `*[_type=="category"]|order(level asc, order asc)${CATEGORY_PROJECTION}`,
  categoryBySlug: /* groq */ `*[_type=="category" && slug.current==$slug][0]${CATEGORY_PROJECTION}`,
  categoryByCode: /* groq */ `*[_type=="category" && categoryCode==$code][0]${CATEGORY_PROJECTION}`,
  tools: /* groq */ `*[_type=="tool" && ${PUBLISHED}]|order(name asc)${TOOL_PROJECTION}`,
  toolBySlug: /* groq */ `*[_type=="tool" && slug.current==$slug][0]${TOOL_PROJECTION}`,
  toolsByCategorySlug: /* groq */ `*[_type=="tool" && ${PUBLISHED} && (primaryCategory->slug.current==$slug || $slug in secondaryCategories[]->slug.current)]|order(name asc)${TOOL_PROJECTION}`,
}
