import Link from 'next/link'
import { ExternalLink, ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { GNB } from '@/components/layout/GNB'
import { GrainOverlay } from '@/components/effects/GrainOverlay'
import { CursorSpotlight } from '@/components/effects/CursorSpotlight'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const CATEGORY_COLORS: Record<string, string> = {
  'AI': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  '빅테크': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  '스타트업': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  '신기술': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  '정책/규제': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  '리서치': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  type NewsItem = {
    id: string
    title: string
    summary: string | null
    url: string
    source: string | null
    categories: string[]
    published_at: string | null
  }

  const { data: item } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single() as { data: NewsItem | null }

  if (!item) notFound()

  return (
    <>
      <CursorSpotlight />
      <GNB />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-32">
        {/* 뒤로가기 */}
        <Link
          href="/news"
          className="mb-10 inline-flex items-center gap-2 text-[13px] text-foreground-subtle transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          News
        </Link>

        {/* 카테고리 + 출처 */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {item.categories?.map((cat: string) => (
            <span
              key={cat}
              className={[
                'rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
                CATEGORY_COLORS[cat] ?? 'bg-white/[0.06] text-foreground-muted border-white/[0.06]',
              ].join(' ')}
            >
              {cat}
            </span>
          ))}
          {item.source && (
            <span className="text-[12px] text-foreground-subtle">{item.source}</span>
          )}
          {item.published_at && (
            <span className="ml-auto text-[12px] text-foreground-subtle">{item.published_at}</span>
          )}
        </div>

        {/* 제목 */}
        <h1 className="mb-8 text-[26px] font-bold leading-snug tracking-tight text-foreground">
          {item.title}
        </h1>

        {/* 요약 */}
        <div className="mb-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <p className="text-[13px] font-medium uppercase tracking-[0.1em] text-foreground-subtle mb-3">
            Summary
          </p>
          <p className="text-[15px] leading-[1.8] text-foreground-muted">
            {item.summary}
          </p>
        </div>

        {/* 원문 링크 */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[14px] font-semibold text-background transition-opacity hover:opacity-80"
        >
          원문 보기
          <ExternalLink size={14} />
        </a>
      </main>
      <GrainOverlay />
    </>
  )
}
