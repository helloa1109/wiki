import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/layout/AdminSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const nickname = user.user_metadata?.nickname ?? user.user_metadata?.id ?? '관리자'

  return (
    <div className="flex min-h-dvh bg-background">
      <AdminSidebar nickname={nickname} userId={user.id} />
      <main className="ml-[220px] flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
