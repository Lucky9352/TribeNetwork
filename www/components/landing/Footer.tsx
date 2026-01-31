'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Send, Loader2, Check } from 'lucide-react'
import { SiX, SiInstagram, SiGithub } from '@icons-pack/react-simple-icons'
import { siteConfig } from '@/lib/site-config'
import { motion } from 'framer-motion'

/**
 * @file Footer.tsx
 * @description A comprehensive footer component with multi-column navigation,
 * newsletter signup, and social media links.
 */

interface FooterLink {
  label: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { label: 'Community', href: siteConfig.urls.community },
      { label: 'AI Utils', href: siteConfig.urls.ai },
      { label: 'Advertise', href: siteConfig.urls.advertise },
    ],
  },
  /*
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Brand', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
  */
]

const SOCIAL_LINKS = [
  { icon: SiX, href: siteConfig.social.twitter, label: 'X' },
  { icon: SiInstagram, href: siteConfig.social.instagram, label: 'Instagram' },
  { icon: SiGithub, href: siteConfig.social.github, label: 'GitHub' },
].filter((link) => link.href && link.href !== '#')

const NewsletterForm = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setIsSuccess(true)
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl"
      >
        <div className="flex items-center gap-3 text-blue-400 mb-2">
          <div className="p-1 rounded-lg bg-blue-400/10">
            <Check className="w-5 h-5" />
          </div>
          <span className="font-black uppercase tracking-widest text-sm">
            Subscribed
          </span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Welcome to the network. You&apos;ll receive our next campus update
          shortly.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="max-w-md">
      <h3 className="font-black text-white text-lg uppercase tracking-tighter mb-2">
        Join the <span className="text-blue-400">Network</span>
      </h3>
      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
        Stay ahead with the latest advancements in campus intelligence and
        community connectivity.
      </p>
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your work email"
          disabled={isSubmitting}
          className="w-full bg-white/3 border border-white/10 rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors disabled:opacity-50 text-foreground placeholder:text-muted-foreground hover:bg-white/5"
        />
        <button
          type="submit"
          disabled={isSubmitting || !email}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 rounded-full hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Send className="w-4 h-4 text-white" />
          )}
        </button>
      </form>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs mt-3 ml-2 font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

const FooterColumn = ({ section }: { section: FooterSection }) => (
  <div>
    <h3 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-6">
      {section.title}
    </h3>
    <ul className="space-y-3">
      {section.links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center group"
          >
            {link.label}
            <ArrowRight className="w-3 h-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-transform duration-300" />
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

/**
 * Main Footer Component.
 */
export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear())

  React.useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-transparent relative z-10 border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          {/* Brand & Newsletter - Takes up 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-tighter text-primary">
                Tribe Network
              </span>
            </Link>
            <NewsletterForm />
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {FOOTER_SECTIONS.map((section) => (
              <FooterColumn key={section.title} section={section} />
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            © {year} Tribe Network. All rights reserved.
          </p>

          <div className="flex gap-4">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted/50 rounded-full"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
