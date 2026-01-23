'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/**
 * @file ChatInput.tsx
 * @description Premium chat input with animations, auto-resize, and visual polish.
 */

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 150) + 'px'
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full p-4"
    >
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            'relative flex items-end gap-2 bg-zinc-900/80 rounded-2xl border transition-all duration-300',
            isFocused
              ? 'border-purple-500/50 shadow-lg shadow-purple-500/10'
              : 'border-white/10 hover:border-white/20'
          )}
        >
          {/* Sparkles icon */}
          <div className="absolute left-4 top-4">
            <Sparkles
              className={cn(
                'h-5 w-5 transition-colors duration-300',
                isFocused ? 'text-purple-400' : 'text-zinc-600'
              )}
            />
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            placeholder="Ask about campus life, find people, get answers..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={1}
            className={cn(
              'flex-1 bg-transparent resize-none py-4 pl-12 pr-4 text-[15px] text-white',
              'placeholder:text-zinc-500 focus:outline-none',
              'min-h-[56px] max-h-[150px]'
            )}
            disabled={isLoading}
          />

          {/* Send button */}
          <div className="flex items-center pr-3 pb-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                size="icon"
                className={cn(
                  'h-10 w-10 rounded-xl transition-all duration-300',
                  message.trim()
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'bg-zinc-800 text-zinc-500',
                  isLoading && 'opacity-50 cursor-not-allowed'
                )}
                disabled={isLoading || !message.trim()}
              >
                <Send
                  className={cn('h-4 w-4', message.trim() && 'animate-pulse')}
                />
              </Button>
            </motion.div>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
