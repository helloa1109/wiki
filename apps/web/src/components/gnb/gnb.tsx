'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import styles from './gnb.module.css'

const NAV_ITEMS = [
  { label: 'Posts', href: '/posts' },
  { label: 'About', href: '/about' },
  { label: 'Works', href: '/works' },
  { label: 'Notes', href: '/notes', mobileHide: true },
]

export default function Gnb() {
  const navRef = useRef<HTMLElement>(null)
  
  // 원래 코드처럼 width, height, left를 모두 관리합니다.
  const [indicator, setIndicator] = useState({
    width: 0,
    height: 0,
    left: 0,
    isHovered: false,
  })

  const handleEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navRef.current) return

    const navRect = navRef.current.getBoundingClientRect()
    const rect = e.currentTarget.getBoundingClientRect()

    setIndicator({
      width: rect.width,
      height: rect.height, // height 복구
      left: rect.left - navRect.left, // 원래 방식대로 left 사용
      isHovered: true,
    })
  }

  const handleLeave = () => {
    setIndicator((prev) => ({ ...prev, isHovered: false }))
  }

  return (
    <header className={styles.gnb}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark} />
            DBC
        </Link>

        <nav
          ref={navRef}
          className={`${styles.nav} ${indicator.isHovered ? styles.hasIndicator : ''}`.trim()}
          onMouseLeave={handleLeave}
        >
          <span 
            className={styles.indicator} 
            style={{
              width: `${indicator.width}px`,
              height: `${indicator.height}px`,
              left: `${indicator.left}px`,
            }}
          />

          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.label}
              href={item.href}
              onMouseEnter={handleEnter}
              className={`${styles.navItem} ${item.mobileHide ? styles.mobileHide : ''}`.trim()}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}