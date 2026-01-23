'use client'

import React from 'react'
import { Heart, MessageCircle, Share2, Eye } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * @file CommunityScreen.tsx
 * @description Mock forum feed for JAIN University Tribe Community.
 * Shows anonymous confessions, study groups, and campus discussions.
 */

interface User {
  name: string
  handle: string
  avatarGradient: string
}

interface Post {
  id: string
  user: User
  time: string
  content: string | React.ReactNode
  likes: string
  comments: string
  views?: string
  tag?: string
  tagColor?: string
}

const FEED_DATA: Post[] = [
  {
    id: 'post-1',
    user: {
      name: 'Anonymous',
      handle: '@confession',
      avatarGradient: 'bg-pink-500/20',
    },
    time: '2h',
    content: (
      <>
        That moment when you accidentally unmute yourself during online class
        while roasting the professor 💀 Anyone else from JC campus relate?
      </>
    ),
    likes: '324',
    comments: '47',
    views: '2.1k',
    tag: 'confession',
    tagColor: 'bg-pink-500/20 text-pink-400',
  },
  {
    id: 'post-2',
    user: {
      name: 'StudyBuddy',
      handle: '@jain_bba',
      avatarGradient: 'bg-blue-500/20',
    },
    time: '5h',
    content:
      'Looking for a study group for CA Foundation! Anyone preparing for Nov attempt? 📚',
    likes: '89',
    comments: '23',
    tag: 'notes-links',
    tagColor: 'bg-blue-500/20 text-blue-400',
  },
  {
    id: 'post-3',
    user: {
      name: 'PlanMaster',
      handle: '@weekend_vibes',
      avatarGradient: 'bg-emerald-500/20',
    },
    time: '1d',
    content: (
      <>
        Weekend trip to Nandi Hills anyone? 🏔️ Planning for Saturday 6 AM start.
        DM if interested!
        <span className="text-purple-400"> #meetup</span>
      </>
    ),
    likes: '156',
    comments: '34',
    tag: 'plan-meet',
    tagColor: 'bg-green-500/20 text-green-400',
  },
]

const MobileHeader = () => (
  <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 shrink-0 bg-zinc-950 z-10 sticky top-0">
    <span className="font-bold text-lg tracking-tight">Tribe</span>
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500">JAIN University</span>
      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
        <span className="text-xs">🎓</span>
      </div>
    </div>
  </div>
)

const PostTag = ({ tag, color }: { tag: string; color: string }) => (
  <span
    className={`text-[10px] px-2 py-0.5 rounded-full ${color} uppercase tracking-wider`}
  >
    {tag}
  </span>
)

const PostActions = ({
  likes,
  comments,
  views,
}: {
  likes: string
  comments: string
  views?: string
}) => (
  <div className="flex justify-between px-2 text-zinc-500 mt-3">
    <button className="flex gap-1.5 hover:text-red-500 transition-colors group items-center">
      <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
      <span className="text-xs">{likes}</span>
    </button>
    <button className="flex gap-1.5 hover:text-blue-500 transition-colors items-center">
      <MessageCircle className="w-4 h-4" />
      <span className="text-xs">{comments}</span>
    </button>
    {views && (
      <button className="flex gap-1.5 items-center text-zinc-600">
        <Eye className="w-4 h-4" />
        <span className="text-xs">{views}</span>
      </button>
    )}
    <button className="hover:text-green-500 transition-colors">
      <Share2 className="w-4 h-4" />
    </button>
  </div>
)

const FeedPost = ({ post, index }: { post: Post; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
    className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-default"
  >
    <div className="flex gap-3 mb-2">
      <div
        className={`w-10 h-10 rounded-full ${post.user.avatarGradient} shrink-0`}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sm">{post.user.name}</span>
          <span className="text-zinc-500 text-xs">
            {post.user.handle} • {post.time}
          </span>
          {post.tag && (
            <PostTag
              tag={post.tag}
              color={post.tagColor || 'bg-zinc-700 text-zinc-400'}
            />
          )}
        </div>
        <div className="text-sm mt-2 leading-relaxed text-zinc-300">
          {post.content}
        </div>
      </div>
    </div>
    <PostActions
      likes={post.likes}
      comments={post.comments}
      views={post.views}
    />
  </motion.div>
)

/**
 * Main component for the Community Screen demo.
 */
export default function CommunityScreen() {
  return (
    <div className="w-full h-full bg-zinc-950 text-white overflow-hidden flex flex-col font-sans">
      <MobileHeader />
      <div className="flex-1 overflow-y-auto no-scrollbar p-0 space-y-0 pb-10">
        {FEED_DATA.map((post, i) => (
          <FeedPost key={post.id} post={post} index={i} />
        ))}
      </div>
    </div>
  )
}
