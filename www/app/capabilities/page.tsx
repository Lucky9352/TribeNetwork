import { redirect } from 'next/navigation'

/**
 * Redirect /capabilities to /advertise
 * The capabilities content is now part of the main Advertise page.
 */
export default function CapabilitiesPage() {
  redirect('/advertise')
}
