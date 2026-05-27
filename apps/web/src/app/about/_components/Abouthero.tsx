'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './AboutHero.module.css'

const THUMBS = [
  { src: 'https://images.unsplash.com/photo-1545665277-5937489579f2?w=560&q=80', cls: 'thumb1' },
  { src: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=720&q=80', cls: 'thumb2' },
  { src: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=480&q=80', cls: 'thumb3' },
  { src: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=640&q=80', cls: 'thumb4' },
  { src: 'https://images.unsplash.com/photo-1561070791-2526d30994b8?w=440&q=80', cls: 'thumb5' },
  { src: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=560&q=80', cls: 'thumb6' },
  { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80', cls: 'thumb7' },
] as const

const ROTATIONS = [-8, 6, 12, -4, -10, 8, -6] as const
const DEPTHS = [0.4, 0.6, 0.8, 0.5, 0.3, 0.7, 0.55] as const

export function AboutHero() {
  const heroRef = useRef<HTMLElement>(null)
  const thumbsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const isMobile =
      window.matchMedia('(max-width: 768px)').matches ||
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) return

    let rafId = 0
    let tx = 0, ty = 0, cx = 0, cy = 0
    let needsUpdate = false

    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect()
      tx = (e.clientX - rect.left) / rect.width - 0.5
      ty = (e.clientY - rect.top) / rect.height - 0.5
      needsUpdate = true
    }

    const tick = () => {
      if (needsUpdate) {
        cx += (tx - cx) * 0.08
        cy += (ty - cy) * 0.08
        thumbsRef.current.forEach((t, i) => {
          if (!t) return
          const d = DEPTHS[i] ?? 0.5
          const rot = ROTATIONS[i] ?? 0
          const x = cx * 50 * d
          const y = cy * 30 * d
          t.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`
        })
        if (Math.abs(tx - cx) < 0.001 && Math.abs(ty - cy) < 0.001) needsUpdate = false
      }
      rafId = requestAnimationFrame(tick)
    }

    hero.addEventListener('mousemove', onMove)
    tick()

    return () => {
      hero.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section ref={heroRef} className={styles.hero}>
      <div className={styles.collage} aria-hidden="true">
        {THUMBS.map((t, i) => (
          <div
            key={t.cls}
            ref={(el) => {
              if (el) thumbsRef.current[i] = el
            }}
            className={`${styles.thumb} ${styles[t.cls]}`}
          >
            <Image
              src={t.src}
              alt=""
              fill
              sizes="(max-width: 768px) 130px, 360px"
              priority={i < 4}
            />
          </div>
        ))}
      </div>

      <h1 className={styles.mark} aria-label="DBC">dbc</h1>

      <p className={styles.caption}>
        <mark>DBC는 기획하고, 만들고, 함께 기록하는</mark> 팀입니다.
      </p>
    </section>
  )
}
