'use client'

import React, { useCallback } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * @file Spotlight.tsx
 * @description A container component that adds a mouse-following spotlight effect.
 * Creates a radial gradient that follows the cursor for an interactive hover effect.
 */

interface SpotlightProps {
  children: React.ReactNode
  className?: string
}

/**
 * Spotlight Component
 * Renders a container with a mouse-tracking radial gradient spotlight effect.
 *
 * @param {SpotlightProps} props - The props for the Spotlight component.
 * @param {React.ReactNode} props.children - Content to render inside the spotlight container.
 * @param {string} [props.className] - Additional classes to apply to the container.
 * @returns {JSX.Element} The rendered Spotlight component.
 */
export const Spotlight = ({ children, className }: SpotlightProps) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = useCallback(
    ({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) => {
      const { left, top } = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - left)
      mouseY.set(clientY - top)
    },
    [mouseX, mouseY]
  )

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-white/10 bg-white/5',
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  )
}
