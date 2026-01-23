'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  flarumAPI,
  FlarumDiscussion,
  FlarumPost,
  FlarumUser,
  FlarumTag,
  getDiscussionTags,
} from '@/lib/flarum-api'
import Header from '@/components/Header'
import { formatDistanceToNow } from 'date-fns'
import { useAuthStore } from '@/store/auth-store'
import { buildDiscussionTree } from '@/lib/discussion-tree'
import ThreadedPost from '@/components/ThreadedPost'

export default function DiscussionPage() {
  const params = useParams()
  const router = useRouter()
  const discussionId = params.id as string
  const { isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore()

  const [discussion, setDiscussion] = useState<FlarumDiscussion | null>(null)
  const [posts, setPosts] = useState<FlarumPost[]>([])
  const [included, setIncluded] = useState<
    Array<FlarumUser | FlarumDiscussion | FlarumPost | FlarumTag>
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newReply, setNewReply] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const discussionTree = useMemo(() => buildDiscussionTree(posts), [posts])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    const scrollToHash = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1)
        const element = document.getElementById(id)
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            element.classList.add('ring-2', 'ring-blue-500/50')
            setTimeout(
              () => element.classList.remove('ring-2', 'ring-blue-500/50'),
              2000
            )
          }, 100)
        }
      }
    }

    if (!loading && posts.length > 0) {
      scrollToHash()
    }

    window.addEventListener('hashchange', scrollToHash)
    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [loading, posts])

  const loadDiscussion = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [discussionResponse, postsResponse] = await Promise.all([
        flarumAPI.getDiscussion(discussionId, 'user,tags,firstPost'),
        flarumAPI.getPosts({
          discussion: discussionId,
          include: 'user',
          page: { limit: 50 },
        }),
      ])

      setDiscussion(
        Array.isArray(discussionResponse.data)
          ? discussionResponse.data[0]
          : discussionResponse.data
      )

      const allPosts = Array.isArray(postsResponse.data)
        ? postsResponse.data
        : [postsResponse.data]
      setPosts(allPosts)

      const combinedIncluded = [
        ...(discussionResponse.included || []),
        ...(postsResponse.included || []),
      ]
      setIncluded(combinedIncluded)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to load discussion')
    } finally {
      setLoading(false)
    }
  }, [discussionId])

  useEffect(() => {
    if (discussionId && isAuthenticated) {
      loadDiscussion()
    }
  }, [discussionId, isAuthenticated, loadDiscussion])

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReply.trim() || submitting) return

    try {
      setSubmitting(true)
      await flarumAPI.createPost({
        discussionId,
        content: newReply,
      })
      setNewReply('')
      await loadDiscussion()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message || 'Failed to post reply')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReplyTo = (username: string, postNumber: number) => {
    const mention = `@"${username}"#p${postNumber} `
    setNewReply((prev) => {
      if (prev.trim()) {
        return prev + mention
      }
      return mention
    })
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

  if (loading) {
    return (
      <div className="min-h-screen bg-tribe-bg-base">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Skeleton */}
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-tribe-bg-elevated rounded w-3/4"></div>
            <div className="h-4 bg-tribe-bg-elevated rounded w-1/4"></div>
            <div className="border-b border-zinc-800/60 p-6 space-y-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-zinc-800/50 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-zinc-800/50 rounded w-1/4"></div>
                  <div className="h-3 bg-zinc-800/50 rounded w-1/6"></div>
                </div>
              </div>
              <div className="h-32 bg-zinc-800/50 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !discussion) {
    return (
      <div className="min-h-screen bg-tribe-bg-base">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
            <svg
              className="w-16 h-16 text-red-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-red-400 text-lg mb-6">
              {error || 'Discussion not found'}
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

  const tags = getDiscussionTags(discussion, included)

  return (
    <div className="min-h-screen bg-tribe-bg-base">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 mb-6 text-sm transition-colors group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
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

        {/* Discussion Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
            {discussion.attributes.title}
          </h1>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium bg-zinc-800/80 text-zinc-400 border border-zinc-700/50"
                >
                  {tag.attributes.icon && (
                    <i className={`${tag.attributes.icon} mr-1.5`}></i>
                  )}
                  {tag.attributes.name}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 font-medium">
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-zinc-300">
                {discussion.attributes.commentCount}
              </span>{' '}
              comments
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-zinc-300">
                {discussion.attributes.participantCount}
              </span>{' '}
              participants
            </span>
            <span>
              {formatDistanceToNow(new Date(discussion.attributes.createdAt), {
                addSuffix: true,
              })
                .replace('about ', '')
                .replace('almost ', '')}
            </span>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {discussionTree.map((node) => (
            <ThreadedPost
              key={node.post.id}
              node={node}
              included={included}
              discussionId={discussion.id}
              onReply={handleReplyTo}
              onUpdate={loadDiscussion}
              onDelete={loadDiscussion}
            />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12 text-tribe-text-secondary">
            <p>No posts yet. Be the first to reply!</p>
          </div>
        )}

        {/* Reply Composer */}
        <div id="reply-box" className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base font-semibold text-white">
              Write a Reply
            </h3>
            <span className="text-xs text-zinc-500">(Markdown supported)</span>
          </div>

          <form onSubmit={handleSubmitReply}>
            <div className="relative group">
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="What are your thoughts?"
                rows={4}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
              />
              <div className="absolute bottom-3 right-3 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={!newReply.trim() || submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-lg text-white font-semibold text-xs transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none"
                >
                  {submitting ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
