import type {Category, Tool} from '@/lib/types'
import {localRepository} from './local'
import {sanityRepository} from './sanity'

/**
 * The data-access boundary. The UI only ever talks to this interface, so the
 * source can switch from local seed data to Sanity with zero UI changes.
 */
export interface ToolsRepository {
  getCategories(): Promise<Category[]>
  getCategoryBySlug(slug: string): Promise<Category | null>
  getCategoryByCode(code: string): Promise<Category | null>
  getTools(): Promise<Tool[]>
  getToolBySlug(slug: string): Promise<Tool | null>
  getToolsByCategorySlug(slug: string): Promise<Tool[]>
}

/**
 * Factory: use Sanity only when explicitly selected AND a project id is present.
 * Otherwise fall back to local seed data — so the app always runs.
 */
export function getRepository(): ToolsRepository {
  const useSanity =
    process.env.DATA_SOURCE === 'sanity' && Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
  return useSanity ? sanityRepository : localRepository
}

export const repo = getRepository()
