'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Horizontalworks.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const WORKS = [
  {
    n: '01',
    title: 'Liquid Bloom',
    tag: 'Generative · 2025',
    desc: '셰이더 기반 유체 시뮬레이션과 GSAP 타임라인을 결합한 인터랙티브 히어로.',
    src: 'https://images.unsplash.com/photo-1561070791-2526d30994b8?w=800&q=80',
  },
  {
    n: '02',
    title: 'Tidal Garden',
    tag: 'WebGL · 2025',
    desc: '스크롤 위치에 반응해 파도처럼 흐르는 식물 모티프 데모.',
    src: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800&q=80',
  },
  {
    n: '03',
    title: 'Coral Drift',
    tag: 'Three.js · 2024',
    desc: '커서를 따라 자라나는 산호 구조의 3D 환경.',
    src: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80',
  },
  {
    n: '04',
    title: 'Aurora Spin',
    tag: 'Canvas · 2024',
    desc: '북극광에서 영감 받은 입자 시스템과 회전 파라미터 컨트롤.',
    src: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=800&q=80',
  },
  {
    n: '05',
    title: 'Meadow Sequence',
    tag: 'Generative · 2024',
    desc: '바람의 결을 따라 흐르는 풀밭의 생성형 시퀀스.',
    src: 'https://images.unsplash.com/photo-1545665277-5937489579f2?w=800&q=80',
  },
] as const

export function HorizontalWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLSpanElement>(null)
  const progressNumRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const isMobile =
      window.matchMedia('(max-width: 768px)').matches ||
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) return

    const ctx = gsap.context(() => {
      const totalScroll = track.scrollWidth - window.innerWidth

      const tween = gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${p * 100}%`
            }
            if (progressNumRef.current) {
              const idx = Math.min(WORKS.length, Math.max(1, Math.ceil(p * WORKS.length)))
              progressNumRef.current.textContent = String(idx).padStart(2, '0')
            }
          },
        },
      })

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Recent Works</span>
        <h2>
          정원에서 피어난 <em>최근 작업들</em>.
        </h2>
      </div>

      <div ref={trackRef} className={styles.track}>
        {WORKS.map((w) => (
          <article key={w.n} className={styles.card}>
            <div className={styles.cardMedia}>
              <Image
                src={w.src}
                alt={w.title}
                fill
                sizes="(max-width: 768px) 100vw, 520px"
              />
            </div>
            <div className={styles.cardMeta}>
              <div className={styles.cardN}>{w.n}</div>
              <div className={styles.cardTitle}>{w.title}</div>
              <div className={styles.cardTag}>{w.tag}</div>
              <p className={styles.cardDesc}>{w.desc}</p>
              <a className={styles.cardArrow} href="#" aria-label={`${w.title} 자세히 보기`}>
                →
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.progress} aria-hidden="true">
        <span ref={progressNumRef} className={styles.progressN}>01</span>
        <span className={styles.progressTrack}>
          <span ref={progressBarRef} className={styles.progressBar} />
        </span>
        <span className={styles.progressTotal}>0{WORKS.length}</span>
      </div>
    </section>
  )
}
