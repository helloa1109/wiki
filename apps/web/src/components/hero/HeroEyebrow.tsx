/**
 * Hero 상단 eyebrow 라벨.
 * 좌측에 펄스링 애니메이션 도트, 우측에 모노 폰트 라벨.
 *
 * Server Component — fade-up 진입 애니메이션은 CSS 만 사용.
 */
export function HeroEyebrow() {
    return (
      <div
        className="mb-9 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] py-[7px] pl-3 pr-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-foreground-muted opacity-0 animate-fade-up"
        style={{ animationDelay: "200ms" }}
      >
        <span aria-hidden="true" className="relative h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-brand" />
          <span className="absolute -inset-1 rounded-full bg-brand opacity-30 animate-pulse-ring" />
        </span>
        Personal Blog · Notes &amp; Logs
      </div>
    );
  }