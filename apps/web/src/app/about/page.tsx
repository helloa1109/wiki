import { GNB } from '@/components/layout/GNB'
import { GrainOverlay } from '@/components/effects/GrainOverlay'
import { CursorSpotlight } from '@/components/effects/CursorSpotlight'
import { FadeUp } from '@/components/about/FadeUp'
import { SlideFromSides } from '@/components/about/SlideFromSides'
import { BloomHero } from './_components/BloomHero'
import { HorizontalWorks } from './_components/HorizontalWorks'
import Link from 'next/link'

export const metadata = {
  title: 'About | Team DBC',
  description: 'DBC는 UI/UX 기획자들이 모여 만든 팀입니다.',
}

const VALUES = [
  {
    num: '01',
    title: '기록이 곧 설계다',
    desc: '생각을 글로 옮기는 순간, 흐릿한 아이디어가 명확한 방향이 됩니다. 우리는 매 작업을 기록하며 더 나은 다음을 준비합니다.',
  },
  {
    num: '02',
    title: '사용자의 맥락을 먼저',
    desc: '기능보다 흐름을, 화면보다 경험을 먼저 생각합니다. 사용자가 어떤 상황에서 무엇을 필요로 하는지가 우리의 출발점입니다.',
  },
  {
    num: '03',
    title: '함께 만드는 깊이',
    desc: '각자의 시선이 모일 때 더 입체적인 해답이 나옵니다. DBC는 개인의 성장과 팀의 시너지를 함께 추구합니다.',
  },
]

const WHAT_WE_DO = [
  { label: 'UX 리서치', desc: '사용자 인터뷰, 여정 지도, 페인포인트 분석' },
  { label: 'UI 기획', desc: '와이어프레임, 플로우 설계, 프로토타이핑' },
  { label: '작업 회고', desc: '프로젝트 종료 후 배움을 글로 정리하고 공유' },
  { label: '디자인 노트', desc: '영감을 주는 디자인 사례와 인사이트 기록' },
]

