'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './PageChrome.module.css'

export function PageChrome() {
  const [progress, setProgress] = useState(0)
  const tickingRef = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
        setProgress(p)
        tickingRef.current = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className={styles.progress} aria-hidden="true">
        <span className={styles.progressLabel}>scroll</span>
        <span className={styles.progressNumber}>
          {String(Math.round(progress * 100)).padStart(3, '0')}
          <span className={styles.progressPct}>%</span>
        </span>
      </div>

      <a className={styles.contact} href="mailto:hello@dbc.team">
        <span>Contact</span>
        <span className={styles.contactArrow}>→</span>
      </a>
    </>
  )
}
