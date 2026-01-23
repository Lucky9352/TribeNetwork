import { NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/auth'

/**
 * POST /api/admin/logout
 * Clear the admin session cookie.
 */
export async function POST() {
  try {
    await clearSessionCookie()

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch {
    return NextResponse.json(
      { error: 'Logout failed. Please try again.' },
      { status: 500 }
    )
  }
}
