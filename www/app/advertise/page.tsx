'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Building2,
  Clock,
  Mail,
  Megaphone,
  MessageSquare,
  Phone,
  Target,
  TrendingUp,
  Users,
  Zap,
  BarChart,
  Building,
  PieChart,
  Plus,
  Minus,
} from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import Grain from '@/components/ui/Grain'
import PartnershipForm from '@/components/forms/PartnershipForm'
import Modal from '@/components/ui/Modal'

interface Channel {
  name: string
  icon: React.ElementType
  color: string
  stats: string
}

interface CampaignPreview {
  name: string
  channel: 'WhatsApp' | 'Email' | 'SMS'
  status: 'Active' | 'Completed'
  reach: string
  ctr: string
}

const STATS = [
  { value: '50k+', label: 'Verified Students', icon: Users },
  { value: '18+', label: 'Campuses', icon: Building2 },
  { value: '4.8%', label: 'Avg CTR', icon: TrendingUp },
  { value: '<5min', label: 'To Launch', icon: Clock },
]

const NEW_CAPABILITIES = [
  {
    title: 'Hyper-Local Feed Ads',
    description:
      'Place your brand directly in the university discussion stream. Target by campus, major, or academic year.',
    icon: Megaphone,
    color: 'bg-blue-500/10 text-blue-400',
  },
  {
    title: 'Strategic Push Notifications',
    description:
      'Deliver time-sensitive announcements for recruitment drives, hackathons, or campus events directly to student devices.',
    icon: Target,
    color: 'bg-indigo-500/10 text-indigo-400',
  },
  {
    title: 'Brand Ambassadorship',
    description:
      'Leverage improved credibility by partnering with verified student leaders and campus organizations.',
    icon: Users,
    color: 'bg-violet-500/10 text-violet-400',
  },
  {
    title: 'Event Sponsorship',
    description:
      'Gain physical and digital visibility at high-traffic university fests, orientations, and competitions.',
    icon: Building,
    color: 'bg-sky-500/10 text-sky-400',
  },
  {
    title: 'Performance Analytics',
    description:
      'Track impressions, click-through rates, and conversions with our granular, privacy-compliant dashboard.',
    icon: BarChart,
    color: 'bg-blue-500/10 text-blue-400',
  },
  {
    title: 'Demographic Insights',
    description:
      'Understand student sentiment and trends to refine your messaging and product positioning.',
    icon: PieChart,
    color: 'bg-indigo-500/10 text-indigo-400',
  },
]

const CHANNELS: Channel[] = [
  {
    name: 'WhatsApp',
    icon: MessageSquare,
    color: 'text-green-400 bg-green-400/10',
    stats: '68% open rate',
  },
  {
    name: 'Email',
    icon: Mail,
    color: 'text-blue-400 bg-blue-400/10',
    stats: 'HTML templates',
  },
  {
    name: 'SMS',
    icon: Phone,
    color: 'text-purple-400 bg-purple-400/10',
    stats: '99% delivery',
  },
]

const SAMPLE_CAMPAIGNS: CampaignPreview[] = [
  {
    name: 'Summer Internship Drive',
    channel: 'WhatsApp',
    status: 'Active',
    reach: '45.2K',
    ctr: '5.2%',
  },
  {
    name: 'Product Launch - BLR',
    channel: 'Email',
    status: 'Active',
    reach: '32.1K',
    ctr: '4.8%',
  },
  {
    name: 'Brand Awareness Q4',
    channel: 'WhatsApp',
    status: 'Completed',
    reach: '89.3K',
    ctr: '6.1%',
  },
]

const CHANNEL_ICONS = { WhatsApp: MessageSquare, Email: Mail, SMS: Phone }
const CHANNEL_COLORS = {
  WhatsApp: 'text-green-400 bg-green-400/10',
  Email: 'text-blue-400 bg-blue-400/10',
  SMS: 'text-purple-400 bg-purple-400/10',
}

const HeroSection = ({ onOpenForm }: { onOpenForm: () => void }) => (
  <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-medium"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      India&apos;s Largest College Network
    </motion.div>

    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-5xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.9] mb-6"
    >
      Strategic
      <br />
      <span className="text-blue-500">Campus Engagement</span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10"
    >
      Connect authentically with the next generation of leaders. Precision
      targeting across verified university networks.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col sm:flex-row gap-4"
    >
      <button
        onClick={onOpenForm}
        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25"
      >
        Start Campaign
        <ArrowRight className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          document
            .getElementById('channels')
            ?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-lg font-bold rounded-full border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
      >
        <BarChart className="w-5 h-5 text-blue-400" />
        View Media Kit
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

