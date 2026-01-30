'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Send, Loader2, Check } from 'lucide-react'
import { SiX, SiInstagram, SiGithub } from '@icons-pack/react-simple-icons'
import { siteConfig } from '@/lib/site-config'

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
      <div className="max-w-md">
        <div className="flex items-center gap-2 text-green-400 mb-2">
          <Check className="w-5 h-5" />
          <span className="font-bold">You&apos;re subscribed!</span>
        </div>
        <p className="text-muted-foreground text-sm">
          Thanks for joining! We&apos;ll keep you updated on the latest
          features.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md">
      <h3 className="font-bold text-lg mb-2">Stay updated</h3>
      <p className="text-muted-foreground text-sm mb-4">
        Get the latest updates on campus features and AI tools.
      </p>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={isSubmitting}
          className="w-full bg-muted border border-border rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 text-foreground placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={isSubmitting || !email}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="w-3 h-3 text-primary-foreground animate-spin" />
          ) : (
            <Send className="w-3 h-3 text-primary-foreground" />
          )}
        </button>
      </form>
      {error && <p className="text-destructive text-xs mt-2">{error}</p>}
    </div>
  )
}

const FooterColumn = ({ section }: { section: FooterSection }) => (
  <div>
    <h3 className="font-bold text-white mb-4">{section.title}</h3>
    <ul className="space-y-3">
      {section.links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center group"
          >
            {link.label}
            <ArrowRight className="w-3 h-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
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
    <footer className="bg-background border-t border-border pt-20 pb-10">
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
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-3 gap-8">
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
