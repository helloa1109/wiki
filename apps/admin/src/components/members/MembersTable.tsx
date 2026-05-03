'use client'

import { useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { updateMemberStatus } from '@/app/actions/members'

interface Profile {
  id: string
  email: string | null
  nickname: string | null
  status: string | null
  created_at: string | null
}

const STATUS_LABEL: Record<string, string> = {
  pending: '대기',
  approved: '승인',
  rejected: '거절',
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
  approved: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected'

const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'pending', label: '대기' },
  { key: 'approved', label: '승인' },
  { key: 'rejected', label: '거절' },
]

export function MembersTable({ profiles }: { profiles: Profile[] }) {
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [pending, startTransition] = useTransition()
  const [actionTarget, setActionTarget] = useState<string | null>(null)

  const filtered = filter === 'all' ? profiles : profiles.filter((p) => p.status === filter)

  const handleAction = (userId: string, status: 'approved' | 'rejected') => {
    setActionTarget(userId)
    startTransition(async () => {
      await updateMemberStatus(userId, status)
      setActionTarget(null)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 필터 탭 */}
      <div className="flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1 w-fit">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors duration-150',
              filter === key
                ? 'bg-white/[0.08] text-foreground'
                : 'text-foreground-muted hover:text-foreground',
            )}
          >
            {label}
            <span className="ml-1.5 text-[11px] text-foreground-subtle">
              {key === 'all' ? profiles.length : profiles.filter((p) => p.status === key).length}
            </span>
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div className="rounded-xl border border-white/[0.06] bg-[hsl(var(--surface))] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-[14px] text-foreground-subtle">회원이 없습니다</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-3.5 text-left text-[12px] font-medium uppercase tracking-[0.06em] text-foreground-subtle">닉네임</th>
                <th className="px-5 py-3.5 text-left text-[12px] font-medium uppercase tracking-[0.06em] text-foreground-subtle">이메일</th>
                <th className="px-5 py-3.5 text-left text-[12px] font-medium uppercase tracking-[0.06em] text-foreground-subtle">상태</th>
                <th className="px-5 py-3.5 text-left text-[12px] font-medium uppercase tracking-[0.06em] text-foreground-subtle">가입일</th>
                <th className="px-5 py-3.5 text-right text-[12px] font-medium uppercase tracking-[0.06em] text-foreground-subtle">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((profile) => {
                const isLoading = pending && actionTarget === profile.id
                const status = profile.status ?? 'pending'

                return (
                  <tr key={profile.id} className="group transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[11px] font-semibold text-foreground">
                          {(profile.nickname ?? '?').slice(0, 1).toUpperCase()}
                        </div>
                        <span className="text-[13.5px] font-medium text-foreground">
                          {profile.nickname ?? '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-foreground-muted">
                      {profile.email ?? '-'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        'inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-medium',
                        STATUS_STYLE[status] ?? STATUS_STYLE.pending,
                      )}>
                        {STATUS_LABEL[status] ?? status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-foreground-muted">
                      {profile.created_at
                        ? new Date(profile.created_at).toLocaleDateString('ko-KR')
                        : '-'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {status !== 'approved' && (
                          <button
                            onClick={() => handleAction(profile.id, 'approved')}
                            disabled={isLoading}
                            className={cn(
                              'rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors',
                              'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20',
                              'disabled:cursor-not-allowed disabled:opacity-40',
                            )}
                          >
                            {isLoading ? '처리 중...' : '승인'}
                          </button>
                        )}
                        {status !== 'rejected' && (
                          <button
                            onClick={() => handleAction(profile.id, 'rejected')}
                            disabled={isLoading}
                            className={cn(
                              'rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors',
                              'bg-red-500/10 text-red-400 hover:bg-red-500/20',
                              'disabled:cursor-not-allowed disabled:opacity-40',
                            )}
                          >
                            {isLoading ? '처리 중...' : '거절'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
