'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FlarumTag } from '@/lib/flarum-api'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  tags: FlarumTag[]
  selectedTag: string | null
  onTagSelect: (slug: string | null) => void
}

const getColorFromString = (str: string): string => {
  const colors = [
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#f97316',
    '#10b981',
    '#06b6d4',
    '#f59e0b',
    '#ef4444',
    '#6366f1',
    '#14b8a6',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

const isColorBad = (color: string): boolean => {
  if (!color) return true
  const hex = color.replace('#', '')
  if (hex.length !== 6) return true
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const saturation = max === 0 ? 0 : (max - min) / max
  return luminance < 0.25 || luminance > 0.85 || saturation < 0.25
}

const getTagColor = (tag: {
  attributes: { color?: string; name: string }
}): string => {
  const color = tag.attributes.color
  if (!color || isColorBad(color)) {
    return getColorFromString(tag.attributes.name)
  }
  return color
}

export default function MobileNav({
  isOpen,
  onClose,
  tags,
  selectedTag,
  onTagSelect,
}: MobileNavProps) {
  if (!isOpen) return null

  const visibleTags = tags.filter(
    (tag) => (tag.attributes.discussionCount || 0) > 0
  )

  const handleTagClick = (slug: string | null) => {
    onTagSelect(slug)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 bg-zinc-950 z-50 lg:hidden overflow-y-auto animate-slide-in-left border-r border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <Image
              src="/favicon.ico"
              alt="Tribe"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-lg font-semibold text-white">Tribe</span>
          </Link>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <svg
              className="w-5 h-5 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <h2 className="text-sm font-semibold text-white mb-1">Explore</h2>
          <p className="text-xs text-zinc-500 mb-4">
            Find communities with your people
          </p>

          {/* All Discussions */}
          <button
            onClick={() => handleTagClick(null)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-3 ${
              selectedTag === null ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="font-medium text-white text-sm">
                All Discussions
              </div>
              <div className="text-xs text-zinc-500">Everything</div>
            </div>
            <svg
              className="w-4 h-4 text-zinc-600 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Tags */}
          <div className="space-y-1">
            {visibleTags.map((tag) => {
              const tagColor = getTagColor(tag)
              return (
                <button
                  key={tag.id}
                  onClick={() => handleTagClick(tag.attributes.slug)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    selectedTag === tag.attributes.slug
                      ? 'bg-zinc-800'
                      : 'hover:bg-zinc-800/50'
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: tagColor }}
                  >
                    {tag.attributes.icon ? (
                      <i
                        className={`${tag.attributes.icon} text-sm text-white`}
                      ></i>
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        {tag.attributes.name[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-white text-sm truncate">
                      {tag.attributes.name}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {tag.attributes.discussionCount} posts
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-zinc-600 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )
            })}
          </div>

          {/* View All Communities Link */}
          <Link
            href="/communities"
            onClick={onClose}
            className="flex items-center justify-center gap-2 mt-4 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <span>View all communities</span>
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="p-4 border-t border-zinc-800 mt-auto">
          <Link
            href="/discussions/new"
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-medium transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Start Discussion
          </Link>
        </div>
      </div>
    </>
  )
}
