import React from 'react'
import Link from 'next/link'
import { NewsForm } from '../components'
import { ChevronLeft } from 'lucide-react'

export default function CreateNewsPage() {
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
                <h1 className="text-3xl font-serif font-black text-gray-900">Create New Article</h1>
            </div>

            <NewsForm />
        </div>
    )
}
