import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * @file select.tsx
 * @description Reusable Select component with consistent styling.
 * Built with forwardRef for proper ref forwarding in forms.
 */

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

/**
 * Select Component
 * A styled select dropdown with focus states and accessibility support.
 *
 * @param {SelectProps} props - Standard HTML select attributes.
 * @param {string} [props.className] - Additional classes to apply.
 * @param {React.ReactNode} props.children - Option elements to render.
 * @param {React.Ref<HTMLSelectElement>} ref - Forwarded ref for the select element.
 * @returns {JSX.Element} The rendered Select component.
 */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = 'Select'

export { Select }
