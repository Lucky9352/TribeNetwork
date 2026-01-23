import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

/**
 * GET /api/universities
 * Fetch all university requests (protected - admin only).
 */
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const universities = await prisma.universityRequest.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: universities })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch university requests.' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/universities
 * Handle university/community request form submissions.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { name, email, school } = body
    if (!name || !email || !school) {
      return NextResponse.json(
        { error: 'Name, email, and school are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const request = await prisma.universityRequest.create({
      data: {
        name: body.name,
        email: body.email,
        school: body.school,
        classYear: body.classYear || null,
        phone: body.phone || null,
        instagram: body.instagram || null,
        message: body.message || null,
      },
    })

    return NextResponse.json({
      success: true,
      id: request.id,
      message: 'Your request has been submitted! We will review it soon.',
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit request. Please try again.' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/universities
 * Update university request status (protected - admin only).
 */
export async function PATCH(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      )
    }

    const validStatuses = [
      'pending',
      'contacted',
      'in_progress',
      'completed',
      'rejected',
    ]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updated = await prisma.universityRequest.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update university request.' },
      { status: 500 }
    )
  }
}
