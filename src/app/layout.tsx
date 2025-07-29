import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Food Surplus Platform - Reduce Food Waste, Build Sustainability',
  description: 'Connect food sellers with buyers to reduce waste and promote sustainability. Buy surplus food at discounted prices or donate to those in need.',
  keywords: ['food waste', 'sustainability', 'surplus food', 'donation', 'eco-friendly'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
