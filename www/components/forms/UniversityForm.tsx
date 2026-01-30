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
        className="text-center py-8"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Request Submitted!
        </h3>
        <p className="text-muted-foreground">
          Thanks for your interest! We&apos;ll review your request and get back
          to you soon.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
          <User className="w-4 h-4" />
          Your Name <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      {/* Email */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
          <Mail className="w-4 h-4" />
          Email <span className="text-primary">*</span>
        </label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="you@university.edu"
          className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      {/* School */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
          <School className="w-4 h-4" />
          School / University <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          name="school"
          required
          value={formData.school}
          onChange={handleChange}
          placeholder="XYZ University"
          className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      {/* Class Year */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
          <GraduationCap className="w-4 h-4" />
          Class Year <span className="text-primary">*</span>
        </label>
        <select
          name="classYear"
          required
          value={formData.classYear}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
        >
          <option value="">Select class year</option>
          {CLASS_YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Phone & Instagram - side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Phone className="w-4 h-4" />
            Phone <span className="text-primary">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Instagram className="w-4 h-4" />
            Instagram <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            name="instagram"
            required
            value={formData.instagram}
            onChange={handleChange}
            placeholder="@yourhandle"
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
          <MessageSquare className="w-4 h-4" />
          Why should Tribe come to your campus?
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          placeholder="Tell us about your community..."
          className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-destructive text-sm bg-destructive/10 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Bring Tribe to My Campus
          </>
        )}
      </button>
    </form>
  )
}
