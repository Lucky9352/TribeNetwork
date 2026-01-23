'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { flarumAPI, FlarumTag } from '@/lib/flarum-api'
import Header from '@/components/Header'
import { useAuthStore } from '@/store/auth-store'

export default function NewDiscussionPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tags, setTags] = useState<FlarumTag[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  const loadTags = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadTags()
    }
  }, [isAuthenticated, loadTags])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      const response = await flarumAPI.createDiscussion({
        title: title.trim(),
        content: content.trim(),
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      })

      const newDiscussion = Array.isArray(response.data)
        ? response.data[0]
        : response.data
      router.push(`/discussions/${newDiscussion.id}`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to create discussion')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    )
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
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-6">
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
          Start a Discussion
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error */}
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

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-tribe-text-secondary mb-2"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-tribe-bg-elevated border border-white/10 rounded-xl px-4 py-3 text-tribe-text-primary placeholder-tribe-text-muted focus:outline-none focus:border-tribe-primary/50 transition-colors"
              maxLength={200}
            />
            <p className="text-xs text-tribe-text-muted mt-1 text-right">
              {title.length}/200
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-tribe-text-secondary mb-2">
              Tags (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag.id)
                      ? 'ring-2 ring-tribe-primary ring-offset-2 ring-offset-tribe-bg-base'
                      : 'hover:bg-white/5'
                  }`}
                  style={{
                    backgroundColor: selectedTags.includes(tag.id)
                      ? tag.attributes.color || '#a855f7'
                      : `${tag.attributes.color || '#ffffff'}15`,
                    color: selectedTags.includes(tag.id)
                      ? '#fff'
                      : tag.attributes.color || '#fff',
                  }}
                >
                  {tag.attributes.icon && (
                    <i className={`${tag.attributes.icon} mr-1.5`}></i>
                  )}
                  {tag.attributes.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-tribe-text-secondary mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, stories, or questions..."
              rows={8}
              className="w-full bg-tribe-bg-elevated border border-white/10 rounded-xl px-4 py-3 text-tribe-text-primary placeholder-tribe-text-muted focus:outline-none focus:border-tribe-primary/50 transition-colors resize-none"
            />
            <p className="text-xs text-tribe-text-muted mt-1">
              You can use basic formatting like **bold** and *italic*
            </p>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href="/"
              className="px-6 py-2.5 text-tribe-text-secondary hover:text-tribe-text-primary font-medium transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim() || submitting}
              className="px-8 py-2.5 bg-tribe-primary hover:bg-tribe-primary-hover rounded-xl text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
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
                  Posting...
                </span>
              ) : (
                'Post Discussion'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
