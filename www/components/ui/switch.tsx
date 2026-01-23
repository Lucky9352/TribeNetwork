'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * @file switch.tsx
 * @description A toggle switch component for boolean state controls.
 * Built with accessibility in mind using proper ARIA attributes.
 */

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

/**
 * Switch Component
 * A toggle switch for binary on/off states.
 *
 * @param {SwitchProps} props - The props for the Switch component.
 * @param {boolean} [props.checked] - Whether the switch is on or off.
 * @param {function} [props.onCheckedChange] - Callback when the switch state changes.
 * @param {string} [props.className] - Additional classes to apply.
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded ref for the button element.
 * @returns {JSX.Element} The rendered Switch component.
 */
const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, onCheckedChange, className, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onCheckedChange?.(!checked)
      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleClick}
        className={cn(
          'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-primary' : 'bg-input',
          className
        )}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }
