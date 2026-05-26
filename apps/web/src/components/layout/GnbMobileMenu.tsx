"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@chat/ui";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Posts", href: "/posts", desc: "글 & 아티클" },
  { label: "Works", href: "/works", desc: "작업물" },
  { label: "Notes", href: "/notes", desc: "짧은 메모" },
  { label: "Contests", href: "/contests", desc: "공모전" },
  { label: "News", href: "/news", desc: "AI/테크 뉴스" },
  { label: "About", href: "/about", desc: "팀 소개" },
];

export function GnbMobileMenu() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="메뉴 열기"
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-full",
            "bg-white/[0.04] border border-white/[0.08] text-foreground-muted",
            "transition-all duration-200 hover:bg-white/[0.08] hover:text-foreground"
          )}
        >
          <Menu className="h-[15px] w-[15px]" strokeWidth={1.8} />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className={cn(
          "w-full max-w-[300px] border-l border-white/[0.08]",
          "bg-[#0e0e0e]/95 backdrop-blur-2xl p-0",
          "flex flex-col"
        )}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2">
            <span className="relative h-[18px] w-[18px] rounded-[5px] bg-brand shadow-[0_0_0_1px_hsl(var(--brand)/0.4)]">
              <span className="absolute inset-1 rounded-[2px] bg-background" />
            </span>
            <span className="text-[15px] font-bold tracking-tight text-foreground">
              DBC
            </span>
          </Link>
        </div>

        {/* 네비 링크 */}
        <nav className="flex-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-4",
                  "transition-colors duration-200",
                  isActive
                    ? "bg-white/[0.07] text-foreground"
                    : "text-foreground-muted hover:bg-white/[0.04] hover:text-foreground"
                )}
              >
                <span className="text-[17px] font-semibold tracking-tight">
                  {item.label}
                </span>
                <span className="text-[12px] text-foreground-subtle">
                  {item.desc}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* 하단 */}
        <div className="px-6 py-5 border-t border-white/[0.06]">
          <p className="text-[11px] text-foreground-subtle tracking-wide">
            기획하고, 만들고, 함께 기록하는 팀.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
