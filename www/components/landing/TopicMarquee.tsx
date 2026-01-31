'use client'

import React from 'react'
import { motion } from 'framer-motion'

/**
 * @file TopicMarquee.tsx
 * @description A dual-row infinite scrolling marquee component.
 * Displays a mix of bold text and styled pills to showcase platform topics.
 */

interface MarqueeItemData {
  type: 'text' | 'pill'
  content: string
  color?: string
  textColor?: string
}

const MARQUEE_ROW_1: MarqueeItemData[] = [
  { type: 'text', content: 'BE HONEST' },
  {
    type: 'pill',
    content: 'CONFESSION',
    color: 'bg-pink-500',
    textColor: 'text-pink-100',
  },
  { type: 'text', content: 'BE BRAVE' },
  {
    type: 'pill',
    content: 'CRUSH',
    color: 'bg-indigo-500',
    textColor: 'text-indigo-100',
  },
  { type: 'text', content: 'BE SUPPORTIVE' },
  {
    type: 'pill',
    content: 'SHOUTOUT',
    color: 'bg-green-500',
    textColor: 'text-green-100',
  },
  { type: 'text', content: 'BE YOURSELF' },
  {
    type: 'pill',
    content: 'DRAMA',
    color: 'bg-red-500',
    textColor: 'text-red-100',
  },
  { type: 'text', content: 'BE REAL' },
  {
    type: 'pill',
    content: 'GOSSIP',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-100',
  },
]

const MARQUEE_ROW_2: MarqueeItemData[] = [
  { type: 'text', content: 'ASK ANYTHING' },
  {
    type: 'pill',
    content: 'QUESTIONS',
    color: 'bg-blue-500',
    textColor: 'text-blue-100',
  },
  { type: 'text', content: 'FIND FRIENDS' },
  {
    type: 'pill',
    content: 'STUDY BUDDY',
    color: 'bg-cyan-500',
    textColor: 'text-cyan-100',
  },
  { type: 'text', content: 'GET ACTIVE' },
  {
    type: 'pill',
    content: 'EVENTS',
    color: 'bg-orange-500',
    textColor: 'text-orange-100',
  },
  { type: 'text', content: 'BUY & SELL' },
  {
    type: 'pill',
    content: 'MARKET',
    color: 'bg-lime-500',
    textColor: 'text-lime-100',
  },
  { type: 'text', content: 'FIND LOVE' },
  {
    type: 'pill',
    content: 'DATING',
    color: 'bg-rose-500',
    textColor: 'text-rose-100',
  },
]

const MarqueeText = ({ content }: { content: string }) => (
  <span className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white/90">
    {content}
  </span>
)

const MarqueePill = ({
  content,
  color,
  textColor,
}: {
  content: string
  color?: string
  textColor?: string
}) => (
  <div
    className={`px-5 py-2 sm:px-8 sm:py-3 rounded-full ${color} border-2 sm:border-4 border-white/10 shadow-2xl transform -rotate-2`}
  >
    <span
      className={`text-base sm:text-2xl md:text-4xl font-bold tracking-widest ${textColor}`}
    >
      {content}
    </span>
  </div>
)

const MarqueeRow = ({
  items,
  direction,
  duration,
}: {
  items: MarqueeItemData[]
  direction: 'left' | 'right'
  duration: number
}) => {
  const loopedItems = [...items, ...items]

  return (
    <div className="flex overflow-hidden relative w-full select-none">
      <motion.div
        className="flex shrink-0 items-center justify-around whitespace-nowrap gap-12 pr-12 will-change-transform"
        initial={{ x: direction === 'left' ? '0%' : '-50%' }}
        animate={{ x: direction === 'left' ? '-50%' : '0%' }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: duration,
        }}
        style={{ width: 'fit-content' }}
      >
        {loopedItems.map((item, i) => (
          <div key={`${direction}-${i}`} className="shrink-0 flex items-center">
            {item.type === 'text' ? (
              <MarqueeText content={item.content} />
            ) : (
              <MarqueePill
                content={item.content}
                color={item.color}
                textColor={item.textColor}
              />
            )}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/**
 * Main TopicMarquee Component.
 */
export default function TopicMarquee() {
  return (
    <div className="w-full flex flex-col gap-4 sm:gap-8 py-10 select-none overflow-visible">
      <MarqueeRow items={MARQUEE_ROW_1} direction="left" duration={40} />
      <MarqueeRow items={MARQUEE_ROW_2} direction="right" duration={45} />
    </div>
  )
}
