import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/ThemeProvider'
import ScrollToTop from '@/components/ScrollToTop'

/**
 * @file layout.tsx
 * @description Root layout component for the Tribe Advertise application.
 * content-security-policy, SEO metadata, and global font configuration.
 */

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Tribe Advertise | Reach College Students',
    template: '%s | Tribe Advertise',
  },
  description:
    'The premier programmatic platform to reach 10M+ verified college students in India via WhatsApp, Email, & SMS.',
  applicationName: 'Tribe Advertise',
  keywords: [
    'student marketing',
    'college advertising',
    'campus marketing',
    'Tribe',
    'programmatic ads',
  ],
  authors: [{ name: 'Tribe Network' }],
  creator: 'Tribe Network',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://advertise.tribenetwork.in',
    title: 'Tribe Advertise | Reach College Students',
    description:
      'Launch targeted campaigns to 10M+ students across India. Real-time analytics and verified reach.',
    siteName: 'Tribe Advertise',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tribe Advertise',
    description:
      'The premier programmatic platform to reach 10M+ verified college students in India.',
    creator: '@tribenetwork',
  },
  robots: {
    index: true,
    follow: true,
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

/**
 * Root Layout
 * Wraps all pages with the Inter font and global styles.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          inter.className,
          'min-h-screen bg-background font-sans antialiased text-foreground selection:bg-primary/20 selection:text-primary'
        )}
      >
        <ScrollToTop />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
