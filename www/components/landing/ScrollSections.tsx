'use client'

import React, { useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion'
import {
  Users,
  BrainCircuit,
  Megaphone,
  ArrowRight,
  Sparkles,
  LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import PhoneMockup from '@/components/landing/PhoneMockup'
import CommunityScreen from '@/components/landing/screens/CommunityScreen'
import AIScreen from '@/components/landing/screens/AIScreen'
import AdvertiseScreen from '@/components/landing/screens/AdvertiseScreen'
import { BentoCard } from '@/components/landing/BentoGrid'
import { siteConfig } from '@/lib/site-config'

/**
 * @file ScrollSections.tsx
 * @description A complex scroll-driven component that controls a sticky phone mockup
 * while scrolling through text sections. Features deep integration with Framer Motion.
 */

interface ScrollSectionData {
  id: string
  title: string
  subtitle: string
  description: string
  color: string
  icon: LucideIcon
  href: string
  internalHref: string
  cta: string
  Screen: React.ElementType
  card: {
    title: string
    subtitle: string
    icon: LucideIcon
    gradient: string
    iconColor: string
    delay: number
  }
}

const SCROLL_SECTIONS: ScrollSectionData[] = [
  {
    id: 'community',
    title: 'Unified Campus Experience.',
    subtitle: 'Student Network',
    description:
      'A dedicated digital environment for university life. Facilitate open dialogue, coordinate academic groups, and foster meaningful connections across the entire campus community.',
    color: 'blue',
    icon: Users,
    href: siteConfig.urls.community,
    internalHref: '/community',
    cta: 'Explore Community',
    Screen: CommunityScreen,
    card: {
      title: 'Tribe Network',
      subtitle: 'Secure discourse. Verified identity.',
      icon: Users,
      gradient: 'bg-blue-500/15',
      iconColor: 'text-blue-400',
      delay: 0,
    },
  },
  {
    id: 'ai',
    title: 'Contextual Campus Intelligence.',
    subtitle: 'Advanced AI',
    description:
      'Leverage our proprietary language model to navigate university life. Instantly synthesize thousands of campus discussions, identify academic peers, and access verified institutional knowledge.',
    color: 'cyan',
    icon: BrainCircuit,
    href: siteConfig.urls.ai,
    internalHref: '/ai',
    cta: 'Access Intelligence',
    Screen: AIScreen,
    card: {
      title: 'Neural Search',
      subtitle: 'Semantic understanding. Real-time retrieval.',
      icon: Sparkles,
      gradient: 'bg-cyan-500/15',
      iconColor: 'text-cyan-400',
      delay: 0,
    },
  },
  {
    id: 'advertise',
    title: 'Precision Campus Engagement.',
    subtitle: 'Strategic Outreach',
    description:
      'Deploy targeted campaigns across WhatsApp, Email, and SMS with granular segmentation. Access verified student demographics and track performance with enterprise-grade analytics.',
    color: 'emerald',
    icon: Megaphone,
    href: siteConfig.urls.advertise,
    internalHref: '/advertise',
    cta: 'Start Campaign',
    Screen: AdvertiseScreen,
    card: {
      title: 'Tribe Ads',
      subtitle: 'Verified Audience. High Conversion.',
      icon: Megaphone,
      gradient: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400',
      delay: 0,
    },
  },
]

/**
 * Renders the sticky phone component that transitions between screens.
 */
const StickyPhone = ({ activeSection }: { activeSection: number }) => {
  return (
    <div className="w-1/2 sticky top-0 h-screen flex items-center justify-center p-10 z-0">
      <div className="relative w-[320px] h-[650px] transition-all duration-700">
        <PhoneMockup isStatic={true} hideHeader={true} noScroll={true}>
          <div className="relative w-full h-full bg-black">
            {SCROLL_SECTIONS.map((section, index) => (
              <motion.div
                key={section.id}
                className={`absolute inset-0 w-full h-full ${activeSection === index ? 'pointer-events-auto' : 'pointer-events-none'}`}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeSection === index ? 1 : 0,
                  scale: activeSection === index ? 1 : 0.95,
                  filter: activeSection === index ? 'blur(0px)' : 'blur(10px)',
                }}
                transition={{ duration: 0.5 }}
              >
                <section.Screen />
              </motion.div>
            ))}
          </div>
        </PhoneMockup>

        {/* Dynamic Background Glow based on active section */}
      </div>
    </div>
  )
}

/**
 * Renders individual scrolling text sections with animations triggered by scroll position.
 */
