import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Section } from '@/components/layout/Section'
import { Calendar, ChevronLeft, Share2 } from 'lucide-react'
// import { format } from 'date-fns'
import { notFound } from 'next/navigation'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const article = await prisma.news.findUnique({
        where: { slug }
    })

    if (!article) {
        return { title: 'Article Not Found' }
    }

    return {
        title: `${article.title} | News`,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            images: article.featuredImage ? [article.featuredImage] : [],
        }
    }
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params
    const article = await prisma.news.findUnique({
        where: { slug }
    })

    if (!article || article.status !== 'PUBLISHED') {
        notFound()
    }

    return (
        <article className="pt-24 pb-16">
            {/* Header / Cover Section */}
            <div className="relative h-[60vh] min-h-[400px] w-full bg-brand-black overflow-hidden">
                {article.featuredImage && (
                    <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent" />
                
                <Section className="relative h-full flex flex-col justify-end pb-16 z-10">
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 text-brand-yellow font-black uppercase text-[10px] tracking-[0.3em] mb-8 hover:gap-4 transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Newsroom
                    </Link>
                    
                    <div className="max-w-4xl space-y-6">
                        <div className="flex items-center gap-4 text-white/60 font-bold text-xs uppercase tracking-widest">
                            <Calendar className="w-4 h-4 text-brand-yellow" />
                            {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <h1 className="text-4xl md:text-7xl font-serif font-black text-white leading-[0.9] uppercase">
                            {article.title}
                        </h1>
                    </div>
                </Section>
            </div>

            {/* Content Section */}
            <Section variant="light" className="-mt-10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-8 md:p-16 shadow-2xl relative z-20">
                        {/* Excerpt / Lead */}
                        <p className="text-xl md:text-3xl text-brand-green font-serif italic mb-12 leading-relaxed border-l-4 border-brand-yellow pl-8">
                            {article.excerpt}
                        </p>

                        {/* Body Text */}
                        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-8 font-serif whitespace-pre-wrap">
                            {article.content}
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-16 pt-10 border-t border-gray-100 flex items-center justify-between">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Published by Muoroto Editorial Team
                            </div>
                            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-brand-green transition-colors">
                                <Share2 className="w-4 h-4" />
                                Share Article
                            </button>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Related/Footer CTA */}
            <Section variant="dark" className="text-center py-32">
                <div className="max-w-2xl mx-auto space-y-8">
                    <h2 className="text-3xl md:text-5xl font-serif font-black text-white uppercase leading-none">
                        Stay <span className="text-brand-yellow italic">Informed.</span>
                    </h2>
                    <p className="text-white/50 text-sm tracking-widest font-bold uppercase">
                        Muoroto FM - Nairobi&apos;s Voice of Truth
                    </p>
                    <Link
                        href="/news"
                        className="inline-block bg-brand-yellow text-brand-green px-10 py-4 text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl"
                    >
                        More News Stories
                    </Link>
                </div>
            </Section>
        </article>
    )
}
