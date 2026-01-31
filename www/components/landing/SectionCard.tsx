'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, LucideIcon } from 'lucide-react'

/**
 * @file SectionCard.tsx
 * @description A reusable card component used in the ScrollSections layout.
 * Displays an icon, title, description, and an interactive "Explore" link.
 */

interface SectionCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  gradient: string
  delay?: number
}

const CardIcon = ({ icon: Icon }: { icon: LucideIcon }) => (
  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
    <Icon className="w-6 h-6 text-white" />
  </div>
)

const CardContent = ({
  title,
  description,
}: {
  title: string
  description: string
}) => (
  <>
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed mb-6 grow">{description}</p>

    <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors">
      Explore
      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
    </div>
  </>
)

/**
 * Main SectionCard Component.
 */
export default function SectionCard({
  title,
  description,
  icon,
  href,
  delay = 0,
}: SectionCardProps) {
  return (
    <Link href={href} className="block group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay }}
        className="relative h-full p-8 rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-colors duration-300"
      >
        {/* Background Color Overlay */}
        <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 flex flex-col h-full">
          <CardIcon icon={icon} />
          <CardContent title={title} description={description} />
        </div>
      </motion.div>
    </Link>
  )
}
