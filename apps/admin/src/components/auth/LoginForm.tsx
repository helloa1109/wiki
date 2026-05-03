'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full max-w-[380px]">
      {/* 로고 */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <span className="relative h-9 w-9 rounded-[10px] bg-[hsl(var(--brand))] shadow-[0_0_0_1px_hsl(var(--brand)/0.4),inset_0_1px_0_rgba(255,255,255,0.4)]">
          <span className="absolute inset-[6px] rounded-[4px] bg-background" />
        </span>
        <div className="text-center">
          <p className="text-[15px] font-bold tracking-tight text-foreground">DBC Admin</p>
          <p className="text-[13px] text-foreground-muted mt-0.5">관리자 페이지</p>
        </div>
      </div>

      {/* 카드 */}
      <div className={cn(
        'rounded-2xl border border-white/[0.08] p-7',
        'bg-[hsl(var(--surface))]',
        'shadow-[0_24px_64px_rgba(0,0,0,0.5)]',
      )}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 이메일 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-foreground-muted tracking-wide">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dbc.kr"
              required
              autoComplete="email"
              className={cn(
                'w-full rounded-xl border border-white/[0.08] bg-white/[0.04]',
                'px-4 py-3 text-[14px] text-foreground placeholder:text-foreground-subtle',
                'outline-none transition-all duration-200',
                'focus:border-white/[0.2] focus:bg-white/[0.06]',
              )}
            />
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-foreground-muted tracking-wide">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className={cn(
                'w-full rounded-xl border border-white/[0.08] bg-white/[0.04]',
                'px-4 py-3 text-[14px] text-foreground placeholder:text-foreground-subtle',
                'outline-none transition-all duration-200',
                'focus:border-white/[0.2] focus:bg-white/[0.06]',
              )}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="text-[13px] text-red-400 text-center">{error}</p>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              'mt-1 w-full rounded-xl py-3 text-[14px] font-semibold tracking-tight',
              'bg-foreground text-background',
              'transition-all duration-200',
              'hover:opacity-90 active:scale-[0.98]',
              'disabled:opacity-40 disabled:cursor-not-allowed',
            )}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
