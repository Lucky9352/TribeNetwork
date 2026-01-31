'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2,
  GraduationCap,
  Mail,
  User,
  School,
  Phone,
  Instagram,
  MessageSquare,
  Sparkles,
  ChevronDown,
} from 'lucide-react'

interface UniversityFormProps {
  onSuccess?: () => void
}

const CLASS_YEARS = [
  'Freshman',
  'Sophomore',
  'Junior',
  'Senior',
  'Graduate Student',
  'Alumni',
  'Other',
]

/**
 * University/community request form for students.
 */
export default function UniversityForm({ onSuccess }: UniversityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    classYear: '',
    phone: '',
    instagram: '',
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
      const res = await fetch('/api/universities', {
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
          <GraduationCap className="w-10 h-10 text-blue-400" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
          Inquiry Received!
        </h3>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
          Our team will review your deployment request and get back to you soon.
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
            placeholder="Your Full Name"
            className="w-full pl-10 pr-4 py-3 bg-white/3 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-white/5"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
          Email <span className="text-blue-500">*</span>
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@university.edu"
            className="w-full pl-10 pr-4 py-3 bg-white/3 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-white/5"
          />
        </div>
      </div>

      {/* School */}
      <div className="space-y-2">
        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
          School / University <span className="text-blue-500">*</span>
        </label>
        <div className="relative group">
          <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            name="school"
            required
            value={formData.school}
            onChange={handleChange}
            placeholder="Your University"
            className="w-full pl-10 pr-4 py-3 bg-white/3 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-white/5"
          />
        </div>
      </div>

      {/* Class Year */}
      <div className="space-y-2">
        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
          Class Year <span className="text-blue-500">*</span>
        </label>
        <div className="relative group">
          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
          <select
            name="classYear"
            required
            value={formData.classYear}
            onChange={handleChange}
            className="w-full pl-10 pr-10 py-3 bg-white/3 border border-white/10 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none cursor-pointer hover:bg-white/5"
          >
            <option value="" className="bg-zinc-900">
              Select class year
            </option>
            {CLASS_YEARS.map((year) => (
              <option key={year} value={year} className="bg-zinc-900">
                {year}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-focus-within:text-blue-400 transition-colors" />
        </div>
      </div>

      {/* Phone & Instagram - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Phone <span className="text-blue-500">*</span>
          </label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-4 py-3 bg-white/3 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-white/5"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Instagram <span className="text-blue-500">*</span>
          </label>
          <div className="relative group">
            <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              name="instagram"
              required
              value={formData.instagram}
              onChange={handleChange}
              placeholder="@yourhandle"
              className="w-full pl-10 pr-4 py-3 bg-white/3 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-white/5"
            />
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
          Community Highlights
        </label>
        <div className="relative group">
          <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            placeholder="Tell us about your campus community..."
            className="w-full pl-10 pr-4 py-3 bg-white/3 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none hover:bg-white/5"
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
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 border border-white/10"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Request Deployment
          </>
        )}
      </motion.button>
    </form>
  )
}
