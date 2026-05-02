"use client";

import { useEffect, useState } from "react";

/**
 * 페이지가 임계값 이상 스크롤됐는지 추적하는 훅.
 *
 * @param threshold - 스크롤 픽셀 임계값 (기본 32px)
 * @returns scrolled boolean
 */
export function useScrolled(threshold = 32): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > threshold);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}