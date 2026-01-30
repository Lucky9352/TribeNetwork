'use client'

import React from 'react'
import { Users, MousePointer2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { siteConfig } from '@/lib/site-config'
import { UnifiedHeader } from '@/components/landing/screens/UnifiedHeader'

/**
 * @file AdvertiseScreen.tsx
 * @description A mock interface demonstrating the advertiser dashboard experience.
 * Features animated cards, real-time metric simulation, and active campaign status.
 */

interface MetricItem {
  label: string
  value: string
  icon?: React.ElementType
  color?: string
}

interface CampaignDetails {
  brand: string
  name: string
  target: string
}

const GRAPH_DATA = [20, 35, 30, 50, 45, 60, 55, 75, 70, 90, 85, 100]

const MAIN_METRIC = {
  label: 'Total Reach',
  value: '124,592',
  growth: '+12%',
}

const GRID_METRICS: MetricItem[] = [
  { label: 'Impressions', value: '45.2k', icon: Users, color: 'text-blue-400' },
  {
    label: 'Clicks',
    value: '3,891',
    icon: MousePointer2,
    color: 'text-purple-400',
  },
]

const ACTIVE_CAMPAIGN: CampaignDetails = {
  brand: 'NIKE',
  name: 'Back to School',
  target: 'Target: Ivy League',
}

const Graph = () => (
  <div className="flex items-end gap-1 h-12 w-full pt-2">
    {GRAPH_DATA.map((h, i) => (
      <motion.div
        key={i}
        initial={{ height: 0 }}
        animate={{ height: `${h}%` }}
        transition={{ duration: 0.5, delay: i * 0.05 }}
        className="flex-1 bg-green-500/20 rounded-sm hover:bg-green-500 transition-colors"
      />
    ))}
  </div>
)

const MainStatCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-transparent border border-white/10 p-4 rounded-xl space-y-4"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs text-zinc-500">{MAIN_METRIC.label}</p>
        <h3 className="text-2xl font-bold">{MAIN_METRIC.value}</h3>
      </div>
      <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
        {MAIN_METRIC.growth}
      </span>
    </div>
    <Graph />
  </motion.div>
)

const GridStats = () => (
  <div className="grid grid-cols-2 gap-3">
    {GRID_METRICS.map((metric, i) => (
      <motion.div
        key={metric.label}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 + i * 0.1 }}
        className="bg-transparent border border-white/10 p-3 rounded-xl"
      >
        {metric.icon && (
          <metric.icon className={`w-4 h-4 mb-2 ${metric.color}`} />
        )}
        <p className="text-xs text-zinc-500">{metric.label}</p>
        <p className="text-lg font-bold">{metric.value}</p>
      </motion.div>
    ))}
  </div>
)

const ActiveCampaignCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="bg-transparent border border-white/10 p-4 rounded-xl"
  >
    <div className="flex justify-between items-center mb-3">
      <p className="text-sm font-medium">Active Now</p>
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
    </div>
    <div className="flex gap-3 items-center bg-black/40 p-2 rounded-lg border border-white/5">
      <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center font-bold text-black text-xs">
        {ACTIVE_CAMPAIGN.brand}
      </div>
      <div>
        <p className="text-xs font-bold">{ACTIVE_CAMPAIGN.name}</p>
        <p className="text-[10px] text-zinc-500">{ACTIVE_CAMPAIGN.target}</p>
      </div>
    </div>
  </motion.div>
)

/**
 * Main component for the Advertise Screen demo.
 */
export default function AdvertiseScreen() {
  return (
    <div className="w-full h-full bg-transparent text-white relative overflow-hidden font-sans rounded-[2.5rem]">
      <UnifiedHeader />
      <Link
        href={siteConfig.urls.advertise}
        className="block h-full overflow-hidden cursor-pointer transition-colors"
      >
        <div className="p-4 space-y-4 overflow-y-auto no-scrollbar h-full pt-16 pb-20 mask-gradient-b">
          <MainStatCard />
          <GridStats />
          <ActiveCampaignCard />

          <div className="pt-2">
            <h3 className="text-sm font-bold mb-3 text-zinc-400">
              Past Campaigns
            </h3>
            <div className="space-y-3">
              <div className="bg-transparent border border-white/5 p-4 rounded-xl opacity-60">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">Summer Sale</span>
                  <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">
                    Ended
                  </span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Reach: 85k</span>
                  <span>Clicks: 2.1k</span>
                </div>
              </div>
              <div className="bg-transparent border border-white/5 p-4 rounded-xl opacity-60">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">Hiring Drive</span>
                  <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">
                    Ended
                  </span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Reach: 42k</span>
                  <span>Applications: 850</span>
                </div>
              </div>
              <div className="bg-transparent border border-white/5 p-4 rounded-xl opacity-60">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">Hackathon Sponsor</span>
                  <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">
                    Ended
                  </span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Reach: 15k</span>
                  <span>Registrations: 300</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
