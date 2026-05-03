'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { AuthCard } from './AuthCard'
import { AuthInput } from './AuthInput'

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
    <AuthCard title="로그인" description="관리자 페이지">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@gmail.com"
          required
          autoComplete="email"
        />
        <AuthInput
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        {error && (
          <p className="text-center text-[13px] text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={cn(
            'mt-1 w-full rounded-xl py-3 text-[14px] font-semibold tracking-tight',
            'bg-foreground text-background',
            'transition-all duration-200 hover:opacity-90 active:scale-[0.98]',
            'disabled:cursor-not-allowed disabled:opacity-40',
          )}
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>

        <p className="text-center text-[13px] text-foreground-muted">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-foreground underline-offset-4 hover:underline">
            회원가입
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
