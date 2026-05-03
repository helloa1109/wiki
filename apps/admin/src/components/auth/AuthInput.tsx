import { cn } from '@/lib/utils'

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function AuthInput({ label, error, className, ...props }: AuthInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium tracking-wide text-foreground-muted">
        {label}
      </label>
      <input
        className={cn(
          'w-full rounded-xl border bg-white/[0.04]',
          'px-4 py-3 text-[14px] text-foreground placeholder:text-foreground-subtle',
          'outline-none transition-all duration-200',
          error
            ? 'border-red-500/50 focus:border-red-400/70'
            : 'border-white/[0.08] focus:border-white/[0.2] focus:bg-white/[0.06]',
          className,
        )}
        {...props}
      />
      {error && (
        <p className="text-[12px] text-red-400">{error}</p>
      )}
    </div>
  )
}
