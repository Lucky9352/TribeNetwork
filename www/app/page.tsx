'use client'

import React, { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import {
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  MessageSquare,
  Plus,
  Minus,
  Layout,
  Globe,
  Zap,
} from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import ParallaxBackground from '@/components/landing/ParallaxBackground'
import FeatureSection from '@/components/landing/FeatureSection'

import { Button } from '@/components/ui/button'
import Hero from '@/components/landing/Hero'
import Footer from '@/components/landing/Footer'
import Marquee from '@/components/landing/Marquee'
import ScrollSections from '@/components/landing/ScrollSections'
import Navbar from '@/components/landing/Navbar'
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
      viewport={{ once: true, amount: 0.1, margin: '-50px' }}
      variants={containerVariants}
      className="text-2xl xs:text-3xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] md:leading-[0.9]"
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
    <section className="pt-20 sm:pt-32 md:pt-40 pb-20 sm:pb-32 text-center relative overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <AnimatedTitle text="READY FOR TRANSFORMATION?" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '100px' }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-base sm:text-lg md:text-xl mb-12 max-w-2xl mx-auto px-4 leading-relaxed"
        >
          Whether you represent an institution seeking digital evolution or a
          partner aiming for impact within the academic ecosystem — let&apos;s
          collaborate.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '100px' }}
          variants={buttonVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center max-w-[320px] sm:max-w-none mx-auto w-full group"
        >
          {/* Partnership CTA */}
          <Button
            onClick={onOpenPartnership}
            size="lg"
            className="group gap-3 text-lg font-bold rounded-full hover:scale-105 transition-all bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 border border-white/10"
          >
            <Building2 className="w-5 h-5" />
            Institutional Partnerships
          </Button>

          {/* University CTA */}
          <Button
            onClick={onOpenUniversity}
            variant="secondary"
            size="lg"
            className="group gap-3 text-lg font-bold rounded-full hover:scale-105 transition-all bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 border border-white/10"
          >
            <GraduationCap className="w-5 h-5" />
            Deploy At Your Campus
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

const StatsSection = () => (
  <section className="pt-16 sm:pt-0 pb-12 sm:pb-20 px-6 relative z-10 border-y border-transparent bg-transparent">
    <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        { value: '500+', label: 'Universities', icon: GraduationCap },
        { value: '1M+', label: 'Verified Students', icon: Users },
        { value: '50k+', label: 'Academic Circles', icon: BookOpen },
        { value: '24/7', label: 'Campus Discourse', icon: MessageSquare },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '100px' }}
          transition={{ delay: i * 0.05 }}
          className="text-center"
        >
          <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-3" />
          <p className="text-3xl sm:text-4xl font-black text-white mb-1 tracking-tight">
            {stat.value}
          </p>
          <p className="text-muted-foreground text-[10px] sm:text-sm font-bold uppercase tracking-widest leading-relaxed">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  </section>
)

const HOME_FAQS = [
  {
    question: 'How do we deploy Tribe at our campus?',
    answer:
      'Deployment is handled in collaboration with your IT department. We provide a standardized infrastructure that integrates with existing institutional systems while maintaining high security standards.',
  },
  {
    question: 'Is student data secure?',
    answer:
      'Security is our primary focus. We use enterprise-grade encryption and strictly adhere to data privacy regulations. Student data is never sold or used for off-platform tracking.',
  },
  {
    question: 'What are the costs for institutions?',
    answer:
      'We offer tiered partnership models based on campus size and required features. Please reach out via the "Institutional Partnerships" form for a customized proposal.',
  },
  {
    question: 'How does Tribe AI differ from standard LLMs?',
    answer:
      'Tribe AI is fine-tuned specifically for campus contexts. It has access to verified institutional knowledge and can synthesize campus-specific discussions, which general models cannot do accurately.',
  },
]

const HomeFAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  return (
    <section className="pt-16 sm:pt-24 pb-0 px-6 bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '100px' }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter mb-4">
            Frequently Asked <span className="text-blue-500">Questions</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {HOME_FAQS.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div
                key={i}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? 'bg-blue-500/5 border-blue-500/30 shadow-lg shadow-blue-500/10'
                    : 'bg-card/30 border-white/5 hover:border-white/10'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-6 flex items-start justify-between text-left gap-4"
                >
                  <span
                    className={`font-black text-base sm:text-lg transition-colors tracking-tight ${
                      isOpen ? 'text-blue-400' : 'text-white'
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`mt-1 p-1 rounded-full border transition-colors ${
                      isOpen
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-white/10 text-muted-foreground'
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
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
    <main className="min-h-screen relative">
      <Navbar />

      {/* Global Brand Identity */}
      <ParallaxBackground />

      {/* 1. Hero Section */}
      <Hero
        onOpenPartnership={() => setIsPartnershipOpen(true)}
        onOpenUniversity={() => setIsUniversityOpen(true)}
      />

      {/* 2. Global Impact Stats */}
      <StatsSection />

      {/* 3. Social Proof */}
      <section className="pt-12 sm:pt-20 pb-0 relative z-10 overflow-hidden bg-transparent">
        <div className="max-w-7xl mx-auto px-6 mb-4 text-center">
          <h2 className="text-sm sm:text-base font-black tracking-[0.3em] text-white/30 uppercase">
            Trusted by the{' '}
            <span className="text-white/60">Best Institutions</span>
          </h2>
        </div>
        <Marquee />
      </section>

      {/* 4. Sticky Scrollytelling Experience */}
      <div className="pt-12 sm:pt-20 pb-0 relative z-10">
        <ScrollSections />
      </div>

      {/* 5. Ecosystem Overview (FeatureSection) */}
      <div className="relative z-10">
        <FeatureSection
          title="Designed for Deep Integration."
          subtitle="Enterprise Ecosystem"
          description="Tribe isn't just an app; it's a modular infrastructure that plugs directly into university life. From official course channels to anonymous peer support, every layer is built for scale."
          alignment="right"
          color="blue"
          icon={Globe}
          href="/community"
          visual={
            <div className="relative w-full h-full flex items-center justify-center bg-transparent">
              <div className="grid grid-cols-2 gap-4 p-8">
                {[Layout, Globe, Zap, Users].map((Icon, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm"
                  >
                    <Icon className="w-8 h-8 text-blue-400" />
                  </motion.div>
                ))}
              </div>
            </div>
          }
        />
      </div>

      {/* 6. FAQs */}
      <HomeFAQs />

      {/* 7. Final CTA */}
      <div className="relative z-10">
        <FinalCTA
          onOpenPartnership={() => setIsPartnershipOpen(true)}
          onOpenUniversity={() => setIsUniversityOpen(true)}
        />
      </div>

      <Footer />

      {/* Partnership Modal */}
      <Modal
        isOpen={isPartnershipOpen}
        onClose={() => setIsPartnershipOpen(false)}
        title="Institutional Partnership Inquiry"
      >
        <PartnershipForm onSuccess={() => {}} />
      </Modal>

      {/* University Modal */}
      <Modal
        isOpen={isUniversityOpen}
        onClose={() => setIsUniversityOpen(false)}
        title="Deploy At Your Campus"
      >
        <UniversityForm onSuccess={() => {}} />
      </Modal>
    </main>
  )
}
