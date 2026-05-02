import { GrainOverlay } from "@/components/effects/GrainOverlay";
import { CursorSpotlight } from "@/components/effects/CursorSpotlight";
import { GNB } from "@/components/layout/GNB";
;

/**
 * 메인 (/) 페이지.
 *
 * 레이어 z-index:
 *   0    Hero blobs (배경)
 *   1    CursorSpotlight (커서 글로우)
 *   2    Hero content
 *   3    HeroMarker (보조 데코)
 *   50   GNB (sticky)
 *   100  GrainOverlay (전역 그레인)
 *
 * Server Component. 인터랙션 컴포넌트만 leaf 로 'use client'.
 */
export default function Page() {
  return (
    <>
      <CursorSpotlight />
      <GNB />
      {/* <main>
        <Hero />
      </main> */}
      <GrainOverlay />
    </>
  );
}