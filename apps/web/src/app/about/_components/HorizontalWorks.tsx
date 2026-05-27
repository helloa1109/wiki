'use client'

import { useEffect, useRef } from 'react'
import styles from './HorizontalWorks.module.css'

const works = [
  { num: '01', title: 'Liquid Bloom',     tag: 'Generative · Blender · 2026', art: styles.art1 },
  { num: '02', title: 'Tidal Garden',     tag: 'WebGL · TouchDesigner · 2025', art: styles.art2 },
  { num: '03', title: 'Coral Drift',      tag: 'Midjourney · Runway · 2025',   art: styles.art3 },
  { num: '04', title: 'Aurora Spin',      tag: 'Shader · GLSL · 2025',         art: styles.art4 },
  { num: '05', title: 'Meadow Sequence',  tag: 'Blender · Nano Banana · 2024', art: styles.art5 },
]

export function HorizontalWorks() {
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isMobile =
      window.matchMedia('(max-width: 768px)').matches ||
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (isMobile) return

    const pin = pinRef.current
    const track = trackRef.current
    const progressBar = progressRef.current
    if (!pin || !track) return

    let gsapInstance: typeof import('gsap')['default'] | null = null
    let ScrollTriggerInstance: typeof import('gsap/ScrollTrigger')['ScrollTrigger'] | null = null

    async function init() {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      gsap.registerPlugin(ScrollTrigger)
      gsapInstance = gsap
      ScrollTriggerInstance = ScrollTrigger

      const getDistance = () => Math.max(0, track!.scrollWidth - window.innerWidth)

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => '+=' + getDistance(),
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressBar) progressBar.style.width = `${self.progress * 100}%`
          },
        },
      })

      window.addEventListener('load', () =>
        setTimeout(() => ScrollTrigger.refresh(), 200)
      )
    }

    init()

    return () => {
      ScrollTriggerInstance?.getAll().forEach((st) => st.kill())
    }
  }, [])

  return (
    <section className={styles.section}>
      <div ref={pinRef} className={styles.pin}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Selected Works · 05</p>
            <p className={styles.title}>
              <em>Recent fragments<br />from the garden.</em>
            </p>
          </div>
          <div className={styles.headerSide}>
            Scroll to explore<br />
            <span style={{ opacity: 0.55 }}>↓ becomes →</span>
          </div>
        </div>

        <div ref={trackRef} className={styles.track}>
          {works.map((w) => (
            <article key={w.num} className={styles.card}>
              <div className={`${styles.cardArt} ${w.art}`} />
              <div className={styles.cardMeta}>
                <p className={styles.cardNum}>{w.num} / 05</p>
                <p className={styles.cardTitle}><em>{w.title}</em></p>
                <p className={styles.cardTag}>{w.tag}</p>
              </div>
            </article>
          ))}
        </div>

        <p className={styles.hint}>Horizontal scroll</p>
        <div className={styles.progress}>
          <div ref={progressRef} className={styles.progressBar} />
        </div>
      </div>
    </section>
  )
}
