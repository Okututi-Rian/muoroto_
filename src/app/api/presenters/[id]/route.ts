import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'

// GET /api/presenters/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const presenter = await prisma.presenter.findUnique({
      where: { id },
      include: { programs: { select: { id: true, title: true } } },
    })
    if (!presenter) {
      return NextResponse.json({ error: 'Presenter not found' }, { status: 404 })
    }
    return NextResponse.json(presenter)
  } catch (err) {
    console.error('[GET /api/presenters/[id]]', err)
    return NextResponse.json({ error: 'Failed to fetch presenter' }, { status: 500 })
  }
}

// PUT /api/presenters/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()
    const { name, slug, bio, imageUrl } = body

    if (!name || !slug || !bio) {
      return NextResponse.json({ error: 'name, slug, and bio are required' }, { status: 400 })
    }

    const presenter = await prisma.presenter.update({
      where: { id },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        bio: bio.trim(),
        imageUrl: imageUrl || null,
      },
    })
    return NextResponse.json(presenter)
  } catch (err) {
    console.error('[PUT /api/presenters/[id]]', err)
    const message = err instanceof Error ? err.message : 'Failed to update presenter'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/presenters/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    await prisma.presenter.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/presenters/[id]]', err)
    const message = err instanceof Error ? err.message : 'Failed to delete presenter'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
