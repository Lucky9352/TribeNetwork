'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Heart,
  MessageCircle,
  Users,
  CheckCircle,
  Zap,
  Calendar,
  Star,
  LucideIcon,
} from 'lucide-react'

/**
 * @file PhoneMockup.tsx
 * @description A high-fidelity 3D interactive phone mockup component.
 * Features a dynamic island with live notifications and realistic hardware details.
 */

interface MockNotificationData {
  icon: LucideIcon
  text: string
  color: string
}

interface PhoneMockupProps {
  children: React.ReactNode
  isStatic?: boolean
  hideHeader?: boolean
  noScroll?: boolean
}

const MOCK_NOTIFICATIONS: MockNotificationData[] = [
  { icon: Heart, text: '... liked your post', color: 'text-pink-500' },
  { icon: MessageCircle, text: '10+ new messages', color: 'text-blue-400' },
  { icon: Users, text: 'Study Group is live', color: 'text-purple-400' },
  { icon: Bell, text: 'Assignment due in 2h', color: 'text-yellow-400' },
  {
    icon: CheckCircle,
    text: 'Registration confirmed',
    color: 'text-green-400',
  },
  { icon: Zap, text: 'Tribe AI just replied', color: 'text-cyan-400' },
  { icon: Calendar, text: 'Event starting in 10m', color: 'text-orange-400' },
  { icon: Star, text: 'You earned a badge!', color: 'text-amber-300' },
]

const useMockNotifications = () => {
  const [notification, setNotification] = useState<MockNotificationData | null>(
    null
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (Math.random() > 0.2) {
          const randomMsg =
            MOCK_NOTIFICATIONS[
              Math.floor(Math.random() * MOCK_NOTIFICATIONS.length)
            ]
          setNotification(randomMsg)
          setTimeout(() => setNotification(null), 3000)
        }
      }, 3500)

      return () => clearInterval(interval)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [])

  return notification
}

const HardwareButtons = () => (
  <>
    {/* Left Side: Silence + Volume */}
    <div className="absolute top-28 -left-[16px] w-[6px] h-8 bg-[#2a2a2a] rounded-l-md border-y border-l border-[#4a4a4a]" />
    <div className="absolute top-44 -left-[16px] w-[6px] h-16 bg-[#2a2a2a] rounded-l-md border-y border-l border-[#4a4a4a]" />
    <div className="absolute top-64 -left-[16px] w-[6px] h-16 bg-[#2a2a2a] rounded-l-md border-y border-l border-[#4a4a4a]" />

    {/* Right Side: Power */}
    <div className="absolute top-48 -right-[16px] w-[6px] h-24 bg-[#2a2a2a] rounded-r-md border-y border-r border-[#4a4a4a]" />
  </>
)

const DynamicIsland = ({
  notification,
}: {
  notification: MockNotificationData | null
}) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex justify-center w-full pointer-events-none">
      <motion.div
        initial={false}
        animate={{
          width: notification ? (isMobile ? 180 : 230) : isMobile ? 70 : 90,
          height: notification ? 38 : 28,
          borderRadius: 20,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="bg-black flex items-center justify-center overflow-hidden shadow-2xl relative z-50 text-white"
        style={{
          boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <AnimatePresence mode="wait">
          {notification ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2.5 px-3 w-full"
            >
              <notification.icon
                className={`w-3.5 h-3.5 ${notification.color}`}
              />
              <span className="text-[10px] font-medium whitespace-nowrap opacity-90">
                {notification.text}
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

const AppHeader = () => (
  <div className="absolute top-0 left-0 right-0 z-40 px-5 pt-5 pb-4 flex items-center justify-between pointer-events-none">
    {/* Top gradient for readability */}
    <div className="absolute inset-0 bg-black/60 -z-10" />

    <h1 className="text-xl font-bold text-purple-400 mt-1">Tribe</h1>
    <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-white/20 flex items-center justify-center">
      <span className="text-[10px] font-bold text-purple-300">TN</span>
    </div>
  </div>
)

/**
 * Main PhoneMockup Component.
 */
export default function PhoneMockup({
  children,
  isStatic = false,
  hideHeader = false,
  noScroll = false,
}: PhoneMockupProps) {
  const notification = useMockNotifications()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 800
    }
  }, [])

  return (
    <div className="relative mx-auto flex items-center justify-center perspective-[2000px] py-8 sm:py-16">
      <motion.div
        initial={
          isStatic
            ? { rotateY: 0, rotateX: 0, y: 0 }
            : { rotateY: -12, rotateX: 5 }
        }
        animate={
          isStatic
            ? {}
            : {
                y: [-15, 0, -15],
                rotateY: [-12, -15, -12],
              }
        }
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: 'easeInOut',
        }}
        className="relative z-10 w-[240px] xs:w-[310px] md:w-[340px] h-[480px] xs:h-[620px] md:h-[680px] bg-black rounded-[40px] xs:rounded-[60px] select-none border-10 border-[#121212] overflow-visible"
        style={{
          boxShadow: `
                        0 0 0 4px #3a3a3a, /* Metallic Frame */
                        0 0 0 6px #1a1a1a, /* Outer Shadow/Edge */
                        0 50px 100px -20px rgba(0,0,0,0.5), /* Deep Drop Shadow */
                        inset 0 0 0 2px rgba(255,255,255,0.05) /* Inner Glass Reflection */
                    `,
        }}
      >
        <HardwareButtons />

        {/* Screen Container */}
        <div
          className="absolute inset-[-2px] rounded-[38px] xs:rounded-[50px] overflow-hidden z-20"
          style={{
            WebkitMaskImage: '-webkit-radial-gradient(white, black)',
          }}
        >
          <DynamicIsland notification={notification} />
          {!hideHeader && <AppHeader />}

          {/* Scrollable Content Area */}
          <div
            ref={scrollRef}
            className={`h-full w-full bg-black ${hideHeader ? 'pt-0' : 'pt-24'} ${
              noScroll ? 'overflow-hidden' : 'overflow-y-auto'
            }`}
          >
            {children}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50 mix-blend-overlay"></div>
        </div>
      </motion.div>
    </div>
  )
}
