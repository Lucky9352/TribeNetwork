'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2,
  Sparkles,
  Building2,
  Mail,
  User,
  Briefcase,
  DollarSign,
  MessageSquare,
  ChevronDown,
} from 'lucide-react'

interface PartnershipFormProps {
  onSuccess?: () => void
}

const ROLES = [
  'Marketing Lead',
  'Founder / CEO',
  'Agency Partner',
  'Brand Manager',
  'Other',
]

const BUDGETS = [
  'Under $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000+',
]

/**
 * Partnership inquiry form for brands/advertisers.
 */
export default function PartnershipForm({ onSuccess }: PartnershipFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyWebsite: '',
    role: '',
    budgetRange: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setIsSuccess(true)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          You&apos;re on the list!
        </h3>
        <p className="text-muted-foreground">
          We&apos;ll reach out soon to discuss how we can help your brand
          connect with Gen Z.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Your Name <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Work Email <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@company.com"
            className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Company Website */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Company Website <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="url"
            name="companyWebsite"
            required
            value={formData.companyWebsite}
            onChange={handleChange}
            placeholder="https://yourcompany.com"
            className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Role */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Your Role <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
            className="w-full pl-10 pr-10 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none cursor-pointer"
          >
            <option value="">Select your role</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Campaign Budget <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            name="budgetRange"
            required
            value={formData.budgetRange}
            onChange={handleChange}
            className="w-full pl-10 pr-10 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none cursor-pointer"
          >
            <option value="">Select budget range</option>
            {BUDGETS.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          How can we help your brand?
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            placeholder="Tell us about your goals..."
            className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-destructive text-sm bg-destructive/10 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Submit Partnership Inquiry
          </>
        )}
      </motion.button>
    </form>
  )
}
