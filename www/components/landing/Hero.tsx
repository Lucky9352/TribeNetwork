'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Building2, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  titlePart2: 'NETWORK',
  description:
    'The premier digital infrastructure for university campuses. Unifiying communities, amplifying intelligence, and fostering growth.',
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
    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white leading-[1.1] sm:leading-[0.9]">
      <StaggeredText
        text={HERO_CONTENT.titlePart1}
        wrapperClassName="overflow-hidden"
      />
      <br />
      <StaggeredText
        text={HERO_CONTENT.titlePart2}
        wrapperClassName="text-blue-500"
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
      className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium max-w-lg leading-relaxed"
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
          <Button
            onClick={onOpenPartnership}
            className="group gap-2 rounded-full hover:scale-105 transition-all text-sm font-bold h-auto py-3 px-6 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 border border-white/10"
          >
            <Building2 className="w-4 h-4" />
            Institutional Partnerships
          </Button>
        )}
        {onOpenUniversity && (
          <Button
            onClick={onOpenUniversity}
            variant="secondary"
            className="group gap-2 rounded-full hover:scale-105 transition-all text-sm font-bold h-auto py-3 px-6 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 border border-white/10"
          >
            <GraduationCap className="w-4 h-4" />
            Deploy At Your Campus
          </Button>
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
    <PhoneMockup hideHeader={true}>
      <AppNavigation />
    </PhoneMockup>
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
    <section className="relative min-h-screen flex flex-col justify-start pb-0">
      {/* Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none"></div>

      <div className="relative z-10 w-full px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start pt-24 lg:pt-32">
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

      <div className="absolute top-[101%] lg:top-[65%] left-0 right-0 -translate-y-1/2 z-0 opacity-100 pointer-events-none max-w-[100vw] overflow-visible">
        <TopicMarquee />
      </div>
    </section>
  )
}
