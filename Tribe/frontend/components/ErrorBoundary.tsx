'use client'

import { ReactNode } from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-tribe-bg-base flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-tribe-bg-elevated border border-red-500/20 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-tribe-text-primary mb-4">
          Something went wrong
        </h1>
        <p className="text-tribe-text-secondary mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-3 bg-tribe-primary hover:bg-tribe-primary-hover rounded-lg text-white font-medium transition-colors"
        >
          Try again
        </button>
        <button
          onClick={() => (window.location.href = '/')}
          className="mt-4 px-6 py-3 bg-tribe-bg-surface hover:bg-tribe-bg-card-hover border border-white/10 rounded-lg text-tribe-text-secondary font-medium transition-colors block w-full"
        >
          Go to home
        </button>
      </div>
    </div>
  )
}

interface ErrorBoundaryProps {
  children: ReactNode
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={() => {
        if (process.env.NODE_ENV === 'development') {
        }
      }}
      onReset={() => {
        window.location.href = '/'
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}
