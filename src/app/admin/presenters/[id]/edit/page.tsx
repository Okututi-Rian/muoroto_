import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { EditPresenterForm } from './components'

interface Props {
    params: Promise<{ id: string }>
}

export default async function EditPresenterPage({ params }: Props) {
    const { id } = await params

    let presenter
    try {
        presenter = await prisma.presenter.findUnique({ where: { id } })
    } catch (err) {
        console.error('[admin/presenters/edit] DB error:', err)
        return <div className="text-red-600">Database error. Please try again.</div>
    }

    if (!presenter) {
        notFound()
    }

    return (
        <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Edit Presenter</h1>
            <p className="text-gray-500 mb-8">Editing: {presenter.name}</p>

            <div className="bg-white border border-gray-200 p-6">
                <EditPresenterForm presenter={presenter} />
            </div>
        </div>
    )
}
