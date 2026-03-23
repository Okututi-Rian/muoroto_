import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'

// GET /api/news/[id] — get a single news article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const news = await prisma.news.findUnique({
      where: { id },
    })
    if (!news) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    return NextResponse.json(news)
  } catch (err) {
    console.error('[GET /api/news/:id]', err)
    return NextResponse.json({ error: 'Failed to fetch news article' }, { status: 500 })
  }
}

// PATCH /api/news/[id] — update a news article
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await requireAdmin()
    const body = await request.json()
    const { title, slug, excerpt, content, featuredImage, status } = body

    const existing = await prisma.news.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    const data: {
        title?: string;
        slug?: string;
        excerpt?: string;
        content?: string;
        featuredImage?: string | null;
        status?: string;
        publishedAt?: Date | null;
    } = {}
    if (title !== undefined) data.title = (title as string).trim()
    if (slug !== undefined) data.slug = (slug as string).trim()
    if (excerpt !== undefined) data.excerpt = (excerpt as string).trim()
    if (content !== undefined) data.content = (content as string).trim()
    if (featuredImage !== undefined) data.featuredImage = featuredImage as string | null
    if (status !== undefined) {
      data.status = status as string
      if (status === 'PUBLISHED' && existing.status !== 'PUBLISHED') {
        data.publishedAt = new Date()
      } else if (status === 'DRAFT') {
        data.publishedAt = null
      }
    }

    const news = await prisma.news.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
    })
    return NextResponse.json(news)
  } catch (err) {
    console.error('[PATCH /api/news/:id]', err)
    const message = err instanceof Error ? err.message : 'Failed to update news article'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/news/[id] — delete a news article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await requireAdmin()
    await prisma.news.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/news/:id]', err)
    return NextResponse.json({ error: 'Failed to delete news article' }, { status: 500 })
  }
}
