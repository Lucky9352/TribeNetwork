import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import React from 'react'

import './globals.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/ThemeProvider'

/**
 * @file layout.tsx
 * @description Root layout component for the Tribe AI application.
 * Defines the global shell, including fonts, themes, and toast notifications.
 */

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Tribe AI | Intelligent Campus Assistant',
    template: '%s | Tribe AI',
  },
  description:
    'AI-powered assistant for Tribe Network. Enhance your campus experience with intelligent tools and real-time insights.',
  keywords: [
    'Tribe AI',
    'Campus Assistant',
    'Student Tools',
    'Productivity',
    'Artificial Intelligence',
  ],
  authors: [{ name: 'Tribe Network' }],
  creator: 'Tribe Network',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://ai.tribenetwork.in',
    title: 'Tribe AI | Intelligent Campus Assistant',
    description:
      'AI-powered assistant for Tribe Network. Enhance your campus experience.',
    siteName: 'Tribe AI',
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
 * Root Layout Component
 * Wraps the application with global providers and styles.
 *
 * @param {RootLayoutProps} props - The component props.
 * @returns {JSX.Element} The root html structure.
 */
export default function RootLayout({
  children,
}: RootLayoutProps): React.ReactNode {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={cn(
          inter.variable,
          'min-h-screen bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
