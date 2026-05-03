'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function checkEmailExists(email: string): Promise<boolean> {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  return !!data
}
