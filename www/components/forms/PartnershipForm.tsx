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
        className="text-center py-12 px-4"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-500/10 flex items-center justify-center ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/10">
          <Sparkles className="w-10 h-10 text-blue-400" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
          Inquiry Received!
        </h3>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
          Our team will reach out within 24 hours to discuss your campus goals.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
          Your Name <span className="text-blue-500">*</span>
        </label>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="w-full pl-10 pr-4 py-3 bg-white/3 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors duration-200 hover:bg-white/5"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
          Work Email <span className="text-blue-500">*</span>
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@company.com"
            className="w-full pl-10 pr-4 py-3 bg-white/3 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors duration-200 hover:bg-white/5"
          />
        </div>
      </div>

      {/* Company Website */}
      <div className="space-y-2">
        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
          Company Website <span className="text-blue-500">*</span>
        </label>
        <div className="relative group">
          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
          <input
            type="url"
            name="companyWebsite"
            required
            value={formData.companyWebsite}
            onChange={handleChange}
            placeholder="https://yourcompany.com"
            className="w-full pl-10 pr-4 py-3 bg-white/3 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors duration-200 hover:bg-white/5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Role */}
        <div className="space-y-2">
          <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Your Role <span className="text-blue-500">*</span>
          </label>
          <div className="relative group">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
            <select
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 bg-white/3 border border-white/10 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors duration-200 appearance-none cursor-pointer hover:bg-white/5"
            >
              <option value="" className="bg-zinc-900">
                Select role
              </option>
              {ROLES.map((role) => (
                <option key={role} value={role} className="bg-zinc-900">
                  {role}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-focus-within:text-blue-400 transition-colors" />
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Budget <span className="text-blue-500">*</span>
          </label>
          <div className="relative group">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
            <select
              name="budgetRange"
              required
              value={formData.budgetRange}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 bg-white/3 border border-white/10 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors duration-200 appearance-none cursor-pointer hover:bg-white/5"
            >
              <option value="" className="bg-zinc-900">
                Select range
              </option>
              {BUDGETS.map((budget) => (
                <option key={budget} value={budget} className="bg-zinc-900">
                  {budget}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-focus-within:text-blue-400 transition-colors" />
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
          Campaign Goals
        </label>
        <div className="relative group">
          <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            placeholder="Tell us what you'd like to achieve..."
            className="w-full pl-10 pr-4 py-3 bg-white/3 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors duration-200 resize-none hover:bg-white/5"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20 font-medium"
        >
          {error}
        </motion.p>
      )}

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 border border-white/10"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Launch Inquiry
          </>
        )}
      </motion.button>
    </form>
  )
}
