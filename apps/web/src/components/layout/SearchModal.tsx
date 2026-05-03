'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, FileText } from 'lucide-react'
import Link from 'next/link'

interface SearchResult {
  id: string
  title: string
  tags: string[]
  created_at: string | null
}

interface SearchModalProps {
  visible: boolean
  onClose: () => void
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-transparent text-brand font-semibold">{part}</mark>
      : part
  )
}

export function SearchModal({ visible, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (visible) {
      inputRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [visible])

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

  const hasQuery = query.trim().length > 0
  const isEmpty = hasQuery && !loading && results.length === 0

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col"
      style={{
        backgroundColor: `rgba(10,10,10,${visible ? 0.95 : 0})`,
        backdropFilter: `blur(${visible ? 24 : 0}px)`,
        transition: 'background-color 300ms ease, backdrop-filter 300ms ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* 결과 영역 */}
      <div
        className="flex flex-1 flex-col items-center px-6 pt-28 overflow-y-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 300ms ease, transform 300ms ease',
          transitionDelay: visible ? '60ms' : '0ms',
        }}
      >
        <div className="w-full max-w-2xl">

          {/* 초기 빈 상태 */}
          {!hasQuery && (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <Search className="h-9 w-9 text-white/10" strokeWidth={1.2} />
              <p className="text-[13px] text-foreground-subtle">제목 또는 내용으로 검색하세요</p>
            </div>
          )}

          {/* 로딩 */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
            </div>
          )}

          {/* 검색 결과 없음 */}
          {isEmpty && (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <Search className="h-9 w-9 text-white/10" strokeWidth={1.2} />
              <p className="text-[15px] font-medium text-foreground">검색 결과가 없습니다</p>
              <p className="text-[13px] text-foreground-subtle">
                &apos;{query}&apos;에 대한 결과를 찾지 못했습니다
              </p>
            </div>
          )}

          {/* 결과 목록 */}
          {!loading && results.length > 0 && (
            <>
              <p className="mb-4 text-[11px] uppercase tracking-[0.12em] text-foreground-subtle">
                {results.length}개의 결과
              </p>
              <ul className="divide-y divide-white/[0.05]">
                {results.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/posts/${r.id}`}
                      onClick={onClose}
                      className="group flex items-start gap-4 py-4 transition-colors duration-150 hover:text-foreground"
                    >
                      <FileText
                        className="mt-0.5 h-4 w-4 shrink-0 text-white/20 transition-colors group-hover:text-brand/60"
                        strokeWidth={1.5}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-[15px] font-medium text-foreground leading-snug group-hover:text-white transition-colors">
                          {highlight(r.title, query)}
                        </p>
                        {r.tags.length > 0 && (
                          <p className="mt-1.5 text-[12px] text-foreground-subtle">
                            {r.tags.join(' · ')}
                          </p>
                        )}
                      </div>
                      {r.created_at && (
                        <span className="shrink-0 text-[12px] text-foreground-subtle">
                          {new Date(r.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

        </div>
      </div>

      {/* 하단 입력창 */}
      <div
        className="border-t border-white/[0.06] px-6 py-5"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 300ms ease, transform 300ms cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: visible ? '40ms' : '0ms',
        }}
      >
        <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-3.5 transition-colors duration-200 focus-within:border-brand/40">
          <Search className="h-4 w-4 shrink-0 text-foreground-subtle" strokeWidth={1.6} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-foreground-subtle"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="shrink-0 text-[12px] text-foreground-subtle hover:text-foreground transition-colors"
            >
              지우기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