function SectionText({
  section,
  index,
  setActiveSection,
  isActive,
}: {
  section: ScrollSectionData
  index: number
  setActiveSection: (i: number) => void
  isActive: boolean
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest > 0.1 && latest < 0.9) {
      setActiveSection(index)
    }
    if (index === 0 && latest <= 0.1) {
      setActiveSection(-1)
    }
    if (index === SCROLL_SECTIONS.length - 1 && latest >= 0.9) {
      setActiveSection(-1)
    }
  })

  return (
    <motion.div
      ref={ref}
      className="h-screen flex items-center justify-center"
      style={{
        opacity: useTransform(
          scrollYProgress,
          [0, 0.05, 0.2, 0.8, 0.95, 1],
          [0.7, 0.9, 1, 1, 0.9, 0.7]
        ),
        x: useTransform(scrollYProgress, [0, 0.5, 1], [-8, 0, -8]),
        scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.99, 1, 0.99]),
      }}
    >
      <motion.div
        className="space-y-6 max-w-xl p-10"
        initial="visible"
        animate={isActive ? 'visible' : 'dimmed'}
        variants={{
          dimmed: { opacity: 0.6 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.04,
              delayChildren: 0,
            },
          },
        }}
      >
        <motion.div
          variants={{
            dimmed: { opacity: 0.5, y: 0 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-${section.color}-500/20 text-${section.color}-400 text-sm font-medium bg-${section.color}-500/10`}
        >
          <section.icon className="w-4 h-4" />
          {section.subtitle}
        </motion.div>

        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.02 } } }}
        >
          <motion.h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[1.1]">
            {/* Staggered Title */}
            {section.title.split(' ').map((word: string, i: number) => (
              <span key={i} className="inline-block mr-4 whitespace-nowrap">
                {Array.from(word).map((char, j) => (
                  <motion.span
                    key={j}
                    variants={{
                      dimmed: { y: 0, opacity: 0.6, filter: 'blur(0px)' },
                      visible: {
                        y: 0,
                        opacity: 1,
                        filter: 'blur(0px)',
                        transition: {
                          type: 'spring',
                          damping: 20,
                          stiffness: 200,
                        },
                      },
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h2>
        </motion.div>

        <motion.p
          variants={{
            dimmed: { opacity: 0.4, y: 0 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
          }}
          className="text-xl text-muted-foreground font-light leading-relaxed"
        >
          {section.description}
        </motion.p>

        <motion.div
          variants={{
            dimmed: { opacity: 0.4, y: 0 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
          }}
          className="flex items-center gap-4 pt-2"
        >
          <Link href={section.internalHref}>
            <span
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-${section.color}-500/30 text-${section.color}-400 text-sm font-medium hover:bg-${section.color}-500/10 transition-all cursor-pointer`}
            >
              {section.cta}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </Link>
        </motion.div>

        <motion.div
          variants={{
            dimmed: { opacity: 0.5, scale: 0.98 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { type: 'spring', stiffness: 150, damping: 20 },
            },
          }}
          className="h-48 w-full max-w-sm"
        >
          <BentoCard
            item={{
              id: section.id,
              href: section.href,
              title: section.card.title,
              subtitle: section.card.subtitle,
              icon: section.card.icon,
              logoGradient: section.card.gradient,
              iconColor: section.card.iconColor,
              delay: 0,
              className: 'h-full',
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Renders the stacked layout for mobile devices.
 */
const MobileLayout = () => (
  <div className="lg:hidden space-y-20 py-20 px-6">
    {SCROLL_SECTIONS.map((section) => (
      <div key={section.id} className="space-y-8">
        <div className="aspect-9/16 w-full max-w-[300px] mx-auto overflow-hidden rounded-4xl border border-border shadow-2xl relative">
          <section.Screen />
        </div>
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">{section.title}</h2>
          <p className="text-muted-foreground mb-6">{section.description}</p>
          <Link
            href={section.internalHref}
            className="inline-flex items-center text-foreground border-b border-foreground pb-1"
          >
            Explore {section.subtitle} <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    ))}
  </div>
)

/**
 * Main ScrollSections Component.
 */
export default function ScrollSections() {
  const [activeSection, setActiveSection] = useState(-1)

  return (
    <div className="relative w-full">
      {/* Desktop: Sticky Layout */}
      <div className="hidden lg:flex flex-row min-h-screen items-start relative">
        {/* Left: Scrollable Text Content */}
        <div className="w-1/2 relative z-10">
          {SCROLL_SECTIONS.map((section, index) => (
            <SectionText
              key={section.id}
              section={section}
              index={index}
              setActiveSection={setActiveSection}
              isActive={activeSection === index}
            />
          ))}
        </div>

        {/* Right: Sticky Phone */}
        <StickyPhone activeSection={activeSection} />
      </div>

      {/* Mobile: Stacked Layout */}
      <MobileLayout />
    </div>
  )
}
