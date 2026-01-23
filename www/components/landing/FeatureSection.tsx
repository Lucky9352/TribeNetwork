'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { LucideIcon, ArrowRight } from 'lucide-react'
import { Spotlight } from '@/components/ui/Spotlight'

/**
 * @file FeatureSection.tsx
 * @description A standalone feature section component with scroll-linked parallax animations.
 * Provides a split layout (text + visual) with customizable alignment and theming.
 */

type FeatureAlignment = 'left' | 'right'
type FeatureColor = 'purple' | 'blue' | 'green' | 'orange' | 'pink'

interface FeatureSectionProps {
  title: string
  subtitle: string
  description: string
  alignment: FeatureAlignment
  color: FeatureColor
  icon: LucideIcon
  href: string
  visual: React.ReactNode
}

const COLOR_VARIANTS: Record<
  FeatureColor,
  {
    badgeBg: string
    badgeBorder: string
    badgeText: string
    glow: string
    linkText: string
  }
> = {
  purple: {
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/20',
    badgeText: 'text-purple-400',
    glow: 'bg-purple-500/20',
    linkText: 'text-purple-400',
  },
  blue: {
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/20',
    badgeText: 'text-blue-400',
    glow: 'bg-blue-500/20',
    linkText: 'text-blue-400',
  },
  green: {
    badgeBg: 'bg-green-500/10',
    badgeBorder: 'border-green-500/20',
    badgeText: 'text-green-400',
    glow: 'bg-green-500/20',
    linkText: 'text-green-400',
  },
  orange: {
    badgeBg: 'bg-orange-500/10',
    badgeBorder: 'border-orange-500/20',
    badgeText: 'text-orange-400',
    glow: 'bg-orange-500/20',
    linkText: 'text-orange-400',
  },
  pink: {
    badgeBg: 'bg-pink-500/10',
    badgeBorder: 'border-pink-500/20',
    badgeText: 'text-pink-400',
    glow: 'bg-pink-500/20',
    linkText: 'text-pink-400',
  },
}

const FeatureText = ({
  title,
  subtitle,
  description,
  color,
  icon: Icon,
  href,
  alignment,
  opacity,
}: {
  title: string
  subtitle: string
  description: string
  color: FeatureColor
  icon: LucideIcon
  href: string
  alignment: FeatureAlignment
  opacity: MotionValue<number>
}) => {
  const styles = COLOR_VARIANTS[color]

  return (
    <motion.div
      style={{ opacity }}
      className={`space-y-8 ${alignment === 'right' ? 'lg:col-start-2' : ''}`}
    >
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${styles.badgeBg} border ${styles.badgeBorder} ${styles.badgeText} text-sm font-medium`}
      >
        <Icon className="w-4 h-4" />
        {subtitle}
      </div>

      <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[1.1]">
        {title}
      </h2>

      <p className="text-xl text-gray-400 font-light leading-relaxed max-w-lg">
        {description}
      </p>

      <Link href={href} className="inline-block group">
        <span
          className={`flex items-center text-lg font-medium ${styles.linkText} group-hover:text-white transition-colors`}
        >
          Explore {subtitle}
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
        </span>
      </Link>
    </motion.div>
  )
}

const FeatureVisual = ({
  visual,
  color,
  alignment,
  y,
}: {
  visual: React.ReactNode
  color: FeatureColor
  alignment: FeatureAlignment
  y: MotionValue<number>
}) => {
  const styles = COLOR_VARIANTS[color]

  return (
    <div className={`${alignment === 'right' ? 'lg:col-start-1' : ''}`}>
      <motion.div style={{ y }} className="relative">
        <Spotlight className="aspect-4/3 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-center overflow-hidden">
          {visual}
        </Spotlight>

        {/* Decorative Glow */}
        <div
          className={`absolute -inset-10 -z-10 ${styles.glow} blur-[100px] rounded-full opacity-50`}
        />
      </motion.div>
    </div>
  )
}

/**
 * Main Feature Section Component.
 */
export default function FeatureSection(props: FeatureSectionProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0])

  return (
    <section
      ref={ref}
      className="min-h-[80vh] flex items-center py-24 relative overflow-hidden"
    >
      <div
        className={`max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full ${
          props.alignment === 'right' ? 'lg:grid-flow-dense' : ''
        }`}
      >
        <FeatureText {...props} opacity={opacity} />
        <FeatureVisual
          visual={props.visual}
          color={props.color}
          alignment={props.alignment}
          y={y}
        />
      </div>
    </section>
  )
}
