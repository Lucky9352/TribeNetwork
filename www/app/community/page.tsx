'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Users,
  MessageSquare,
  Shield,
  Heart,
  BookOpen,
  Calendar,
  Globe,
  ChevronDown,
  TrendingUp,
  Award,
} from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import Grain from '@/components/ui/Grain'
import { siteConfig } from '@/lib/site-config'

/**
 * @file page.tsx
 * @description Comprehensive Community page with features, categories, and FAQs.
 */

const STATS = [
  { value: '50k+', label: 'Students', icon: Users },
  { value: '18+', label: 'Campuses', icon: Globe },
  { value: '10k+', label: 'Discussions', icon: MessageSquare },
  { value: '100%', label: 'Anonymous', icon: Shield },
]

const FEATURES = [
  {
    icon: Shield,
    title: 'Anonymous by Default',
    description:
      'Share freely without revealing your identity. Your privacy is protected with end-to-end anonymity.',
    color: 'bg-purple-500/10 text-purple-400',
  },
  {
    icon: MessageSquare,
    title: 'Real-Time Discussions',
    description:
      'Engage in live conversations with fellow students. Get instant replies and notifications.',
    color: 'bg-blue-500/10 text-blue-400',
  },
  {
    icon: BookOpen,
    title: 'Study Resources',
    description:
      'Share notes, past papers, and study materials. Find help for any subject or exam.',
    color: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    icon: Calendar,
    title: 'Events & Meetups',
    description:
      'Plan trips, organize study groups, and coordinate campus events with your peers.',
    color: 'bg-amber-500/10 text-amber-400',
  },
  {
    icon: Heart,
    title: 'Confessions Wall',
    description:
      'A safe space to share thoughts, feelings, and campus confessions without judgment.',
    color: 'bg-pink-500/10 text-pink-400',
  },
  {
    icon: TrendingUp,
    title: 'Career & Placements',
    description:
      'Discuss internships, job openings, interview experiences, and career advice.',
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
    question: 'Is the forum really anonymous?',
    answer:
      "Yes! All posts are anonymous by default. We don't show your real name or email to other users. You can choose a username that doesn't identify you. Even moderators cannot see your personal details for regular posts.",
  },
  {
    question: 'Who can join the community?',
    answer:
      'Currently, Tribe Community is open to JAIN University students across all campuses. We verify student status through university email addresses to ensure a safe, student-only space.',
  },
  {
    question: 'How do I create my first post?',
    answer:
      'Simply sign in with your university credentials, click the "New Discussion" button, choose a category, and start writing! You can add images, links, and format your text with markdown.',
  },
  {
    question: 'Are there any rules or guidelines?',
    answer:
      'Yes, we have community guidelines to ensure respectful discussions. No harassment, hate speech, or doxxing is allowed. Posts violating guidelines are removed, and repeat offenders may be banned.',
  },
  {
    question: 'Can I delete my posts?',
    answer:
      'Yes, you can delete or edit your own posts at any time. Once deleted, the content is permanently removed from our servers.',
  },
  {
    question: 'How is this different from WhatsApp groups?',
    answer:
      'Unlike WhatsApp groups, Tribe offers true anonymity, organized categories, searchable discussions, and a permanent archive. Your posts reach all campus students, not just group members.',
  },
]

const HeroSection = () => (
  <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]" />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-medium"
    >
      <Users className="w-4 h-4" />
      JAIN University Student Forum
    </motion.div>

    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9] mb-6"
    >
      Your Campus,
      <br />
      <span className="text-purple-400">Connected.</span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-10"
    >
      An anonymous forum built for JAIN University students. Share confessions,
      find study groups, plan meetups, and connect with your campus community.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col sm:flex-row gap-4"
    >
      <a
        href={siteConfig.urls.community}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-full hover:scale-105 transition-all flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Join the Forum
          <ArrowRight className="w-4 h-4" />
        </button>
      </a>
      <a href="#features">
        <button className="px-8 py-4 border border-zinc-700 text-white font-semibold rounded-full hover:bg-zinc-800 transition-all">
          Learn More
        </button>
      </a>
    </motion.div>
  </section>
)

const StatsSection = () => (
  <section className="py-16 px-6 border-y border-zinc-800">
    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="text-center"
        >
          <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
          <p className="text-zinc-500 text-sm">{stat.label}</p>
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
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
          Everything You <span className="text-purple-400">Need</span>
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Built specifically for university students. Every feature designed to
          make campus life better.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all group"
          >
            <div
              className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-zinc-400 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

const CategoriesSection = () => (
  <section className="py-20 px-6 relative">
    <div className="absolute inset-0 -z-10 bg-purple-900/5" />
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
          Discussion <span className="text-pink-400">Categories</span>
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Find exactly what you&apos;re looking for. Every topic has its place.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/50 transition-all"
          >
            <div className="text-3xl mb-3">{cat.emoji}</div>
            <h3 className="text-white font-bold mb-1">{cat.name}</h3>
            <p className="text-zinc-500 text-sm mb-2">{cat.description}</p>
            <p className="text-purple-400 text-xs font-medium">
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
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
            Frequently Asked <span className="text-cyan-400">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-5 flex items-center justify-between text-left"
              >
                <span className="font-medium text-white">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-zinc-400 text-sm">
                  {faq.answer}
                </div>
              )}
            </motion.div>
          ))}
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
      viewport={{ once: true }}
      className="max-w-4xl mx-auto bg-purple-900/30 border border-purple-500/20 rounded-3xl p-12 text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-purple-500/5" />
      <Award className="w-16 h-16 text-purple-400 mx-auto mb-6 relative z-10" />
      <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 relative z-10">
        Ready to Join?
      </h2>
      <p className="text-zinc-400 max-w-lg mx-auto mb-8 relative z-10">
        Connect with thousands of JAIN University students. Start your first
        discussion today.
      </p>
      <a
        href={siteConfig.urls.community}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10"
      >
        <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto">
          <Users className="w-5 h-5" />
          Join Tribe Community
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
    <main className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Navbar />
      <Grain />

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
