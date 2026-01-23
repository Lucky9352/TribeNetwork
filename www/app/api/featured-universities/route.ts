'use server'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

/**
 * @file route.ts
 * @description API endpoints for featured universities management.
 * GET is public (for marquee), POST/PATCH/DELETE require admin auth.
 */

export async function GET() {
  try {
    const universities = await prisma.featuredUniversity.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        order: true,
      },
    })

    return NextResponse.json({ data: universities })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'University name is required' },
        { status: 400 }
      )
    }

    const maxOrder = await prisma.featuredUniversity.aggregate({
      _max: { order: true },
    })

    const university = await prisma.featuredUniversity.create({
      data: {
        name: name.trim(),
        order: (maxOrder._max.order ?? -1) + 1,
      },
    })

    return NextResponse.json({ data: university }, { status: 201 })
  } catch (error) {
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json(
        { error: 'University already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create university' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, name, isActive, order } = body

    if (!id) {
      return NextResponse.json(
        { error: 'University ID is required' },
        { status: 400 }
      )
    }

    const updateData: { name?: string; isActive?: boolean; order?: number } = {}
    if (name !== undefined) updateData.name = name.trim()
    if (isActive !== undefined) updateData.isActive = isActive
    if (order !== undefined) updateData.order = order

    const university = await prisma.featuredUniversity.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ data: university })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update university' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'University ID is required' },
        { status: 400 }
      )
    }

    await prisma.featuredUniversity.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete university' },
      { status: 500 }
    )
  }
}
