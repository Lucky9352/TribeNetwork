import { cn } from '@/lib/utils'

/**
 * @file skeleton.tsx
 * @description Use to show a placeholder while content is loading.
 */

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-primary/10', className)}
      {...props}
    />
  )
}

export { Skeleton }
