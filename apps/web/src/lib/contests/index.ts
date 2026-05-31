import { fetchWevityContests } from './wevity'
import { fetchLinkareerContests } from './linkareer'
import type { Contest, ContestSource } from './types'

export type { Contest, ContestCategory, ContestSource } from './types'

interface FetchOptions {
  sources?: ContestSource[]
  maxPagesPerSource?: number
}

export async function fetchAllContests(options: FetchOptions = {}): Promise<Contest[]> {
  const { sources = ['wevity', 'linkareer'], maxPagesPerSource } = options

  const fetchers: Promise<Contest[]>[] = []

  if (sources.includes('wevity')) {
    fetchers.push(fetchWevityContests({ maxPages: maxPagesPerSource ?? 3 }))
  }
  if (sources.includes('linkareer')) {
    fetchers.push(fetchLinkareerContests({ maxPages: maxPagesPerSource ?? 2 }))
  }

  const results = await Promise.allSettled(fetchers)
  return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
}
