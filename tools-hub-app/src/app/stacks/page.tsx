import type {Metadata} from 'next'
import {repo} from '@/lib/repository'
import StackBuilderClient from '@/components/StackBuilderClient'

export const metadata: Metadata = {title: 'Stack Builder'}

export default async function StacksPage() {
  const tools = await repo.getTools()
  return <StackBuilderClient tools={tools} />
}
