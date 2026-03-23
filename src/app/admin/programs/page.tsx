import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { ProgramList, CreateProgramForm } from './components'

type ProgramWithPresenters = Prisma.ProgramGetPayload<{
    include: { presenters: { select: { id: true; name: true } } }
}>

type PresenterSelect = { id: string; name: string }

export default async function AdminProgramsPage() {
    let programs: ProgramWithPresenters[] = []
    let presenters: PresenterSelect[] = []

    try {
        ;[programs, presenters] = await Promise.all([
            prisma.program.findMany({
                orderBy: { order: 'asc' },
                include: { presenters: { select: { id: true, name: true } } },
            }),
            prisma.presenter.findMany({
                orderBy: { name: 'asc' },
                select: { id: true, name: true },
            }),
        ])
    } catch (err) {
        console.error('[admin/programs] DB error:', err)
    }

    return (
        <div>
            <h1 className="text-3xl font-black text-gray-900 mb-8">Programs</h1>

            {/* Existing Programs */}
            <section className="bg-white border border-gray-200 p-6 mb-8">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                    All Programs ({programs.length})
                </h2>
                <ProgramList programs={programs} />
            </section>

            {/* Create Form */}
            <section className="bg-white border border-gray-200 p-6">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                    Add New Program
                </h2>
                <CreateProgramForm presenters={presenters} />
            </section>
        </div>
    )
}