const ChannelsSection = () => (
  <section id="channels" className="py-20 px-6 bg-black border-y border-border">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
          Omnichannel <span className="text-blue-400">Inventory</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Diverse formats to suit your campaign objectives - from awareness to
          conversion.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CHANNELS.map((channel, i) => (
          <motion.div
            key={channel.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card/30 border border-white/5 p-8 rounded-2xl hover:border-blue-500/30 transition-all hover:bg-blue-500/5 group text-center"
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${channel.color} group-hover:scale-110 transition-transform`}
            >
              <channel.icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {channel.name}
            </h3>
            <p className="text-muted-foreground">{channel.stats}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

const CapabilitiesSection = () => (
  <section className="py-20 px-6">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
          Platform <span className="text-blue-400">Capabilities</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Everything you need to run successful student campaigns.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {NEW_CAPABILITIES.map((capability, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card/30 border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all hover:bg-blue-500/5 group"
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <capability.icon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">
              {capability.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {capability.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

const WorkflowSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const FAQS = [
    {
      question: 'How do you verify student accounts?',
      answer:
        'We partner directly with universities to integrate with their student information systems, ensuring every account is tied to an active student ID. This guarantees authenticity and prevents fraud.',
    },
    {
      question: 'What kind of targeting options are available?',
      answer:
        'You can target students by university, academic year, major, interests (e.g., tech, arts, sports), and even specific campus organizations. Our granular filters ensure your message reaches the most relevant audience.',
    },
    {
      question: 'Can I track campaign performance in real-time?',
      answer:
        "Yes, our dashboard provides real-time analytics on impressions, click-through rates, conversions, and engagement metrics. You can monitor your campaign's progress and make data-driven adjustments on the fly.",
    },
    {
      question: 'What is the minimum budget for a campaign?',
      answer:
        'We offer flexible pricing models to accommodate various budgets. Campaigns can start from as low as $100, making it accessible for both small businesses and large enterprises. Contact us for a custom quote.',
    },
  ]

  return (
    <section className="py-20 px-6 relative">
      <div className="absolute inset-0 -z-10 bg-primary/5" />
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
            Launch campaigns in four simple steps.
          </p>
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

const DashboardPreview = () => {
  const CAMPAIGN_STATS = [
    { label: 'Student Reach', value: '50k+', icon: Users },
    { label: 'Engagement Rate', value: '12%', icon: TrendingUp },
    { label: 'Campus Presence', value: '15+', icon: Building },
    { label: 'Conversion Lift', value: '3.5x', icon: Zap },
  ]
  return (
    <section id="dashboard-preview" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
            Dashboard <span className="text-blue-400">Preview</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track all your campaigns in one powerful dashboard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10"
        >
          {/* Dashboard Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="bg-black/50 px-4 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
              <span className="text-muted-foreground text-xs font-mono">
                tribe.advertise/dashboard
              </span>
            </div>
            <div className="w-16" />
          </div>

          {/* Dashboard Content */}
          <div className="p-8 space-y-8">
            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CAMPAIGN_STATS.map((m) => (
                <div
                  key={m.label}
                  className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                      <m.icon className="w-4 h-4" />
                    </div>
                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                      {m.label}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white tracking-tight">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Campaigns Table */}
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-bold text-lg">
                  Recent Campaigns
                </h3>
                <button className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
                  View All →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5">
                      <th className="text-left px-6 py-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="text-left px-6 py-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        Channel
                      </th>
                      <th className="text-left px-6 py-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        Reach
                      </th>
                      <th className="text-left px-6 py-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        CTR
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_CAMPAIGNS.map((c) => {
                      const Icon = CHANNEL_ICONS[c.channel]
                      return (
                        <tr
                          key={c.name}
                          className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4 text-white font-medium text-sm">
                            {c.name}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-white/5 ${CHANNEL_COLORS[c.channel].replace('bg-', 'bg-opacity-10 bg-')}`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              {c.channel}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-white/5 ${c.status === 'Active' ? 'text-green-400 bg-green-400/10' : 'text-zinc-400 bg-zinc-400/10'}`}
                            >
                              {c.status === 'Active' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                              )}
                              {c.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-300 text-sm font-mono">
                            {c.reach}
                          </td>
                          <td className="px-6 py-4 text-green-400 text-sm font-mono font-bold">
                            {c.ctr}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const CTASection = ({ onOpenForm }: { onOpenForm: () => void }) => (
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

      <Megaphone className="w-16 h-16 text-blue-400 mx-auto mb-6 relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
      <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4 relative z-10">
        Ready to Launch?
      </h2>
      <p className="text-muted-foreground max-w-lg mx-auto mb-10 relative z-10 text-lg">
        Partner with the most influential campus network in the region.
      </p>

      <button
        onClick={onOpenForm}
        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto shadow-lg shadow-blue-500/25 border border-white/10 relative z-10"
      >
        <Megaphone className="w-5 h-5" />
        Start Campaign
      </button>
    </motion.div>
  </section>
)

/**
 * Main Advertise Page.
 */
export default function AdvertisePage() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      <Grain />

      <HeroSection onOpenForm={() => setIsFormOpen(true)} />
      <StatsSection />
      <ChannelsSection />
      <CapabilitiesSection />
      <WorkflowSection />
      <DashboardPreview />
      <CTASection onOpenForm={() => setIsFormOpen(true)} />

      <Footer />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Start Your Campaign"
      >
        <PartnershipForm onSuccess={() => {}} />
      </Modal>
    </main>
  )
}
