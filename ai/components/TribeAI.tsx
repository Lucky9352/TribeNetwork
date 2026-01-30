'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Home,
  Book,
  Coffee,
  Gamepad,
  GraduationCap,
  Store,
  Sparkles,
  MessageSquare,
  Users,
  Calendar,
  Brain,
  Music,
  History,
  Trash2,
  ExternalLink,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { getChatResponse } from '@/lib/api'
import { Message, MessageType } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { ChatMessage } from '@/components/ChatMessage'
import { ChatInput } from '@/components/ChatInput'
import { EventItem } from '@/lib/events-service'

/**
 * @file TribeAI.tsx
 * @description Enhanced TribeAI chat interface with animations, history, and UX features.
 */

/** Conversation type for history */
interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

/** Navigation category configuration */
interface NavigationCategory {
  title: string
  icon: React.ElementType
  questions: string[]
}

/** Welcome card configuration */
interface WelcomeCard {
  icon: React.ElementType
  title: string
  description: string
  query: string
  gradient: string
}

/** Navigation categories */
const navigationCategories: NavigationCategory[] = [
  {
    title: 'Campus Life',
    icon: Home,
    questions: [
      'Best food spots near campus?',
      'Looking for flatmates near JC',
      'Morning jogging group anyone?',
    ],
  },
  {
    title: 'Placements & Career',
    icon: GraduationCap,
    questions: [
      'How to prepare for placements?',
      'Mock interview partners?',
      'Resume tips for freshers?',
    ],
  },
  {
    title: 'Notes & Study',
    icon: Book,
    questions: [
      'Past year papers for DSA?',
      'Study group for CA exams?',
      'Best resources for DBMS?',
    ],
  },
  {
    title: 'Hangouts',
    icon: Coffee,
    questions: [
      'Weekend trip plans?',
      'Movie night this Saturday?',
      'Anyone for board games?',
    ],
  },
  {
    title: 'Gaming',
    icon: Gamepad,
    questions: [
      'Valorant players here?',
      'BGMI squad needed!',
      'Chess tournament interest?',
    ],
  },
  {
    title: 'Buy & Sell',
    icon: Store,
    questions: [
      'Selling old textbooks?',
      'Looking for a used laptop',
      'Trading gaming peripherals?',
    ],
  },
]

/** Welcome cards for empty state */
const welcomeCards: WelcomeCard[] = [
  {
    icon: Users,
    title: 'Find Your People',
    description: 'Connect with students who share your interests',
    query: 'Anyone here into photography?',
    gradient: 'text-zinc-400',
  },
  {
    icon: Book,
    title: 'Study Together',
    description: 'Find study groups and share resources',
    query: 'Looking for a study group for CA Foundation',
    gradient: 'text-zinc-400',
  },
  {
    icon: Calendar,
    title: 'Plan Meetups',
    description: 'Organize trips, events, and hangouts',
    query: 'Weekend trip to Nandi Hills anyone?',
    gradient: 'text-zinc-400',
  },
  {
    icon: Brain,
    title: 'Get Answers',
    description: 'Ask anything about campus life',
    query: 'Best cafes near JC campus for studying?',
    gradient: 'text-zinc-400',
  },
  {
    icon: Music,
    title: 'Hobbies & Fun',
    description: 'Find people with similar hobbies',
    query: 'Any guitarists looking to jam?',
    gradient: 'text-zinc-400',
  },
  {
    icon: GraduationCap,
    title: 'Career Help',
    description: 'Placement prep and career advice',
    query: 'Tips for cracking Amazon interviews?',
    gradient: 'text-zinc-400',
  },
]

