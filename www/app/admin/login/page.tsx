'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'

/**
 * @file page.tsx
 * @description Admin login page with email/password authentication.
 */

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md px-6 z-10"
      >
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-500/10 mb-4 sm:mb-6 ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/10"
          >
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight"
          >
            Admin Access
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-base text-muted-foreground px-4"
          >
            Enter your credentials to manage the network
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative group mx-2 sm:mx-0"
        >
          {/* Subtle gradient border effect */}
          <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent rounded-3xl pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@tribenetwork.in"
                  className="bg-zinc-900/50 border-white/10 focus:border-blue-500/50 focus:ring-blue-500/20 h-12 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="bg-zinc-900/50 border-white/10 focus:border-blue-500/50 focus:ring-blue-500/20 h-12 rounded-xl text-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 border border-white/10 transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-muted-foreground/40 text-[10px] font-medium mt-10 uppercase tracking-widest"
        >
          Protected System • Tribe Network Inc.
        </motion.p>
      </motion.div>
    </div>
  )
}
