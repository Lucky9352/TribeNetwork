'use client'

import React from 'react'
import { Send, Sparkles, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { siteConfig } from '@/lib/site-config'

/**
 * @file AIScreen.tsx
 * @description Mock AI chat interface demonstrating TribeAI with forum RAG search.
 * Shows how AI searches across forum discussions to find relevant community answers.
 */

interface ChatMessage {
  role: 'user' | 'ai'
  content: string | React.ReactNode
  forumResults?: ForumResult[]
}

interface ForumResult {
  title: string
  user: string
  snippet: string
}

const MESSAGES: ChatMessage[] = [
  {
    role: 'user',
    content: 'Anyone into guitar here?',
  },
  {
    role: 'ai',
    content: (
      <>
        <p className="mb-3">Found some fellow guitarists on campus! 🎸</p>
      </>
    ),
    forumResults: [
      {
        title: 'Looking for jam buddies',
        user: '@musiclover',
        snippet:
          'I play acoustic guitar, been learning for 2 years. Looking for people to jam with on weekends...',
      },
      {
        title: 'Guitar lessons?',
        user: '@beginner_axe',
        snippet:
          'Does anyone know a good guitar teacher near JC campus? Want to learn electric...',
      },
    ],
  },
  {
    role: 'user',
    content: 'Awesome! Also, any good late night food spots around here?',
  },
  {
    role: 'ai',
    content: 'Absolutely! Here are some popular spots open late near campus 🍔',
    forumResults: [
      {
        title: 'Best midnight snacks?',
        user: '@nightowl',
        snippet:
          'Maggi Point behind the library is open till 2 AM. Their cheese maggi is legendary...',
      },
      {
        title: '24/7 Coffee shops',
        user: '@caffeine_addict',
        snippet:
          'Third Wave Coffee near the main gate stays open for study sessions during exams!',
      },
    ],
  },
  {
    role: 'user',
    content: 'Thanks! One last thing - when is the next club fair?',
  },
  {
    role: 'ai',
    content:
      'The Annual Club Fair is scheduled for next Friday at the Student Center Plaza! 🎉',
    forumResults: [
      {
        title: 'Club Fair 2024 discussion',
        user: '@event_coord',
        snippet:
          'We have over 50 clubs registering this year. Tech, Music, Dance, and more...',
      },
    ],
  },
]

const Header = () => (
  <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 shrink-0 bg-zinc-950 z-10 relative">
    <span className="font-bold text-lg flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-blue-400" />
      Tribe AI
    </span>
    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
      <span className="text-xs text-blue-400">AI</span>
    </div>
  </div>
)

const ForumResultCard = ({
  result,
  index,
}: {
  result: ForumResult
  index: number
}) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.8 + index * 0.2 }}
    className="bg-zinc-700/50 rounded-xl p-3 border border-white/5"
  >
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1">
        <p className="text-xs font-medium text-white mb-1">{result.title}</p>
        <p className="text-[10px] text-zinc-400">by {result.user}</p>
      </div>
      <ExternalLink className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
    </div>
    <p className="text-[11px] text-zinc-400 mt-2 line-clamp-2">
      {result.snippet}
    </p>
  </motion.div>
)

const MessageBubble = ({
  message,
  index,
}: {
  message: ChatMessage
  index: number
}) => {
  const isAi = message.role === 'ai'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.3, duration: 0.4 }}
      className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`px-4 py-3 max-w-[95%] text-sm leading-relaxed ${
          isAi
            ? 'bg-zinc-800 text-zinc-200 rounded-2xl rounded-tl-sm'
            : 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
        }`}
      >
        {typeof message.content === 'string' ? (
          <p>{message.content}</p>
        ) : (
          message.content
        )}
        {message.forumResults && (
          <div className="mt-3 space-y-2">
            {message.forumResults.map((result, i) => (
              <ForumResultCard key={i} result={result} index={i} />
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="text-[11px] text-zinc-500 mt-2"
            >
              💡 Check these discussions or start a new post!
            </motion.p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.8 }}
    className="flex justify-start"
  >
    <div className="bg-zinc-900 border border-white/5 px-3 py-2 rounded-2xl rounded-tl-sm flex gap-1 items-center">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.15 }}
          className="w-1.5 h-1.5 bg-zinc-500 rounded-full"
        />
      ))}
    </div>
  </motion.div>
)

const InputArea = () => (
  <div className="p-3 border-t border-white/10 bg-zinc-950">
    <div className="relative">
      <input
        type="text"
        placeholder="Ask about campus life..."
        className="w-full bg-zinc-900 border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
        disabled
      />
      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-500 rounded-full hover:bg-blue-400 transition-colors">
        <Send className="w-3 h-3 text-white" />
      </button>
    </div>
  </div>
)

/**
 * Main component for the AI Chat Screen demo.
 */
export default function AIScreen() {
  return (
    <div className="w-full h-full bg-zinc-950 text-white flex flex-col relative overflow-hidden font-sans">
      <Header />
      <Link
        href={siteConfig.urls.ai}
        className="flex-1 flex flex-col min-h-0 cursor-pointer group"
      >
        <div className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar">
          {MESSAGES.map((msg, i) => (
            <div
              key={i}
              className="group-hover:bg-white/2 transition-colors rounded-lg -mx-2 px-2 py-1"
            >
              <MessageBubble message={msg} index={i} />
            </div>
          ))}
          <TypingIndicator />
        </div>
        <InputArea />
      </Link>
    </div>
  )
}
