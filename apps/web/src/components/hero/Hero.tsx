import { HeroBlobs } from "./HeroBlobs";
import { HeroEyebrow } from "./HeroEyebrow";
import { HeroTitle } from "./HeroTitle";
import { HeroActions } from "./HeroActions";
import { HeroMarker } from "./HeroMarker";

/**
 * 메인(/) 페이지의 히어로 섹션.
 *
 * 레이아웃:
 *   ─ HeroBlobs (z=0, 배경 메시 그라디언트)
 *   ─ 콘텐츠 (z=2, 좌측 정렬)
 *       ─ HeroEyebrow
 *       ─ HeroTitle (단어 stagger reveal)
 *       ─ Subtitle
 *       ─ HeroActions (Magnetic + Ghost)
 *   ─ HeroMarker (z=3, 비대칭 보조 마커)
 *
 * Server Component. 인터랙션은 MagneticButton 만 leaf 로 분리.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden px-10 pb-20 pt-[140px] max-md:px-6 max-md:pb-24 max-md:pt-[120px]">
      <HeroBlobs />

      <div className="relative z-[2] mx-auto w-full max-w-[1280px]">
        <div className="mx-auto max-w-[880px] text-center">
          <HeroEyebrow />
          <HeroTitle />

          <p
            className="mx-auto mb-12 max-w-[540px] text-[clamp(15px,1.4vw,18px)] leading-[1.65] text-foreground-muted opacity-0 animate-fade-up"
            style={{ animationDelay: "1000ms" }}
          >
            UI/UX 기획자가 남기는 작업 회고와 디자인 노트.
            <br />
            오래 걸려 정리한 것들이 천천히 쌓이는 공간입니다.
          </p>

          <div className="flex justify-center">
            <HeroActions />
          </div>
        </div>
      </div>

      <HeroMarker />
    </section>
  );
}