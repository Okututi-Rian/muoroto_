import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { NewsList } from './components'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminNewsPage() {
    let news: Awaited<ReturnType<typeof prisma.news.findMany>> = []
    try {
        news = await prisma.news.findMany({
            orderBy: { createdAt: 'desc' }
        })
    } catch (err) {
        console.error('Error fetching news:', err)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-black text-gray-900">News & Articles</h1>
                    <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold text-[10px]">
                        Manage your website&apos;s editorial content
                    </p>
                </div>
                <Link
                    href="/admin/news/create"
                    className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-brand-green-dark transition-colors shadow-lg shadow-brand-green/20"
                >
                    <Plus className="w-4 h-4" />
                    New Article
                </Link>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {news.length} Articles Total
                    </span>
                </div>
                <NewsList news={news} />
            </div>
        </div>
    )
}
