import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { NewsForm } from '../../components'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

interface Props {
    params: Promise<{ id: string }>
}

export default async function EditNewsPage({ params }: Props) {
    const { id } = await params
    const news = await prisma.news.findUnique({
        where: { id }
    })

    if (!news) {
        notFound()
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <Link
                    href="/admin/news"
                    className="inline-flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-green transition-colors"
                >
                    <ChevronLeft className="w-3 h-3" />
                    Back to Articles
                </Link>
                <h1 className="text-3xl font-serif font-black text-gray-900">Edit Article</h1>
                <p className="text-gray-400 text-[10px] font-mono tracking-tighter">ID: {news.id}</p>
            </div>

            <NewsForm initialData={news} />
        </div>
    )
}
