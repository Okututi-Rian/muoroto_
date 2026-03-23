import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { EditProgramForm } from './components'

interface Props {
    params: Promise<{ id: string }>
}

export default async function EditProgramPage({ params }: Props) {
    const { id } = await params

    let program
    let allPresenters: { id: string; name: string }[] = []

    try {
        ;[program, allPresenters] = await Promise.all([
            prisma.program.findUnique({
                where: { id },
                include: { presenters: { select: { id: true, name: true } } },
            }),
            prisma.presenter.findMany({
                orderBy: { name: 'asc' },
                select: { id: true, name: true },
            }),
        ])
    } catch (err) {
        console.error('[admin/programs/edit] DB error:', err)
        return <div className="text-red-600">Database error. Please try again.</div>
    }

    if (!program) {
        notFound()
    }

    return (
        <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Edit Program</h1>
            <p className="text-gray-500 mb-8">Editing: {program.title}</p>

            <div className="bg-white border border-gray-200 p-6">
                <EditProgramForm program={program} allPresenters={allPresenters} />
            </div>
        </div>
    )
}
