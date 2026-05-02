"use client";

import { useCursorSpotlight } from "@/lib/hooks/useCursorSpotlight";

/**
 * 페이지 전역 커서 스포트라이트.
 * `cursor-spotlight` 클래스의 라디얼 그라디언트가 마우스 좌표를 따라감.
 * z-index 1 (블롭 위, 콘텐츠 아래).
 */
export function CursorSpotlight() {
  const ref = useCursorSpotlight<HTMLDivElement>();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="cursor-spotlight pointer-events-none fixed inset-0 z-[1]"
    />
  );
}