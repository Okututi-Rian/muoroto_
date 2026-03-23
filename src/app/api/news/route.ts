import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'

// GET /api/news — list all news articles (admin use)
export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(news)
  } catch (err) {
    console.error('[GET /api/news]', err)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}

// POST /api/news — create a new news article
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    const { title, slug, excerpt, content, featuredImage, status } = body

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json({ error: 'title, slug, excerpt, and content are required' }, { status: 400 })
    }

    const news = await prisma.news.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        featuredImage: featuredImage || null,
        status: status || 'DRAFT',
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    })
    return NextResponse.json(news, { status: 201 })
  } catch (err) {
    console.error('[POST /api/news]', err)
    const message = err instanceof Error ? err.message : 'Failed to create news article'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
