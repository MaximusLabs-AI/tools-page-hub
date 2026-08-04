// Import the local seed into Sanity via the HTTP mutate API (createOrReplace = idempotent).
// Reads credentials from env (source .env.local first). Never hardcodes the token.
//
//   cd tools-hub-app && set -a && . ./.env.local && set +a && node scripts/sanity-import.mjs
import {readFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const dir = dirname(fileURLToPath(import.meta.url))
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-08-01'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN (source .env.local first).')
  process.exit(1)
}

const docs = JSON.parse(readFileSync(join(dir, '../src/data/seed.json'), 'utf8'))
const mutations = docs.map((d) => ({createOrReplace: d}))
const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}?returnIds=true`

const res = await fetch(url, {
  method: 'POST',
  headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
  body: JSON.stringify({mutations}),
})
const json = await res.json()
if (!res.ok) {
  console.error('Import failed:', res.status, JSON.stringify(json).slice(0, 800))
  process.exit(1)
}
const results = json.results || []
const cats = results.filter((r) => r.id.startsWith('category-')).length
const tools = results.filter((r) => r.id.startsWith('tool-')).length
console.log(`Imported ${results.length} documents (${cats} categories, ${tools} tools) into ${projectId}/${dataset}.`)
console.log(`transactionId=${json.transactionId}`)
