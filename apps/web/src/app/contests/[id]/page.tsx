import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { GNB } from '@/components/layout/GNB'
import { GrainOverlay } from '@/components/effects/GrainOverlay'
import { CursorSpotlight } from '@/components/effects/CursorSpotlight'
import { fetchLinkareerDetail } from '@/lib/contests/linkareer'

export const revalidate = 3600

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  if (!id.startsWith('linkareer-')) return {}
  const activityId = id.replace('linkareer-', '')
  const detail = await fetchLinkareerDetail(activityId)
  if (!detail) return {}
  return { title: `${detail.title} | Wiki` }
}

export default async function ContestDetailPage({ params }: Props) {
  const { id } = await params

  // Wevity는 크롤링 불가 → 원본 사이트로 리다이렉트
  if (id.startsWith('wevity-')) {
    const ix = id.replace('wevity-', '')
    redirect(`https://www.wevity.com/?c=find&s=1&gbn=view&ix=${ix}`)
  }

  if (!id.startsWith('linkareer-')) notFound()

  const activityId = id.replace('linkareer-', '')
  const detail = await fetchLinkareerDetail(activityId)
  if (!detail) notFound()

  const rows = [
    { label: '주최', value: detail.organizer },
    { label: '참여대상', value: detail.target },
    { label: '시상규모', value: detail.prize },
    { label: '접수기간', value: detail.startDate && detail.endDate ? `${detail.startDate} ~ ${detail.endDate}` : (detail.endDate ?? null) },
    { label: '활동혜택', value: detail.benefits },
    { label: '공모분야', value: detail.field },
  ].filter((r) => r.value)

  return (
    <>
      <CursorSpotlight />
      <GNB />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        {/* 뒤로가기 */}
        <Link
          href="/contests"
          className="mb-8 flex items-center gap-1.5 text-[13px] text-foreground-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          공모전 목록
        </Link>

        {/* 썸네일 */}
        {detail.thumbnail && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-white/[0.08]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={detail.thumbnail}
              alt={detail.title}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* 제목 */}
        <h1 className="mb-6 text-[26px] font-bold leading-snug tracking-tight text-foreground">
          {detail.title}
        </h1>

        {/* 정보 테이블 */}
        {rows.length > 0 && (
          <dl className="mb-8 divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08]">
            {rows.map((r) => (
              <div key={r.label} className="flex gap-4 px-5 py-3.5">
                <dt className="w-24 shrink-0 text-[13px] text-foreground-subtle">{r.label}</dt>
                <dd className="text-[13px] text-foreground">{r.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* 원본 링크 */}
        <a
          href={detail.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] px-4 py-2.5 text-[13px] text-foreground-muted transition-colors hover:border-white/[0.16] hover:text-foreground"
        >
          링커리어에서 자세히 보기
          <ExternalLink size={13} />
        </a>
      </main>
      <GrainOverlay />
    </>
  )
}
