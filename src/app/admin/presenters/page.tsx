import { prisma } from '@/lib/db'
import { PresenterList, CreatePresenterForm } from './components'

export default async function AdminPresentersPage() {
    let presenters: Awaited<ReturnType<typeof prisma.presenter.findMany>> = []
    try {
        presenters = await prisma.presenter.findMany({
            orderBy: { createdAt: 'desc' },
            include: { programs: { select: { id: true, title: true } } },
        })
    } catch (err) {
        console.error('[admin/presenters] DB error:', err)
    }

    return (
        <div>
            <h1 className="text-3xl font-black text-gray-900 mb-8">Presenters</h1>

            {/* Existing Presenters */}
            <section className="bg-white border border-gray-200 p-6 mb-8">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                    All Presenters ({presenters.length})
                </h2>
                <PresenterList presenters={presenters} />
            </section>

            {/* Create Form */}
            <section className="bg-white border border-gray-200 p-6">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                    Add New Presenter
                </h2>
                <CreatePresenterForm />
            </section>
        </div>
    )
}
