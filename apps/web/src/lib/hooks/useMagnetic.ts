"use client";

import { useEffect, useRef, type RefObject } from "react";

interface UseMagneticOptions {
  /** 끌어당기는 강도 (0-1, 기본 0.32) */
  strength?: number;
  /** 효과가 시작되는 반경 (px, 기본 100) */
  radius?: number;
  /** 보간 감쇠 계수 (0-1, 기본 0.18) */
  damping?: number;
}

/**
 * 마그네틱 호버 효과 훅.
 *
 * 커서가 element 근처에 오면 element 가 커서 방향으로 살짝 끌려옴.
 * setState 를 쓰지 않고 ref 의 transform 을 직접 조작하여 리렌더 없음.
 * touch device 에서는 자동 비활성화.
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>({
  strength = 0.32,
  radius = 100,
  damping = 0.18,
}: UseMagneticOptions = {}): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // touch device 는 hover 가 없으므로 효과 비활성
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let bx = 0;
    let by = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius * 1.5) {
        tx = dx * strength;
        ty = dy * strength;
      }
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
    };

    const tick = () => {
      bx += (tx - bx) * damping;
      by += (ty - by) * damping;
      el.style.transform = `translate(${bx.toFixed(2)}px, ${by.toFixed(2)}px)`;
      raf = requestAnimationFrame(tick);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    tick();

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength, radius, damping]);

  return ref;
}