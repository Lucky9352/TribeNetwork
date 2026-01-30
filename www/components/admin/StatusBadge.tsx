'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

/**
 * @file StatusBadge.tsx
 * @description Color-coded status badge and custom dropdown for submissions.
 */

type Status = 'pending' | 'contacted' | 'in_progress' | 'completed' | 'rejected'

interface StatusBadgeProps {
  status: Status | string
  className?: string
}

const statusConfig: Record<
  Status,
  { bg: string; text: string; label: string; dot: string; border: string }
> = {
  pending: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    label: 'Pending',
    dot: 'bg-amber-400',
    border: 'border-amber-500/30',
  },
  contacted: {
    bg: 'bg-blue-500/15',
    text: 'text-blue-300',
    label: 'Contacted',
    dot: 'bg-blue-400',
    border: 'border-blue-500/30',
  },
  in_progress: {
    bg: 'bg-purple-500/15',
    text: 'text-purple-300',
    label: 'In Progress',
    dot: 'bg-purple-400',
    border: 'border-purple-500/30',
  },
  completed: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    label: 'Completed',
    dot: 'bg-emerald-400',
    border: 'border-emerald-500/30',
  },
  rejected: {
    bg: 'bg-red-500/15',
    text: 'text-red-300',
    label: 'Rejected',
    dot: 'bg-red-400',
    border: 'border-red-500/30',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status as Status] || {
    bg: 'bg-slate-500/15',
    text: 'text-slate-300',
    label: status,
    dot: 'bg-slate-400',
    border: 'border-slate-500/30',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}

interface StatusSelectProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const statusOptions: { value: Status; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
]

export function StatusSelect({ value, onChange, disabled }: StatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<{
    top: number
    left: number
  } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const config = statusConfig[value as Status]

  const handleToggle = useCallback(() => {
    if (disabled) return

    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 4,
        left: rect.right - 140,
      })
    }
    setIsOpen(!isOpen)
  }, [isOpen, disabled])

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        const dropdown = document.getElementById('status-dropdown-portal')
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }
    }
    function handleScroll() {
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen])

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'flex items-center gap-1.5 sm:gap-2 px-2 sm:pl-3 sm:pr-2 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold border cursor-pointer transition-all',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#12121a]',
          config?.bg || 'bg-slate-800',
          config?.text || 'text-slate-300',
          config?.border || 'border-slate-600',
          'hover:brightness-110',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            config?.dot || 'bg-slate-400'
          )}
        />
        {config?.label || value}
        <svg
          className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Portal Dropdown Menu - only render when position is calculated */}
      {isOpen &&
        position &&
        typeof window !== 'undefined' &&
        createPortal(
          <div
            id="status-dropdown-portal"
            className="fixed z-50 min-w-[140px] bg-[#1a1a24] border border-white/10 rounded-lg shadow-2xl overflow-hidden"
            style={{ top: position.top, left: position.left }}
          >
            {statusOptions.map((option) => {
              const optConfig = statusConfig[option.value]
              const isSelected = value === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-left transition-colors',
                    isSelected ? 'bg-white/10' : 'hover:bg-white/5',
                    optConfig.text
                  )}
                >
                  <span
                    className={cn('w-1.5 h-1.5 rounded-full', optConfig.dot)}
                  />
                  {option.label}
                  {isSelected && (
                    <svg
                      className="w-3.5 h-3.5 ml-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>,
          document.body
        )}
    </>
  )
}
