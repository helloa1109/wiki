import { cn } from "@/lib/utils";

interface Word {
  text: string;
  /** 진입 애니메이션 delay (ms) */
  delay: number;
  /** 이 단어 앞에 줄바꿈 */
  breakBefore?: boolean;
  /** 이탤릭 세리프 강조 */
  accent?: boolean;
}

const WORDS: Word[] = [
  { text: "기획하고,", delay: 360 },
  { text: "만들고,", delay: 480, accent: true },
  { text: "함께", delay: 660, breakBefore: true },
  { text: "기록하는", delay: 760 },
  { text: "팀.", delay: 880, accent: true },
];

/**
 * Hero 메인 타이틀.
 * 단어별로 80ms 간격 stagger reveal (CSS 애니메이션 + animation-delay).
 * 강조어는 Newsreader 이탤릭 세리프 + 브랜드 컬러로 에디토리얼 포인트.
 *
 * Server Component — 애니메이션은 마운트시 자동 실행.
 */
export function HeroTitle() {
  return (
    <h1 className="mb-9 text-[clamp(48px,9vw,124px)] font-extrabold leading-[0.95] tracking-[-0.045em] text-foreground">
      {WORDS.map((w, i) => (
        <span key={i}>
          {w.breakBefore && <br />}
          <span
            className={cn(
              "inline-block opacity-0 translate-y-[60%] animate-word-reveal",
              w.accent &&
                "font-serif italic font-medium text-brand tracking-[-0.02em] pr-[0.05em]"
            )}
            style={{ animationDelay: `${w.delay}ms` }}
          >
            {w.text}
          </span>
          {!w.accent && " "}
        </span>
      ))}
    </h1>
  );
}