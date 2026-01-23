'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { flarumAPI, FlarumUser, FlarumDiscussion } from '@/lib/flarum-api'
import Header from '@/components/Header'
import { useAuthStore } from '@/store/auth-store'
import { formatDistanceToNow } from 'date-fns'

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const {
    isAuthenticated,
    isLoading: authLoading,
    checkAuth,
    user: currentUser,
  } = useAuthStore()

  const [user, setUser] = useState<FlarumUser | null>(null)
  const [discussions, setDiscussions] = useState<FlarumDiscussion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const userResponse = await flarumAPI.getUser(userId)
      setUser(userResponse)

      const discussionsResponse = await flarumAPI.getDiscussions({
        filter: { author: userId },
        page: { limit: 10 },
        include: 'tags',
      })
      setDiscussions(
        Array.isArray(discussionsResponse.data)
          ? discussionsResponse.data
          : [discussionsResponse.data]
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to load user')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId && isAuthenticated) {
      loadUserData()
    }
  }, [userId, isAuthenticated, loadUserData])

  const isOwnProfile = currentUser?.id === userId

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

  if (loading) {
    return (
      <div className="min-h-screen bg-tribe-bg-base">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-tribe-bg-elevated rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-tribe-bg-elevated rounded w-32"></div>
                <div className="h-4 bg-tribe-bg-elevated rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-tribe-bg-base">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
            <p className="text-red-400 text-lg mb-6">
              {error || 'User not found'}
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-tribe-bg-elevated hover:bg-tribe-bg-card rounded-xl text-tribe-text-primary font-medium transition-colors"
            >
              ← Back to Feed
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-tribe-bg-base">
      <Header />

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

        {/* Profile Header */}
        <div className="bg-tribe-bg-elevated border border-white/5 rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-tribe-primary flex items-center justify-center shrink-0">
              {user.attributes.avatarUrl ? (
                <Image
                  src={user.attributes.avatarUrl}
                  alt={user.attributes.displayName || user.attributes.username}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <span className="text-white font-bold text-3xl">
                  {(user.attributes.displayName ||
                    user.attributes.username)[0].toUpperCase()}
                </span>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-tribe-text-primary mb-1">
                {user.attributes.displayName || user.attributes.username}
              </h1>
              <p className="text-tribe-text-muted mb-3">
                @{user.attributes.username}
              </p>

              {user.attributes.bio && (
                <p className="text-tribe-text-secondary mb-4">
                  {user.attributes.bio}
                </p>
              )}

              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-tribe-text-muted">
                <span>
                  Joined{' '}
                  {formatDistanceToNow(new Date(user.attributes.joinTime), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            {/* Edit Profile Button */}
            {isOwnProfile && (
              <Link
                href="/settings/profile"
                className="px-4 py-2 bg-tribe-bg-card hover:bg-white/10 border border-white/10 rounded-xl text-tribe-text-primary text-sm font-medium transition-colors"
              >
                Edit Profile
              </Link>
            )}
          </div>
        </div>

        {/* User's Discussions */}
        <div>
          <h2 className="text-lg font-semibold text-tribe-text-primary mb-4">
            Discussions
          </h2>

          {discussions.length === 0 ? (
            <div className="text-center py-12 text-tribe-text-secondary">
              <p>No discussions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {discussions.map((discussion) => (
                <Link
                  key={discussion.id}
                  href={`/discussions/${discussion.id}`}
                  className="block bg-tribe-bg-elevated border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors"
                >
                  <h3 className="font-medium text-tribe-text-primary mb-2">
                    {discussion.attributes.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-tribe-text-muted">
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
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
