import { createClient } from '@/lib/supabase/server'
import { FileText, Users, TrendingUp, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

async function getStats() {
  const supabase = await createClient()

  const [{ count: postCount }, { count: memberCount }] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  return {
    posts: postCount ?? 0,
    members: memberCount ?? 0,
  }
}

const STAT_CARDS = [
  {
    label: '전체 게시글',
    key: 'posts' as const,
    icon: FileText,
    description: '등록된 게시글 수',
    color: 'text-blue-400',
    bg: 'bg-blue-400/[0.08]',
  },
  {
    label: '전체 회원',
    key: 'members' as const,
    icon: Users,
    description: '가입된 회원 수',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/[0.08]',
  },
]

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">대시보드</h1>
        <p className="mt-1 text-[14px] text-foreground-muted">DBC 블로그 현황을 한눈에 확인하세요.</p>
      </div>

      {/* 스탯 카드 */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.key}
              className={cn(
                'rounded-xl border border-white/[0.06] bg-[hsl(var(--surface))] p-5',
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] text-foreground-muted">{card.label}</p>
                  <p className="mt-2 text-[32px] font-bold tracking-tight text-foreground">
                    {stats[card.key].toLocaleString()}
                  </p>
                  <p className="mt-1 text-[12px] text-foreground-subtle">{card.description}</p>
                </div>
                <div className={cn('rounded-lg p-2.5', card.bg)}>
                  <Icon className={cn('h-5 w-5', card.color)} strokeWidth={1.8} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 빠른 링크 */}
      <div className="rounded-xl border border-white/[0.06] bg-[hsl(var(--surface))] p-5">
        <h2 className="mb-4 text-[14px] font-semibold text-foreground">빠른 이동</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '게시글 관리', href: '/posts', icon: FileText, desc: '게시글 작성 및 편집' },
            { label: '회원 관리', href: '/members', icon: Users, desc: '회원 목록 및 권한' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg border border-white/[0.06] p-4',
                  'transition-colors duration-150 hover:bg-white/[0.04]',
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-foreground-muted" strokeWidth={1.8} />
                <div>
                  <p className="text-[13px] font-medium text-foreground">{item.label}</p>
                  <p className="text-[12px] text-foreground-subtle">{item.desc}</p>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
