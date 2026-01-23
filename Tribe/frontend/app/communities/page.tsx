'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { flarumAPI, FlarumTag } from '@/lib/flarum-api'
import { useAuthStore } from '@/store/auth-store'
import Header from '@/components/Header'
import { Skeleton } from '@/components/Skeleton'

export default function CommunitiesPage() {
  const [tags, setTags] = useState<FlarumTag[]>([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuthStore()

  const loadTags = useCallback(async () => {
    try {
      setLoading(true)
      const response = await flarumAPI.getTags()
      const tagsData = Array.isArray(response.data)
        ? response.data
        : [response.data]
      const sorted = tagsData.sort((a, b) => {
        const posA = a.attributes.position ?? 999
        const posB = b.attributes.position ?? 999
        if (posA !== posB) return posA - posB
        return a.attributes.name.localeCompare(b.attributes.name)
      })
      setTags(sorted)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTags()
  }, [loadTags])

  const visibleTags = tags.filter((tag) => !tag.attributes.isHidden)
  const hiddenTags = tags.filter((tag) => tag.attributes.isHidden)

  return (
    <div className="min-h-screen bg-black">
      <Header showMenuButton={false} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 pl-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4 text-sm font-medium"
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
            Back to home
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Communities</h1>
          <p className="text-zinc-400 text-lg">
            Explore all the communities on Tribe
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="relative border-b border-r border-zinc-800/50 p-6 first:rounded-tl-2xl last:rounded-br-2xl sm:border sm:rounded-2xl"
              >
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-6 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-1/4 rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Communities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {visibleTags.map((tag) => {
                const discussionCount = tag.attributes.discussionCount || 0

                return (
                  <Link
                    key={tag.id}
                    href={`/?tag=${tag.attributes.slug}`}
                    className="group relative border-b border-r border-zinc-800/50 hover:bg-zinc-900/20 p-6 transition-all duration-300 first:rounded-tl-2xl last:rounded-br-2xl sm:border sm:rounded-2xl sm:bg-transparent"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                        {tag.attributes.icon ? (
                          <i
                            className={`${tag.attributes.icon} text-xl text-blue-500`}
                          ></i>
                        ) : (
                          <span className="text-blue-500 font-bold text-lg">
                            {tag.attributes.name[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors truncate">
                          {tag.attributes.name}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-1 font-medium">
                          {discussionCount}{' '}
                          <span className="font-normal text-zinc-600">
                            {discussionCount === 1 ? 'post' : 'posts'}
                          </span>
                        </p>
                        {tag.attributes.description && (
                          <p className="text-sm text-zinc-400 mt-3 line-clamp-2 leading-relaxed">
                            {tag.attributes.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Hidden Communities Section */}
            {isAuthenticated && hiddenTags.length > 0 && (
              <div className="mt-12 border-t border-zinc-900 pt-12">
                <div className="flex items-center gap-3 mb-6 pl-1">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Private Communities
                    </h2>
                    <p className="text-sm text-zinc-500">
                      Visible only to members
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hiddenTags.map((tag) => {
                    const discussionCount = tag.attributes.discussionCount || 0

                    return (
                      <Link
                        key={tag.id}
                        href={`/?tag=${tag.attributes.slug}`}
                        className="group relative border border-zinc-800/30 hover:border-zinc-700/50 hover:bg-zinc-900/20 rounded-2xl p-6 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center shrink-0">
                            {tag.attributes.icon ? (
                              <i
                                className={`${tag.attributes.icon} text-xl text-zinc-400`}
                              ></i>
                            ) : (
                              <span className="text-zinc-400 font-bold text-lg">
                                {tag.attributes.name[0].toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors truncate">
                                {tag.attributes.name}
                              </h3>
                              <svg
                                className="w-4 h-4 text-zinc-600 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                            </div>
                            <p className="text-sm text-zinc-500 mt-1">
                              {discussionCount}{' '}
                              <span className="font-normal text-zinc-600">
                                {discussionCount === 1 ? 'post' : 'posts'}
                              </span>
                            </p>
                            {tag.attributes.description && (
                              <p className="text-sm text-zinc-500 mt-3 line-clamp-2">
                                {tag.attributes.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {visibleTags.length === 0 && hiddenTags.length === 0 && (
              <div className="text-center py-24">
                <div className="w-16 h-16 rounded-full bg-zinc-900/50 flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                  <svg
                    className="w-8 h-8 text-zinc-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  No communities yet
                </h3>
                <p className="text-zinc-500">
                  Communities will appear here once they are created.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
