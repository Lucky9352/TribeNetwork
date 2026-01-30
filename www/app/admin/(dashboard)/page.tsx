'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { StatusSelect } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import Grain from '@/components/ui/Grain'
import {
  Users,
  Building2,
  Mail,
  Star,
  LogOut,
  Loader2,
  Search,
  ExternalLink,
} from 'lucide-react'

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
          fetch('/api/featured-universities?showAll=true'),
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
      icon: <Users className="w-4 h-4" />,
    },
    {
      value: 'universities',
      label: 'Universities',
      count: stats.universities.total,
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      value: 'newsletter',
      label: 'Newsletter',
      count: stats.newsletter.total,
      icon: <Mail className="w-4 h-4" />,
    },
    {
      value: 'featured',
      label: 'Featured',
      count: stats.featured.total,
      icon: <Star className="w-4 h-4" />,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-foreground relative selection:bg-blue-500/30">
      <Grain />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/10">
              <span className="font-bold text-blue-400">TN</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                Overview
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="relative max-w-[1600px] mx-auto px-6 py-8 z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card/30 border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all hover:bg-blue-500/5 group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Partnerships
            </h3>
            <p className="text-muted-foreground text-sm">
              <span className="text-foreground font-medium">
                {stats.partnerships.total}
              </span>{' '}
              Total Inquiries
              {stats.partnerships.pending > 0 && (
                <span className="block mt-1 text-emerald-400">
                  {stats.partnerships.pending} pending review
                </span>
              )}
            </p>
          </div>

          <div className="bg-card/30 border border-white/5 p-6 rounded-2xl hover:border-indigo-500/30 transition-all hover:bg-indigo-500/5 group">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Universities
            </h3>
            <p className="text-muted-foreground text-sm">
              <span className="text-foreground font-medium">
                {stats.universities.total}
              </span>{' '}
              Campus Requests
              {stats.universities.pending > 0 && (
                <span className="block mt-1 text-emerald-400">
                  {stats.universities.pending} pending review
                </span>
              )}
            </p>
          </div>

          <div className="bg-card/30 border border-white/5 p-6 rounded-2xl hover:border-emerald-500/30 transition-all hover:bg-emerald-500/5 group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Newsletter
            </h3>
            <p className="text-muted-foreground text-sm">
              <span className="text-foreground font-medium">
                {stats.newsletter.total}
              </span>{' '}
              Active Subscribers
              <span className="block mt-1 text-muted-foreground/60">
                Weekly updates enabled
              </span>
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          {/* Tabs */}
          <div className="border-b border-white/5 px-6 py-4 bg-white/5">
            <div className="flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all border ${
                    activeTab === tab.value
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'border-transparent text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                      activeTab === tab.value
                        ? 'bg-white/50 text-white'
                        : 'bg-white/10 text-muted-foreground'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Table Content */}
          <div className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-muted-foreground text-sm">Loading data...</p>
              </div>
            ) : (
              <>
                {/* Partnerships Table */}
                {activeTab === 'partnerships' && (
                  <div className="overflow-x-auto">
                    {partnerships.length === 0 ? (
                      <div className="text-center py-32">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                          <Search className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-white font-medium">
                          No inquiries found
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">
                          New partnership requests will appear here
                        </p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/5">
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4 text-center">Company</th>
                            <th className="px-6 py-4 text-center">Budget</th>
                            <th className="px-6 py-4 text-center">Message</th>
                            <th className="px-6 py-4 text-center">Date</th>
                            <th className="px-6 py-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {partnerships.map((p) => (
                            <tr
                              key={p.id}
                              className="hover:bg-white/5 transition-colors group"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">
                                    {p.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-medium text-white text-sm">
                                      {p.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {p.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                {p.companyWebsite ? (
                                  <a
                                    href={
                                      p.companyWebsite.startsWith('http')
                                        ? p.companyWebsite
                                        : `https://${p.companyWebsite}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 hover:underline text-sm inline-flex items-center gap-1.5"
                                  >
                                    {p.companyWebsite.replace(
                                      /^https?:\/\//,
                                      ''
                                    )}
                                    <ExternalLink className="w-3 h-3 opacity-50" />
                                  </a>
                                ) : (
                                  <span className="text-muted-foreground text-sm">
                                    —
                                  </span>
                                )}
                                {p.role && (
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {p.role}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-center">
                                {p.budgetRange ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 border border-white/5 text-white">
                                    {p.budgetRange}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground text-sm">
                                    —
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 max-w-xs text-center">
                                {p.message ? (
                                  <p
                                    className="text-sm text-zinc-400 truncate group-hover:text-zinc-300 transition-colors mx-auto"
                                    title={p.message}
                                  >
                                    {p.message}
                                  </p>
                                ) : (
                                  <span className="text-muted-foreground text-sm italic">
                                    No message
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="text-muted-foreground text-sm">
                                  {formatDate(p.createdAt)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex justify-center">
                                  <StatusSelect
                                    value={p.status}
                                    onChange={(status) =>
                                      updateStatus('partnerships', p.id, status)
                                    }
                                    disabled={updating === p.id}
                                  />
                                </div>
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
                      <div className="text-center py-32">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                          <Search className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-white font-medium">
                          No requests found
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">
                          New university requests will appear here
                        </p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/5">
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4 text-center">School</th>
                            <th className="px-6 py-4 text-center">Contact</th>
                            <th className="px-6 py-4 text-center">Message</th>
                            <th className="px-6 py-4 text-center">Date</th>
                            <th className="px-6 py-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {universities.map((u) => (
                            <tr
                              key={u.id}
                              className="hover:bg-white/5 transition-colors group"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">
                                    {u.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-medium text-white text-sm">
                                      {u.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {u.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="text-white text-sm font-medium">
                                  {u.school}
                                </div>
                                {u.classYear && (
                                  <div className="text-xs text-muted-foreground">
                                    Class of {u.classYear}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex flex-col gap-1 items-center">
                                  {u.phone && (
                                    <span className="text-sm text-zinc-300">
                                      {u.phone}
                                    </span>
                                  )}
                                  {u.instagram && (
                                    <a
                                      href={`https://instagram.com/${u.instagram.replace('@', '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1 hover:underline"
                                    >
                                      {u.instagram}
                                    </a>
                                  )}
                                  {!u.phone && !u.instagram && (
                                    <span className="text-muted-foreground text-sm">
                                      —
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 max-w-xs text-center">
                                {u.message ? (
                                  <p
                                    className="text-sm text-zinc-400 truncate group-hover:text-zinc-300 transition-colors mx-auto"
                                    title={u.message}
                                  >
                                    {u.message}
                                  </p>
                                ) : (
                                  <span className="text-muted-foreground text-sm italic">
                                    No message
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="text-muted-foreground text-sm">
                                  {formatDate(u.createdAt)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex justify-center">
                                  <StatusSelect
                                    value={u.status}
                                    onChange={(status) =>
                                      updateStatus('universities', u.id, status)
                                    }
                                    disabled={updating === u.id}
                                  />
                                </div>
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
                      <div className="text-center py-32">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                          <Mail className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-white font-medium">
                          No subscribers yet
                        </p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/5">
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4 text-center">Source</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">
                              Date Subscribed
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {newsletter.map((n) => (
                            <tr
                              key={n.id}
                              className="hover:bg-white/5 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">
                                    {n.email.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-medium text-white text-sm">
                                    {n.email}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 border border-white/5 text-muted-foreground capitalize">
                                  {n.source}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                    n.isSubscribed
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${n.isSubscribed ? 'bg-emerald-400' : 'bg-red-400'}`}
                                  />
                                  {n.isSubscribed ? 'Active' : 'Unsubscribed'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-muted-foreground text-sm text-center">
                                {formatDate(n.createdAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* Featured Universities Tab */}
                {activeTab === 'featured' && (
                  <div>
                    {/* Add New University Toolbar */}
                    <div className="p-6 border-b border-white/5">
                      <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
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
                        className="flex gap-4"
                      >
                        <div className="flex-1">
                          <input
                            type="text"
                            value={newUniversityName}
                            onChange={(e) =>
                              setNewUniversityName(e.target.value)
                            }
                            placeholder="University name (e.g. Stanford University)"
                            className="flex h-10 w-full rounded-md border border-white/5 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-transparent transition-all"
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={
                            !newUniversityName.trim() || addingUniversity
                          }
                          className="bg-blue-600 hover:bg-blue-500 text-white font-medium"
                        >
                          {addingUniversity ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Star className="w-4 h-4 mr-2" />
                              Add
                            </>
                          )}
                        </Button>
                      </form>
                    </div>

                    {/* Universities List */}
                    <div>
                      {featuredUniversities.length === 0 ? (
                        <div className="text-center py-16">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                            <Star className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <p className="text-white font-medium mb-1">
                            No featured universities
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Add universities above to display them in the
                            marquee
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/5">
                                <th className="px-6 py-4">University</th>
                                <th className="px-6 py-4 text-center">
                                  Status
                                </th>
                                <th className="px-6 py-4 text-center">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {featuredUniversities.map((uni) => (
                                <tr
                                  key={uni.id}
                                  className="hover:bg-white/5 transition-colors group"
                                >
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                      <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                          uni.isActive
                                            ? 'bg-blue-500/10 text-blue-400'
                                            : 'bg-white/5 text-muted-foreground border border-white/5'
                                        }`}
                                      >
                                        {uni.name.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <p
                                          className={`font-medium text-sm ${
                                            uni.isActive
                                              ? 'text-white'
                                              : 'text-muted-foreground'
                                          }`}
                                        >
                                          {uni.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground/60 font-mono mt-0.5">
                                          Order: {uni.order}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <button
                                      onClick={async () => {
                                        setUpdating(uni.id)
                                        try {
                                          const res = await fetch(
                                            '/api/featured-universities',
                                            {
                                              method: 'PATCH',
                                              headers: {
                                                'Content-Type':
                                                  'application/json',
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
                                                  ? {
                                                      ...u,
                                                      isActive: !u.isActive,
                                                    }
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
                                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                        uni.isActive
                                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                          : 'bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10'
                                      } disabled:opacity-50 min-w-[80px] flex justify-center mx-auto`}
                                    >
                                      {updating === uni.id ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : uni.isActive ? (
                                        'Active'
                                      ) : (
                                        'Inactive'
                                      )}
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center">
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
                                                prev.filter(
                                                  (u) => u.id !== uni.id
                                                )
                                              )
                                            }
                                          } catch {
                                          } finally {
                                            setUpdating(null)
                                          }
                                        }}
                                        className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all"
                                        title="Remove"
                                      >
                                        <LogOut className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
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
