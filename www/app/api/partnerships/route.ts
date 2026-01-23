import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

/**
 * GET /api/partnerships
 * Fetch all partnership inquiries (protected - admin only).
 */
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const partnerships = await prisma.partnershipInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: partnerships })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch partnerships.' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/partnerships
 * Handle partnership inquiry form submissions.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { name, email } = body
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
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

    const inquiry = await prisma.partnershipInquiry.create({
      data: {
        name: body.name,
        email: body.email,
        companyWebsite: body.companyWebsite || null,
        role: body.role || null,
        budgetRange: body.budgetRange || null,
        message: body.message || null,
      },
    })

    return NextResponse.json({
      success: true,
      id: inquiry.id,
      message: 'Thank you for your interest! We will be in touch soon.',
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/partnerships
 * Update partnership inquiry status (protected - admin only).
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

    const updated = await prisma.partnershipInquiry.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update partnership.' },
      { status: 500 }
    )
  }
}
