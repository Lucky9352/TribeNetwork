'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import { useAuthStore } from '@/store/auth-store'

export default function SettingsPage() {
  const router = useRouter()
  const {
    isAuthenticated,
    isLoading: authLoading,
    checkAuth,
    user,
    logout,
  } = useAuthStore()

  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setDisplayName(user.attributes.displayName || '')
      setBio(user.attributes.bio || '')
    }
  }, [user])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setSaving(true)
      setMessage(null)

      // TODO: Implement profile update API
      // await flarumAPI.updateUser(user.id, { displayName, bio });

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to update profile',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-tribe-bg-base flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-tribe-primary border-t-transparent mb-4"></div>
          <p className="text-tribe-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-tribe-bg-base">
      <Header showMenuButton={false} />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-tribe-text-secondary hover:text-tribe-text-primary mb-6 text-sm transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Feed
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-tribe-text-primary mb-6">
          Settings
        </h1>

        {/* Profile Section */}
        <section className="bg-tribe-bg-elevated border border-white/5 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-tribe-text-primary mb-4">
            Profile
          </h2>

          {message && (
            <div
              className={`mb-4 p-4 rounded-xl ${
                message.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Avatar Preview */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-tribe-primary flex items-center justify-center">
                {user?.attributes.avatarUrl ? (
                  <Image
                    src={user.attributes.avatarUrl}
                    alt={
                      user.attributes.displayName || user.attributes.username
                    }
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <span className="text-white font-bold text-2xl">
                    {(user?.attributes.displayName ||
                      user?.attributes.username ||
                      'U')[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-tribe-text-primary">
                  {user?.attributes.username}
                </p>
                <button
                  type="button"
                  className="text-sm text-tribe-primary hover:text-tribe-primary-hover"
                >
                  Change avatar
                </button>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-tribe-text-secondary mb-2"
              >
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-tribe-bg-card border border-white/10 rounded-xl text-tribe-text-primary focus:outline-none focus:border-tribe-primary/50 transition-colors"
                placeholder="How others see you"
              />
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-tribe-text-secondary mb-2"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-tribe-bg-card border border-white/10 rounded-xl text-tribe-text-primary focus:outline-none focus:border-tribe-primary/50 transition-colors resize-none"
                placeholder="Tell others about yourself"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-tribe-primary hover:bg-tribe-primary-hover rounded-xl text-white font-medium transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </section>

        {/* Account Section */}
        <section className="bg-tribe-bg-elevated border border-white/5 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-tribe-text-primary mb-4">
            Account
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="font-medium text-tribe-text-primary">Email</p>
                <p className="text-sm text-tribe-text-muted">
                  {user?.attributes.email || 'Not set'}
                </p>
              </div>
              <button className="text-sm text-tribe-primary hover:text-tribe-primary-hover">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="font-medium text-tribe-text-primary">Password</p>
                <p className="text-sm text-tribe-text-muted">••••••••</p>
              </div>
              <button className="text-sm text-tribe-primary hover:text-tribe-primary-hover">
                Change
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-tribe-bg-elevated border border-red-500/20 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-red-400 mb-4">
            Danger Zone
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-tribe-text-primary">Sign out</p>
              <p className="text-sm text-tribe-text-muted">
                You&apos;ll need to sign in again
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
