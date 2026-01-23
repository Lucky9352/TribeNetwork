'use client'

import React, { memo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * @file Marquee.tsx
 * @description An infinite scrolling marquee component displaying university names.
 * Fetches universities from the database, with fallback to defaults.
 */

const DEFAULT_UNIVERSITIES = [
  'Stanford University',
  'MIT',
  'Harvard',
  'UC Berkeley',
  'Yale',
  'Princeton',
  'Columbia',
  'UCLA',
  'Cornell',
  'UPenn',
  'Duke',
  'Caltech',
]

const MarqueeItem = ({ text }: { text: string }) => (
  <span className="text-2xl font-bold text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors cursor-default shrink-0">
    {text}
  </span>
)

const MarqueeContent = memo(function MarqueeContent({
  universities,
}: {
  universities: string[]
}) {
  const loopedUniversities = [...universities, ...universities]

  return (
    <div className="flex overflow-hidden select-none">
      <motion.div
        className="flex shrink-0 items-center gap-16 pr-16"
        animate={{ x: '-50%' }}
        transition={{
          duration: 30,
          ease: 'linear',
          repeat: Infinity,
        }}
        style={{ width: 'fit-content' }}
      >
        {loopedUniversities.map((uni, i) => (
          <MarqueeItem key={`${uni}-${i}`} text={uni} />
        ))}
      </motion.div>
    </div>
  )
})

/**
 * Main Marquee Component.
 */
export default function Marquee() {
  const [universities, setUniversities] =
    useState<string[]>(DEFAULT_UNIVERSITIES)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    async function fetchUniversities() {
      try {
        const res = await fetch('/api/featured-universities')
        if (res.ok) {
          const data = await res.json()
          if (data.data && data.data.length > 0) {
            setUniversities(data.data.map((u: { name: string }) => u.name))
          }
        }
      } catch {
      } finally {
        setIsLoaded(true)
      }
    }

    fetchUniversities()
  }, [])

  return (
    <div className="relative flex overflow-hidden py-10 bg-black border-y border-white/5">
      <div className="absolute inset-y-0 left-0 w-24 bg-black z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-black z-10 pointer-events-none" />
      {isLoaded ? (
        <MarqueeContent universities={universities} />
      ) : (
        <MarqueeContent universities={DEFAULT_UNIVERSITIES} />
      )}
    </div>
  )
}
