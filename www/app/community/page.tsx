'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Users,
  MessageSquare,
  Shield,
  Bell,
  Calendar,
  GraduationCap,
  BookOpen,
  Vote,
  Layout,
  Plus,
  Minus,
} from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { siteConfig } from '@/lib/site-config'

/**
 * @file page.tsx
 * @description Comprehensive Community page with features, categories, and FAQs.
 */

const STATS = [
  { value: '500+', label: 'Universities', icon: GraduationCap },
  { value: '1M+', label: 'Verified Students', icon: Users },
  { value: '50k+', label: 'Academic Circles', icon: BookOpen },
  { value: '24/7', label: 'Campus Discourse', icon: MessageSquare },
]

const FEATURES = [
  {
    icon: GraduationCap,
    title: 'Academic Circles',
    description:
      'Dedicated spaces for course-specific discussions, resource sharing, and peer learning.',
    color: 'bg-blue-500/10 text-blue-400',
  },
  {
    icon: Vote,
    title: 'Student Governance',
    description:
      'Digital town halls for student council updates, polls, and transparent campus decision making.',
    color: 'bg-indigo-500/10 text-indigo-400',
  },
  {
    icon: Bell,
    title: 'Official Announcements',
    description:
      'Verified channels for university administration to broadcast important notifications and deadlines.',
    color: 'bg-blue-500/10 text-blue-400',
  },
  {
    icon: Calendar,
    title: 'University Events Board',
    description:
      'A centralized calendar for hackathons, cultural fests, workshops, and inter-college competitions.',
    color: 'bg-indigo-500/10 text-indigo-400',
  },
  {
    icon: Layout,
    title: 'Club Management',
    description:
      'Tools for student organizations to manage membership, coordinate events, and secure funding.',
    color: 'bg-blue-500/10 text-blue-400',
  },
  {
    icon: Shield,
    title: 'Verified Access',
    description:
      'A secure environment where every user is authenticated via university credentials (`.edu` / ID card).',
    color: 'bg-indigo-500/10 text-indigo-400',
  },
]

const CATEGORIES = [
  {
    name: 'Confessions',
    emoji: '💭',
    description: 'Anonymous thoughts and stories',
    posts: '2.5k+',
  },
  {
    name: 'Notes & Links',
    emoji: '📚',
    description: 'Study materials and resources',
    posts: '1.8k+',
  },
  {
    name: 'Plan & Meet',
    emoji: '🗓️',
    description: 'Events and hangouts',
    posts: '890+',
  },
  {
    name: 'Professional',
    emoji: '💼',
    description: 'Jobs and internships',
    posts: '1.2k+',
  },
  {
    name: 'General',
    emoji: '💬',
    description: 'Everything else',
    posts: '3.4k+',
  },
  {
    name: 'Stock Market',
    emoji: '📈',
    description: 'Trading and investments',
    posts: '450+',
  },
]

const FAQS = [
  {
    question: 'How do I join my university community?',
    answer:
      'Simply sign up with your university email address. Our system automatically verifies your domain and places you into your official campus network.',
  },
  {
    question: 'Can alumni join the network?',
    answer:
      'Yes, we have dedicated alumni networks that foster mentorship and professional networking opportunities for graduating students.',
  },
  {
    question: 'Is my data visible to administration?',
    answer:
      'While we host official channels, student-to-student discourse in private circles remains confidential and is not shared with university administration.',
  },
  {
    question: 'How can I start a new club?',
    answer:
      'Any verified student can propose a new club. Once it receives the required number of initial signatures, it gets an official space on the platform.',
  },
  {
    question: 'Are inter-university connections possible?',
    answer:
      'Yes. While your primary experience is centered on your campus, you can join "National Circles" for broader interests like Competitive Programming or Research.',
  },
  {
    question: 'Is the platform free for students?',
    answer:
      'Absolutely. Tribe Network is and will always be free for students to use for communication, networking, and event discovery.',
  },
]

const HeroSection = () => (
  <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium"
    >
      <Users className="w-4 h-4" />
      Student Forum
    </motion.div>

    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white leading-[1.1] md:leading-[0.9] mb-6"
    >
      The Digital
      <br />
      <span className="text-blue-500">Campus Hub</span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mb-10 px-4"
    >
      A unified platform for student governance, academic collaboration, and
      vibrant campus life.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-4"
    >
      <a
        href={siteConfig.urls.community}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25">
          Join Network
          <ArrowRight className="w-5 h-5" />
        </button>
      </a>
      <button
        onClick={() => {
          document
            .getElementById('features')
            ?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-lg font-bold rounded-full border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
      >
        <BookOpen className="w-5 h-5 text-blue-400" />
        Explore Features
      </button>
    </motion.div>
  </section>
)

const StatsSection = () => (
  <section className="py-12 sm:py-16 px-6 border-y border-border">
    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '100px' }}
          transition={{ delay: i * 0.1 }}
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

const FeaturesSection = () => (
  <section id="features" className="py-20 px-6">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '100px' }}
        className="text-center mb-10 sm:mb-16"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
          Everything <span className="text-blue-400">Campus</span>
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4 leading-relaxed">
          Built to support the diverse needs of a modern university ecosystem.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '100px' }}
            transition={{ delay: i * 0.05 }}
            className="bg-card/30 border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all hover:bg-blue-500/5 group"
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mb-2 tracking-tight">
              {feature.title}
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

const CategoriesSection = () => (
  <section className="py-20 px-6 relative">
    <div className="absolute inset-0 -z-10 bg-blue-900/5" />
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '100px' }}
        className="text-center mb-12 sm:mb-16 px-4"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
          Discussion <span className="text-blue-400">Categories</span>
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Find exactly what you&apos;re looking for. Every topic has its place.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '100px' }}
            transition={{ delay: i * 0.05 }}
            className="bg-card/30 border border-white/5 rounded-xl p-5 hover:border-blue-500/30 transition-all hover:bg-blue-500/5 group"
          >
            <div className="text-2xl sm:text-3xl mb-3 group-hover:scale-110 transition-transform origin-left">
              {cat.emoji}
            </div>
            <h3 className="text-white font-black text-sm sm:text-base mb-1 tracking-tight">
              {cat.name}
            </h3>
            <p className="text-muted-foreground text-[10px] sm:text-sm mb-2 leading-tight">
              {cat.description}
            </p>
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">
              {cat.posts} posts
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

const FAQSection = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '100px' }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
            Frequently Asked <span className="text-blue-400">Questions</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '100px' }}
                transition={{ delay: i * 0.05 }}
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

const CTASection = () => (
  <section className="py-32 px-6">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '100px' }}
      className="max-w-4xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 text-center relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-linear-to-b from-blue-500/10 via-transparent to-blue-500/5 opacity-50" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]" />

      <GraduationCap className="w-16 h-16 text-blue-400 mx-auto mb-6 relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 relative z-10 leading-tight">
        Ready to Join?
      </h2>
      <p className="text-muted-foreground max-w-lg mx-auto mb-8 sm:mb-10 relative z-10 text-base sm:text-lg leading-relaxed px-4">
        Claim your digital campus identity today.
      </p>

      <a
        href={siteConfig.urls.community}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 inline-block"
      >
        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto shadow-lg shadow-blue-500/25 border border-white/10">
          <Users className="w-5 h-5" />
          Get Started
        </button>
      </a>
    </motion.div>
  </section>
)

/**
 * Community Page
 */
export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-blue-500/30">
      <Navbar />

      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CategoriesSection />
      <FAQSection />
      <CTASection />

      <Footer />
    </main>
  )
}
