import { redirect } from 'next/navigation'

/**
 * Redirect /dashboard to /advertise
 * The dashboard preview is now part of the main Advertise page.
 */
export default function DashboardPage() {
  redirect('/advertise')
}
