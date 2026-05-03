"use client";

import { useState, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/lib/hooks/useScrolled";
import { GnbLogo } from "@/components/layout/GnbLogo";
import { GnbNav } from "./GnbNav";
import { GnbMobileMenu } from "./GnbMobileMenu";
import { SearchModal } from "./SearchModal";

export function GNB() {
  const scrolled = useScrolled(32);
  const [mounted, setMounted] = useState(false);   // DOM에 있음
  const [visible, setVisible] = useState(false);   // 애니메이션 on/off
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openSearch = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMounted(true);
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const closeSearch = useCallback(() => {
    setVisible(false);
    closeTimer.current = setTimeout(() => setMounted(false), 300);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed left-1/2 -translate-x-1/2 z-50",
          "transition-[top] duration-[400ms] ease-standard",
          scrolled ? "top-3" : "top-6"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-7 pl-[22px] pr-2 py-2 rounded-full",
            "bg-surface/55 backdrop-blur-xl backdrop-saturate-[160%]",
            "border border-white/[0.08]",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.02),0_16px_40px_rgba(0,0,0,0.5)]",
            "transition-transform duration-[400ms] ease-standard",
            scrolled && "scale-[0.96]",
            "max-md:gap-3 max-md:pl-4"
          )}
        >
          <GnbLogo />

          <div className="hidden md:block">
            <GnbNav />
          </div>

          {/* 검색 / 닫기 버튼 */}
          <div className="hidden md:block">
            <button
              onClick={mounted ? closeSearch : openSearch}
              aria-label={mounted ? "검색 닫기" : "검색"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-foreground-muted transition-all duration-200 ease-standard hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-foreground"
            >
              <span
                className="flex items-center justify-center transition-all duration-200"
                style={{
                  opacity: 1,
                  transform: mounted ? 'rotate(90deg) scale(0.9)' : 'rotate(0deg) scale(1)',
                }}
              >
                {mounted
                  ? <X className="h-3.5 w-3.5" strokeWidth={2} />
                  : <Search className="h-3.5 w-3.5" strokeWidth={1.8} />
                }
              </span>
            </button>
          </div>

          <div className="md:hidden">
            <GnbMobileMenu />
          </div>
        </div>
      </header>

      {mounted && <SearchModal visible={visible} onClose={closeSearch} />}
    </>
  );
}