export default function AboutPage() {
  return (
    <>
      <CursorSpotlight />
      <GNB />
      <main className="overflow-hidden">

        {/* ── Bloom Hero ───────────────────────────── */}
        <BloomHero />

        {/* ── Hero ─────────────────────────────────── */}
        <section className="relative flex min-h-[100dvh] flex-col items-start justify-end px-10 pb-24 pt-[140px] max-md:px-6">
          {/* 배경 그라디언트 블롭 */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute left-[-10%] top-[20%] h-[600px] w-[600px] rounded-full bg-brand/[0.04] blur-[120px]" />
            <div className="absolute right-[-5%] top-[40%] h-[400px] w-[400px] rounded-full bg-brand/[0.03] blur-[100px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl w-full">
            <p
              className="mb-6 text-[13px] font-medium uppercase tracking-[0.14em] text-brand opacity-0 animate-fade-up"
              style={{ animationDelay: '200ms' }}
            >
              Team DBC
            </p>
            <h1
              className="text-[clamp(40px,7vw,96px)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground opacity-0 animate-fade-up"
              style={{ animationDelay: '400ms' }}
            >
              우리는<br />
              경험을<br />
              <span className="text-brand">설계합니다.</span>
            </h1>
            <p
              className="mt-8 max-w-[480px] text-[clamp(15px,1.4vw,18px)] leading-[1.7] text-foreground-muted opacity-0 animate-fade-up"
              style={{ animationDelay: '700ms' }}
            >
              DBC는 UI/UX 기획자들이 모여 만든 팀입니다.
              작업을 기록하고, 경험을 나누며,
              더 나은 사용자 경험을 함께 만들어갑니다.
            </p>
          </div>

          {/* 스크롤 힌트 */}
          <div
            className="absolute bottom-10 left-10 flex items-center gap-3 opacity-0 animate-fade-up max-md:left-6"
            style={{ animationDelay: '1100ms' }}
          >
            <div className="h-[1px] w-10 bg-white/20" />
            <span className="text-[11px] uppercase tracking-[0.12em] text-foreground-subtle">Scroll</span>
          </div>
        </section>

        {/* ── DBC 의미 ──────────────────────────────── */}
        <section className="px-10 py-32 max-md:px-6">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <p className="mb-16 text-[11px] uppercase tracking-[0.14em] text-foreground-subtle">
                What is DBC
              </p>
            </FadeUp>

            <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1 max-md:gap-12">
              {[
                { letter: 'D', word: 'Design', desc: '사용자의 맥락에서 시작하는 설계. 기능이 아닌 경험을 디자인합니다.' },
                { letter: 'B', word: 'Build', desc: '아이디어를 실제로 구체화하는 과정. 기록과 반복을 통해 완성합니다.' },
                { letter: 'C', word: 'Connect', desc: '팀 간, 사용자 간, 아이디어 간의 연결. 함께할 때 더 강해집니다.' },
              ].map((item, i) => (
                <FadeUp key={item.letter} delay={i * 120}>
                  <div className="group">
                    <div className="mb-5 flex items-baseline gap-3">
                      <span className="font-serif text-[clamp(52px,6vw,80px)] font-bold leading-none tracking-[-0.04em] text-brand/60 transition-colors duration-300 group-hover:text-brand">
                        {item.letter}
                      </span>
                      <span className="text-[14px] font-medium text-foreground-muted">
                        {item.word}
                      </span>
                    </div>
                    <p className="text-[14px] leading-[1.7] text-foreground-subtle">
                      {item.desc}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── 슬라이드 작업물 ───────────────────────── */}
        <SlideFromSides />

        {/* ── 구분선 ────────────────────────────────── */}
        <div className="mx-10 border-t border-white/[0.06] max-md:mx-6" />

        {/* ── 가로 스크롤 갤러리 ────────────────────── */}
        <HorizontalWorks />

        {/* ── 우리의 가치관 ─────────────────────────── */}
        <section className="px-10 py-32 max-md:px-6">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <p className="mb-16 text-[11px] uppercase tracking-[0.14em] text-foreground-subtle">
                Our Values
              </p>
            </FadeUp>

            <div className="flex flex-col gap-0">
              {VALUES.map((value, i) => (
                <FadeUp key={value.num} delay={i * 100}>
                  <div className="group flex gap-10 border-t border-white/[0.06] py-10 transition-colors duration-300 hover:border-white/[0.12] max-md:flex-col max-md:gap-4">
                    <span className="w-10 shrink-0 text-[13px] font-mono text-foreground-subtle transition-colors group-hover:text-brand">
                      {value.num}
                    </span>
                    <div>
                      <h3 className="mb-3 text-[18px] font-semibold tracking-tight text-foreground">
                        {value.title}
                      </h3>
                      <p className="max-w-[560px] text-[14px] leading-[1.75] text-foreground-muted">
                        {value.desc}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
              <div className="border-t border-white/[0.06]" />
            </div>
          </div>
        </section>

        {/* ── 무엇을 하는가 ─────────────────────────── */}
        <section className="px-10 py-32 max-md:px-6">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <p className="mb-16 text-[11px] uppercase tracking-[0.14em] text-foreground-subtle">
                What We Do
              </p>
            </FadeUp>

            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              {WHAT_WE_DO.map((item, i) => (
                <FadeUp key={item.label} delay={i * 80}>
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.04]">
                    <h3 className="mb-2 text-[15px] font-semibold text-foreground">
                      {item.label}
                    </h3>
                    <p className="text-[13px] leading-[1.65] text-foreground-muted">
                      {item.desc}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────── */}
        <section className="px-10 pb-40 max-md:px-6">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] px-12 py-16 text-center max-md:px-8 max-md:py-12">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.04] blur-[80px]" />
                </div>
                <p className="relative mb-3 text-[12px] uppercase tracking-[0.14em] text-foreground-subtle">
                  기록을 만나보세요
                </p>
                <h2 className="relative mb-8 text-[clamp(24px,3.5vw,40px)] font-bold tracking-tight text-foreground">
                  오래 걸려 정리한 것들이<br />
                  천천히 쌓이는 공간
                </h2>
                <Link
                  href="/posts"
                  className="relative inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-[14px] font-semibold text-background transition-opacity hover:opacity-80"
                >
                  Posts 보러가기
                  <span>→</span>
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>

      </main>
      <GrainOverlay />
    </>
  )
}
