'use client'

import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import type { Database } from '@chat/database'

export function createClient() {
  return createSupabaseBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
