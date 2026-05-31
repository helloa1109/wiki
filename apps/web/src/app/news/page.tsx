import Link from 'next/link'
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { GNB } from '@/components/layout/GNB'
import { GrainOverlay } from '@/components/effects/GrainOverlay'
import { CursorSpotlight } from '@/components/effects/CursorSpotlight'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'News | Team DBC',
  description: 'AI/테크 데일리 뉴스를 확인하세요.',
}

type NewsItem = {
  id: string
  title: string
  summary: string | null
  url: string
  source: string | null
  categories: string[]
  published_at: string | null
  image_url: string | null
}

const PAGE_SIZE = 15
const ALL_CATEGORIES = ['AI', '빅테크', '스타트업', '신기술', '정책/규제', '리서치']

const CATEGORY_COLORS: Record<string, string> = {
  'AI': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  '빅테크': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  '스타트업': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  '신기술': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  '정책/규제': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  '리서치': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
}

async function getNews(category: string, page: number): Promise<{ items: NewsItem[]; total: number }> {
  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let q = supabase
    .from('news')
    .select('id, title, summary, url, source, categories, published_at, image_url', { count: 'exact' })
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (category !== 'all') {
    q = q.contains('categories', [category])
  }

  const { data, count } = await q
  return { items: (data as NewsItem[]) ?? [], total: count ?? 0 }
}

function pageHref(category: string, page: number) {
  const params = new URLSearchParams()
  if (category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `/news?${qs}` : '/news'
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const params = await searchParams
  const category = params.category ?? 'all'
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const { items: news, total } = await getNews(category, page)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <>
      <CursorSpotlight />
      <GNB />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        <div className="mb-10">
          <h1 className="text-[32px] font-bold tracking-tight text-foreground">News</h1>
          <p className="mt-2 text-[15px] text-foreground-muted">
            AI/테크 분야 주요 뉴스를 매일 자동으로 수집합니다.
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/news"
            className={[
              'rounded-full px-4 py-1.5 text-[13px] font-medium border transition-colors',
              category === 'all'
                ? 'bg-white text-black border-white'
                : 'border-white/[0.08] text-foreground-muted hover:text-foreground hover:border-white/[0.16]',
            ].join(' ')}
          >
            전체
          </Link>
          {ALL_CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/news?category=${encodeURIComponent(c)}`}
              className={[
                'rounded-full px-4 py-1.5 text-[13px] font-medium border transition-colors',
                category === c
                  ? 'bg-white text-black border-white'
                  : 'border-white/[0.08] text-foreground-muted hover:text-foreground hover:border-white/[0.16]',
              ].join(' ')}
            >
              {c}
            </Link>
          ))}
        </div>

        {news.length === 0 ? (
          <div className="flex h-60 items-center justify-center rounded-2xl border border-white/[0.06]">
            <p className="text-[14px] text-foreground-subtle">
              아직 수집된 뉴스가 없어요.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="group rounded-2xl border border-white/[0.08] overflow-hidden transition-colors hover:border-white/[0.14]"
                >
                  {item.image_url && (
                    <Link href={`/news/${item.id}`}>
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-40 object-cover"
                      />
                    </Link>
                  )}
                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      {item.categories?.map((cat) => (
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
                        <span className="text-[11px] text-foreground-subtle">{item.source}</span>
                      )}
                      {item.published_at && (
                        <span className="ml-auto text-[11px] text-foreground-subtle">
                          {item.published_at}
                        </span>
                      )}
                    </div>

                    <Link href={`/news/${item.id}`}>
                      <h2 className="mb-2 text-[15px] font-semibold leading-snug text-foreground hover:text-foreground/80 transition-colors">
                        {item.title}
                      </h2>
                    </Link>

                    {item.summary && (
                      <p className="mb-4 text-[13px] leading-[1.7] text-foreground-muted line-clamp-2">
                        {item.summary}
                      </p>
                    )}

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] px-3 py-1.5 text-[12px] text-foreground-muted transition-colors hover:border-white/[0.16] hover:text-foreground"
                    >
                      원문 보기
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Link
                  href={pageHref(category, page - 1)}
                  aria-disabled={page <= 1}
                  className={[
                    'inline-flex h-9 w-9 items-center justify-center rounded-full border text-foreground-muted transition-colors',
                    page <= 1
                      ? 'pointer-events-none border-white/[0.04] text-foreground-subtle opacity-40'
                      : 'border-white/[0.08] hover:border-white/[0.16] hover:text-foreground',
                  ].join(' ')}
                >
                  <ChevronLeft size={15} />
                </Link>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={pageHref(category, p)}
                      className={[
                        'inline-flex h-9 w-9 items-center justify-center rounded-full border text-[13px] font-medium transition-colors',
                        p === page
                          ? 'bg-white text-black border-white'
                          : 'border-white/[0.08] text-foreground-muted hover:border-white/[0.16] hover:text-foreground',
                      ].join(' ')}
                    >
                      {p}
                    </Link>
                  ))}
                </div>

                <Link
                  href={pageHref(category, page + 1)}
                  aria-disabled={page >= totalPages}
                  className={[
                    'inline-flex h-9 w-9 items-center justify-center rounded-full border text-foreground-muted transition-colors',
                    page >= totalPages
                      ? 'pointer-events-none border-white/[0.04] text-foreground-subtle opacity-40'
                      : 'border-white/[0.08] hover:border-white/[0.16] hover:text-foreground',
                  ].join(' ')}
                >
                  <ChevronRight size={15} />
                </Link>
              </div>
            )}
          </>
        )}
      </main>
      <GrainOverlay />
    </>
  )
}
