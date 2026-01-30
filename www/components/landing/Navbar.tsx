'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { siteConfig } from '@/lib/site-config'

/**
 * @file Navbar.tsx
 * @description The main floating navigation bar for the landing page.
 * Features a glassmorphism effect and smooth entrance animation.
 */

interface NavLinkData {
  label: string
  href: string
}

const NAV_LINKS: NavLinkData[] = [
  { label: 'Community', href: siteConfig.urls.community },
  { label: 'AI', href: siteConfig.urls.ai },
  { label: 'Advertise', href: siteConfig.urls.advertise },
]

const NavLink = ({ href, label }: NavLinkData) => (
  <Link href={href} className="hover:text-foreground transition-colors">
    {label}
  </Link>
)

/**
 * Main Navbar Component.
 */
export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-6 pointer-events-none"
    >
      <div className="bg-background/60 backdrop-blur-xl border border-border rounded-full px-6 py-3 flex items-center gap-8 pointer-events-auto shadow-2xl">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-xl tracking-tighter text-foreground hover:text-muted-foreground transition-colors"
        >
          Tribe
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
