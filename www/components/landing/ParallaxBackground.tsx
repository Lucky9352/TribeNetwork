'use client'

import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * @file ParallaxBackground.tsx
 * @description A background component that renders multiple layers of scrolling text
 * moving at different velocities to create a parallax depth effect.
 */

interface ParallaxLayerData {
  text: string
  velocity: number
}

interface ParallaxLayerProps extends ParallaxLayerData {
  children?: never
}

const BACKGROUND_LAYERS: ParallaxLayerData[] = [
  { text: 'TRIBE NETWORK', velocity: -2 },
  { text: 'COMMUNITY AI GROWTH', velocity: 2 },
  { text: 'FUTURE OF CAMPUS', velocity: -1.5 },
  { text: 'JOIN THE TRIBE', velocity: 3 },
]

/**
 * Renders a single horizontal scrolling text layer.
 * Fizz actually uses horizontal movement on vertical scroll.
 */
function ParallaxTextLayer({ text, velocity = 5 }: ParallaxLayerProps) {
  const { scrollY } = useScroll()
  const x = useTransform(scrollY, [0, 1000], [0, velocity * 100])

  return (
    <motion.div
      style={{ x, WebkitTextStroke: '2px rgba(255,255,255,0.05)' }}
      className="text-[8rem] sm:text-[12rem] md:text-[20rem] font-black uppercase tracking-tighter text-transparent stroke-white/5 stroke-2 flex whitespace-nowrap leading-none select-none"
    >
      <span className="mx-4">{text}</span>
      <span className="mx-4">{text}</span>
      <span className="mx-4">{text}</span>
    </motion.div>
  )
}

/**
 * Main ParallaxBackground Component.
 */
export default function ParallaxBackground() {
  return (
    <div className="fixed inset-0 z-0 flex flex-col justify-center pointer-events-none overflow-hidden space-y-[-50px]">
      {BACKGROUND_LAYERS.map((layer, index) => (
        <ParallaxTextLayer
          key={`${layer.text}-${index}`}
          text={layer.text}
          velocity={layer.velocity}
        />
      ))}
    </div>
  )
}
