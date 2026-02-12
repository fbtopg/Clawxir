import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PostHogProvider } from '@/lib/posthog'
import * as Sentry from '@sentry/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// Initialize Sentry
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
})

export const metadata: Metadata = {
  title: 'Clawxir - AI Agent Circuit Builder',
  description: 'Build and visualize AI agent circuits with Clawxir',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <PostHogProvider>
        <body className={inter.className}>
          {children}
          
          {/* Performance monitoring */}
          <script
            defer
            src={`https://static.cloudflareinsights.com/beacon.min.js`}
            data-cf-beacon='{"token": "your-cloudflare-token"}'
          />
        </body>
      </PostHogProvider>
    </html>
  )
}