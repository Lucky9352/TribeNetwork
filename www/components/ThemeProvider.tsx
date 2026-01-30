'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'

/**
 * @file ThemeProvider.tsx
 * @description Theme provider wrapper for next-themes integration.
 * Provides dark/light mode support throughout the application.
 */

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

/**
 * Theme provider component that wraps next-themes.
 * @param props - Theme provider props including children
 * @returns The theme provider component
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export { useTheme }
