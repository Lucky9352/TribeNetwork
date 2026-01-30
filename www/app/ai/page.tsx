'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  Search,
  MessageSquare,
  Users,
  Zap,
  Brain,
  BookOpen,
  Link2,
  Shield,
  Clock,
  Bot,
  Target,
  FileText,
  CalendarCheck,
  Briefcase,
  Globe,
  Award,
  Plus,
  Minus,
} from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import Grain from '@/components/ui/Grain'
import { siteConfig } from '@/lib/site-config'
import { AnimatePresence } from 'framer-motion'

/**
 * @file page.tsx
 * @description Comprehensive AI page with features, how it works, use cases, and FAQs.
 */

const STATS = [
  { value: '1M+', label: 'Academic Data Points', icon: BookOpen },
  { value: '<2s', label: 'Retrieval Latency', icon: Zap },
  { value: '24/7', label: 'Student Support', icon: Clock },
  { value: '100%', label: 'Knowledge Graph', icon: Link2 },
]

const FEATURES = [
  {
    icon: Search,
    title: 'Cross-Platform Retrieval',
    description:
      'Synthesize answers from university portals, forum discussions, and academic repositories instantly.',
    color: 'bg-blue-500/10 text-blue-400',
  },
  {
    icon: Users,
    title: 'Academic Networking',
    description:
      'Identify peers with similar research interests or find study partners for specific courses.',
    color: 'bg-indigo-500/10 text-indigo-400',
  },
  {
    icon: MessageSquare,
    title: 'Discourse Analysis',
    description:
      'Understand campus sentiment and trending academic topics through real-time natural language processing.',
    color: 'bg-sky-500/10 text-sky-400',
  },
  {
    icon: Link2,
    title: 'Citation & Attribution',
    description:
      'Every AI response includes direct citations to source discussions or administrative documents for verification.',
    color: 'bg-blue-500/10 text-blue-400',
  },
  {
    icon: Brain,
    title: 'Context-Aware Knowledge Graph',
    description:
      'Built tailored to your specific university ontology - departments, faculty, events, and campus lexicon.',
    color: 'bg-indigo-500/10 text-indigo-400',
  },
  {
    icon: Shield,
    title: 'Enterprise-Grade Privacy',
    description:
      'Student queries are anonymized and processed securely. No personal data is used for model training.',
    color: 'bg-sky-500/10 text-sky-400',
  },
]

const USE_CASES = [
  {
    query: '"Summarize CS402 feedback"',
    result:
      'Aggregates student reviews on course difficulty, syllabus coverage, and faculty teaching styles.',
    icon: FileText,
  },
  {
    query: '"Library hours during finals?"',
    result:
      'Provides real-time operational hours, shuttle schedules, and study room availability.',
    icon: Clock,
  },
  {
    query: '"Find research collaborators"',
    result:
      'Connects you with students working on similar thesis topics or projects.',
    icon: Globe,
  },
  {
    query: '"Internship placement stats?"',
    result:
      'Retrieves verified data on recent campus placements and salary packages.',
    icon: Briefcase,
  },
  {
    query: '"Hackathon team finding"',
    result: 'Matches you with developers and designers looking for teammates.',
    icon: Award,
  },
  {
    query: '"Administrative deadlines"',
    result:
      'Alerts you about upcoming fee payments, exam registrations, and form submissions.',
    icon: CalendarCheck,
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Input Query',
    description:
      'Ask about academic resources, campus facilities, or student sentiment.',
    icon: MessageSquare,
  },
  {
    step: '02',
    title: 'Semantic Search',
    description:
      'Our LLM scans the proprietary university knowledge graph and discussion forums.',
    icon: Search,
  },
  {
    step: '03',
    title: 'Synthesized Response',
    description:
      'Receive a comprehensive answer citing specific documents and discussions.',
    icon: Target,
  },
  {
    step: '04',
    title: 'Verify & Engage',
    description:
      'Click citations to view source material or join the relevant discussion.',
    icon: Users,
  },
]

