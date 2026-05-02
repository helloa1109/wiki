import Link from "next/link";

/**
 * GNB 좌측 로고. 작은 오렌지 마크 + 워드마크.
 */
export function GnbLogo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-[15px] font-bold tracking-tight text-foreground"
    >
      <span
        aria-hidden="true"
        className="relative h-[18px] w-[18px] rounded-[5px] bg-brand shadow-[0_0_0_1px_hsl(var(--brand)/0.4),inset_0_1px_0_rgba(255,255,255,0.4)]"
      >
        <span className="absolute inset-1 rounded-[2px] bg-background" />
      </span>
      DBC
    </Link>
  );
}
