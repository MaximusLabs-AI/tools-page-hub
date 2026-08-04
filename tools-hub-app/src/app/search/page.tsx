import type {Metadata} from 'next'
import {repo} from '@/lib/repository'
import SearchClient from '@/components/SearchClient'

export const metadata: Metadata = {title: 'Search', robots: {index: false}}

export default async function SearchPage({searchParams}: {searchParams: {q?: string}}) {
  const tools = await repo.getTools()
  return <SearchClient tools={tools} initialQ={searchParams.q || ''} />
}
