import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

/**
 * @file layout.tsx
 * @description Admin layout with authentication check.
 * Redirects to login page if not authenticated.
 */

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getSession()

  if (!session) {
    redirect('/admin/login')
  }

  return <>{children}</>
}
