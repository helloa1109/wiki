import { GNB } from '@/components/layout/GNB'
import { GrainOverlay } from '@/components/effects/GrainOverlay'
import { CursorSpotlight } from '@/components/effects/CursorSpotlight'

export const metadata = {
  title: 'Works | Team DBC',
  description: 'DBC 팀의 작업물을 소개합니다.',
}

export default function WorksPage() {
  return (
    <>
      <CursorSpotlight />
      <GNB />
      <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
        <p className="mb-4 text-[11px] uppercase tracking-[0.14em] text-foreground-subtle">
          Works
        </p>
        <h1 className="mb-3 text-[32px] font-bold tracking-tight text-foreground">
          준비 중입니다
        </h1>
        <p className="text-[15px] text-foreground-muted">
          곧 DBC 팀의 작업물을 만나볼 수 있어요.
        </p>
      </main>
      <GrainOverlay />
    </>
  )
}
