import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * @file input.tsx
 * @description Reusable Input component with consistent styling.
 * Built with forwardRef for proper ref forwarding in forms.
 */

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

/**
 * Input Component
 * A styled input field with focus states and accessibility support.
 *
 * @param {InputProps} props - Standard HTML input attributes.
 * @param {string} [props.className] - Additional classes to apply.
 * @param {React.Ref<HTMLInputElement>} ref - Forwarded ref for the input element.
 * @returns {JSX.Element} The rendered Input component.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
