'use client'

import React, { MouseEvent } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Users,
  Sparkles,
  Megaphone,
  ArrowUpRight,
  LucideIcon,
} from 'lucide-react'
import { Spotlight } from '@/components/ui/Spotlight'
import { siteConfig } from '@/lib/site-config'

/**
 * @file BentoGrid.tsx
 * @description A 3D tilt-interactive grid component showcasing main platform features.
 * Uses physics-based springs for mouse interaction and Framer Motion for entrance animations.
 */

type CardVariant = 'default' | 'community' | 'ai'

interface BentoItem {
  id: string
  href: string
  title: string
  subtitle: string
  icon: LucideIcon
  logoGradient: string
  iconColor?: string
  delay: number
  variant?: CardVariant
  className?: string
}

const BENTO_ITEMS: BentoItem[] = [
  {
    id: 'community',
    href: siteConfig.urls.community,
    title: 'Tribe Community',
    subtitle: 'Join 100+ campuses. The largest student network.',
    icon: Users,
    logoGradient: 'bg-purple-500/15',
    iconColor: 'text-purple-400',
    delay: 0.2,
    variant: 'community',
    className: 'col-span-1 sm:col-span-2 aspect-[1.1/1] sm:aspect-[2.2/1]',
  },
  {
    id: 'ai',
    href: siteConfig.urls.ai,
    title: 'AI Lab',
    subtitle: 'Future of study.',
    icon: Sparkles,
    logoGradient: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    delay: 0.3,
    variant: 'ai',
    className: 'col-span-1 aspect-square',
  },
  {
    id: 'advertise',
    href: siteConfig.urls.advertise,
    title: 'Advertise',
    subtitle: 'Reach students.',
    icon: Megaphone,
    logoGradient: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    delay: 0.4,
    variant: 'default',
    className: 'col-span-1 aspect-square',
  },
]

/**
 * A container that tilts based on mouse position using spring physics.
 */
const TiltCard = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 })

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: MouseEvent<HTMLDivElement>) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect()

    const xPct = (clientX - left) / width - 0.5
    const yPct = (clientY - top) / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7])

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative preserve-3d ${className}`}
    >
      {children}
    </motion.div>
  )
}

export const BentoCard = ({ item }: { item: BentoItem }) => {
  const {
    className,
    href,
    title,
    subtitle,
    icon: Icon,
    logoGradient,
    delay,
  } = item

  return (
    <div className={`${className} perspective-1000`}>
      <TiltCard className="h-full w-full">
        <Link href={href} className="block h-full group">
          <Spotlight className="h-full flex flex-col p-6 transition-colors duration-500 hover:border-white/30 bg-zinc-900/30 backdrop-blur-sm border border-white/10 rounded-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay, duration: 0.6 }}
              className="relative z-10 flex flex-col h-full transform-gpu"
              style={{ transform: 'translateZ(20px)' }}
            >
              <div
                className={`w-12 h-12 rounded-full ${logoGradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}
              >
                <Icon
                  className={`w-6 h-6 ${item.iconColor || 'text-purple-400'}`}
                />
              </div>

              <div className="mt-auto">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-gray-100 transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed group-hover:text-gray-300 transition-colors">
                  {subtitle}
                </p>
              </div>

              <div className="absolute bottom-1 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                <ArrowUpRight className="w-5 h-5 text-white/70" />
              </div>
            </motion.div>
          </Spotlight>
        </Link>
      </TiltCard>
    </div>
  )
}

/**
 * Main Bento Grid Component.
 */
export default function BentoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full h-full min-h-[400px]">
      {BENTO_ITEMS.map((item) => (
        <BentoCard key={item.id} item={item} />
      ))}
    </div>
  )
}
