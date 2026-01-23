'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  flarumAPI,
  FlarumDiscussion,
  FlarumUser,
  FlarumTag,
  FlarumPost,
} from '@/lib/flarum-api'
import Header from '@/components/Header'
import { useAuthStore } from '@/store/auth-store'
import { formatDistanceToNow } from 'date-fns'

function SearchPageLoading() {
  return (
    <div className="min-h-screen bg-tribe-bg-base flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-tribe-primary border-t-transparent mb-4"></div>
        <p className="text-tribe-text-secondary">Loading...</p>
      </div>
    </div>
  )
}

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const { isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore()

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<FlarumDiscussion[]>([])
  const [included, setIncluded] = useState<
    Array<FlarumUser | FlarumDiscussion | FlarumPost | FlarumTag>
  >([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return

    try {
      setLoading(true)
      setSearched(true)

      const response = await flarumAPI.getDiscussions({
        filter: { q: query.trim() },
        page: { limit: 20 },
        include: 'user,firstPost,tags',
      })

      setResults(Array.isArray(response.data) ? response.data : [response.data])
      setIncluded(response.included || [])

      router.push(`/search?q=${encodeURIComponent(query.trim())}`, {
        scroll: false,
      })
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [query, router])

  useEffect(() => {
    if (initialQuery && isAuthenticated) {
      handleSearch()
    }
  }, [initialQuery, isAuthenticated, handleSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-tribe-bg-base flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-tribe-primary border-t-transparent mb-4"></div>
          <p className="text-tribe-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-tribe-bg-base">
      <Header showMenuButton={false} />

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-tribe-text-secondary hover:text-tribe-text-primary mb-6 text-sm transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Feed
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-tribe-text-primary mb-6">
          Search
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search discussions..."
              className="w-full bg-tribe-bg-elevated border border-white/10 rounded-xl px-4 py-4 pl-12 text-tribe-text-primary placeholder-tribe-text-muted focus:outline-none focus:border-tribe-primary/50 transition-colors text-lg"
              autoFocus
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tribe-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-tribe-primary hover:bg-tribe-primary-hover rounded-lg text-white font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Results */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-tribe-bg-elevated rounded-xl p-5 animate-pulse"
              >
                <div className="h-5 bg-tribe-bg-card rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-tribe-bg-card rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {!loading && searched && (
          <>
            <p className="text-tribe-text-secondary mb-4">
              {results.length === 0
                ? 'No results found'
                : `${results.length} result${results.length === 1 ? '' : 's'} found`}
            </p>

            <div className="space-y-3">
              {results.map((discussion) => {
                const user = included.find(
                  (inc): inc is FlarumUser =>
                    inc.type === 'users' &&
                    inc.id === discussion.relationships?.user?.data?.id
                )

                return (
                  <Link
                    key={discussion.id}
                    href={`/discussions/${discussion.id}`}
                    className="block bg-tribe-bg-elevated border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors"
                  >
                    <h3 className="font-semibold text-tribe-text-primary mb-2 hover:text-tribe-primary transition-colors">
                      {discussion.attributes.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-tribe-text-muted">
                      <span className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-tribe-primary/20 flex items-center justify-center">
                          <span className="text-xs text-tribe-primary">
                            {(user?.attributes.username ||
                              'U')[0].toUpperCase()}
                          </span>
                        </div>
                        {user?.attributes.username || 'Unknown'}
                      </span>
                      <span>•</span>
                      <span>{discussion.attributes.commentCount} comments</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(
                          new Date(discussion.attributes.createdAt),
                          { addSuffix: true }
                        )}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {!loading && !searched && (
          <div className="text-center py-12 text-tribe-text-muted">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p>Enter a search term to find discussions</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchPageContent />
    </Suspense>
  )
}
