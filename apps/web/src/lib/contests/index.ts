import { createClient } from '@/lib/supabase/server'
import type { Contest, ContestCategory, ContestSource } from './types'

export type { Contest, ContestCategory, ContestSource } from './types'

export async function fetchAllContests(): Promise<Contest[]> {
  const supabase = await createClient()

  type ContestRow = {
    external_id: string
    title: string
    organizer: string | null
    category: string | null
    start_date: string | null
    end_date: string | null
    days_left: number | null
    prize: string | null
    target: string | null
    detail_url: string
    thumbnail_url: string | null
    source: string
  }

  const { data, error } = await supabase
    .from('contests')
    .select('external_id, title, organizer, category, start_date, end_date, days_left, prize, target, detail_url, thumbnail_url, source')
    .order('scraped_at', { ascending: false }) as { data: ContestRow[] | null; error: unknown }

  if (error) {
    console.error('[contests] supabase fetch error:', error)
    return []
  }

  const score = (d: number | null) => d === null ? 9999 : d < 0 ? 99999 : d

  const mapped = (data ?? []).map((row) => ({
    id: row.external_id,
    title: row.title,
    organizer: row.organizer,
    category: (row.category ?? 'etc') as ContestCategory,
    startDate: row.start_date,
    endDate: row.end_date,
    daysLeft: row.days_left,
    prize: row.prize,
    target: row.target,
    detailUrl: row.detail_url,
    thumbnailUrl: row.thumbnail_url,
    source: row.source as ContestSource,
  }))

  mapped.sort((a, b) => score(a.daysLeft) - score(b.daysLeft))
  return mapped
}
