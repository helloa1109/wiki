"use client";

import { type ButtonHTMLAttributes } from "react";
import { useMagnetic } from "@/lib/hooks/useMagnetic";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number;
  radius?: number;
}

export function MagneticButton({
  className,
  children,
  strength,
  radius,
  ...props
}: MagneticButtonProps) {
  const ref = useMagnetic<HTMLButtonElement>({ strength, radius });

  return (
    <button
      ref={ref}
      className={cn(
        // 기본 형태
        "group relative inline-flex items-center gap-2.5 rounded-full overflow-hidden",
        "px-7 py-[15px] text-[14.5px] font-semibold tracking-tight",
        // 다크 글래스 배경
        "bg-gradient-to-b from-white/[0.09] to-white/[0.03]",
        "border border-white/[0.1]",
        "text-foreground",
        // 상단 인너 하이라이트 (유리 느낌)
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
        // 샤인 스윕 — hover 시 빛이 왼→오로 쓸고 지나감
        "before:pointer-events-none before:absolute before:inset-0",
        "before:-translate-x-full hover:before:translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-white/[0.1] before:to-transparent",
        "before:transition-transform before:duration-[600ms] before:ease-in-out",
        // 호버 — 브랜드 오로라 글로우 + 보더 밝아짐
        "transition-[border-color,box-shadow] duration-300",
        "hover:border-white/[0.22]",
        "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_0_28px_rgba(255,106,61,0.22),0_0_60px_rgba(255,106,61,0.08),0_8px_32px_rgba(0,0,0,0.5)]",
        // 클릭 피드백
        "active:scale-[0.97]",
        "will-change-transform",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
