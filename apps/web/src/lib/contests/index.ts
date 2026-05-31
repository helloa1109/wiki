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

  // 각 소스 내 position을 전체 개수로 정규화(0~1)해 신선도 점수로 변환 후 정렬
  // → 두 소스가 고르게 섞이면서 각 소스 안에서는 최신순 유지
  const scored = arrays.flatMap((arr) =>
    arr.map((item, i) => ({ item, score: arr.length > 1 ? i / (arr.length - 1) : 0 }))
  )
  scored.sort((a, b) => a.score - b.score)
  return scored.map((s) => s.item)
}