/** Suggested follow-up questions */
const getFollowUpSuggestions = (lastMessage: string): string[] => {
  const lower = lastMessage.toLowerCase()
  if (lower.includes('study') || lower.includes('exam')) {
    return [
      'Any study groups for this?',
      'Where can I find notes?',
      'Best study spots on campus?',
    ]
  }
  if (
    lower.includes('food') ||
    lower.includes('cafe') ||
    lower.includes('restaurant')
  ) {
    return [
      'What about budget options?',
      'Any late-night places?',
      'Best for group hangouts?',
    ]
  }
  if (
    lower.includes('trip') ||
    lower.includes('travel') ||
    lower.includes('weekend')
  ) {
    return [
      'How much would it cost?',
      'Who else is interested?',
      'Best time to go?',
    ]
  }
  if (
    lower.includes('game') ||
    lower.includes('gaming') ||
    lower.includes('play')
  ) {
    return [
      'What rank are you?',
      'When do you usually play?',
      'Any tournaments coming up?',
    ]
  }
  return [
    'Tell me more about this',
    'Who else is interested?',
    'Any related discussions?',
  ]
}

/**
 * Main TribeAI chat interface component.
 */
export function TribeAI() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null)
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('tribe-ai-conversations')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setConversations(
          parsed.map((c: Conversation) => ({
            ...c,
            createdAt: new Date(c.createdAt),
            messages: c.messages.map((m: Message) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            })),
          }))
        )
      } catch {}
    }
  }, [])

  const saveConversations = useCallback((convs: Conversation[]) => {
    localStorage.setItem('tribe-ai-conversations', JSON.stringify(convs))
  }, [])

  const startNewConversation = useCallback(() => {
    setMessages([])
    setCurrentConversationId(null)
    setFollowUpSuggestions([])
    setShowHistory(false)
  }, [])

  const loadConversation = useCallback((conv: Conversation) => {
    setMessages(conv.messages)
    setCurrentConversationId(conv.id)
    setShowHistory(false)
    if (conv.messages.length > 0) {
      const lastAiMsg = [...conv.messages]
        .reverse()
        .find((m) => m.type === MessageType.AI)
      if (lastAiMsg) {
        setFollowUpSuggestions(getFollowUpSuggestions(lastAiMsg.content))
      }
    }
  }, [])

  const deleteConversation = useCallback(
    (id: string) => {
      const updated = conversations.filter((c) => c.id !== id)
      setConversations(updated)
      saveConversations(updated)
      if (currentConversationId === id) {
        startNewConversation()
      }
    },
    [
      conversations,
      currentConversationId,
      saveConversations,
      startNewConversation,
    ]
  )

  /**
   * Handles sending a new message and getting AI response.
   */
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: MessageType.User,
      content,
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsLoading(true)
    setIsNavOpen(false)
    setFollowUpSuggestions([])

    try {
      const aiResponse = await getChatResponse(newMessages)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: MessageType.AI,
        content: aiResponse,
        timestamp: new Date(),
      }

      const updatedMessages = [...newMessages, aiMessage]
      setMessages(updatedMessages)
      setFollowUpSuggestions(getFollowUpSuggestions(aiResponse))

      const convId = currentConversationId || Date.now().toString()
      const title = content.slice(0, 30) + (content.length > 30 ? '...' : '')
      const existingConv = conversations.find((c) => c.id === convId)

      let updatedConversations: Conversation[]
      if (existingConv) {
        updatedConversations = conversations.map((c) =>
          c.id === convId ? { ...c, messages: updatedMessages } : c
        )
      } else {
        const newConv: Conversation = {
          id: convId,
          title,
          messages: updatedMessages,
          createdAt: new Date(),
        }
        updatedConversations = [newConv, ...conversations].slice(0, 20)
        setCurrentConversationId(convId)
      }

      setConversations(updatedConversations)
      saveConversations(updatedConversations)
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Unknown error'
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: MessageType.AI,
        content: `⚠️ Couldn't reach the AI: ${reason}. Please try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (messagesEndRef.current && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])

  const hasMessages = messages.length > 0

  return (
    <div className="flex h-screen bg-black relative">
      {/* Subtle Background */}
      {/* Background - Clean Solid */}
      <div className="fixed inset-0 -z-10 bg-black pointer-events-none" />

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-white/5 bg-black h-full">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm">Tribe AI</h1>
            </div>
          </div>

          <ScrollArea className="flex-1 -mx-2 px-2">
            {showHistory ? (
              <div className="space-y-1">
                <div className="mb-4 px-2">
                  <Button
                    onClick={() => setShowHistory(false)}
                    variant="ghost"
                    className="w-full justify-start text-xs text-zinc-500 hover:text-white pl-0 hover:bg-transparent"
                  >
                    ← Back to Topics
                  </Button>
                </div>

                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 px-3">
                  History
                </h2>

                <Button
                  onClick={startNewConversation}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 mb-4 justify-start h-auto"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium text-sm">New Chat</span>
                </Button>

                {conversations.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center py-4">
                    No conversations yet
                  </p>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => loadConversation(conv)}
                      title={conv.title}
                      className={cn(
                        'w-full flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all group text-left',
                        currentConversationId === conv.id
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                      )}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors mt-0.5',
                          currentConversationId === conv.id
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-200'
                        )}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <span className="font-medium text-sm line-clamp-2 block leading-snug">
                          {conv.title}
                        </span>
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteConversation(conv.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all text-red-400 shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 px-3">
                    Explore
                  </h2>

                  <button
                    onClick={() => setShowHistory(true)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-1 group text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-zinc-700 transition-colors">
                      <History className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
                    </div>
                    <div className="flex-1 text-left min-w-0 font-medium text-sm">
                      Chat History
                    </div>
                  </button>
                </div>

                <div className="space-y-1">
                  {navigationCategories.map((category) => {
                    const isActive = activeCategory === category.title
                    return (
                      <div key={category.title} className="mb-1">
                        <button
                          onClick={() =>
                            setActiveCategory(isActive ? null : category.title)
                          }
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group',
                            isActive
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                          )}
                        >
                          <div
                            className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                              isActive
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-200'
                            )}
                          >
                            <category.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 text-left min-w-0 font-medium text-sm">
                            {category.title}
                          </div>
                        </button>

                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-14 pr-2 py-1 space-y-1">
                                {category.questions.map((question) => (
                                  <button
                                    key={question}
                                    onClick={() => handleSendMessage(question)}
                                    className="w-full text-left text-xs py-2 px-3 text-zinc-500 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors line-clamp-2 leading-relaxed"
                                    title={question}
                                  >
                                    {question}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-white/5 relative z-0">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-white/5 bg-black/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="md:hidden hover:bg-white/10"
            >
              {isNavOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <h1 className="text-base font-semibold text-white">Tribe AI</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={startNewConversation}
              className="text-zinc-400 hover:text-white hover:bg-white/10 gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">New Chat</span>
            </Button>
          </div>
        </header>

        {/* Main Area */}
        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto scroll-smooth"
        >
          {!hasMessages ? (
            /* Empty State - Welcome Cards */
            <div className="h-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-start pt-12 md:pt-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 text-left"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                  Welcome to Tribe AI
                </h2>
                <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
                  Your intelligent campus assistant. Ask questions, find
                  resources, or explore the community.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {welcomeCards.map((card, i) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => handleSendMessage(card.query)}
                    className="bg-zinc-900/40 border border-white/5 hover:bg-zinc-900 hover:border-zinc-700 rounded-2xl p-5 cursor-pointer transition-all group flex flex-col h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
                          card.gradient.replace('bg-', 'bg-opacity-10 bg-')
                        )}
                      >
                        <card.icon className="w-5 h-5" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </div>

                    <h3 className="font-semibold text-white mb-1.5 text-base">
                      {card.title}
                    </h3>
                    <p className="text-sm text-zinc-500 mb-4 flex-1 leading-relaxed">
                      {card.description}
                    </p>

                    <div className="pt-3 border-t border-white/5">
                      <p className="text-xs text-zinc-400 font-medium group-hover:text-blue-400 transition-colors truncate">
                        &ldquo;{card.query}&rdquo;
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            /* Chat Messages */
            <div className="px-4 py-6">
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col gap-6">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full"
                    >
                      {/* TribeAI Header */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/15 flex items-center justify-center animate-pulse">
                          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-zinc-400">
                          TribeAI
                        </span>
                        <span className="text-xs text-zinc-600">
                          is thinking...
                        </span>
                      </div>
                      {/* Skeleton lines */}
                      <div className="space-y-2">
                        <div className="h-4 bg-zinc-800 rounded-lg w-3/4 animate-pulse" />
                        <div
                          className="h-4 bg-zinc-800 rounded-lg w-1/2 animate-pulse"
                          style={{ animationDelay: '0.1s' }}
                        />
                        <div
                          className="h-4 bg-zinc-800 rounded-lg w-2/3 animate-pulse"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Follow-up Suggestions */}
                  {!isLoading && followUpSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap gap-2 pl-14"
                    >
                      {followUpSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSendMessage(suggestion)}
                          className="px-3 py-1.5 text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/20 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="sticky bottom-0 bg-black/80 backdrop-blur-xl border-t border-white/5">
          <div className="max-w-2xl mx-auto">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR - Events & Opportunities */}
      <div className="hidden xl:flex xl:flex-col w-80 bg-black/50 backdrop-blur-xl h-full border-l border-white/5">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="font-semibold text-white">Events & Opportunities</h2>
          </div>
          <p className="text-xs text-zinc-500">Curated for students</p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-8">
            {/* Upcoming Events Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                Upcoming Events
              </h3>
              <EventsList category="events" />
            </div>

            {/* Career Opportunities Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-3 h-3" />
                Career Opportunities
              </h3>
              <EventsList category="opportunities" />
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsNavOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-black border-r border-white/5 z-50 md:hidden flex flex-col"
            >
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h1 className="font-bold text-white">Tribe AI</h1>
                    <p className="text-xs text-zinc-500">Campus Assistant</p>
                  </div>
                </div>
              </div>
              <ScrollArea className="flex-1 p-3">
                <Button
                  onClick={startNewConversation}
                  className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 mb-3"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
                <p className="text-xs text-zinc-500 uppercase tracking-wider px-3 mb-3">
                  Topics
                </p>
                <div className="space-y-1">
                  {navigationCategories.map((category) => (
                    <Button
                      key={category.title}
                      variant="ghost"
                      className="w-full justify-start gap-3 h-auto py-3 px-3 hover:bg-white/5"
                      onClick={() => {
                        handleSendMessage(category.questions[0])
                      }}
                    >
                      <category.icon className="h-5 w-5 text-blue-400" />
                      <span className="text-sm">{category.title}</span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function EventsList({ category }: { category: 'events' | 'opportunities' }) {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events')
        const data = await res.json()
        if (data.events) {
          setEvents(data.events)
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const filteredEvents = events.filter((e) => e.category === category)

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 text-center">
        <p className="text-xs text-zinc-500 italic">
          No {category === 'events' ? 'upcoming events' : 'opportunities'} found
          right now.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

function EventCard({ event }: { event: EventItem }) {
  return (
    <a
      href={event.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 rounded-lg bg-zinc-900/40 border border-white/5 hover:bg-zinc-800/40 hover:border-blue-500/30 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span
          className={cn(
            'text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide',
            event.source === 'internal'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
          )}
        >
          {event.source === 'internal' ? 'From Tribe' : 'Web Update'}
        </span>
        {event.date && (
          <span className="text-[10px] text-zinc-500">
            {new Date(event.date).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}
      </div>
      <h4 className="font-medium text-sm text-zinc-200 line-clamp-2 mb-1 group-hover:text-white transition-colors">
        {event.title}
      </h4>
      <p className="text-xs text-zinc-500 line-clamp-2 mb-2">{event.snippet}</p>
      <div className="flex items-center justify-between text-[10px] text-zinc-600 uppercase tracking-wide">
        <span>{event.type}</span>
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </a>
  )
}
