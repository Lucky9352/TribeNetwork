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
  ChevronDown,
  Bot,
  Target,
  Lightbulb,
} from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import Grain from '@/components/ui/Grain'
import { siteConfig } from '@/lib/site-config'

/**
 * @file page.tsx
 * @description Comprehensive AI page with features, how it works, use cases, and FAQs.
 */

const STATS = [
  { value: '10k+', label: 'Posts Indexed', icon: BookOpen },
  { value: '<2s', label: 'Response Time', icon: Zap },
  { value: '24/7', label: 'Available', icon: Clock },
  { value: '100%', label: 'Forum Connected', icon: Link2 },
]

const FEATURES = [
  {
    icon: Search,
    title: 'Smart Forum Search',
    description:
      "Our AI searches across thousands of forum discussions to find exactly what you're looking for. No more endless scrolling.",
    color: 'bg-blue-500/10 text-blue-400',
  },
  {
    icon: Users,
    title: 'Find People Like You',
    description:
      'Ask "anyone into photography?" and get matched with students who share your interests, hobbies, and passions.',
    color: 'bg-purple-500/10 text-purple-400',
  },
  {
    icon: MessageSquare,
    title: 'Natural Conversations',
    description:
      'Chat naturally like you would with a friend. Ask questions, get recommendations, and discover campus life.',
    color: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    icon: Link2,
    title: 'Direct Forum Links',
    description:
      'Every answer comes with links to original forum discussions so you can dive deeper and connect with the community.',
    color: 'bg-amber-500/10 text-amber-400',
  },
  {
    icon: Brain,
    title: 'Context-Aware Answers',
    description:
      'TribeAI understands JAIN University context - campus names, courses, events, and student life.',
    color: 'bg-pink-500/10 text-pink-400',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description:
      "Your conversations with TribeAI are private. We don't store personal queries or share your data.",
    color: 'bg-indigo-500/10 text-indigo-400',
  },
]

const USE_CASES = [
  {
    query: '"Anyone into guitar here?"',
    result:
      'Finds students who play guitar, jam sessions, and music communities',
    icon: '🎸',
  },
  {
    query: '"Study group for CA exams?"',
    result:
      'Connects you with chartered accountancy students and study materials',
    icon: '📚',
  },
  {
    query: '"Best cafes near JU campus?"',
    result: 'Shows recommendations and reviews from real students',
    icon: '☕',
  },
  {
    query: '"Internship opportunities?"',
    result: 'Finds job postings, interview experiences, and career advice',
    icon: '💼',
  },
  {
    query: '"Weekend trip plans?"',
    result: 'Discovers upcoming trips, travel groups, and adventure buddies',
    icon: '🏔️',
  },
  {
    query: '"Basketball players?"',
    result: 'Matches you with sports enthusiasts and team tryout information',
    icon: '🏀',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Ask Anything',
    description:
      'Type your question naturally - about people, topics, or campus life',
    icon: MessageSquare,
  },
  {
    step: '02',
    title: 'AI Searches Forum',
    description:
      'TribeAI searches across all forum discussions using smart matching',
    icon: Search,
  },
  {
    step: '03',
    title: 'Get Relevant Results',
    description:
      'Receive curated answers with direct links to discussions and users',
    icon: Target,
  },
  {
    step: '04',
    title: 'Connect & Engage',
    description: 'Jump into discussions, reply to posts, or create new topics',
    icon: Users,
  },
]

const FAQS = [
  {
    question: 'How does TribeAI find relevant answers?',
    answer:
      'TribeAI uses advanced natural language processing to understand your question and searches across all forum discussions. It ranks results by relevance and returns the most helpful discussions with direct links.',
  },
  {
    question: 'Is TribeAI connected to the live forum?',
    answer:
      'Yes! TribeAI searches the actual Tribe Community forum in real-time. All results link to real discussions where you can engage with other students.',
  },
  {
    question: 'Can TribeAI answer general knowledge questions?',
    answer:
      'TribeAI is primarily designed for campus-related queries. While it can answer general questions, it excels at finding campus-specific information, people with shared interests, and community discussions.',
  },
  {
    question: 'Are my conversations private?',
    answer:
      "Yes, your conversations with TribeAI are private. We don't store your queries or share your data with third parties. Your privacy is our priority.",
  },
  {
    question: "What if TribeAI can't find what I'm looking for?",
    answer:
      'If no relevant discussions exist, TribeAI will suggest creating a new post on the forum. This helps build the community and ensures your question gets answered by real students.',
  },
  {
    question: 'Does TribeAI work on mobile?',
    answer:
      'Absolutely! TribeAI is fully responsive and works on any device - smartphones, tablets, or desktops. Access it through any modern web browser.',
  },
]

const HeroSection = () => (
  <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
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
      className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9] mb-6"
    >
      AI That Knows
      <br />
      <span className="text-blue-400">Your Campus</span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10"
    >
      Ask anything about campus life. TribeAI searches across thousands of forum
      discussions to find students with similar interests, study partners, and
      answers.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col sm:flex-row gap-4"
    >
      <a href={siteConfig.urls.ai} target="_blank" rel="noopener noreferrer">
        <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full hover:scale-105 transition-all flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Try TribeAI
          <ArrowRight className="w-4 h-4" />
        </button>
      </a>
      <a href="#how-it-works">
        <button className="px-8 py-4 border border-border text-foreground font-semibold rounded-full hover:bg-muted transition-all">
          See How It Works
        </button>
      </a>
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
          Intelligent <span className="text-blue-400">Features</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          More than just a chatbot. TribeAI is your personal campus assistant.
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
            className="bg-card/50 border border-border rounded-2xl p-6 hover:border-blue-500/50 transition-all group"
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
          How It <span className="text-cyan-400">Works</span>
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
          What You Can <span className="text-pink-400">Ask</span>
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
            className="bg-card/50 border border-border rounded-xl p-5 hover:border-blue-500/30 transition-all"
          >
            <div className="text-3xl mb-3">{useCase.icon}</div>
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
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
            Frequently Asked <span className="text-green-400">Questions</span>
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
              className="bg-card/50 border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-5 flex items-center justify-between text-left"
              >
                <span className="font-medium text-foreground">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-muted-foreground text-sm">
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
      className="max-w-4xl mx-auto bg-blue-900/30 border border-blue-500/20 rounded-3xl p-12 text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-blue-500/5" />
      <Lightbulb className="w-16 h-16 text-blue-400 mx-auto mb-6 relative z-10" />
      <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4 relative z-10">
        Ready to Explore?
      </h2>
      <p className="text-muted-foreground max-w-lg mx-auto mb-8 relative z-10">
        Start asking questions. Find your people. Discover campus life like
        never before.
      </p>
      <a
        href={siteConfig.urls.ai}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10"
      >
        <button className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto">
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
