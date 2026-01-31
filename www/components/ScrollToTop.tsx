'use client'

import { usePathname } from 'next/navigation'
import { useLayoutEffect } from 'react'

/**
 * @component ScrollToTop
 * @description Forces the window to scroll to top on route changes.
 */
export default function ScrollToTop() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }, [pathname])

  return null
}
