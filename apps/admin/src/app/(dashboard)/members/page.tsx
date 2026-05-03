import { createAdminClient } from '@/lib/supabase/admin'
import { MembersTable } from '@/components/members/MembersTable'

export const dynamic = 'force-dynamic'

export default async function MembersPage() {
  const supabase = createAdminClient()

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, nickname, status, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">회원 관리</h1>
        <p className="mt-1 text-[14px] text-foreground-muted">
          가입 신청 회원을 승인하거나 거절할 수 있어요.
        </p>
      </div>

      {error ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5">
          <p className="text-[14px] text-red-400">{error.message}</p>
        </div>
      ) : (
        <MembersTable profiles={profiles ?? []} />
      )}
    </div>
  )
}
