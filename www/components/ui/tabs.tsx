'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * @file tabs.tsx
 * @description A controlled tabs component for switching between content panels.
 * Provides a segmented control style interface for navigation.
 */

export interface Tab {
  value: string
  label: string
}

export interface TabsProps {
  tabs: Tab[]
  value: string
  onChange: (value: string) => void
  className?: string
}

/**
 * Tabs Component
 * A segmented control for switching between views or content sections.
 *
 * @param {TabsProps} props - The props for the Tabs component.
 * @param {Tab[]} props.tabs - Array of tab objects with value and label.
 * @param {string} props.value - The currently selected tab value.
 * @param {function} props.onChange - Callback when a tab is selected.
 * @param {string} [props.className] - Additional classes to apply.
 * @returns {JSX.Element} The rendered Tabs component.
 */
export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'hover:bg-background/50 hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
