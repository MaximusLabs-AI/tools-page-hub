import {resolveProfileConfidence} from '../src/lib/core/confidence'
import {localRepository} from '../src/lib/repository/local'

const nowArgument = process.argv.find((argument) => argument.startsWith('--date='))
const auditDate = nowArgument ? new Date(nowArgument.slice('--date='.length)) : new Date()

if (Number.isNaN(auditDate.getTime())) {
  throw new Error('Use --date=YYYY-MM-DD with a valid date.')
}

const tools = await localRepository.getTools()
const rows = tools.map((tool) => {
  const confidence = resolveProfileConfidence(tool, auditDate)
  const dimensions = confidence.evidenceBreakdown ?? []
  return {
    tool: tool.name,
    score: confidence.aggregatePct,
    feature: dimensions[0]?.scorePct ?? 0,
    pricing: dimensions[1]?.scorePct ?? 0,
    decision: dimensions[2]?.scorePct ?? 0,
    sources: dimensions[3]?.scorePct ?? 0,
    recordedSources: confidence.evidenceSources?.length ?? 0,
    band: confidence.evidenceBand ?? 'n/a',
  }
})

console.table(rows)
console.log({
  auditedTools: rows.length,
  minimum: Math.min(...rows.map((row) => row.score)),
  maximum: Math.max(...rows.map((row) => row.score)),
  uniqueScores: new Set(rows.map((row) => row.score)).size,
  allDimensionsPerfect: rows.filter(
    (row) =>
      row.feature === 100 &&
      row.pricing === 100 &&
      row.decision === 100 &&
      row.sources === 100,
  ).length,
  auditDate: auditDate.toISOString(),
})
