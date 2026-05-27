import { Newsreader, JetBrains_Mono, Fraunces } from "next/font/google";

/**
 * Newsreader — 디스플레이 세리프 (이탤릭 강조어용)
 * font-serif italic 으로 사용
 */
export const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
  variable: "--font-newsreader",
  display: "swap",
});

/**
 * JetBrains Mono — eyebrow / 메타 텍스트용 모노스페이스
 * font-mono 으로 사용
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300"],
  variable: "--font-fraunces",
  display: "swap",
});