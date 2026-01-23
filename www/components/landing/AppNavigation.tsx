'use client'

import React from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Users,
  Megaphone,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
} from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * @file AppNavigation.tsx
 * @description A demo component simulating the "Feed" view of the mobile application.
 * It showcases the community aspect and navigation structure.
 */

interface PostStats {
  likes: string
  comments: string
}

interface PostData {
  id: string
  author: string
  handle: string
  avatarColor: string
  content: string
  tag?: string
  tagColor?: string
  stats: PostStats
  href: string
}

const FEED_ITEMS: PostData[] = [
  {
    id: 'post-community',
    author: 'Tribe Community',
    handle: 'community',
    avatarColor: 'bg-purple-600',
    content:
      'We are building the largest network of campus communities. Connect, share, and grow with peers from 100+ universities! 🎓✨',
    tag: 'Community',
    tagColor: 'bg-purple-500/20 text-purple-400',
    stats: { likes: '5.2k', comments: '420' },
    href: '/community',
  },
  {
    id: 'post-ai',
    author: 'Tribe AI Lab',
    handle: 'ai_research',
    avatarColor: 'bg-blue-600',
    content:
      'Experience the future of campus intelligence. Our new AI tools help you study smarter, not harder. 🤖🧠\n\nTry it now inside.',
    tag: 'Artificial Intelligence',
    tagColor: 'bg-blue-500/20 text-blue-400',
    stats: { likes: '3.8k', comments: '156' },
    href: '/ai',
  },
  {
    id: 'post-advertise',
    author: 'Tribe Brands',
    handle: 'advertise',
    avatarColor: 'bg-green-600',
    content:
      'Want to reach students effectively? Launch your campaign across our network in minutes. 🚀📈',
    tag: 'Sponsored',
    tagColor: 'bg-green-500/20 text-green-400',
    stats: { likes: '1.2k', comments: '89' },
    href: '/advertise',
  },
  {
    id: 'post-events',
    author: 'Campus Events',
    handle: 'events_blr',
    avatarColor: 'bg-orange-600',
    content:
      'Hackathon this weekend! 💻 Join 500+ developers at IIT Bangalore. Prizes worth ₹5L up for grabs. Register now! 👇',
    tag: 'Event',
    tagColor: 'bg-orange-500/20 text-orange-400',
    stats: { likes: '892', comments: '124' },
    href: '/community',
  },
  {
    id: 'post-lifestyle',
    author: 'Bangalore Vibes',
    handle: 'blr_student_life',
    avatarColor: 'bg-pink-600',
    content:
      'Best study spot detected: Third Wave Coffee, Koramangala. ☕️📚 Quiet, good wifi, great coffee.',
    tag: 'Lifestyle',
    tagColor: 'bg-pink-500/20 text-pink-400',
    stats: { likes: '2.1k', comments: '34' },
    href: '/community',
  },
]

const PostCard = ({ post, index }: { post: PostData; index: number }) => (
  <Link href={post.href} className="block mb-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/5 hover:border-white/20 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${post.avatarColor} flex items-center justify-center font-bold text-white text-sm shrink-0`}
          >
            {post.author[0]}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-white font-semibold text-sm">
                {post.author}
              </h3>
              <span className="text-blue-400 text-[10px] bg-blue-400/10 px-1 rounded">
                Verified
              </span>
            </div>
            <p className="text-gray-500 text-xs">@{post.handle} · 2h</p>
          </div>
        </div>
        <MoreHorizontal className="text-gray-500 w-4 h-4" />
      </div>

      <p className="text-gray-200 text-sm mb-4 leading-relaxed whitespace-pre-line">
        {post.content}
      </p>

      {post.tag && (
        <div
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${post.tagColor}`}
        >
          {post.tag}
        </div>
      )}

      <div className="flex items-center justify-between text-gray-500 text-xs border-t border-white/5 pt-3">
        <div className="flex items-center gap-1 hover:text-red-400 transition-colors">
          <Heart className="w-4 h-4" /> {post.stats.likes}
        </div>
        <div className="flex items-center gap-1 hover:text-blue-400 transition-colors">
          <MessageCircle className="w-4 h-4" /> {post.stats.comments}
        </div>
        <div className="flex items-center gap-1 hover:text-green-400 transition-colors">
          <Share2 className="w-4 h-4" /> Share
        </div>
      </div>
    </motion.div>
  </Link>
)

const BottomNav = () => (
  <div className="fixed bottom-0 w-full h-16 bg-[#0a0a0a]/90 backdrop-blur-lg border-t border-white/5 flex items-center justify-around px-6 z-50 rounded-b-[40px] max-w-[inherit]">
    <div className="p-2 text-white cursor-pointer hover:bg-white/10 rounded-full transition-colors">
      <Sparkles className="w-6 h-6" />
    </div>
    <div className="p-2 text-gray-600 cursor-pointer hover:text-white hover:bg-white/10 rounded-full transition-colors">
      <Users className="w-6 h-6" />
    </div>
    <div className="p-2 text-gray-600 cursor-pointer hover:text-white hover:bg-white/10 rounded-full transition-colors">
      <Megaphone className="w-6 h-6" />
    </div>
  </div>
)

const FeedList = () => (
  <div className="px-4 py-4 space-y-4">
    {FEED_ITEMS.map((post, index) => (
      <PostCard key={post.id} post={post} index={index} />
    ))}
    <div className="p-4 bg-transparent text-center text-gray-600 text-xs">
      You&apos;re all caught up!
    </div>
  </div>
)

/**
 * Main App Navigation Screen Component.
 */
export default function AppNavigation() {
  return (
    <div className="pb-36 font-sans">
      <FeedList />
      <BottomNav />
    </div>
  )
}
