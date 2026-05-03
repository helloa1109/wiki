"use client";

import Link from "next/link";
import { useRef, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  hideOnMobile?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Posts", href: "/posts" },
  { label: "Works", href: "/works" },
  { label: "Notes", href: "/notes", hideOnMobile: true },
];

interface IndicatorState {
  left: number;
  width: number;
  height: number;
}

export function GnbNav() {
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState<IndicatorState | null>(null);
  const pathname = usePathname();

  const handleEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    const navEl = navRef.current;
    if (!navEl) return;
    const navRect = navEl.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    setIndicator({
      left: rect.left - navRect.left,
      width: rect.width,
      height: rect.height,
    });
  };

  const handleNavLeave = () => setIndicator(null);

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      onMouseLeave={handleNavLeave}
      className="relative flex items-center gap-0.5"
    >
      {/* 호버 인디케이터 */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-0 rounded-full",
          "bg-white/[0.08] border border-white/[0.04]",
          "transition-[left,width,height,opacity] duration-[400ms] ease-spring",
          indicator ? "opacity-100" : "opacity-0"
        )}
        style={{
          left: indicator ? `${indicator.left}px` : "0px",
          width: indicator ? `${indicator.width}px` : "0px",
          height: indicator ? `${indicator.height}px` : "0px",
        }}
      />

      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onMouseEnter={handleEnter}
            className={cn(
              "relative z-10 px-3.5 py-2 rounded-full",
              "text-[13.5px] font-medium tracking-tight",
              "transition-colors duration-200 ease-standard",
              isActive
                ? "text-white"
                : "text-foreground-muted hover:text-foreground",
              item.hideOnMobile && "hidden md:inline-block"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
