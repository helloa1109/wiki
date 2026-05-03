import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { GNB } from '@/components/layout/GNB'
import { GrainOverlay } from '@/components/effects/GrainOverlay'
import { CursorSpotlight } from '@/components/effects/CursorSpotlight'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type Post = {
  id: string
  title: string
  content: string | null
  thumbnail_url: string | null
  tags: string[]
  created_at: string | null
}

export default async function WorksDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('id, title, content, thumbnail_url, tags, created_at')
    .eq('id', params.id)
    .eq('published', true)
    .single() as { data: Post | null }

  if (!post) notFound()

  return (
    <>
      <CursorSpotlight />
      <GNB />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        {/* 뒤로가기 */}
        <Link
          href="/works"
          className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-foreground-muted transition-colors hover:text-foreground"
        >
          ← Works
        </Link>

        {/* 썸네일 */}
        {post.thumbnail_url && (
          <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image
              src={post.thumbnail_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* 태그 */}
        {post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-foreground-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 제목 */}
        <h1 className="mb-3 text-[28px] font-bold leading-tight tracking-tight text-foreground">
          {post.title}
        </h1>

        {/* 날짜 */}
        {post.created_at && (
          <p className="mb-10 text-[13px] text-foreground-subtle">
            {new Date(post.created_at).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}

        {/* 본문 */}
        {post.content ? (
          <div className="prose prose-invert max-w-none text-[15px] leading-relaxed text-foreground-muted">
            {post.content}
          </div>
        ) : (
          <p className="text-[14px] text-foreground-subtle">본문 내용이 없습니다.</p>
        )}
      </main>
      <GrainOverlay />
    </>
  )
}
