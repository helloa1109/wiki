import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (!q.trim()) return NextResponse.json({ results: [] })

  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('id, title, tags, created_at')
    .eq('published', true)
    .ilike('title', `%${q}%`)
    .limit(10)

  return NextResponse.json({ results: data ?? [] })
}
