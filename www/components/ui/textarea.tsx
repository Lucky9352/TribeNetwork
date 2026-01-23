import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * @file textarea.tsx
 * @description Reusable Textarea component with consistent styling.
 * Built with forwardRef for proper ref forwarding in forms.
 */

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

/**
 * Textarea Component
 * A styled multi-line text input with focus states and accessibility support.
 *
 * @param {TextareaProps} props - Standard HTML textarea attributes.
 * @param {string} [props.className] - Additional classes to apply.
 * @param {React.Ref<HTMLTextAreaElement>} ref - Forwarded ref for the textarea element.
 * @returns {JSX.Element} The rendered Textarea component.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
