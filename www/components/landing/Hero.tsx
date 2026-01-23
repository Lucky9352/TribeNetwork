'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Building2, GraduationCap } from 'lucide-react'
import ParallaxBackground from './ParallaxBackground'
import PhoneMockup from './PhoneMockup'
import AppNavigation from './AppNavigation'
import TopicMarquee from './TopicMarquee'

/**
 * @file Hero.tsx
 * @description The main landing page hero section.
 * Features staggered text animations, a parallax background, and a 3D interactive phone mockup.
 */

const HERO_CONTENT = {
  titlePart1: 'TRIBE',
  titlePart2: 'NETWORK.',
  description:
    'The unified ecosystem for campus communities. Connect, explore intelligence, and grow.',
}

interface HeroProps {
  onOpenPartnership?: () => void
  onOpenUniversity?: () => void
}

/**
 * Animated text component that reveals characters one by one.
 */
const StaggeredText = ({
  text,
  className = '',
  wrapperClassName = '',
}: {
  text: string
  className?: string
  wrapperClassName?: string
}) => (
  <span className={`inline-block ${wrapperClassName}`}>
    {Array.from(text).map((char, i) => (
      <motion.span
        key={i}
        variants={{
          hidden: { y: 100, opacity: 0, filter: 'blur(10px)' },
          visible: {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            transition: {
              type: 'spring',
              damping: 12,
              stiffness: 100,
            },
          },
        }}
        className={`inline-block ${className}`}
      >
        {char}
      </motion.span>
    ))}
  </span>
)

interface HeroContentProps {
  onOpenPartnership?: () => void
  onOpenUniversity?: () => void
}

const HeroContent = ({
  onOpenPartnership,
  onOpenUniversity,
}: HeroContentProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }}
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    }}
    className="space-y-6"
  >
    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9]">
      <StaggeredText
        text={HERO_CONTENT.titlePart1}
        wrapperClassName="overflow-hidden"
      />
      <br />
      <StaggeredText
        text={HERO_CONTENT.titlePart2}
        wrapperClassName="text-purple-400"
      />
    </h1>
    <motion.p
      variants={{
        hidden: { opacity: 0, x: -20, filter: 'blur(5px)' },
        visible: {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.8, ease: 'easeOut' },
        },
      }}
      className="text-xl text-gray-400 font-light max-w-lg"
    >
      {HERO_CONTENT.description}
    </motion.p>

    {/* CTA Buttons */}
    {(onOpenPartnership || onOpenUniversity) && (
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.4, duration: 0.5 },
          },
        }}
        className="flex flex-wrap gap-3 pt-4"
      >
        {onOpenPartnership && (
          <button
            onClick={onOpenPartnership}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-full hover:scale-105 transition-all"
          >
            <Building2 className="w-4 h-4" />
            Partner With Us
          </button>
        )}
        {onOpenUniversity && (
          <button
            onClick={onOpenUniversity}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-full hover:scale-105 transition-all"
          >
            <GraduationCap className="w-4 h-4" />
            Bring Tribe to Campus
          </button>
        )}
      </motion.div>
    )}
  </motion.div>
)

const HeroVisual = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
    animate={{ opacity: 1, scale: 1, rotate: -6 }}
    transition={{ duration: 0.8, type: 'spring', delay: 0.2 }}
    className="relative"
  >
    <PhoneMockup>
      <AppNavigation />
    </PhoneMockup>

    {/* Decorative Elements around phone */}
    <div className="absolute -z-10 top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
    <div className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
  </motion.div>
)

/**
 * Main Hero Section Component.
 */
export default function Hero({
  onOpenPartnership,
  onOpenUniversity,
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-start overflow-hidden bg-black text-white selection:bg-purple-500/30 pt-12 lg:pt-16 pb-24 lg:pb-32">
      {/* Scrolling Text Background */}
      <ParallaxBackground />

      {/* Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        {/* LEFT SIDE: Headings + Description */}
        <div className="lg:col-span-7 flex flex-col space-y-12">
          <HeroContent
            onOpenPartnership={onOpenPartnership}
            onOpenUniversity={onOpenUniversity}
          />
        </div>

        {/* RIGHT SIDE: Phone Mockup */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <HeroVisual />
        </div>
      </div>

      {/* "Background Running Thing" - Full Width Topic Marquee */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-0 opacity-100 pointer-events-none">
        <TopicMarquee />
      </div>
    </section>
  )
}
