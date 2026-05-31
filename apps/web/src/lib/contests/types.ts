export type ContestCategory = 'ai' | 'dev' | 'planning' | 'startup' | 'etc'
export type ContestSource = 'wevity' | 'linkareer'

export interface Contest {
  id: string
  title: string
  organizer: string | null
  category: ContestCategory
  startDate: string | null
  endDate: string | null
  daysLeft: number | null
  prize: string | null
  target: string | null
  detailUrl: string
  thumbnailUrl: string | null
  source: ContestSource
}
