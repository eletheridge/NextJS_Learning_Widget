import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Quote Widget',
  description: 'Widget for simulating RFQs and quotes',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en" data-theme="winter">
      <body className={inter.className}>{children}</body>
      </html>
  )
}
