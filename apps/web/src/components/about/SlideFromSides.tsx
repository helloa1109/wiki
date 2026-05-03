'use client'

import { useEffect, useRef, useState } from 'react'

const LEFT_CARDS = [
  {
    id: 1,
    bg: 'bg-gradient-to-br from-slate-100 to-blue-100',
    title: 'UX Research',
    sub: '사용자 인터뷰 & 여정 지도',
    dark: false,
  },
  {
    id: 2,
    bg: 'bg-gradient-to-br from-rose-400 to-pink-600',
    title: 'UI Planning',
    sub: '와이어프레임 & 프로토타입',
    dark: true,
  },
]

const RIGHT_CARDS = [
  {
    id: 3,
    bg: 'bg-gradient-to-br from-[#1a1028] to-[#2d1f4a]',
    title: 'Design Note',
    sub: '인사이트와 영감의 기록',
    dark: true,
    accent: '#c084fc',
  },
  {
    id: 4,
    bg: 'bg-gradient-to-br from-[#0f1923] to-[#1e3a5f]',
    title: 'Retrospect',
    sub: '프로젝트 종료 후 회고',
    dark: true,
    accent: '#38bdf8',
  },
]

export function SlideFromSides() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // disconnect 하지 않아 스크롤 역방향 시 되돌아감
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) setVisible(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative overflow-hidden py-28">
      <div className="flex items-center justify-between">

        {/* 왼쪽 카드 그룹 */}
        <div
          className="flex shrink-0 gap-3"
          style={{
            transform: visible ? 'translateX(0)' : 'translateX(-110%)',
            transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {LEFT_CARDS.map((card) => (
            <div
              key={card.id}
              className={`relative flex h-[260px] w-[180px] shrink-0 flex-col justify-end overflow-hidden rounded-2xl p-5 ${card.bg}`}
            >
              <p className={`text-[11px] font-medium uppercase tracking-widest ${card.dark ? 'text-white/50' : 'text-black/40'}`}>
                {card.sub}
              </p>
              <p className={`mt-1 text-[17px] font-bold tracking-tight ${card.dark ? 'text-white' : 'text-gray-900'}`}>
                {card.title}
              </p>
            </div>
          ))}
        </div>

        {/* 중앙 텍스트 — 양쪽 여백 확보 */}
        <div
          className="flex flex-1 flex-col items-center justify-center gap-3 px-24 text-center max-md:px-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            transitionDelay: visible ? '250ms' : '0ms',
          }}
        >
          <p className="text-[11px] uppercase tracking-[0.14em] text-foreground-subtle">Our Works</p>
          <p className="text-[clamp(18px,2.2vw,28px)] font-bold leading-tight tracking-tight text-foreground">
            기록이 쌓일수록<br />더 선명해지는 방향
          </p>
        </div>

        {/* 오른쪽 카드 그룹 */}
        <div
          className="flex shrink-0 gap-3"
          style={{
            transform: visible ? 'translateX(0)' : 'translateX(110%)',
            transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {RIGHT_CARDS.map((card) => (
            <div
              key={card.id}
              className={`relative flex h-[260px] w-[180px] shrink-0 flex-col justify-end overflow-hidden rounded-2xl p-5 ${card.bg}`}
            >
              {card.accent && (
                <div
                  className="absolute left-1/2 top-8 h-20 w-20 -translate-x-1/2 rounded-full blur-[30px]"
                  style={{ backgroundColor: card.accent, opacity: 0.35 }}
                />
              )}
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
                {card.sub}
              </p>
              <p className="mt-1 text-[17px] font-bold tracking-tight text-white">
                {card.title}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
