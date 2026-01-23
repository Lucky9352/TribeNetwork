'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { FlarumPost, FlarumUser, getUser, flarumAPI } from '@/lib/flarum-api'
import { shouldUnoptimize } from '@/lib/image-utils'
import { useAuthStore } from '@/store/auth-store'
import { useToast } from './Toast'

function transformContentUrls(html: string): string {
  if (typeof window === 'undefined') return html

  const currentOrigin = window.location.origin
  const flarumUrlPattern =
    /https?:\/\/[^\/"'\s]+\/d\/(\d+)(?:-[^\/"'\s]*)?(?:\/(\d+))?/g

  let processedHtml = html.replace(
    flarumUrlPattern,
    (match, discussionId, postNumber) => {
      if (postNumber && postNumber !== '1') {
        return `${currentOrigin}/discussions/${discussionId}#post-${postNumber}`
      }
      return `${currentOrigin}/discussions/${discussionId}`
    }
  )

  const unparsedMentionPattern = /^<p>@["“]?[^"#]+["”]?#p\d+\s*[.,]?\s*/i
  processedHtml = processedHtml.replace(unparsedMentionPattern, '<p>')

  const plainTextMention = /^@["“]?[^"#]+["”]?#p\d+\s*[.,]?\s*/i
  processedHtml = processedHtml.replace(plainTextMention, '')

  return processedHtml
}

interface PostItemProps {
  post: FlarumPost
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  included?: Array<FlarumUser | any>
  isFirstPost?: boolean
  discussionId: string
  onReply?: (username: string, postNumber: number) => void
  onUpdate?: () => void
  onDelete?: () => void
  className?: string
}

export default function PostItem({
  post,
  included = [],
  isFirstPost = false,
  discussionId,
  onReply,
  onUpdate,
  onDelete,
  className = '',
}: PostItemProps) {
  const { addToast } = useToast()
  const { user } = useAuthStore()
  const postUser = getUser(post, included)
  const isAnonymous = post.attributes.isAnonymous

  const canEdit =
    post.attributes.canEdit || (user && postUser && user.id === postUser.id)
  const canDelete =
    post.attributes.canDelete || (user && postUser && user.id === postUser.id)

  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.attributes.content || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const initialVoteCount = Number(
    post.attributes.score ?? post.attributes.votes ?? 0
  )

  let initialUserVote: 'up' | 'down' | null = null
  if (post.attributes.hasUpvoted) initialUserVote = 'up'
  else if (post.attributes.hasDownvoted) initialUserVote = 'down'

  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(
    initialUserVote
  )
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (type: 'up' | 'down') => {
    if (isVoting) return
    if (!user) {
      addToast('error', 'Please login to vote')
      return
    }

    try {
      setIsVoting(true)

      let newVote: 'up' | 'down' | null = type
      const currentCount = Number(voteCount)
      let newCount = currentCount

      if (userVote === type) {
        newVote = null
        newCount = type === 'up' ? currentCount - 1 : currentCount + 1
      } else {
        if (userVote === 'up') newCount = currentCount - 2
        else if (userVote === 'down') newCount = currentCount + 2
        else newCount = type === 'up' ? currentCount + 1 : currentCount - 1
      }

      await flarumAPI.vote(post.id, newVote)

      setUserVote(newVote)
      setVoteCount(newCount)
    } catch {
      addToast('error', 'Failed to submit vote')
    } finally {
      setIsVoting(false)
    }
  }

  const handleShare = () => {
    const dId = discussionId || post.relationships?.discussion?.data?.id
    const baseUrl = `${window.location.origin}/discussions/${dId}`

    const url = isFirstPost
      ? baseUrl
      : `${baseUrl}#post-${post.attributes.number}`

    navigator.clipboard.writeText(url)
    addToast('success', 'Link copied to clipboard!')
  }

  const handleEdit = () => {
    setEditContent(post.attributes.content || '')
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await flarumAPI.updatePost(post.id, { content: editContent })
      setIsEditing(false)
      addToast('success', 'Post updated')
      onUpdate?.()
    } catch {
      addToast('error', 'Failed to update post')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      setIsDeleting(true)
      await flarumAPI.deletePost(post.id)
      addToast('success', 'Post deleted')
      onDelete?.()
    } catch {
      addToast('error', 'Failed to delete post')
      setIsDeleting(false)
    }
  }

  return (
    <article
      id={`post-${post.attributes.number}`}
      className={`border-b border-zinc-800/60 p-5 sm:p-6 transition-colors duration-200 hover:bg-zinc-900/40 ${className} ${
        isDeleting ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0 ring-2 ring-zinc-700/50">
            {!isAnonymous && postUser?.attributes.avatarUrl ? (
              <Image
                src={postUser.attributes.avatarUrl}
                alt={
                  postUser.attributes.displayName ||
                  postUser.attributes.username
                }
                fill
                className="object-cover"
                sizes="(max-width: 768px) 48px, 48px"
                unoptimized={shouldUnoptimize(postUser.attributes.avatarUrl)}
              />
            ) : isAnonymous ? (
              <span className="text-base text-zinc-500">👻</span>
            ) : (
              <span className="text-white font-semibold text-sm">
                {(postUser?.attributes.displayName ||
                  postUser?.attributes.username ||
                  'U')[0].toUpperCase()}
              </span>
            )}
          </div>

          {/* User Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm sm:text-base">
                {isAnonymous
                  ? 'Anonymous'
                  : postUser?.attributes.displayName ||
                    postUser?.attributes.username ||
                    'User'}
              </span>
              {isFirstPost && (
                <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md font-bold uppercase tracking-wide border border-blue-500/20">
                  OP
                </span>
              )}
            </div>
            <span className="text-xs text-zinc-500">
              {formatDistanceToNow(new Date(post.attributes.createdAt), {
                addSuffix: true,
              })}
              {post.attributes.editedAt && (
                <span
                  className="ml-1"
                  title={`Edited ${new Date(
                    post.attributes.editedAt
                  ).toLocaleString()}`}
                >
                  • Edited
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Actions Menu (Edit/Delete) */}
        {(canEdit || canDelete) && !isEditing && (
          <div className="relative group">
            <button className="text-zinc-500 hover:text-white p-1 rounded hover:bg-zinc-800">
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
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 overflow-hidden">
              {canEdit && (
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="mb-5">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 min-h-[100px]"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : post.attributes.isHidden ? (
        <div className="mb-5 p-4 bg-red-500/5 border border-red-500/10 rounded-lg">
          <p className="text-zinc-500 text-sm italic">
            This post has been hidden/deleted.
          </p>
        </div>
      ) : (
        <div
          className="prose prose-invert prose-sm sm:prose-base max-w-none text-zinc-200 mb-5
                      prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                      prose-img:rounded-xl prose-img:max-h-[500px] prose-img:object-contain
                      prose-p:leading-relaxed prose-p:text-zinc-300
                      prose-strong:text-white prose-strong:font-semibold
                      prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-zinc-300
                      [&_.PostMention]:hidden"
          dangerouslySetInnerHTML={{
            __html: transformContentUrls(post.attributes.contentHtml || ''),
          }}
        />
      )}

      {/* Actions Footer */}
      <div className="flex items-center justify-between pt-4 mt-2">
        {/* Left: Interactive Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-all"
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
                strokeWidth={1.5}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-all"
            onClick={() => {
              const username = isAnonymous
                ? 'Anonymous'
                : postUser?.attributes.displayName ||
                  postUser?.attributes.username ||
                  'User'
              if (onReply) {
                onReply(username, post.attributes.number)
              }
              document
                .getElementById('reply-box')
                ?.scrollIntoView({ behavior: 'smooth' })
              setTimeout(() => {
                const textarea = document.querySelector(
                  '#reply-box textarea'
                ) as HTMLTextAreaElement
                textarea?.focus()
              }, 300)
            }}
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
                strokeWidth={1.5}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            Reply
          </button>
        </div>

        {/* Right: Vote Pill - Modern Ghost Style */}
        <div
          className={`flex items-center rounded-full transition-all ${
            isVoting ? 'opacity-50' : ''
          } ${
            userVote
              ? 'bg-zinc-900 border border-zinc-800'
              : 'hover:bg-zinc-900/60'
          }`}
        >
          <button
            onClick={() => handleVote('down')}
            disabled={isVoting}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              userVote === 'down'
                ? 'text-orange-500'
                : isVoting
                  ? 'text-zinc-700 cursor-not-allowed'
                  : 'text-zinc-500 hover:text-orange-400 hover:bg-zinc-800'
            }`}
          >
            <svg
              className="w-4 h-4"
              fill={userVote === 'down' ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 13l-7 7-7-7"
              />
            </svg>
          </button>

          <span
            className={`text-sm font-bold min-w-[20px] text-center px-1 ${
              userVote === 'up'
                ? 'text-blue-500'
                : userVote === 'down'
                  ? 'text-orange-500'
                  : 'text-zinc-400'
            }`}
          >
            {isVoting ? (
              <svg
                className="w-3 h-3 animate-spin mx-auto"
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
            ) : (
              voteCount
            )}
          </span>

          <button
            onClick={() => handleVote('up')}
            disabled={isVoting}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              userVote === 'up'
                ? 'text-blue-500'
                : isVoting
                  ? 'text-zinc-700 cursor-not-allowed'
                  : 'text-zinc-500 hover:text-blue-400 hover:bg-zinc-800'
            }`}
          >
            <svg
              className="w-4 h-4"
              fill={userVote === 'up' ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 11l7-7 7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}
