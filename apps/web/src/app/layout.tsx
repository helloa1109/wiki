import type { Metadata } from "next";
import "./globals.css";
import { newsreader, jetbrainsMono } from "../lib/fonts";

export const metadata: Metadata = {
  title: "효깅 — 정돈된 노트, 정돈되는 사고",
  description:
    "UI/UX 기획자가 남기는 작업 회고와 디자인 노트. 오래 걸려 정리한 것들이 천천히 쌓이는 공간.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`dark ${newsreader.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Pretendard 가변 웹폰트 (CDN) */}
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}