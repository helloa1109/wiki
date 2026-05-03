'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { checkEmailExists } from '@/app/actions/auth'
import { AuthCard } from './AuthCard'
import { AuthInput } from './AuthInput'

interface FieldErrors {
  email?: string
  nickname?: string
  password?: string
  passwordConfirm?: string
}

export function SignupForm() {
  const [values, setValues] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }))
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = (): boolean => {
    const errors: FieldErrors = {}

    if (!values.email) errors.email = '이메일을 입력해주세요.'

    if (!values.nickname) {
      errors.nickname = '닉네임을 입력해주세요.'
    } else if (values.nickname.length < 2) {
      errors.nickname = '닉네임은 2자 이상이어야 합니다.'
    }

    if (!values.password) {
      errors.password = '비밀번호를 입력해주세요.'
    } else if (values.password.length < 8) {
      errors.password = '비밀번호는 8자 이상이어야 합니다.'
    }

    if (!values.passwordConfirm) {
      errors.passwordConfirm = '비밀번호를 한 번 더 입력해주세요.'
    } else if (values.password !== values.passwordConfirm) {
      errors.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validate()) return

    setLoading(true)

    const exists = await checkEmailExists(values.email)
    if (exists) {
      setFieldErrors((prev) => ({ ...prev, email: '이미 사용 중인 이메일입니다.' }))
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { nickname: values.nickname },
      },
    })

    if (error) {
      setError(
        error.message.includes('already registered')
          ? '이미 사용 중인 이메일입니다.'
          : error.message,
      )
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <AuthCard title="가입 완료" description="관리자 페이지">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] text-xl text-foreground">
            ✓
          </div>
          <div>
            <p className="text-[14px] text-foreground">가입이 완료됐어요</p>
            <p className="mt-1 text-[13px] text-foreground-muted">
              {values.email} 로 로그인할 수 있어요.
            </p>
          </div>
          <Link
            href="/login"
            className={cn(
              'mt-2 w-full rounded-xl py-3 text-center text-[14px] font-semibold',
              'bg-foreground text-background',
              'transition-all duration-200 hover:opacity-90',
            )}
          >
            로그인으로 이동
          </Link>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="회원가입" description="관리자 페이지">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          label="이메일"
          type="email"
          value={values.email}
          onChange={set('email')}
          placeholder="example@gmail.com"
          autoComplete="email"
          error={fieldErrors.email}
        />
        <AuthInput
          label="닉네임"
          type="text"
          value={values.nickname}
          onChange={set('nickname')}
          placeholder="홍길동"
          autoComplete="nickname"
          error={fieldErrors.nickname}
        />
        <AuthInput
          label="비밀번호"
          type="password"
          value={values.password}
          onChange={set('password')}
          placeholder="8자 이상 입력"
          autoComplete="new-password"
          error={fieldErrors.password}
        />
        <AuthInput
          label="비밀번호 확인"
          type="password"
          value={values.passwordConfirm}
          onChange={set('passwordConfirm')}
          placeholder="••••••••"
          autoComplete="new-password"
          error={fieldErrors.passwordConfirm}
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
          {loading ? '가입 중...' : '가입하기'}
        </button>

        <p className="text-center text-[13px] text-foreground-muted">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-foreground underline-offset-4 hover:underline">
            로그인
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
