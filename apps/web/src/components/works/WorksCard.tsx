import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface WorksCardProps {
  id: string
  title: string
  thumbnail_url: string | null
  tags: string[]
  created_at: string | null
}

export function WorksCard({ id, title, thumbnail_url, tags, created_at }: WorksCardProps) {
  return (
    <Link
      href={`/works/${id}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl',
        'border border-white/[0.06] bg-white/[0.02]',
        'transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]',
      )}
    >
      {/* 썸네일 */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-white/[0.04]">
        {thumbnail_url ? (
          <Image
            src={thumbnail_url}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[13px] text-white/20">No Image</span>
          </div>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h2 className="text-[16px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-white">
          {title}
        </h2>

        {/* 태그 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-foreground-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 날짜 */}
        {created_at && (
          <p className="mt-auto text-[12px] text-foreground-subtle">
            {new Date(created_at).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
      </div>
    </Link>
  )
}
