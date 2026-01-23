'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { StatusSelect } from '@/components/admin/StatusBadge'

/**
 * @file page.tsx
 * @description Admin dashboard with tabs for managing submissions.
 */

interface Partnership {
  id: string
  name: string
  email: string
  companyWebsite: string | null
  role: string | null
  budgetRange: string | null
  message: string | null
  status: string
  createdAt: string
}

interface University {
  id: string
  name: string
  email: string
  school: string
  classYear: string | null
  phone: string | null
  instagram: string | null
  message: string | null
  status: string
  createdAt: string
}

interface Newsletter {
  id: string
  email: string
  isSubscribed: boolean
  source: string
  createdAt: string
}

interface FeaturedUniversity {
  id: string
  name: string
  isActive: boolean
  order: number
  createdAt: string
}

type Tab = 'partnerships' | 'universities' | 'newsletter' | 'featured'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('partnerships')
  const [partnerships, setPartnerships] = useState<Partnership[]>([])
  const [universities, setUniversities] = useState<University[]>([])
  const [newsletter, setNewsletter] = useState<Newsletter[]>([])
  const [featuredUniversities, setFeaturedUniversities] = useState<
    FeaturedUniversity[]
  >([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [newUniversityName, setNewUniversityName] = useState('')
  const [addingUniversity, setAddingUniversity] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [partnershipsRes, universitiesRes, newsletterRes, featuredRes] =
        await Promise.all([
          fetch('/api/partnerships'),
          fetch('/api/universities'),
          fetch('/api/newsletter'),
          fetch('/api/featured-universities'),
        ])

      if (!partnershipsRes.ok || !universitiesRes.ok || !newsletterRes.ok) {
        if (partnershipsRes.status === 401) {
          router.push('/admin/login')
          return
        }
      }

      const [partnershipsData, universitiesData, newsletterData, featuredData] =
        await Promise.all([
          partnershipsRes.json(),
          universitiesRes.json(),
          newsletterRes.json(),
          featuredRes.ok ? featuredRes.json() : { data: [] },
        ])

      setPartnerships(partnershipsData.data || [])
      setUniversities(universitiesData.data || [])
      setNewsletter(newsletterData.data || [])
      setFeaturedUniversities(featuredData.data || [])
    } catch {
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function updateStatus(
    type: 'partnerships' | 'universities',
    id: string,
    status: string
  ) {
    setUpdating(id)
    try {
      const res = await fetch(`/api/${type}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })

      if (res.ok) {
        if (type === 'partnerships') {
          setPartnerships((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status } : p))
          )
        } else {
          setUniversities((prev) =>
            prev.map((u) => (u.id === id ? { ...u, status } : u))
          )
        }
      }
    } catch {
    } finally {
      setUpdating(null)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const stats = {
    partnerships: {
      total: partnerships.length,
      pending: partnerships.filter((p) => p.status === 'pending').length,
    },
    universities: {
      total: universities.length,
      pending: universities.filter((u) => u.status === 'pending').length,
    },
    newsletter: {
      total: newsletter.length,
      subscribed: newsletter.filter((n) => n.isSubscribed).length,
    },
    featured: {
      total: featuredUniversities.length,
      active: featuredUniversities.filter((f) => f.isActive).length,
    },
  }

  const tabs: {
    value: Tab
    label: string
    count: number
    icon: React.ReactNode
  }[] = [
    {
      value: 'partnerships',
      label: 'Partnerships',
      count: stats.partnerships.total,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      value: 'universities',
      label: 'Universities',
      count: stats.universities.total,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      value: 'newsletter',
      label: 'Newsletter',
      count: stats.newsletter.total,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      value: 'featured' as Tab,
      label: 'Featured',
      count: stats.featured.total,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-emerald-950/10 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">
                Admin Dashboard
              </h1>
              <p className="text-xs text-slate-500">
                Manage submissions & inquiries
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="relative max-w-[1600px] mx-auto px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="group relative bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
            <div className="absolute inset-0 bg-amber-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-amber-200/60 mb-1">
                  Partnership Inquiries
                </p>
                <p className="text-3xl font-bold text-white mb-2">
                  {stats.partnerships.total}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
                    {stats.partnerships.pending} pending
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="group relative bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
            <div className="absolute inset-0 bg-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-purple-200/60 mb-1">
                  University Requests
                </p>
                <p className="text-3xl font-bold text-white mb-2">
                  {stats.universities.total}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                    {stats.universities.pending} pending
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="group relative bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
            <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-200/60 mb-1">
                  Newsletter Subscribers
                </p>
                <p className="text-3xl font-bold text-white mb-2">
                  {stats.newsletter.total}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                    {stats.newsletter.subscribed} active
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-white/5 px-6 py-4">
            <div className="flex items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    activeTab === tab.value
                      ? 'bg-white/10 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.value
                        ? 'bg-white/10 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Table Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20" />
                  <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" />
                </div>
                <p className="text-slate-500 text-sm">Loading data...</p>
              </div>
            ) : (
              <>
                {/* Partnerships Table */}
                {activeTab === 'partnerships' && (
                  <div className="overflow-x-auto">
                    {partnerships.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="w-8 h-8 text-slate-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-slate-400 font-medium">
                          No partnership inquiries yet
                        </p>
                        <p className="text-slate-600 text-sm mt-1">
                          New inquiries will appear here
                        </p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-white/5">
                            <th className="px-4 py-4">Contact</th>
                            <th className="px-4 py-4">Company</th>
                            <th className="px-4 py-4">Budget</th>
                            <th className="px-4 py-4">Message</th>
                            <th className="px-4 py-4">Date</th>
                            <th className="px-4 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {partnerships.map((p) => (
                            <tr
                              key={p.id}
                              className="hover:bg-white/2 transition-colors"
                            >
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 text-sm font-medium">
                                    {p.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-medium text-white">
                                      {p.name}
                                    </div>
                                    <div className="text-sm text-white/70">
                                      {p.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div>
                                  {p.companyWebsite ? (
                                    <a
                                      href={
                                        p.companyWebsite.startsWith('http')
                                          ? p.companyWebsite
                                          : `https://${p.companyWebsite}`
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="admin-link-emerald hover:underline text-sm"
                                    >
                                      {p.companyWebsite.replace(
                                        /^https?:\/\//,
                                        ''
                                      )}
                                    </a>
                                  ) : (
                                    <span className="text-slate-600 text-sm">
                                      Not provided
                                    </span>
                                  )}
                                  {p.role && (
                                    <div className="text-xs text-slate-500 mt-0.5">
                                      {p.role}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                {p.budgetRange ? (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300">
                                    {p.budgetRange}
                                  </span>
                                ) : (
                                  <span className="text-slate-600 text-sm">
                                    —
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-4 max-w-xs">
                                {p.message ? (
                                  <p
                                    className="text-sm text-slate-400 truncate"
                                    title={p.message}
                                  >
                                    {p.message}
                                  </p>
                                ) : (
                                  <span className="text-slate-600 text-sm">
                                    No message
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-4 text-slate-500 text-sm whitespace-nowrap">
                                {formatDate(p.createdAt)}
                              </td>
                              <td className="px-4 py-4">
                                <StatusSelect
                                  value={p.status}
                                  onChange={(status) =>
                                    updateStatus('partnerships', p.id, status)
                                  }
                                  disabled={updating === p.id}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* Universities Table */}
                {activeTab === 'universities' && (
                  <div className="overflow-x-auto">
                    {universities.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="w-8 h-8 text-slate-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <p className="text-slate-400 font-medium">
                          No university requests yet
                        </p>
                        <p className="text-slate-600 text-sm mt-1">
                          New requests will appear here
                        </p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-white/5">
                            <th className="px-4 py-4">Student</th>
                            <th className="px-4 py-4">School</th>
                            <th className="px-4 py-4">Contact</th>
                            <th className="px-4 py-4">Message</th>
                            <th className="px-4 py-4">Date</th>
                            <th className="px-4 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {universities.map((u) => (
                            <tr
                              key={u.id}
                              className="hover:bg-white/2 transition-colors"
                            >
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-purple-500/15 flex items-center justify-center text-purple-400 text-sm font-medium">
                                    {u.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-medium text-white">
                                      {u.name}
                                    </div>
                                    <div className="text-sm text-white/70">
                                      {u.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="text-white text-sm">
                                  {u.school}
                                </div>
                                {u.classYear && (
                                  <div className="text-xs text-slate-500">
                                    Class of {u.classYear}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex flex-col gap-1">
                                  {u.phone && (
                                    <span className="text-sm text-slate-400">
                                      {u.phone}
                                    </span>
                                  )}
                                  {u.instagram && (
                                    <a
                                      href={`https://instagram.com/${u.instagram.replace('@', '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="admin-link-white text-sm hover:underline"
                                    >
                                      {u.instagram}
                                    </a>
                                  )}
                                  {!u.phone && !u.instagram && (
                                    <span className="text-slate-600 text-sm">
                                      —
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-4 max-w-xs">
                                {u.message ? (
                                  <p
                                    className="text-sm text-slate-400 truncate"
                                    title={u.message}
                                  >
                                    {u.message}
                                  </p>
                                ) : (
                                  <span className="text-slate-600 text-sm">
                                    No message
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-4 text-slate-500 text-sm whitespace-nowrap">
                                {formatDate(u.createdAt)}
                              </td>
                              <td className="px-4 py-4">
                                <StatusSelect
                                  value={u.status}
                                  onChange={(status) =>
                                    updateStatus('universities', u.id, status)
                                  }
                                  disabled={updating === u.id}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* Newsletter Table */}
                {activeTab === 'newsletter' && (
                  <div className="overflow-x-auto">
                    {newsletter.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="w-8 h-8 text-slate-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-slate-400 font-medium">
                          No newsletter subscribers yet
                        </p>
                        <p className="text-slate-600 text-sm mt-1">
                          New subscribers will appear here
                        </p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-white/5">
                            <th className="px-4 py-4">Email</th>
                            <th className="px-4 py-4">Source</th>
                            <th className="px-4 py-4">Subscribed</th>
                            <th className="px-4 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {newsletter.map((n) => (
                            <tr
                              key={n.id}
                              className="hover:bg-white/2 transition-colors"
                            >
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 text-sm font-medium">
                                    {n.email.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-medium text-white">
                                    {n.email}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 capitalize">
                                  {n.source}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-slate-500 text-sm">
                                {formatDate(n.createdAt)}
                              </td>
                              <td className="px-4 py-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                                    n.isSubscribed
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${n.isSubscribed ? 'bg-emerald-400' : 'bg-red-400'}`}
                                  />
                                  {n.isSubscribed ? 'Active' : 'Unsubscribed'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Featured Universities Tab */}
            {activeTab === 'featured' && (
              <>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-slate-500">
                      Loading featured universities...
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
                    {/* Add New University Form */}
                    <div className="p-6 border-b border-white/5">
                      <h3 className="text-sm font-medium text-slate-400 mb-4">
                        Add New University
                      </h3>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault()
                          if (!newUniversityName.trim() || addingUniversity)
                            return
                          setAddingUniversity(true)
                          try {
                            const res = await fetch(
                              '/api/featured-universities',
                              {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  name: newUniversityName.trim(),
                                }),
                              }
                            )
                            if (res.ok) {
                              const data = await res.json()
                              setFeaturedUniversities((prev) => [
                                ...prev,
                                data.data,
                              ])
                              setNewUniversityName('')
                            }
                          } catch {
                          } finally {
                            setAddingUniversity(false)
                          }
                        }}
                        className="flex gap-3"
                      >
                        <input
                          type="text"
                          value={newUniversityName}
                          onChange={(e) => setNewUniversityName(e.target.value)}
                          placeholder="University name (e.g. Stanford University)"
                          className="flex-1 px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                        />
                        <button
                          type="submit"
                          disabled={
                            !newUniversityName.trim() || addingUniversity
                          }
                          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                          {addingUniversity ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          )}
                          Add
                        </button>
                      </form>
                    </div>

                    {/* Universities List */}
                    {featuredUniversities.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        </div>
                        <p className="text-slate-400 font-medium mb-1">
                          No featured universities
                        </p>
                        <p className="text-slate-500 text-sm">
                          Add universities above to display them in the marquee
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {featuredUniversities.map((uni) => (
                          <div
                            key={uni.id}
                            className="flex items-center justify-between px-6 py-4 hover:bg-white/2 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-10 h-10 rounded-full ${uni.isActive ? 'bg-purple-500/15' : 'bg-slate-500/15'} flex items-center justify-center`}
                              >
                                <span
                                  className={`text-sm font-bold ${uni.isActive ? 'text-purple-400' : 'text-slate-500'}`}
                                >
                                  {uni.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p
                                  className={`font-medium ${uni.isActive ? 'text-white' : 'text-slate-500'}`}
                                >
                                  {uni.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Order: {uni.order}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {/* Toggle Active Button */}
                              <button
                                onClick={async () => {
                                  setUpdating(uni.id)
                                  try {
                                    const res = await fetch(
                                      '/api/featured-universities',
                                      {
                                        method: 'PATCH',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                          id: uni.id,
                                          isActive: !uni.isActive,
                                        }),
                                      }
                                    )
                                    if (res.ok) {
                                      setFeaturedUniversities((prev) =>
                                        prev.map((u) =>
                                          u.id === uni.id
                                            ? { ...u, isActive: !u.isActive }
                                            : u
                                        )
                                      )
                                    }
                                  } catch {
                                  } finally {
                                    setUpdating(null)
                                  }
                                }}
                                disabled={updating === uni.id}
                                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                                  uni.isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                                    : 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 border border-slate-500/20'
                                } disabled:opacity-50`}
                              >
                                {updating === uni.id ? (
                                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : uni.isActive ? (
                                  'Active'
                                ) : (
                                  'Inactive'
                                )}
                              </button>
                              {/* Delete Button */}
                              <button
                                onClick={async () => {
                                  if (
                                    !confirm(
                                      `Delete "${uni.name}" from featured universities?`
                                    )
                                  )
                                    return
                                  setUpdating(uni.id)
                                  try {
                                    const res = await fetch(
                                      `/api/featured-universities?id=${uni.id}`,
                                      {
                                        method: 'DELETE',
                                      }
                                    )
                                    if (res.ok) {
                                      setFeaturedUniversities((prev) =>
                                        prev.filter((u) => u.id !== uni.id)
                                      )
                                    }
                                  } catch {
                                  } finally {
                                    setUpdating(null)
                                  }
                                }}
                                disabled={updating === uni.id}
                                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                                title="Delete"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
