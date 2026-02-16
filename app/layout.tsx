import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '谁是卧底 - Who is the Spy',
  description: 'A fun party game with AI-generated words',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
