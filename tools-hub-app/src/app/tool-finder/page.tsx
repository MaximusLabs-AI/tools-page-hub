import type {Metadata} from 'next'
import {repo} from '@/lib/repository'
import ToolFinderClient from '@/components/ToolFinderClient'

export const metadata: Metadata = {title: 'Tool Finder'}

export default async function ToolFinderPage() {
  const tools = await repo.getTools()
  return <ToolFinderClient tools={tools} />
}
