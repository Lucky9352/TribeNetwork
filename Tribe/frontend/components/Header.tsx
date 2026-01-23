'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import {
  flarumAPI,
  FlarumDiscussion,
  FlarumUser,
  FlarumTag,
  FlarumPost,
} from '@/lib/flarum-api'
import { formatDistanceToNow } from 'date-fns'
import { shouldUnoptimize } from '@/lib/image-utils'

interface HeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
}

export default function Header({
  onMenuClick,
  showMenuButton = true,
}: HeaderProps) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const checkAuth = useAuthStore((state) => state.checkAuth)
  const isLoading = useAuthStore((state) => state.isLoading)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FlarumDiscussion[]>([])
  const [searchIncluded, setSearchIncluded] = useState<
    Array<FlarumUser | FlarumDiscussion | FlarumPost | FlarumTag>
  >([])
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showSearch])

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (!value.trim()) {
      setSearchResults([])
      return
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSearching(true)

        try {
          const response = await flarumAPI.getDiscussions({
            filter: { q: value.trim() },
            page: { limit: 6 },
            include: 'user,firstPost,tags',
          })
          const results = Array.isArray(response.data)
            ? response.data
            : [response.data]
          if (results.length > 0) {
            setSearchResults(results)
            setSearchIncluded(response.included || [])
            return
          }
        } catch {}

        const response = await flarumAPI.getDiscussions({
          page: { limit: 50 },
          include: 'user,firstPost,tags',
          sort: '-lastPostedAt',
        })
        const allDiscussions = Array.isArray(response.data)
          ? response.data
          : [response.data]
        const query = value.trim().toLowerCase()
        const filtered = allDiscussions
          .filter((d) => d.attributes.title.toLowerCase().includes(query))
          .slice(0, 6)

        setSearchResults(filtered)
        setSearchIncluded(response.included || [])
      } catch {
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false)
        setSearchQuery('')
        setSearchResults([])
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSearch])

  const closeSearch = () => {
    setShowSearch(false)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleResultClick = (id: string) => {
    closeSearch()
    router.push(`/discussions/${id}`)
  }

  return (
    <>
      <header className="bg-black border-b border-white/10 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Left: Menu Button + Logo */}
          <div className="flex items-center gap-3">
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}

            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/favicon.ico"
                alt="Tribe"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <div className="hidden sm:block">
                <span className="text-lg font-semibold text-white">Tribe</span>
                <span className="text-xs text-zinc-500 block -mt-0.5">
                  Campus Network
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Actions */}
          <nav className="flex items-center gap-1">
            {/* New Post Button */}
            <Link
              href="/discussions/new"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Post
            </Link>

            {/* Search Button */}
            <button
              onClick={() => setShowSearch(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
            >
              <svg
                className="w-5 h-5 text-zinc-400"
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
            </button>

            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="relative w-8 h-8 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center hover:ring-2 hover:ring-blue-500/50 transition-all"
                >
                  {user?.attributes.avatarUrl ? (
                    <Image
                      src={user.attributes.avatarUrl}
                      alt={
                        user.attributes.displayName || user.attributes.username
                      }
                      fill
                      className="object-cover"
                      sizes="32px"
                      unoptimized={shouldUnoptimize(user.attributes.avatarUrl)}
                    />
                  ) : (
                    <span className="text-white font-medium text-xs">
                      {(user?.attributes.displayName ||
                        user?.attributes.username ||
                        'U')[0].toUpperCase()}
                    </span>
                  )}
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-11 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden">
                      <div className="px-3 py-2.5 border-b border-zinc-800">
                        <p className="font-medium text-sm text-white truncate">
                          {user?.attributes.displayName ||
                            user?.attributes.username}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                          @{user?.attributes.username}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          href={`/profile/${user?.id}`}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Profile
                        </Link>

                        <Link
                          href="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
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
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Settings
                        </Link>
                      </div>

                      <div className="border-t border-zinc-800 pt-1">
                        <button
                          onClick={() => {
                            logout()
                            setShowUserMenu(false)
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
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
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-medium transition-colors text-sm"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Search Modal */}
      {showSearch && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={closeSearch}
          />
          <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
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
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search discussions..."
                  className="w-full bg-transparent text-white placeholder-zinc-500 pl-12 pr-12 py-4 text-base focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSearchResults([])
                      searchInputRef.current?.focus()
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Search Results */}
              {(isSearching ||
                searchResults.length > 0 ||
                (searchQuery && !isSearching)) && (
                <div className="border-t border-zinc-800 max-h-80 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-zinc-500">
                      <svg
                        className="w-5 h-5 animate-spin mx-auto mb-2"
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
                      Searching...
                    </div>
                  ) : searchResults.length === 0 && searchQuery ? (
                    <div className="p-4 text-center text-zinc-500">
                      No results found for &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    searchResults.map((discussion) => {
                      const discussionUser = searchIncluded.find(
                        (inc): inc is FlarumUser =>
                          inc.type === 'users' &&
                          inc.id === discussion.relationships?.user?.data?.id
                      )

                      return (
                        <button
                          key={discussion.id}
                          onClick={() => handleResultClick(discussion.id)}
                          className="w-full px-4 py-3 text-left hover:bg-zinc-800/50 transition-colors flex items-start gap-3"
                        >
                          <div className="relative w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                            {discussionUser?.attributes.avatarUrl ? (
                              <Image
                                src={discussionUser.attributes.avatarUrl}
                                alt={
                                  discussionUser.attributes.username ||
                                  'User avatar'
                                }
                                fill
                                className="rounded-full object-cover"
                                sizes="32px"
                                unoptimized={shouldUnoptimize(
                                  discussionUser.attributes.avatarUrl
                                )}
                              />
                            ) : (
                              <span className="text-xs text-zinc-400">
                                {(discussionUser?.attributes.username ||
                                  'U')[0].toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white truncate">
                              {discussion.attributes.title}
                            </h4>
                            <p className="text-xs text-zinc-500">
                              {discussionUser?.attributes.username || 'Unknown'}{' '}
                              · {discussion.attributes.commentCount} comments ·{' '}
                              {formatDistanceToNow(
                                new Date(discussion.attributes.createdAt),
                                { addSuffix: true }
                              )}
                            </p>
                          </div>
                        </button>
                      )
                    })
                  )}
                </div>
              )}

              {/* Footer hint */}
              <div className="border-t border-zinc-800 px-4 py-2 flex items-center justify-between text-xs text-zinc-600">
                <span>
                  Press{' '}
                  <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">
                    Esc
                  </kbd>{' '}
                  to close
                </span>
                <Link
                  href={`/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}
                  onClick={closeSearch}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Advanced search →
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
