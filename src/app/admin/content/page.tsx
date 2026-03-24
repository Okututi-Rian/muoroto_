import { prisma } from '@/lib/db'
import { ContentList } from './components'

export const dynamic = 'force-dynamic'

export default async function AdminContentPage() {
    let contents: Awaited<ReturnType<typeof prisma.content.findMany>> = []
    try {
        contents = await prisma.content.findMany({
            orderBy: { key: 'asc' },
        })
    } catch (err) {
        console.error('[admin/content] DB error:', err)
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight underline decoration-brand-yellow decoration-4 underline-offset-8">
                    Website Content
                </h1>
                <div className="px-3 py-1 bg-brand-green/10 text-brand-green text-[10px] font-black uppercase tracking-widest rounded-full border border-brand-green/20">
                    CMS Module
                </div>
            </div>

            <section className="bg-white border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-brand-yellow rounded-full"></div>
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                        Manage Static Text & Banners ({contents.length})
                    </h2>
                </div>
                
                {contents.length === 0 ? (
                    <div className="py-20 text-center bg-gray-50 border border-dashed border-gray-200">
                        <p className="text-gray-400 text-sm font-medium">No content keys found in database.</p>
                        <p className="text-xs text-gray-300 mt-1">Please seed initial content or wait for automatic initialization.</p>
                    </div>
                ) : (
                    <ContentList contents={contents} />
                )}
            </section>

            <div className="mt-8 p-6 bg-brand-black text-white/50 rounded-2xl border border-white/5 text-xs leading-relaxed">
                <p className="font-bold text-brand-yellow uppercase tracking-widest mb-2">Editor Guidelines</p>
                <ul className="space-y-2 list-disc pl-4">
                    <li>Dynamic text used across <span className="text-white">Home</span> and <span className="text-white">About</span> pages.</li>
                    <li>Editing these values updates the live site instantly after refresh.</li>
                    <li>Always verify your changes on the public site after saving.</li>
                </ul>
            </div>
        </div>
    )
}
