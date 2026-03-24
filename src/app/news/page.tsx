import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { Section } from '@/components/layout/Section'
import { ArrowRight, Calendar } from 'lucide-react'
// import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function NewsListingPage() {
    let articles: Awaited<ReturnType<typeof prisma.news.findMany>> = []
    try {
        articles = await prisma.news.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: { publishedAt: 'desc' }
        })
    } catch (err) {
        console.error('Error fetching public news:', err)
    }

    const featuredArticle = articles[0]
    const remainingArticles = articles.slice(1)

    return (
        <div className="pt-24 pb-16">
            <Section variant="light" className="border-b border-border/50">
                <div className="space-y-4 mb-16">
                    <div className="inline-block bg-brand-green/10 text-brand-green text-[10px] font-black uppercase tracking-[0.4em] px-3 py-1 rounded-full">
                        Latest Coverage
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif text-brand-black leading-none uppercase">
                        News & <span className="text-brand-green">Insights.</span>
                    </h1>
                    <div className="w-12 h-1 bg-brand-yellow rounded-full"></div>
                </div>

                {!featuredArticle ? (
                    <div className="py-24 text-center bg-surface-card rounded-2xl border border-dashed border-brand-green/20">
                        <p className="text-brand-green/40 font-bold uppercase tracking-[0.2em]">Our newsroom is preparing content</p>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {/* Featured Article */}
                        <Link href={`/news/${featuredArticle.slug}`} className="group block">
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 shadow-2xl">
                                    {featuredArticle.featuredImage ? (
                                        <Image
                                            src={featuredArticle.featuredImage}
                                            alt={featuredArticle.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-brand-green/5">
                                            <span className="text-brand-green/20 font-black text-4xl uppercase tracking-tighter">MUOROTO</span>
                                        </div>
                                    )}
                                    <div className="absolute top-6 left-6 bg-brand-yellow text-brand-green text-[10px] font-black px-3 py-1 uppercase tracking-widest shadow-lg">
                                        Featured
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-brand-green font-bold text-[10px] uppercase tracking-widest">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(featuredArticle.publishedAt || featuredArticle.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-serif font-black text-brand-black leading-tight group-hover:text-brand-green transition-colors">
                                        {featuredArticle.title}
                                    </h2>
                                    <p className="text-lg text-gray-500 leading-relaxed font-serif">
                                        {featuredArticle.excerpt}
                                    </p>
                                    <div className="flex items-center text-brand-black font-bold uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
                                        Read Full Article <ArrowRight className="ml-3 h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Remaining Grid */}
                        {remainingArticles.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 border-t border-border/50">
                                {remainingArticles.map((article) => (
                                    <Link key={article.id} href={`/news/${article.slug}`} className="group space-y-6">
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 shadow-xl">
                                            {article.featuredImage ? (
                                                <Image
                                                    src={article.featuredImage}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-brand-green/5 text-brand-green/20 font-black text-xl uppercase tracking-tighter">
                                                    NEWS
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <div className="text-brand-green font-bold text-[10px] uppercase tracking-widest">
                                                {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <h3 className="text-xl font-serif font-black text-brand-black leading-tight group-hover:text-brand-green transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-3">
                                                {article.excerpt}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Section>
        </div>
    )
}
