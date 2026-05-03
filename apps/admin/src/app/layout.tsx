import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DBC Admin',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
