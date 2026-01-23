/**
 * @file route.ts
 * @description API endpoint to fetch aggregated events and opportunities.
 */

import { NextResponse } from 'next/server'
import { getAggregatedEvents } from '@/lib/events-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const events = await getAggregatedEvents()
    return NextResponse.json({ events })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
