import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'

// GET /api/content — list all content entries
export async function GET() {
  try {
    const contents = await prisma.content.findMany({
      orderBy: { key: 'asc' },
    })
    return NextResponse.json(contents)
  } catch (err) {
    console.error('[GET /api/content]', err)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

// POST /api/content — create or update a content entry (upsert)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    const { key, title, content, imageUrl } = body

    if (!key || content === undefined) {
      return NextResponse.json({ error: 'key and content are required' }, { status: 400 })
    }

    const entry = await prisma.content.upsert({
      where: { key: key.trim() },
      update: {
        title: title?.trim() || null,
        content: content.trim(),
        imageUrl: imageUrl || null,
      },
      create: {
        key: key.trim(),
        title: title?.trim() || null,
        content: content.trim(),
        imageUrl: imageUrl || null,
      },
    })
    return NextResponse.json(entry, { status: 201 })
  } catch (err) {
    console.error('[POST /api/content]', err)
    const message = err instanceof Error ? err.message : 'Failed to update content'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
