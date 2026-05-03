import { Eye, Users, MousePointerClick, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAnalyticsData } from '@/lib/analytics'

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}분 ${s}초`
}

const CARDS = [
  {
    key: 'pageViews7d' as const,
    label: '페이지뷰',
    desc: '최근 7일',
    icon: Eye,
    color: 'text-violet-400',
    bg: 'bg-violet-400/[0.08]',
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: 'activeUsers7d' as const,
    label: '활성 사용자',
    desc: '최근 7일',
    icon: Users,
    color: 'text-sky-400',
    bg: 'bg-sky-400/[0.08]',
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: 'sessions7d' as const,
    label: '세션',
    desc: '최근 7일',
    icon: MousePointerClick,
    color: 'text-orange-400',
    bg: 'bg-orange-400/[0.08]',
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: 'avgSessionDuration' as const,
    label: '평균 세션 시간',
    desc: '최근 7일',
    icon: Clock,
    color: 'text-pink-400',
    bg: 'bg-pink-400/[0.08]',
    format: (v: number) => formatDuration(v),
  },
]

export async function AnalyticsSection() {
  const data = await getAnalyticsData()

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-foreground">사이트 분석</h2>
        <span className="text-[12px] text-foreground-subtle">Google Analytics</span>
      </div>

      {!data ? (
        <div className="flex h-24 items-center justify-center rounded-xl border border-white/[0.06] bg-[hsl(var(--surface))]">
          <p className="text-[13px] text-foreground-subtle">데이터를 불러올 수 없어요</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CARDS.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.key}
                className="rounded-xl border border-white/[0.06] bg-[hsl(var(--surface))] p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[13px] text-foreground-muted">{card.label}</p>
                    <p className="mt-2 text-[24px] font-bold tracking-tight text-foreground">
                      {card.format(data[card.key])}
                    </p>
                    <p className="mt-1 text-[12px] text-foreground-subtle">{card.desc}</p>
                  </div>
                  <div className={cn('rounded-lg p-2.5', card.bg)}>
                    <Icon className={cn('h-4 w-4', card.color)} strokeWidth={1.8} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
