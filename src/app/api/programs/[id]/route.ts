import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'

// GET /api/programs/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const program = await prisma.program.findUnique({
      where: { id },
      include: { presenters: { select: { id: true, name: true } } },
    })
    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }
    return NextResponse.json(program)
  } catch (err) {
    console.error('[GET /api/programs/[id]]', err)
    return NextResponse.json({ error: 'Failed to fetch program' }, { status: 500 })
  }
}

// PUT /api/programs/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()
    const {
      title,
      slug,
      description,
      days,
      startTime,
      endTime,
      order,
      status,
      imageUrl,
      presenterIds,
    } = body

    if (!title || !slug || !description) {
      return NextResponse.json(
        { error: 'title, slug, and description are required' },
        { status: 400 }
      )
    }

    const program = await prisma.program.update({
      where: { id },
      data: {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        days: Array.isArray(days) ? days : [],
        startTime: startTime || '',
        endTime: endTime || '',
        order: typeof order === 'number' ? order : 0,
        status: status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
        imageUrl: imageUrl || null,
        presenters: {
          set: Array.isArray(presenterIds)
            ? presenterIds.map((pid: string) => ({ id: pid }))
            : [],
        },
      },
      include: { presenters: { select: { id: true, name: true } } },
    })
    return NextResponse.json(program)
  } catch (err) {
    console.error('[PUT /api/programs/[id]]', err)
    const message = err instanceof Error ? err.message : 'Failed to update program'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/programs/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    await prisma.program.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/programs/[id]]', err)
    const message = err instanceof Error ? err.message : 'Failed to delete program'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
