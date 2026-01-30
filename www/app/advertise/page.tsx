'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Building2,
  Clock,
  Globe,
  Lock,
  Mail,
  Megaphone,
  MessageSquare,
  Phone,
  Play,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import Grain from '@/components/ui/Grain'
import PartnershipForm from '@/components/forms/PartnershipForm'

/**
 * @file page.tsx
 * @description Comprehensive Advertise page combining capabilities, dashboard preview, and CTA.
 */

interface Capability {
  icon: React.ElementType
  title: string
  desc: string
  gradient: string
}

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

const CAPABILITIES: Capability[] = [
  {
    icon: Users,
    title: 'Verified Network',
    desc: "India's largest verified student database",
    gradient: 'bg-primary/10 text-primary',
  },
  {
    icon: Target,
    title: 'Precision Targeting',
    desc: 'Target by college, year, interests & more',
    gradient: 'bg-blue-500/10 text-blue-400',
  },
  {
    icon: MessageSquare,
    title: 'Multi-Channel',
    desc: 'WhatsApp, Email & SMS from one platform',
    gradient: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Track reach, engagement & ROI live',
    gradient: 'bg-amber-500/10 text-amber-400',
  },
  {
    icon: Zap,
    title: 'Fast Launch',
    desc: 'Go live in under 5 minutes',
    gradient: 'bg-pink-500/10 text-pink-400',
  },
  {
    icon: Lock,
    title: 'Verified Delivery',
    desc: 'Guaranteed reach to real students',
    gradient: 'bg-indigo-500/10 text-indigo-400',
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

const WORKFLOW = [
  { step: '01', title: 'Select Campuses', desc: 'Choose from 18+ colleges' },
  { step: '02', title: 'Set Targeting', desc: 'Define your audience' },
  { step: '03', title: 'Upload Creative', desc: 'Add message & media' },
  { step: '04', title: 'Launch & Track', desc: 'Go live instantly' },
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
  <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
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
      Reach <span className="text-primary">Students</span>
      <br />
      Effortlessly
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10"
    >
      Run verified campus campaigns on WhatsApp, email and SMS. Pick colleges,
      set interests and budget, and launch in minutes.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col sm:flex-row gap-4"
    >
      <button
        onClick={onOpenForm}
        className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full hover:scale-105 transition-all flex items-center gap-2"
      >
        <Megaphone className="w-5 h-5" />
        Start Campaign
        <ArrowRight className="w-4 h-4" />
      </button>
      <a href="#dashboard-preview">
        <button className="px-8 py-4 border border-border text-foreground font-semibold rounded-full hover:bg-muted transition-all">
          See How It Works
        </button>
      </a>
    </motion.div>

    {/* Stats Row */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
    >
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="bg-card/50 border border-border rounded-2xl p-6 text-center shadow-sm"
        >
          <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
          <p className="text-3xl font-bold text-foreground mb-1">
            {stat.value}
          </p>
          <p className="text-muted-foreground text-sm">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  </section>
)

const ChannelsSection = () => (
  <section className="py-20 px-6 border-y border-border">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
          Multi-Channel <span className="text-primary">Delivery</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Reach students where they are. One platform, three channels.
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
            className="bg-card/50 border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all"
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${channel.color}`}
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
          Platform <span className="text-primary">Capabilities</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Everything you need to run successful student campaigns.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CAPABILITIES.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-card/50 border border-border rounded-2xl p-6 hover:border-primary/50 transition-all group"
          >
            <div
              className={`w-12 h-12 rounded-xl ${item.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              {item.title}
            </h3>
            <p className="text-muted-foreground text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

const WorkflowSection = () => (
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
          How It <span className="text-pink-400">Works</span>
        </h2>
        <p className="text-muted-foreground">
          Launch campaigns in four simple steps.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {WORKFLOW.map((item, i) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {item.step}
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">
              {item.title}
            </h3>
            <p className="text-muted-foreground text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

const DashboardPreview = () => (
  <section id="dashboard-preview" className="py-20 px-6">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
          Dashboard <span className="text-green-400">Preview</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Track all your campaigns in one powerful dashboard.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card/80 border border-border rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Dashboard Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-muted-foreground text-sm font-mono">
            tribe.advertise/dashboard
          </span>
          <div />
        </div>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Campaigns', value: '12', icon: Play },
              { label: 'Total Reach', value: '1.2M', icon: Users },
              { label: 'Engagements', value: '184K', icon: TrendingUp },
              { label: 'Avg CTR', value: '4.8%', icon: BarChart3 },
            ].map((m) => (
              <div key={m.label} className="bg-secondary/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <m.icon className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground text-xs">
                    {m.label}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Campaigns Table */}
          <div className="bg-secondary/30 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-foreground font-medium">
                Recent Campaigns
              </span>
              <span className="text-primary text-sm">View All →</span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">
                    Campaign
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">
                    Channel
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">
                    Reach
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">
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
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-foreground text-sm">
                        {c.name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${CHANNEL_COLORS[c.channel]}`}
                        >
                          <Icon className="w-3 h-3" />
                          {c.channel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${c.status === 'Active' ? 'text-green-400 bg-green-400/10' : 'text-zinc-400 bg-zinc-400/10'}`}
                        >
                          {c.status === 'Active' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          )}
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground text-sm">
                        {c.reach}
                      </td>
                      <td className="px-4 py-3 text-green-400 text-sm font-medium">
                        {c.ctr}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

const CTASection = ({ onOpenForm }: { onOpenForm: () => void }) => (
  <section className="py-32 px-6">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto bg-primary/20 border border-primary/20 rounded-3xl p-12 text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-primary/5" />
      <Globe className="w-16 h-16 text-primary mx-auto mb-6 relative z-10" />
      <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4 relative z-10">
        Ready to Launch?
      </h2>
      <p className="text-muted-foreground max-w-lg mx-auto mb-8 relative z-10">
        Join brands reaching thousands of verified students across India&apos;s
        largest college network.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
        <button
          onClick={onOpenForm}
          className="px-8 py-4 bg-foreground text-background font-bold rounded-full hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <Megaphone className="w-5 h-5" />
          Get Started
        </button>
      </div>
      <p className="text-muted-foreground text-sm mt-6 relative z-10">
        No credit card required • Launch in minutes
      </p>
    </motion.div>
  </section>
)

const PartnerFormModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card border border-border w-full max-w-lg rounded-2xl overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">
                  Start Your Campaign
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-6">
                <PartnershipForm onSuccess={() => {}} />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

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
      <ChannelsSection />
      <CapabilitiesSection />
      <WorkflowSection />
      <DashboardPreview />
      <CTASection onOpenForm={() => setIsFormOpen(true)} />

      <Footer />

      <PartnerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </main>
  )
}
