'use client'

import { useState, useEffect, memo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import {
  FlarumDiscussion,
  FlarumUser,
  FlarumPost,
  htmlToText,
  extractFirstImage,
  flarumAPI,
} from '@/lib/flarum-api'
import { shouldUnoptimize } from '@/lib/image-utils'
import { useToast } from './Toast'

import { useAuthStore } from '@/store/auth-store'

interface DiscussionCardProps {
  discussion: FlarumDiscussion
  startPost?: FlarumPost
  author?: FlarumUser
  postAuthor?: FlarumUser
  priority?: boolean
}

const DiscussionCard = memo(function DiscussionCard({
  discussion,
  startPost,
  author,
  postAuthor,
  priority = false,
}: DiscussionCardProps) {
  const { addToast } = useToast()
  const { user } = useAuthStore()
  const { attributes } = discussion
  const createdAt = new Date(attributes.createdAt)
  const lastPostedAt = attributes.lastPostedAt
    ? new Date(attributes.lastPostedAt)
    : null

  const firstPost = startPost
  const editedAt = firstPost?.attributes.editedAt
    ? new Date(firstPost.attributes.editedAt)
    : null

  let activeTime = lastPostedAt || createdAt
  if (editedAt && editedAt > activeTime) {
    activeTime = editedAt
  }
  const userAuthor = author
  const postUser = postAuthor

  const contentHtml = firstPost?.attributes.contentHtml || ''
  const contentText = htmlToText(contentHtml)
  const contentPreview =
    contentText.length > 200 ? contentText.slice(0, 200) + '...' : contentText
  const imageUrl = extractFirstImage(contentHtml)

  const isAnonymous = firstPost?.attributes.isAnonymous
  const displayUser = isAnonymous ? null : postUser || userAuthor

  const [voteCount, setVoteCount] = useState(0)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [interactionMode, setInteractionMode] = useState<
    'gamification' | 'likes' | 'none'
  >('none')
  const [isVoting, setIsVoting] = useState(false)

  useEffect(() => {
    if (typeof discussion.attributes.votes !== 'undefined') {
      setInteractionMode('gamification')
      setVoteCount(Number(discussion.attributes.votes || 0))
      if (discussion.attributes.hasUpvoted) setUserVote('up')
      else if (discussion.attributes.hasDownvoted) setUserVote('down')
      else setUserVote(null)
    } else if (firstPost) {
      const attrs = firstPost.attributes

      if (
        typeof attrs.score !== 'undefined' ||
        typeof attrs.votes !== 'undefined'
      ) {
        setInteractionMode('gamification')
        setVoteCount(Number(attrs.score ?? attrs.votes ?? 0))
        if (attrs.hasUpvoted) setUserVote('up')
        else if (attrs.hasDownvoted) setUserVote('down')
        else setUserVote(null)
      } else if (attrs.canLike) {
        setInteractionMode('likes')
        setVoteCount(Number(attrs.likesCount || 0))
        if (attrs.isLiked) setUserVote('up')
        else setUserVote(null)
      } else {
        setInteractionMode('none')
        setVoteCount(
          (attributes.participantCount || 0) + (attributes.commentCount || 0)
        )
      }
    }
  }, [
    firstPost,
    discussion.attributes,
    attributes.participantCount,
    attributes.commentCount,
  ])

  const handleVote = async (type: 'up' | 'down') => {
    if (!firstPost) return
    if (interactionMode === 'none') return

    if (interactionMode === 'likes' && type === 'down') {
      return
    }

    if (!user) {
      addToast('error', 'Please login to vote')
      return
    }

    if (isVoting) return

    try {
      setIsVoting(true)

      let newVote: 'up' | 'down' | null = type
      const currentCount = Number(voteCount)
      let newCount = currentCount

      if (interactionMode === 'gamification') {
        if (userVote === type) {
          newVote = null
          newCount = type === 'up' ? currentCount - 1 : currentCount + 1
        } else {
          if (userVote === 'up') newCount = currentCount - 2
          else if (userVote === 'down') newCount = currentCount + 2
          else newCount = type === 'up' ? currentCount + 1 : currentCount - 1
        }
      } else if (interactionMode === 'likes') {
        if (userVote === 'up') {
          newVote = null
          newCount = currentCount - 1
        } else {
          newVote = 'up'
          newCount = currentCount + 1
        }
      }

      if (interactionMode === 'gamification') {
        await flarumAPI.vote(firstPost.id, newVote)
      } else if (interactionMode === 'likes') {
        await flarumAPI.updatePost(firstPost.id, { isLiked: newVote === 'up' })
      }

      setUserVote(newVote)
      setVoteCount(newCount)
    } catch {
      addToast('error', 'Failed to submit vote')
    } finally {
      setIsVoting(false)
    }
  }

  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/discussions/${discussion.id}`)
  }

  return (
    <article
      onClick={handleCardClick}
      className="group border-b border-zinc-800/60 p-5 sm:p-6 transition-colors duration-200 cursor-pointer hover:bg-zinc-900/40"
    >
      {/* Header: Avatar, Username, Time */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0 ring-2 ring-zinc-700/40">
          {displayUser?.attributes.avatarUrl ? (
            <Image
              src={displayUser.attributes.avatarUrl}
              alt={
                displayUser.attributes.displayName ||
                displayUser.attributes.username
              }
              fill
              className="object-cover"
              sizes="44px"
            />
          ) : isAnonymous ? (
            <span className="text-base text-zinc-500">👻</span>
          ) : (
            <span className="text-white font-semibold text-sm">
              {(displayUser?.attributes.displayName ||
                displayUser?.attributes.username ||
                'U')[0].toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-white text-sm sm:text-base truncate">
            {isAnonymous
              ? 'Anonymous'
              : displayUser?.attributes.displayName ||
                displayUser?.attributes.username ||
                'User'}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            {activeTime.getTime() !== createdAt.getTime() ? (
              <span className="text-blue-400/70">
                Active{' '}
                {formatDistanceToNow(activeTime, {
                  addSuffix: false,
                }).replace('about ', '')}{' '}
                ago
              </span>
            ) : (
              <>
                <span>
                  {formatDistanceToNow(createdAt, { addSuffix: true }).replace(
                    'about ',
                    ''
                  )}
                </span>
                {firstPost?.attributes.editedAt && (
                  <span
                    className="ml-1"
                    title={`Edited ${new Date(firstPost.attributes.editedAt).toLocaleString()}`}
                  >
                    • Edited
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      {attributes.title && (
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-relaxed tracking-tight group-hover:text-blue-400 transition-colors">
          {attributes.title}
        </h3>
      )}

      {/* Content (if no title) */}
      {!attributes.title && (
        <p className="text-sm text-zinc-400 leading-relaxed mb-3 line-clamp-3">
          {contentPreview}
        </p>
      )}

      {/* Large Central Image */}
      {imageUrl && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-zinc-900">
          <Image
            src={imageUrl}
            alt="Post content"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={shouldUnoptimize(imageUrl)}
            priority={priority}
          />
        </div>
      )}

      {/* Footer Actions */}
      <div
        className="flex items-center justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Comments & Share */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-sm text-zinc-500">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {attributes.commentCount || 0}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation()
              const url = `${window.location.origin}/discussions/${discussion.id}`
              navigator.clipboard.writeText(url)
              addToast('success', 'Link copied to clipboard!')
            }}
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors"
            title="Share"
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
            onClick={(e) => {
              e.stopPropagation()
              handleVote('down')
            }}
            disabled={
              interactionMode === 'likes' ||
              interactionMode === 'none' ||
              isVoting
            }
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              userVote === 'down'
                ? 'text-orange-500'
                : interactionMode === 'likes' ||
                    interactionMode === 'none' ||
                    isVoting
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
            onClick={(e) => {
              e.stopPropagation()
              handleVote('up')
            }}
            disabled={interactionMode === 'none' || isVoting}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              userVote === 'up'
                ? 'text-blue-500'
                : interactionMode === 'none' || isVoting
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
})

export default DiscussionCard
