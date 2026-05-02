import Link from "next/link";
import { Rss } from "lucide-react";

/**
 * GNB 우측 액션 버튼. 현재는 RSS 구독 링크.
 * 추후 검색이나 테마 토글로 교체 가능.
 */
export function GnbAction() {
  return (
    <Link
      href="/rss.xml"
      aria-label="RSS 구독"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.08] text-foreground-muted transition-all duration-200 ease-standard hover:text-foreground hover:bg-white/[0.08] hover:border-white/[0.16]"
    >
      <Rss className="h-3.5 w-3.5" strokeWidth={1.8} />
    </Link>
  );
}
