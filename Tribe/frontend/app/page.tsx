'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  flarumAPI,
  FlarumDiscussion,
  FlarumTag,
  FlarumUser,
  FlarumPost,
  getUser,
  getFirstPost,
} from '@/lib/flarum-api'
import DiscussionCard from '@/components/DiscussionCard'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import { useAuthStore } from '@/store/auth-store'
import { Skeleton } from '@/components/Skeleton'

type SortType = 'hot' | 'new'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore()

  const [discussions, setDiscussions] = useState<FlarumDiscussion[]>([])
  const [included, setIncluded] = useState<
    Array<FlarumUser | FlarumDiscussion | FlarumPost | FlarumTag>
  >([])
  const [tags, setTags] = useState<FlarumTag[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortType, setSortType] = useState<SortType>('hot')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 20

  const sentinelRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  const loadDiscussions = useCallback(
    async (reset = true) => {
      try {
        if (reset) {
          setLoading(true)
          offsetRef.current = 0
          setHasMore(true)
        } else {
          setLoadingMore(true)
        }
        setError(null)

        const currentOffset = reset ? 0 : offsetRef.current

        const response = await flarumAPI.getDiscussions({
          page: { limit: PAGE_SIZE, offset: currentOffset },
          include: 'user,firstPost,tags,lastPostedUser',
          sort: sortType === 'new' ? '-lastPostedAt' : '-votes',
          filter: selectedTag ? { tag: selectedTag } : undefined,
        })

        const newDiscussions = Array.isArray(response.data)
          ? response.data
          : [response.data]

        const newIncluded = response.included || []

        if (reset) {
          setDiscussions(newDiscussions)
          setIncluded(newIncluded)
        } else {
          setDiscussions((prev) => [...prev, ...newDiscussions])
          setIncluded((prev) => [...prev, ...newIncluded])
        }

        setHasMore(
          newDiscussions.length >= PAGE_SIZE ||
            !!(response.links && response.links.next)
        )
        offsetRef.current = currentOffset + newDiscussions.length
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || 'Failed to load discussions')
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [sortType, selectedTag]
  )

  useEffect(() => {
    if (isAuthenticated) {
      loadDiscussions()
      loadTags()
    }
  }, [isAuthenticated, loadDiscussions])

  const loadMore = useCallback((): void => {
    if (!loadingMore && hasMore) {
      loadDiscussions(false)
    }
  }, [loadingMore, hasMore, loadDiscussions])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, loading, loadMore])

  const loadTags = async () => {
    try {
      const response = await flarumAPI.getTags()
      const tagsData = Array.isArray(response.data)
        ? response.data
        : [response.data]
      setTags(
        tagsData
          .filter((tag) => !tag.attributes.isHidden)
          .sort(
            (a, b) =>
              (a.attributes.position || 0) - (b.attributes.position || 0)
          )
      )
    } catch {}
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
      <Header onMenuClick={() => setMobileNavOpen(true)} />

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        tags={tags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          tags={tags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />

        {/* Main Feed */}
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Hero Banner */}
          {/* Hero Banner */}
          <div className="mb-8 border-b border-zinc-800/60 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
                  Welcome to Tribe
                </h1>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                  Your campus community — share ideas, ask questions, and
                  connect with peers.
                </p>
              </div>
              <Link
                href="/discussions/new"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] shrink-0 border border-blue-500/50"
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
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Start a conversation
              </Link>
            </div>
          </div>

          {/* Sort Tabs */}
          <div className="flex justify-center gap-6 mb-6">
            <button
              onClick={() => setSortType('hot')}
              className={`text-sm font-semibold px-4 py-2 rounded-full transition-all ${
                sortType === 'hot'
                  ? 'text-white bg-zinc-800'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => setSortType('new')}
              className={`text-sm font-semibold px-4 py-2 rounded-full transition-all ${
                sortType === 'new'
                  ? 'text-white bg-zinc-800'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              Latest
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="space-y-0">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b border-zinc-800/60 p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32 rounded" />
                      <Skeleton className="h-3 w-20 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-3/4 rounded mb-3" />
                  <Skeleton className="h-4 w-full rounded mb-2" />
                  <Skeleton className="h-4 w-2/3 rounded mb-4" />

                  {/* Image Skeleton placeholder for variety */}
                  {i % 2 === 0 && (
                    <Skeleton className="w-full aspect-video rounded-xl mb-4" />
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 mb-6">
              <p className="text-red-400 mb-3">Error: {error}</p>
              <button
                onClick={() => loadDiscussions()}
                className="px-4 py-2 bg-tribe-primary hover:bg-tribe-primary-hover rounded-lg text-white text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Discussions */}
          {!loading && !error && (
            <div className="space-y-4">
              {discussions.length === 0 ? (
                <div className="text-center py-12 text-tribe-text-secondary">
                  <p className="text-lg">No discussions found</p>
                  <p className="text-sm mt-2">
                    Be the first to start a conversation!
                  </p>
                </div>
              ) : (
                <>
                  {discussions.map((discussion, index) => {
                    const startPost = getFirstPost(discussion, included)
                    const author = getUser(discussion, included)
                    const postAuthor = startPost
                      ? getUser(startPost, included)
                      : undefined

                    return (
                      <DiscussionCard
                        key={discussion.id}
                        discussion={discussion}
                        startPost={startPost}
                        author={author}
                        postAuthor={postAuthor}
                        priority={index < 10}
                      />
                    )
                  })}

                  {/* Infinite scroll sentinel */}
                  {hasMore && discussions.length > 0 && (
                    <div
                      ref={sentinelRef}
                      className="flex items-center justify-center py-6"
                    >
                      {loadingMore && (
                        <div className="flex items-center gap-2 text-zinc-500">
                          <svg
                            className="animate-spin h-4 w-4"
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
                          <span className="text-sm">Loading more...</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Button - Create Discussion */}
      <Link
        href="/discussions/new"
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-400 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all z-50"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </Link>
    </div>
  )
}
