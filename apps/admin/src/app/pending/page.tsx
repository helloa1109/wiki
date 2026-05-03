import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PendingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const handleLogout = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-white/[0.06] bg-[hsl(var(--surface))] p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
            <span className="text-xl">⏳</span>
          </div>
          <h1 className="text-[18px] font-bold tracking-tight text-foreground">승인 대기 중</h1>
          <p className="mt-2 text-[13px] text-foreground-muted">
            관리자의 승인 후 서비스를 이용할 수 있어요.
          </p>
          <p className="mt-1 text-[12px] text-foreground-subtle">{user.email}</p>
          <form action={handleLogout} className="mt-6">
            <button
              type="submit"
              className="w-full rounded-xl py-2.5 text-[13px] font-medium text-foreground-muted transition-colors hover:bg-white/[0.04] hover:text-foreground border border-white/[0.06]"
            >
              로그아웃
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
