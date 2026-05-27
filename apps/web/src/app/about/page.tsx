import { GNB } from '@/components/layout/GNB'
import { GrainOverlay } from '@/components/effects/GrainOverlay'
import { CursorSpotlight } from '@/components/effects/CursorSpotlight'
import { BloomHero } from './_components/BloomHero'
import { HorizontalWorks } from './_components/HorizontalWorks'

export const metadata = {
  title: 'About | Team DBC',
  description: 'DBC는 UI/UX 기획자들이 모여 만든 팀입니다.',
}

export default function AboutPage() {
  return (
    <>
      <CursorSpotlight />
      <GNB />
      <main>
        <BloomHero />
        <HorizontalWorks />

        {/* ── Outro / Footer ──────────────────────── */}
        <footer
          style={{
            background: 'linear-gradient(180deg, #0d0c18 0%, #050410 100%)',
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6rem 3rem',
            textAlign: 'center',
            gap: '2rem',
            color: 'white',
            position: 'relative',
            zIndex: 5,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-fraunces), Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(2.4rem, 5vw, 4.6rem)',
              letterSpacing: '-0.03em',
              maxWidth: '16ch',
              lineHeight: 1.05,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(180,160,220,0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            <em>More works,<br />still blooming.</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', maxWidth: '38ch', lineHeight: 1.65 }}>
            기록이 쌓일수록 더 선명해지는 방향.<br />
            DBC의 작업들이 계속 피어납니다.
          </p>
          <a
            href="/posts"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'white',
              borderRadius: '100px',
              padding: '0.85rem 0.85rem 0.85rem 1.6rem',
              fontSize: '0.95rem',
              fontWeight: 500,
              textDecoration: 'none',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.4)',
              transition: 'background 0.3s ease',
            }}
          >
            See full archive
            <span style={{
              width: 26, height: 26,
              background: 'white', color: '#0d0c18',
              borderRadius: '50%',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem',
            }}>→</span>
          </a>
        </footer>
      </main>
      <GrainOverlay />
    </>
  )
}
