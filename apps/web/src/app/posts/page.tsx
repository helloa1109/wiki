import { GNB } from '@/components/layout/GNB'
import { GrainOverlay } from '@/components/effects/GrainOverlay'
import { CursorSpotlight } from '@/components/effects/CursorSpotlight'
import { WorksCard } from '@/components/works/WorksCard'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Works | Team DBC',
  description: 'DBC 팀의 작업물을 확인하세요.',
}

export default async function WorksPage() {
  const supabase = await createClient()

  type Post = {
    id: string
    title: string
    thumbnail_url: string | null
    tags: string[]
    created_at: string | null
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, thumbnail_url, tags, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false }) as { data: Post[] | null }

  return (
    <>
      <CursorSpotlight />
      <GNB />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="text-[32px] font-bold tracking-tight text-foreground">Posts</h1>
          <p className="mt-2 text-[15px] text-foreground-muted">
            DBC 팀의 작업물과 프로젝트를 소개합니다.
          </p>
        </div>

        {/* 목록 */}
        {!posts || posts.length === 0 ? (
          <div className="flex h-60 items-center justify-center rounded-2xl border border-white/[0.06]">
            <p className="text-[14px] text-foreground-subtle">아직 게시된 작업물이 없어요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <WorksCard
                key={post.id}
                id={post.id}
                title={post.title}
                thumbnail_url={post.thumbnail_url}
                tags={post.tags ?? []}
                created_at={post.created_at}
              />
            ))}
          </div>
        )}
      </main>
      <GrainOverlay />
    </>
  )
}
