'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
    }
  }, [error])

  return (
    <div className="min-h-screen bg-tribe-bg-base">
      <Header showMenuButton={false} />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-tribe-text-primary mb-4">
            Something went wrong!
          </h1>
          <p className="text-tribe-text-secondary mb-6">
            {error.message || 'An unexpected error occurred'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-tribe-primary hover:bg-tribe-primary-hover rounded-lg text-white font-medium transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-tribe-bg-surface hover:bg-tribe-bg-card-hover border border-tribe-border rounded-lg text-tribe-text-secondary font-medium transition-colors"
            >
              Go to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
