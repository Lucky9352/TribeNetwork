'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { marked } from 'marked'
import {
  ExternalLink,
  ThumbsUp,
  Bookmark,
  Copy,
  Check,
  Sparkles,
  X,
  PenLine,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Message, MessageType } from '@/types'
import { Button } from '@/components/ui/button'

/**
 * @file ChatMessage.tsx
 * @description Chat message with streaming animation, full-width AI responses.
 */

interface ChatMessageProps {
  message: Message
  followUpSuggestions?: string[]
  onFollowUpClick?: (suggestion: string) => void
}

interface ForumResult {
  title: string
  author: string
  snippet: string
  url: string
  createdAt?: string
  score?: number
}

/** Extract forum results from AI response */
function extractForumResults(content: string): ForumResult[] {
  const results: ForumResult[] = []
  const linkPattern = /\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g
  const matches = content.matchAll(linkPattern)

  for (const match of matches) {
    if (match[2].includes('flarum') || match[2].includes('tribe')) {
      results.push({
        title: match[1],
        author: 'Tribe User',
        snippet: 'Click to view the discussion',
        url: match[2],
      })
    }
  }
  return results.slice(0, 3)
}

/** Streaming text animation */
function StreamingText({
  text,
  onComplete,
}: {
  text: string
  onComplete?: () => void
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const isCompleteRef = useRef(false)
  const charIndexRef = useRef(0)
  const lastTextRef = useRef('')

  useEffect(() => {
    if (!text.startsWith(lastTextRef.current)) {
      charIndexRef.current = 0
      isCompleteRef.current = false
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayedText('')
      setShowCursor(true)
    }

    lastTextRef.current = text
    isCompleteRef.current = false

    let animationFrame: number

    const animate = () => {
      if (charIndexRef.current < text.length) {
        const distance = text.length - charIndexRef.current
        const speed = distance > 50 ? 5 : 3

        charIndexRef.current = Math.min(
          charIndexRef.current + speed,
          text.length
        )
        setDisplayedText(text.slice(0, charIndexRef.current))
        animationFrame = requestAnimationFrame(animate)
      } else {
        if (!isCompleteRef.current) {
          if (charIndexRef.current >= text.length) {
            isCompleteRef.current = true
            setShowCursor(false)
            onComplete?.()
            isCompleteRef.current = true
            setShowCursor(false)
            onComplete?.()
          }
        }
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [text, onComplete])

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((prev) => !prev), 530)
    return () => clearInterval(interval)
  }, [])

  const isIncomplete = displayedText.length < text.length

  return (
    <span>
      {displayedText}
      {isIncomplete && (
        <span
          className={cn(
            'inline-block w-[2px] h-[1em] ml-0.5 align-middle bg-blue-400 rounded-full transition-opacity',
            showCursor ? 'opacity-100' : 'opacity-30'
          )}
        />
      )}
    </span>
  )
}

export function ChatMessage({
  message,
  followUpSuggestions = [],
  onFollowUpClick,
}: ChatMessageProps) {
  const isAI = message.type === MessageType.AI
  const [reactions, setReactions] = useState<{
    helpful: boolean
    saved: boolean
  }>({ helpful: false, saved: false })
  const [copied, setCopied] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [suggestionDismissed, setSuggestionDismissed] = useState(false)
  const [streamComplete, setStreamComplete] = useState(!isAI)

  const parsedContent = useMemo(() => {
    if (isAI && streamComplete) {
      marked.setOptions({ breaks: true, gfm: true })
      return marked(message.content, { async: false }) as string
    }
    return ''
  }, [message.content, isAI, streamComplete])

  const forumResults = useMemo(() => {
    if (isAI && streamComplete) {
      return extractForumResults(message.content)
    }
    return []
  }, [message.content, isAI, streamComplete])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const toggleReaction = (type: 'helpful' | 'saved') => {
    setReactions((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  if (!isAI) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end mb-6"
      >
        <div className="max-w-[80%] bg-zinc-800/80 backdrop-blur-sm text-zinc-100 px-5 py-3.5 rounded-2xl rounded-tr-md border border-white/5 shadow-sm">
          {message.content}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-8 relative group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* AI Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/10 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]">
          <Sparkles className="w-4 h-4 text-blue-400" />
        </div>
        <span className="text-sm font-semibold text-zinc-300">Tribe AI</span>
      </div>

      {/* AI Content */}
      <div className="pl-11 text-zinc-300 text-[15px] leading-7 prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/5 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-li:marker:text-zinc-500">
        {!streamComplete ? (
          <StreamingText
            text={message.content}
            onComplete={() => setStreamComplete(true)}
          />
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: parsedContent }}
            className="markdown-content [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
          />
        )}
      </div>

      {/* Forum Result Cards */}
      {streamComplete && forumResults.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
            Related Discussions
          </p>
          <div className="flex flex-wrap gap-2">
            {forumResults.map((result, i) => (
              <motion.a
                key={i}
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-2 bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/20 rounded-lg transition-all group/card"
              >
                <span className="font-medium text-white text-sm group-hover/card:text-zinc-200 transition-colors">
                  {result.title}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover/card:text-zinc-300 transition-colors shrink-0" />
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {/* Draft Post Suggestion */}
      {streamComplete && message.suggestion && !suggestionDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 inline-flex items-center gap-3 px-3 py-2 rounded-lg border border-white/20 bg-black/40 cursor-pointer transition-all group hover:bg-blue-500/10 hover:border-blue-500/40"
          onClick={() => {
            const params = new URLSearchParams({
              title: message.suggestion?.title || '',
              content: message.suggestion?.content || '',
              tags: message.suggestion?.tag || '',
            })
            const flarumUrl =
              process.env.NEXT_PUBLIC_FLARUM_URL || 'http://localhost:3000'
            window.open(
              `${flarumUrl}/discussions/new?${params.toString()}`,
              '_blank'
            )
          }}
        >
          <PenLine className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-sm text-zinc-200 font-medium">
            {message.suggestion?.title || 'Start A Discussion'}
          </span>
          <span className="text-xs text-zinc-500 group-hover:text-blue-400 transition-colors shrink-0">
            Post →
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSuggestionDismissed(true)
            }}
            className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Action Buttons */}
      {streamComplete && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showActions ? 0.8 : 0.4 }}
            className="flex items-center gap-0.5 mt-6 pt-3 border-t border-white/5"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleReaction('helpful')}
              className={cn(
                'h-7 px-2.5 text-xs gap-1',
                reactions.helpful
                  ? 'text-green-400 bg-green-500/10'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              )}
            >
              <ThumbsUp
                className={cn(
                  'w-3.5 h-3.5',
                  reactions.helpful && 'fill-current'
                )}
              />
              Helpful
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleReaction('saved')}
              className={cn(
                'h-7 px-2.5 text-xs gap-1',
                reactions.saved
                  ? 'text-yellow-400 bg-yellow-500/10'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              )}
            >
              <Bookmark
                className={cn('w-3.5 h-3.5', reactions.saved && 'fill-current')}
              />
              Save
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2.5 text-xs gap-1 text-zinc-500 hover:text-white hover:bg-white/5"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2.5 text-xs gap-1 text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              asChild
            >
              <a
                href={
                  process.env.NEXT_PUBLIC_FLARUM_URL ||
                  'https://tribe-community.vercel.app'
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Forum
              </a>
            </Button>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Follow-up Suggestions - Inline after message */}
      {streamComplete && followUpSuggestions.length > 0 && onFollowUpClick && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mt-4"
        >
          {followUpSuggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              onClick={() => onFollowUpClick(suggestion)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-left transition-all hover:bg-blue-500/10 hover:border-blue-500/40"
            >
              <span className="text-sm text-zinc-300">{suggestion}</span>
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
