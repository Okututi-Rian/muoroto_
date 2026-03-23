import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'

// GET /api/presenters — list all presenters (admin use)
export async function GET() {
  try {
    const presenters = await prisma.presenter.findMany({
      orderBy: [
        { createdAt: 'desc' },
        { id: 'asc' }
      ],
      include: { programs: { select: { id: true, title: true } } },
    })
    return NextResponse.json(presenters)
  } catch (err) {
    console.error('[GET /api/presenters]', err)
    return NextResponse.json({ error: 'Failed to fetch presenters' }, { status: 500 })
  }
}

// POST /api/presenters — create a new presenter
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    const { name, slug, bio, imageUrl } = body

    if (!name || !slug || !bio) {
      return NextResponse.json({ error: 'name, slug, and bio are required' }, { status: 400 })
    }

    const presenter = await prisma.presenter.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        bio: bio.trim(),
        imageUrl: imageUrl || null,
      },
    })
    return NextResponse.json(presenter, { status: 201 })
  } catch (err) {
    console.error('[POST /api/presenters]', err)
    const message = err instanceof Error ? err.message : 'Failed to create presenter'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
