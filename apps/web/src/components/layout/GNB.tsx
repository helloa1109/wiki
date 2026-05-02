"use client";

import { cn } from "@/lib/utils";
import { useScrolled } from "@/lib/hooks/useScrolled";
import { GnbLogo } from "@/components/layout/GnbLogo";
import { GnbNav } from "./GnbNav";
import { GnbAction } from "./GnbAction";

/**
 * Global Navigation Bar — 화면 상단 중앙 플로팅 글래스 필.
 * 스크롤 32px 넘으면 살짝 위로 올라가며 0.96 압축.
 *
 * 구성:
 * - GnbLogo (왼쪽, Server)
 * - GnbNav (가운데, Client - 호버 인디케이터)
 * - GnbAction (오른쪽, Server - RSS)
 */
export function GNB() {
  const scrolled = useScrolled(32);

  return (
    <header
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-50",
        "transition-[top] duration-[400ms] ease-standard",
        scrolled ? "top-3" : "top-6"
      )}
    >
      <div
        className={cn(
          // 형태
          "flex items-center gap-7 pl-[22px] pr-2 py-2 rounded-full",
          // 글래스
          "bg-surface/55 backdrop-blur-xl backdrop-saturate-[160%]",
          "border border-white/[0.08]",
          // 레이어드 섀도우 (인너 보더 + 외곽 그림자)
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.02),0_16px_40px_rgba(0,0,0,0.5)]",
          // 스크롤시 약간 압축
          "transition-transform duration-[400ms] ease-standard",
          scrolled && "scale-[0.96]",
          // 모바일 패딩 보정
          "max-md:gap-3 max-md:pl-4"
        )}
      >
        <GnbLogo />
        <GnbNav />
        <GnbAction />
      </div>
    </header>
  );
}