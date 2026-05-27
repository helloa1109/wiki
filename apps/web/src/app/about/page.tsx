import { GNB } from '@/components/layout/GNB'
import { AboutHero } from './_components/Abouthero'
import { AwardsCollage } from './_components/Awardscollage'
import { Statement } from './_components/Statement'
import { HorizontalWorks } from './_components/Horizontalworks'
import { Outro } from './_components/Outro'
import { PageChrome } from './_components/Pagechrome'

export default function AboutPage() {
  return (
    <main style={{ overflowX: 'clip' }}>
      <GNB />
      <AboutHero />
      <AwardsCollage />
      <Statement />
      <HorizontalWorks />
      <Outro />
      <PageChrome />
    </main>
  )
}
