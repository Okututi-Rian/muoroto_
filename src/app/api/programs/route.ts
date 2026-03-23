import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'

// GET /api/programs — list all programs (admin: all statuses)
export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      orderBy: [
        { order: 'asc' },
        { id: 'asc' }
      ],
      include: { presenters: { select: { id: true, name: true } } },
    })
    return NextResponse.json(programs)
  } catch (err) {
    console.error('[GET /api/programs]', err)
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 })
  }
}

// POST /api/programs — create a new program
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
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

    const program = await prisma.program.create({
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
        presenters:
          Array.isArray(presenterIds) && presenterIds.length > 0
            ? { connect: presenterIds.map((id: string) => ({ id })) }
            : undefined,
      },
      include: { presenters: { select: { id: true, name: true } } },
    })
    return NextResponse.json(program, { status: 201 })
  } catch (err) {
    console.error('[POST /api/programs]', err)
    const message = err instanceof Error ? err.message : 'Failed to create program'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
