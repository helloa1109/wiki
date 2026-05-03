'use client'

import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import Link from 'next/link'

interface SearchResult {
  id: string
  title: string
  tags: string[]
  created_at: string | null
}

export function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results ?? [])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const isEmpty = query.trim() && !loading && results.length === 0

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[#0a0a0a]/95 backdrop-blur-2xl">

      {/* 결과 영역 */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 pt-24">
        {/* 초기 상태 or 빈 결과 */}
        {(!query.trim() || isEmpty) && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Search
              className="h-11 w-11 text-foreground-subtle"
              strokeWidth={1.3}
            />
            {isEmpty ? (
              <>
                <p className="text-[17px] font-semibold text-foreground">검색 결과가 없습니다</p>
                <p className="text-[13px] text-foreground-muted">등록된 항목이 없습니다.</p>
              </>
            ) : (
              <p className="text-[13px] text-foreground-muted">검색어를 입력하세요</p>
            )}
          </div>
        )}

        {/* 결과 목록 */}
        {results.length > 0 && (
          <div className="w-full max-w-2xl space-y-2 overflow-y-auto pb-6">
            {results.map((r) => (
              <Link
                key={r.id}
                href={`/posts/${r.id}`}
                onClick={onClose}
                className="block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                <p className="text-[15px] font-semibold text-foreground">{r.title}</p>
                {r.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {r.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-foreground-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 하단 검색 입력 */}
      <div className="border-t border-white/[0.08] px-6 py-5">
        <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-2xl border border-brand/30 bg-white/[0.03] px-5 py-3.5 focus-within:border-brand/60 transition-colors duration-200">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-foreground-subtle outline-none"
          />
          <button
            className="shrink-0 rounded-xl bg-foreground px-4 py-2 text-[13px] font-semibold text-background transition-opacity hover:opacity-80"
          >
            AI 검색
          </button>
        </div>
      </div>
    </div>
  )
}
