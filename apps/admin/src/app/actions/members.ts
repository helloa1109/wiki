'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

type MemberStatus = 'approved' | 'rejected'

export async function updateMemberStatus(userId: string, status: MemberStatus) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', userId)

  if (error) throw new Error(error.message)

  revalidatePath('/members')
}
