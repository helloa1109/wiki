/**
 * Hero 비대칭 보조 마커들.
 * - 우측 중앙 세로 텍스트 (writing-mode: vertical-rl) — 데스크톱 전용
 * - 우하단 "Currently writing" 라벨 + 흐르는 스크롤 라인
 *
 * Server Component — 모두 CSS 애니메이션.
 */
export function HeroMarker() {
    return (
      <>
        {/* 우측 세로 마커 (≥ lg) */}
        <div
          aria-hidden="true"
          className="absolute right-12 top-1/2 z-[3] -translate-y-1/2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-foreground-subtle opacity-0 animate-fade-up max-lg:hidden"
          style={{
            writingMode: "vertical-rl",
            animationDelay: "1600ms",
          }}
        >
          SCROLL — 28 POSTS · 2024 → 2026
        </div>
  
        {/* 우하단 마커 */}
        <div
          aria-hidden="true"
          className="absolute bottom-12 right-12 z-[3] flex flex-col items-end gap-3 opacity-0 animate-fade-up max-md:bottom-8 max-md:right-6"
          style={{ animationDelay: "1400ms" }}
        >
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-foreground-subtle">
            Currently writing
          </span>
          <span className="relative h-14 w-px overflow-hidden bg-gradient-to-b from-transparent to-white/[0.16]">
            <span className="absolute -top-[30%] left-0 h-[30%] w-full bg-gradient-to-b from-transparent to-foreground animate-scroll-line" />
          </span>
        </div>
      </>
    );
  }