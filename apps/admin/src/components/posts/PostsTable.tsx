'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Globe, EyeOff, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { deletePost, togglePublish } from '@/app/actions/posts'

interface Post {
  id: string
  title: string
  tags: string[]
  published: boolean
  created_at: string | null
  updated_at: string | null
}

type Filter = 'all' | 'published' | 'draft'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'published', label: '발행됨' },
  { key: 'draft', label: '임시저장' },
]

export function PostsTable({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [pending, startTransition] = useTransition()
  const [actionTarget, setActionTarget] = useState<string | null>(null)

  const filtered = filter === 'all'
    ? posts
    : filter === 'published'
    ? posts.filter((p) => p.published)
    : posts.filter((p) => !p.published)

  const count = (key: Filter) =>
    key === 'all' ? posts.length
    : key === 'published' ? posts.filter((p) => p.published).length
    : posts.filter((p) => !p.published).length

  const handleToggle = (id: string, published: boolean) => {
    setActionTarget(id)
    startTransition(async () => {
      await togglePublish(id, !published)
      setActionTarget(null)
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('이 게시글을 삭제하시겠습니까?')) return
    setActionTarget(id)
    startTransition(async () => {
      await deletePost(id)
      setActionTarget(null)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 상단 액션 바 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1 w-fit">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors duration-150',
                filter === key
                  ? 'bg-white/[0.08] text-foreground'
                  : 'text-foreground-muted hover:text-foreground',
              )}
            >
              {label}
              <span className="ml-1.5 text-[11px] text-foreground-subtle">{count(key)}</span>
            </button>
          ))}
        </div>

        <Link
          href="/posts/new"
          className="flex items-center gap-1.5 rounded-lg bg-white/[0.08] border border-white/[0.08] px-3.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-white/[0.12]"
        >
          <Plus className="h-3.5 w-3.5" />
          새 글 작성
        </Link>
      </div>

      {/* 테이블 */}
      <div className="rounded-xl border border-white/[0.06] bg-[hsl(var(--surface))] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3">
            <p className="text-[14px] text-foreground-subtle">게시글이 없습니다</p>
            <Link
              href="/posts/new"
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-1.5 text-[13px] text-foreground-muted hover:text-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              새 글 작성
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-3.5 text-left text-[12px] font-medium uppercase tracking-[0.06em] text-foreground-subtle">제목</th>
                <th className="px-5 py-3.5 text-left text-[12px] font-medium uppercase tracking-[0.06em] text-foreground-subtle">태그</th>
                <th className="px-5 py-3.5 text-left text-[12px] font-medium uppercase tracking-[0.06em] text-foreground-subtle">상태</th>
                <th className="px-5 py-3.5 text-left text-[12px] font-medium uppercase tracking-[0.06em] text-foreground-subtle">작성일</th>
                <th className="px-5 py-3.5 text-right text-[12px] font-medium uppercase tracking-[0.06em] text-foreground-subtle">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((post) => {
                const isLoading = pending && actionTarget === post.id
                return (
                  <tr key={post.id} className="group transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-4 max-w-[280px]">
                      <p className="truncate text-[13.5px] font-medium text-foreground">{post.title}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[11px] text-foreground-subtle"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="text-[11px] text-foreground-subtle">+{post.tags.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[12px] font-medium',
                        post.published
                          ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                          : 'bg-white/[0.06] text-foreground-muted ring-1 ring-white/[0.08]',
                      )}>
                        {post.published ? (
                          <><Globe className="h-3 w-3" /> 발행됨</>
                        ) : (
                          <><EyeOff className="h-3 w-3" /> 임시저장</>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-foreground-muted">
                      {post.created_at
                        ? new Date(post.created_at).toLocaleDateString('ko-KR')
                        : '-'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggle(post.id, post.published)}
                          disabled={isLoading}
                          title={post.published ? '임시저장으로 변경' : '발행하기'}
                          className={cn(
                            'rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors disabled:opacity-40',
                            post.published
                              ? 'bg-white/[0.06] text-foreground-muted hover:bg-white/[0.1]'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20',
                          )}
                        >
                          {isLoading ? '...' : post.published ? '내리기' : '발행'}
                        </button>
                        <Link
                          href={`/posts/${post.id}/edit`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-white/[0.06] hover:text-foreground"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={isLoading}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
