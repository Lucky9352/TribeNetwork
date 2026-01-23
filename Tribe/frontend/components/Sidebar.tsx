'use client'

import Link from 'next/link'
import { FlarumTag } from '@/lib/flarum-api'

interface SidebarProps {
  tags: FlarumTag[]
  selectedTag: string | null
  onTagSelect: (slug: string | null) => void
}

export default function Sidebar({
  tags,
  selectedTag,
  onTagSelect,
}: SidebarProps) {
  const visibleTags = tags.filter(
    (tag) => (tag.attributes.discussionCount || 0) > 0
  )

  return (
    <aside className="hidden lg:block w-64 shrink-0 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-4">
        {/* Explore Header */}
        <div className="mb-5 px-3">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Explore
          </h2>
        </div>

        {/* All Discussions */}
        <button
          onClick={() => onTagSelect(null)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-1 group ${
            selectedTag === null
              ? 'bg-blue-500/10 text-blue-400'
              : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              selectedTag === null
                ? 'bg-blue-500'
                : 'bg-zinc-800 group-hover:bg-zinc-700'
            }`}
          >
            <svg
              className={`w-4 h-4 ${
                selectedTag === null
                  ? 'text-white'
                  : 'text-zinc-400 group-hover:text-zinc-200'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <div className="flex-1 text-left min-w-0 font-medium text-sm">
            All Discussions
          </div>
        </button>

        {/* Tags List */}
        <div className="space-y-1">
          {visibleTags.map((tag) => {
            const isSelected = selectedTag === tag.attributes.slug
            const count = tag.attributes.discussionCount || 0

            return (
              <button
                key={tag.id}
                onClick={() => onTagSelect(tag.attributes.slug)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
                  isSelected ? 'bg-blue-500/10' : 'hover:bg-zinc-900/60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-200'
                  }`}
                >
                  {tag.attributes.icon ? (
                    <i className={`${tag.attributes.icon} text-lg`}></i>
                  ) : (
                    <span className="font-bold text-base">
                      {tag.attributes.name[0].toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 text-left min-w-0 flex flex-col">
                  <span
                    className={`font-semibold text-sm truncate ${isSelected ? 'text-blue-400' : 'text-zinc-200 group-hover:text-white'}`}
                  >
                    {tag.attributes.name}
                  </span>
                  <span className="text-xs text-zinc-500 truncate">
                    {count} {count === 1 ? 'discussion' : 'discussions'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Empty state if no tags */}
        {visibleTags.length === 0 && (
          <div className="text-center py-8 text-zinc-500 text-sm">
            No active communities yet
          </div>
        )}

        {/* View All Communities Link */}
        <Link
          href="/communities"
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
    </aside>
  )
}
