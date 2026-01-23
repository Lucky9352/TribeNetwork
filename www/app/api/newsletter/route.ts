import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

/**
 * GET /api/newsletter
 * Fetch all newsletter subscribers (protected - admin only).
 */
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: subscribers })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch newsletter subscribers.' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/newsletter
 * Handle newsletter email subscription.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, source = 'footer' } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.isSubscribed) {
        return NextResponse.json({
          success: true,
          message: 'You are already subscribed!',
          alreadySubscribed: true,
        })
      } else {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isSubscribed: true },
        })
        return NextResponse.json({
          success: true,
          message: 'Welcome back! You have been re-subscribed.',
        })
      }
    }

    await prisma.newsletterSubscriber.create({
      data: { email, source },
    })

    return NextResponse.json({
      success: true,
      message: 'Thanks for subscribing!',
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}
