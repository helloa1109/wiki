import { cn } from '@/lib/utils'

interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-[400px] px-4">
      {/* 로고 */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <span className="relative h-9 w-9 rounded-[10px] bg-[hsl(var(--brand))] shadow-[0_0_0_1px_hsl(var(--brand)/0.4),inset_0_1px_0_rgba(255,255,255,0.4)]">
          <span className="absolute inset-[6px] rounded-[4px] bg-background" />
        </span>
        <div className="text-center">
          <p className="text-[15px] font-bold tracking-tight text-foreground">DBC Admin</p>
          <p className="mt-0.5 text-[13px] text-foreground-muted">{description}</p>
        </div>
      </div>

      {/* 카드 */}
      <div
        className={cn(
          'rounded-2xl border border-white/[0.08] p-6 sm:p-7',
          'bg-[hsl(var(--surface))]',
          'shadow-[0_24px_64px_rgba(0,0,0,0.5)]',
        )}
      >
        <h1 className="mb-5 text-[16px] font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {children}
      </div>
    </div>
  )
}
