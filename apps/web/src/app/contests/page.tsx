import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { GNB } from '@/components/layout/GNB'
import { GrainOverlay } from '@/components/effects/GrainOverlay'
import { CursorSpotlight } from '@/components/effects/CursorSpotlight'
import { fetchAllContests } from '@/lib/contests'
import type { Contest } from '@/lib/contests/types'

export const revalidate = 3600

export const metadata = {
  title: 'Contests | Wiki',
  description: 'IT/SW/AI/창업 공모전 목록을 확인하세요.',
}

const CATEGORIES = [
  { key: 'all', label: '전체' },
  { key: 'ai', label: 'AI / 데이터' },
  { key: 'dev', label: '개발 / SW' },
  { key: 'planning', label: '기획 / UX' },
  { key: 'startup', label: '창업' },
  { key: 'etc', label: '기타' },
]

const CATEGORY_COLORS: Record<string, string> = {
  ai: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  dev: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  planning: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  startup: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  etc: 'bg-white/[0.06] text-foreground-muted border-white/[0.06]',
}

function isExpired(daysLeft: number | null) {
  if (daysLeft === null) return false
  return daysLeft < 0
}

export default async function ContestsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category = 'all' } = await searchParams
  const all = await fetchAllContests()
  const contests = category === 'all'
    ? all
    : all.filter((c: Contest) => c.category === category)

  return (
    <>
      <CursorSpotlight />
      <GNB />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        <div className="mb-10">
          <h1 className="text-[32px] font-bold tracking-tight text-foreground">Contests</h1>
          <p className="mt-2 text-[15px] text-foreground-muted">
            IT / SW / AI / 창업 관련 공모전을 매일 자동으로 수집합니다.
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = category === c.key
            return (
              <Link
                key={c.key}
                href={c.key === 'all' ? '/contests' : `/contests?category=${c.key}`}
                className={[
                  'rounded-full px-4 py-1.5 text-[13px] font-medium border transition-colors',
                  active
                    ? 'bg-white text-black border-white'
                    : 'border-white/[0.08] text-foreground-muted hover:text-foreground hover:border-white/[0.16]',
                ].join(' ')}
              >
                {c.label}
              </Link>
            )
          })}
        </div>

        {contests.length === 0 ? (
          <div className="flex h-60 items-center justify-center rounded-2xl border border-white/[0.06]">
            <p className="text-[14px] text-foreground-subtle">
              공모전 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {contests.map((c: Contest) => {
              const expired = isExpired(c.daysLeft)
              return (
                <article
                  key={c.id}
                  className={[
                    'group flex flex-col rounded-2xl border p-5 transition-colors',
                    expired
                      ? 'border-white/[0.04] opacity-50'
                      : 'border-white/[0.08] hover:border-white/[0.14]',
                  ].join(' ')}
                >
                  {/* 카테고리 배지 */}
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={[
                        'rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
                        CATEGORY_COLORS[c.category] ?? CATEGORY_COLORS.etc,
                      ].join(' ')}
                    >
                      {CATEGORIES.find((x) => x.key === c.category)?.label ?? '기타'}
                    </span>
                    {expired && (
                      <span className="text-[11px] text-foreground-subtle">마감</span>
                    )}
                    {c.daysLeft !== null && !expired && (
                      <span className="text-[11px] text-foreground-subtle">D-{c.daysLeft}</span>
                    )}
                  </div>

                  <h2 className="mb-1 text-[15px] font-semibold leading-snug text-foreground line-clamp-2">
                    {c.title}
                  </h2>

                  {c.organizer && (
                    <p className="mb-3 text-[13px] text-foreground-muted">{c.organizer}</p>
                  )}

                  <div className="mt-auto space-y-1 text-[12px] text-foreground-subtle">
                    {c.prize && <p>🏆 {c.prize}</p>}
                    {c.target && <p>👤 {c.target}</p>}
                  </div>

                  {/* 링크 버튼 */}
                  <div className="mt-4 flex gap-2">
                    <a
                      href={c.detailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg border border-white/[0.08] px-3 py-1.5 text-[12px] text-foreground-muted transition-colors hover:border-white/[0.16] hover:text-foreground"
                    >
                      {c.source === 'linkareer' ? '링커리어 상세' : 'Wevity 상세'}
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
      <GrainOverlay />
    </>
  )
}
