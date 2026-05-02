'use client'
import { useEffect, useRef } from 'react'

export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mx = window.innerWidth / 2
    let my = window.innerHeight * 0.3
    let tx = mx, ty = my

    const move = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }

    window.addEventListener('mousemove', move)

    const tick = () => {
      tx += (mx - tx) * 0.12
      ty += (my - ty) * 0.12

      ref.current?.style.setProperty('--mx', `${tx}px`)
      ref.current?.style.setProperty('--my', `${ty}px`)

      requestAnimationFrame(tick)
    }

    tick()

    return () => window.removeEventListener('mousemove', move)
  }, [])

  return <div ref={ref} className="spotlight" />
}