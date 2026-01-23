'use client'

import React, { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { Building2, GraduationCap } from 'lucide-react'

import Hero from '@/components/landing/Hero'
import Footer from '@/components/landing/Footer'
import Marquee from '@/components/landing/Marquee'
import ScrollSections from '@/components/landing/ScrollSections'
import Navbar from '@/components/landing/Navbar'
import Grain from '@/components/ui/Grain'
import Modal from '@/components/ui/Modal'
import PartnershipForm from '@/components/forms/PartnershipForm'
import UniversityForm from '@/components/forms/UniversityForm'

/**
 * @file page.tsx
 * @description The main Landing Page for Tribe.
 * Composes the Hero, Social Proof, Scroll Experience, and Final CTA sections.
 */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const letterVariants: Variants = {
  hidden: { y: 50, opacity: 0, filter: 'blur(10px)' },
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
}

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.5, duration: 0.5 },
  },
}

/**
 * Split text component for the "READY TO JOIN?" animation.
 */
const AnimatedTitle = ({ text }: { text: string }) => {
  return (
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="text-5xl md:text-8xl font-black tracking-tighter mb-8"
    >
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block mr-4 whitespace-nowrap">
          {Array.from(word).map((char, j) => (
            <motion.span
              key={`${i}-${j}`}
              variants={letterVariants}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h2>
  )
}

interface FinalCTAProps {
  onOpenPartnership: () => void
  onOpenUniversity: () => void
}

/**
 * Final Call to Action Section with two waitlist options.
 */
const FinalCTA = ({ onOpenPartnership, onOpenUniversity }: FinalCTAProps) => {
  return (
    <section className="py-32 md:py-40 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-purple-900/10 pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <AnimatedTitle text="READY TO JOIN?" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-zinc-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto"
        >
          Whether you&apos;re a brand looking to connect with Gen Z or a student
          wanting Tribe at your school — let&apos;s talk.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={buttonVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Partnership CTA */}
          <button
            onClick={onOpenPartnership}
            className="group flex items-center gap-3 px-8 py-5 bg-purple-600 hover:bg-purple-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-all"
          >
            <Building2 className="w-5 h-5" />
            Partner With Us
          </button>

          {/* University CTA */}
          <button
            onClick={onOpenUniversity}
            className="group flex items-center gap-3 px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-all"
          >
            <GraduationCap className="w-5 h-5" />
            Bring Tribe to Campus
          </button>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * Main Landing Page Component.
 */
export default function LandingPage() {
  const [isPartnershipOpen, setIsPartnershipOpen] = useState(false)
  const [isUniversityOpen, setIsUniversityOpen] = useState(false)

  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Navbar />
      <Grain />

      {/* 1. Hero Section */}
      <Hero
        onOpenPartnership={() => setIsPartnershipOpen(true)}
        onOpenUniversity={() => setIsUniversityOpen(true)}
      />

      {/* 2. Social Proof */}
      <Marquee />

      {/* 3. Sticky Scrollytelling Experience */}
      <ScrollSections />

      {/* 4. Final CTA */}
      <FinalCTA
        onOpenPartnership={() => setIsPartnershipOpen(true)}
        onOpenUniversity={() => setIsUniversityOpen(true)}
      />

      <Footer />

      {/* Partnership Modal */}
      <Modal
        isOpen={isPartnershipOpen}
        onClose={() => setIsPartnershipOpen(false)}
        title="Partner With Tribe"
      >
        <PartnershipForm onSuccess={() => {}} />
      </Modal>

      {/* University Modal */}
      <Modal
        isOpen={isUniversityOpen}
        onClose={() => setIsUniversityOpen(false)}
        title="Bring Tribe to Your Campus"
      >
        <UniversityForm onSuccess={() => {}} />
      </Modal>
    </main>
  )
}
