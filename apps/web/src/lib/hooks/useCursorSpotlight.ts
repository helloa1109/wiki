"use client";

import { useEffect, useRef } from "react";

/**
 * 커서 스포트라이트 위치 추적 훅.
 *
 * 마우스 좌표를 lerp 보간으로 부드럽게 따라가도록 CSS 변수
 * (--mx, --my) 를 element 에 직접 설정. setState 를 쓰지 않아
 * React 리렌더링이 발생하지 않음 (성능 안전).
 *
 * @returns 스포트라이트 element 에 부착할 ref
 */
export function useCursorSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight * 0.3;
    let tx = mx;
    let ty = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const tick = () => {
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      el.style.setProperty("--mx", `${tx}px`);
      el.style.setProperty("--my", `${ty}px`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    tick();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}