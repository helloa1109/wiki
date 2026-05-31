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
  const all = settled.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))

  // daysLeft 오름차순 (마감 임박순) — 두 소스가 값 기준으로 자연스럽게 섞임
  // null은 뒤로, 만료(음수)는 맨 뒤로
  all.sort((a, b) => {
    const score = (d: number | null) => d === null ? 9999 : d < 0 ? 99999 : d
    return score(a.daysLeft) - score(b.daysLeft)
  })
  return all
}
