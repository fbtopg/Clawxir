import { Inter } from 'next/font/google'
import { trackPageView, trackPerformance } from '@/lib/analytics'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Track page view and performance on client side
  if (typeof window !== 'undefined') {
    trackPageView()
    trackPerformance()
  }

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}