const FAQS = [
  {
    question: 'How is the data sourced?',
    answer:
      'TribeAI aggregates data solely from internal university portals, authorized announcements, and verified student discussions. It does not scrape external, unverified sources.',
  },
  {
    question: 'Is the integration real-time?',
    answer:
      'Yes. The Knowledge Graph updates instantly as new discussions are posted or administrative notices are released, ensuring you always have the latest campus information.',
  },
  {
    question: 'Can it help with course selection?',
    answer:
      'Absolutely. By analyzing thousands of student reviews and syllabus documents, TribeAI can provide detailed insights into course difficulty, faculty expectations, and prerequisites.',
  },
  {
    question: 'How is student privacy protected?',
    answer:
      'We strictly adhere to enterprise-grade privacy standards. Query data is anonymized, and the model is trained to respect information boundaries. Personal identifiers are never exposed.',
  },
  {
    question: "What if the information isn't available?",
    answer:
      'If a specific answer cannot be synthesized, TribeAI will guide you to the appropriate university department or suggest starting a new discussion thread to gather community input.',
  },
  {
    question: 'Is it accessible on mobile devices?',
    answer:
      'Yes, the TribeAI interface is fully responsive and optimized for mobile browsers, allowing you to access institutional intelligence from anywhere on campus.',
  },
]

const HeroSection = () => (
  <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium"
    >
      <Sparkles className="w-4 h-4" />
      Powered by Advanced AI
    </motion.div>

    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-5xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.9] mb-6"
    >
      Institutional
      <br />
      <span className="text-blue-400">Intelligence Engine</span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10"
    >
      Navigate university life with precision. Leverage our proprietary LLM to
      synthesize academic resources, campus logistics, and student discourse
      into actionable insights.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-4"
    >
      <a href={siteConfig.urls.ai} target="_blank" rel="noopener noreferrer">
        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25">
          <Bot className="w-5 h-5" />
          Try TribeAI
          <ArrowRight className="w-5 h-5" />
        </button>
      </a>
      <button
        onClick={() => {
          document
            .getElementById('how-it-works')
            ?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-lg font-bold rounded-full border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
      >
        <Zap className="w-5 h-5 text-blue-400" />
        See How It Works
      </button>
    </motion.div>
  </section>
)

const StatsSection = () => (
  <section className="py-16 px-6 border-y border-border">
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
          <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <p className="text-4xl font-bold text-foreground mb-1">
            {stat.value}
          </p>
          <p className="text-muted-foreground text-sm">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  </section>
)

const FeaturesSection = () => (
  <section className="py-20 px-6">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
          Enterprise-Grade <span className="text-blue-400">Capabilities</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          More than just a chatbot. A comprehensive knowledge management system
          for your campus.
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
            className="bg-card/30 border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all hover:bg-blue-500/5 group"
          >
            <div
              className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              {feature.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-20 px-6 relative">
    <div className="absolute inset-0 -z-10 bg-blue-900/5" />
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
          How It <span className="text-blue-400">Works</span>
        </h2>
        <p className="text-muted-foreground">
          From question to answer in seconds.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {HOW_IT_WORKS.map((item, i) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center relative"
          >
            {i < HOW_IT_WORKS.length - 1 && (
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-border" />
            )}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/15 flex items-center justify-center relative z-10">
              <item.icon className="w-7 h-7 text-blue-400" />
            </div>
            <div className="text-xs text-blue-400 font-mono mb-2">
              {item.step}
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              {item.title}
            </h3>
            <p className="text-muted-foreground text-sm">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

const UseCasesSection = () => (
  <section className="py-20 px-6">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
          What You Can <span className="text-indigo-400">Ask</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Real examples of how students use TribeAI.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {USE_CASES.map((useCase, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-card/30 border border-white/5 rounded-xl p-5 hover:border-blue-500/30 transition-all hover:bg-blue-500/5 group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <useCase.icon className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-foreground font-medium mb-2">{useCase.query}</p>
            <p className="text-muted-foreground text-sm">→ {useCase.result}</p>
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
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
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
                viewport={{ once: true }}
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
                    className={`font-semibold text-lg transition-colors ${
                      isOpen ? 'text-blue-400' : 'text-foreground'
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
                      <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
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
      viewport={{ once: true }}
      className="max-w-4xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 text-center relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-linear-to-b from-blue-500/10 via-transparent to-blue-500/5 opacity-50" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]" />

      <Bot className="w-16 h-16 text-blue-400 mx-auto mb-6 relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
      <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4 relative z-10">
        Ready to Deploy?
      </h2>
      <p className="text-muted-foreground max-w-lg mx-auto mb-10 relative z-10 text-lg">
        Empower your student body with the next generation of campus
        intelligence.
      </p>
      <a
        href={siteConfig.urls.ai}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 inline-block"
      >
        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto shadow-lg shadow-blue-500/25 border border-white/10">
          <Sparkles className="w-5 h-5" />
          Start Chatting
        </button>
      </a>
    </motion.div>
  </section>
)

/**
 * AI Page
 */
export default function AIPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-blue-500/30">
      <Navbar />
      <Grain />

      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <FAQSection />
      <CTASection />

      <Footer />
    </main>
  )
}
