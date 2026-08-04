import category from './category'
import vendor from './vendor'
import source from './source'
import tool from './tool'
import {objectTypes} from './objects'

/**
 * Tools Intelligence Hub — Sanity schema registration.
 * Register in sanity.config.ts:
 *   import {schemaTypes} from './schemas/tools-hub'
 *   schema: { types: schemaTypes }
 *
 * Documents:  category, vendor, source, tool
 * Objects:    quickVerdict, bestFit, pricingPlan, capability, integrationRef,
 *             alternativeRef, evidenceClaim, and the AI Answer Confidence set
 *             (aiConfidence + aiEngineScore, sourceOfTruth, dimensionScore,
 *             citationSource).
 *
 * Maps the frozen Phase 4A 13-table model onto Sanity; the AI Answer Confidence
 * object is the net-new extension layered on top (not in Phases 1-5).
 */
export const schemaTypes = [category, vendor, source, tool, ...objectTypes]
