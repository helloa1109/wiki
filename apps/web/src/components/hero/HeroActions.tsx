import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * Hero CTA 영역.
 * - 1차 CTA: MagneticButton (글 보러가기)
 * - 2차: Ghost 링크 (About)
 *
 * Server Component — 인터랙션은 MagneticButton 만 leaf 로 분리.
 */
export function HeroActions() {
  return (
    <div
      className="inline-flex flex-wrap justify-center items-center gap-3 opacity-0 animate-fade-up max-md:flex-col max-md:items-center max-md:w-full max-md:max-w-[320px]"
      style={{ animationDelay: "1180ms" }}
    >
      <MagneticButton className="group max-md:w-full max-md:justify-center">
        글 보러가기
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 ease-standard group-hover:translate-x-1"
          strokeWidth={2.4}
        />
      </MagneticButton>

      <Link
        href="/about"
        className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-[22px] py-4 text-[14.5px] font-medium text-foreground-muted transition-all duration-200 ease-standard hover:border-white/[0.16] hover:bg-white/[0.05] hover:text-foreground active:translate-y-px max-md:w-full max-md:justify-center"
      >
        About DBC
      </Link>
    </div>
  );
}