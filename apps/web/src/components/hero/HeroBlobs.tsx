/**
 * Hero 배경의 메시 그라디언트 블롭 2개.
 * - blob-a: 우하단 오렌지 (브랜드 컬러), 22초 주기
 * - blob-b: 좌상단 쿨톤 블루, 28초 주기 (대비 만들기)
 *
 * filter: blur(90px) 으로 부드럽게, will-change 로 컴포지팅 강제.
 * Server Component (CSS 애니메이션만 사용).
 */
export function HeroBlobs() {
    return (
      <>
        {/* 좌상단 쿨톤 (대비) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[200px] -left-[150px] z-0 h-[700px] w-[700px] animate-blob-b will-change-transform"
          style={{
            background:
              "radial-gradient(circle at center, rgba(60,90,180,0.18) 0%, rgba(60,90,180,0.06) 35%, transparent 65%)",
            filter: "blur(90px)",
          }}
        />
        {/* 우하단 브랜드 (메인) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[350px] -right-[200px] z-0 h-[900px] w-[900px] animate-blob-a will-change-transform"
          style={{
            background:
              "radial-gradient(circle at center, hsl(var(--brand) / 0.35) 0%, hsl(var(--brand) / 0.15) 30%, transparent 60%)",
            filter: "blur(90px)",
          }}
        />
      </>
    );
  }