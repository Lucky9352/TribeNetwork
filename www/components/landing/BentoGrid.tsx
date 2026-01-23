'use client'

import React, { MouseEvent } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Users,
  Sparkles,
  Megaphone,
  ArrowUpRight,
  Activity,
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
    className: 'col-span-2 lg:col-span-2 aspect-[2.2/1]',
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

const LiveIndicator = () => (
  <div className="absolute top-0 right-0 flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
    </span>
    <span className="text-[10px] font-medium text-green-400">420 Live</span>
  </div>
)

const ProcessingIndicator = () => (
  <div className="absolute top-0 right-0 flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-full">
    <Activity className="w-3 h-3 text-blue-400 animate-pulse" />
    <span className="text-[10px] font-medium text-blue-400">Processing</span>
  </div>
)

export const BentoCard = ({ item }: { item: BentoItem }) => {
  const {
    className,
    href,
    title,
    subtitle,
    icon: Icon,
    logoGradient,
    delay,
    variant,
  } = item

  return (
    <div className={`${className} perspective-1000`}>
      <TiltCard className="h-full w-full">
        <Link href={href} className="block h-full group">
          <Spotlight className="h-full flex flex-col p-6 transition-all duration-500 hover:border-white/30 bg-zinc-900/50 border border-white/10 rounded-3xl">
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

              {/* Variant Specific Indicators */}
              {variant === 'community' && <LiveIndicator />}
              {variant === 'ai' && <ProcessingIndicator />}

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
    <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 w-full h-full min-h-[400px]">
      {BENTO_ITEMS.map((item) => (
        <BentoCard key={item.id} item={item} />
      ))}
      <div className="hidden lg:block absolute -z-10 top-0 right-0 w-full h-full bg-purple-500/5 blur-3xl pointer-events-none" />
    </div>
  )
}
