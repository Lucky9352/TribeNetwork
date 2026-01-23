'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, checkAuth } = useAuthStore()
  const [identification, setIdentification] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(identification, password)
      router.push('/')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-tribe-bg-base flex items-center justify-center px-4">
      {/* Background */}
      <div className="fixed inset-0 bg-tribe-bg-base pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/favicon.ico"
            alt="Tribe"
            width={64}
            height={64}
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-tribe-text-primary mb-2">
            Welcome to Tribe
          </h1>
          <p className="text-tribe-text-secondary">
            Connect with your campus community
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-tribe-bg-elevated/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-5 shadow-xl"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
              <svg
                className="w-5 h-5 text-red-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="identification"
              className="block text-sm font-medium text-tribe-text-secondary mb-2"
            >
              Username or Email
            </label>
            <input
              id="identification"
              type="text"
              value={identification}
              onChange={(e) => setIdentification(e.target.value)}
              required
              className="w-full px-4 py-3 bg-tribe-bg-card border border-white/10 rounded-xl text-tribe-text-primary focus:outline-none focus:border-tribe-primary focus:ring-2 focus:ring-tribe-primary/20 transition-all placeholder:text-tribe-text-muted"
              placeholder="Enter your username or email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-tribe-text-secondary mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-tribe-bg-card border border-white/10 rounded-xl text-tribe-text-primary focus:outline-none focus:border-tribe-primary focus:ring-2 focus:ring-tribe-primary/20 transition-all placeholder:text-tribe-text-muted"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3.5 bg-tribe-primary hover:bg-tribe-primary-hover rounded-xl text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center text-sm text-tribe-text-secondary pt-2">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-tribe-primary hover:text-tribe-primary-hover font-medium"
            >
              Sign up
            </Link>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-tribe-text-muted">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
