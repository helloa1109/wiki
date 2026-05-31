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

  const settled = await Promise.allSettled(fetchers)
  const arrays = settled.map((r) => (r.status === 'fulfilled' ? r.value : []))

  // 각 소스는 이미 최신순 — 번갈아 합쳐서 최신글이 앞에 오도록 인터리빙
  const maxLen = Math.max(...arrays.map((a) => a.length), 0)
  const merged: Contest[] = []
  for (let i = 0; i < maxLen; i++) {
    for (const arr of arrays) {
      if (i < arr.length) merged.push(arr[i]!)
    }
  }
  return merged
}
