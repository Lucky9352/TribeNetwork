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
  MessageSquare,
  Sparkles,
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
}

interface ForumResult {
  title: string
  author: string
  snippet: string
  url: string
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
            'inline-block w-[2px] h-[1em] ml-0.5 align-middle bg-purple-400 rounded-full transition-opacity',
            showCursor ? 'opacity-100' : 'opacity-30'
          )}
        />
      )}
    </span>
  )
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.type === MessageType.AI
  const [reactions, setReactions] = useState<{
    helpful: boolean
    saved: boolean
  }>({ helpful: false, saved: false })
  const [copied, setCopied] = useState(false)
  const [showActions, setShowActions] = useState(false)
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
        className="flex justify-end"
      >
        <div className="max-w-[80%] bg-purple-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm">
          {message.content}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* AI Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-purple-500/15 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <span className="text-sm font-medium text-zinc-400">TribeAI</span>
      </div>

      {/* AI Content */}
      <div className="text-zinc-100 text-[15px] leading-relaxed prose prose-invert prose-sm max-w-none">
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
        <div className="mt-4 space-y-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
            Related Discussions
          </p>
          {forumResults.map((result, i) => (
            <motion.a
              key={i}
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="block p-3 bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 rounded-lg transition-all group/card"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate group-hover/card:text-purple-400 transition-colors">
                    {result.title}
                  </p>
                  <p className="text-xs text-zinc-500">by {result.author}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover/card:text-purple-400 transition-colors shrink-0" />
              </div>
            </motion.a>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      {streamComplete && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showActions ? 1 : 0.3 }}
            className="flex items-center gap-1 mt-4 pt-3 border-t border-white/5"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleReaction('helpful')}
              className={cn(
                'h-8 px-3 text-xs gap-1.5',
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
                'h-8 px-3 text-xs gap-1.5',
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
              className="h-8 px-3 text-xs gap-1.5 text-zinc-500 hover:text-white hover:bg-white/5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs gap-1.5 text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10"
              asChild
            >
              <a
                href="https://tribe-community.vercel.app"
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
    </motion.div>
  )
}
