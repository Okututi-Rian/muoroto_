'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ConfirmModal } from '@/components/ConfirmModal'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
}

interface Presenter {
    id: string
    name: string
}

interface Program {
    id: string
    title: string
    slug: string
    description: string
    days: string[]
    startTime: string
    endTime: string
    order: number
    status: 'DRAFT' | 'PUBLISHED'
    imageUrl: string | null
    presenters: { id: string; name: string }[]
}

interface ProgramListProps {
    programs: Program[]
}

export function ProgramList({ programs: initial }: ProgramListProps) {
    const router = useRouter()
    const [programs, setPrograms] = useState(initial)
    const [deleting, setDeleting] = useState<string | null>(null)

    const [confirmDelete, setConfirmDelete] = useState<{ id: string, title: string } | null>(null)

    async function handleDelete(id: string) {
        setDeleting(id)
        const toastId = toast.loading(`Deleting "${confirmDelete?.title}"...`)
        try {
            const res = await fetch(`/api/programs/${id}`, { method: 'DELETE' })
            if (!res.ok) {
                const data = await res.json()
                toast.error(`Error: ${data.error}`, { id: toastId })
                return
            }
            setPrograms((prev) => prev.filter((p) => p.id !== id))
            toast.success(`"${confirmDelete?.title}" deleted successfully`, { id: toastId })
        } catch {
            toast.error('Network error. Please try again.', { id: toastId })
        } finally {
            setDeleting(null)
            setConfirmDelete(null)
        }
    }

    if (programs.length === 0) {
        return <p className="text-gray-400 text-sm py-4">No programs yet. Create one below.</p>
    }

    return (
        <div className="divide-y divide-gray-100">
            {programs.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{p.title}</span>
                            <span
                                className={`text-xs font-bold px-2 py-0.5 ${p.status === 'PUBLISHED'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-500'
                                    }`}
                            >
                                {p.status}
                            </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                            {p.startTime} – {p.endTime} · {p.days.join(', ')} · Order: {p.order}
                        </div>
                        {p.presenters.length > 0 && (
                            <div className="text-xs text-gray-500 mt-0.5">
                                Hosts: {p.presenters.map((pr) => pr.name).join(', ')}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 shrink-0 ml-4">
                        <button
                            onClick={() => router.push(`/admin/programs/${p.id}/edit`)}
                            className="px-3 py-1.5 text-xs font-bold border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setConfirmDelete({ id: p.id, title: p.title })}
                            disabled={deleting === p.id}
                            className="px-3 py-1.5 text-xs font-bold border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                            {deleting === p.id ? 'Deleting…' : 'Delete'}
                        </button>
                    </div>
                </div>
            ))}

            <ConfirmModal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={() => confirmDelete && handleDelete(confirmDelete.id)}
                title="Confirm Deletion"
                description={`This action will permanently delete "${confirmDelete?.title}". This action cannot be undone.`}
                confirmText="Delete Program"
                isLoading={!!deleting}
            />
        </div>
    )
}

interface CreateProgramFormProps {
    presenters: Presenter[]
}

export function CreateProgramForm({ presenters }: CreateProgramFormProps) {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [days, setDays] = useState<string[]>([])
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [order, setOrder] = useState(0)
    const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT')
    const [presenterIds, setPresenterIds] = useState<string[]>([])
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
        }
    }, [previewUrl])

    function handleFileChange(file: File | null) {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null)
        }
        if (file) {
            setImageFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        } else {
            setImageFile(null)
        }
    }

    function handleTitleChange(val: string) {
        setTitle(val)
        setSlug(slugify(val))
    }

    function toggleDay(day: string) {
        setDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        )
    }

    function togglePresenter(id: string) {
        setPresenterIds((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        )
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        if (!title.trim() || !slug.trim() || !description.trim()) {
            setError('Title, slug, and description are required.')
            return
        }
        setSubmitting(true)

        try {
            let imageUrl: string | null = null

            if (imageFile) {
                const uploadToastId = toast.loading('Uploading image...')
                const fd = new FormData()
                fd.append('file', imageFile)
                fd.append('filename', `program-${slug}-${Date.now()}`)

                const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })

                if (!uploadRes.ok) {
                    const uploadErr = await uploadRes.json()
                    toast.error(uploadErr.error || 'Image upload failed', { id: uploadToastId })
                    throw new Error(uploadErr.error || 'Image upload failed')
                }

                const uploadData = await uploadRes.json()
                imageUrl = uploadData.url
                toast.success('Image uploaded successfully', { id: uploadToastId })
            }

            const res = await fetch('/api/programs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug,
                    description,
                    days,
                    startTime,
                    endTime,
                    order,
                    status,
                    imageUrl,
                    presenterIds,
                }),
            })

            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Failed to create program')
                return
            }

            // Reset
            setTitle('')
            setSlug('')
            setDescription('')
            setDays([])
            setStartTime('')
            setEndTime('')
            setOrder(0)
            setStatus('DRAFT')
            setPresenterIds([])
            setImageFile(null)
            setPreviewUrl(null)
            toast.success('Program created successfully')
            router.refresh()
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Network error. Please try again.'
            setError(message)
            toast.error(message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                        Slug *
                    </label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:border-gray-500"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Description *
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                    required
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                        Start Time
                    </label>
                    <input
                        type="text"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        placeholder="06:00 AM"
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                        End Time
                    </label>
                    <input
                        type="text"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        placeholder="09:00 AM"
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                        Order
                    </label>
                    <input
                        type="number"
                        value={order}
                        onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Days
                </label>
                <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => (
                        <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`px-3 py-1.5 text-xs font-bold border transition-colors ${days.includes(day)
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {day.substring(0, 3)}
                        </button>
                    ))}
                </div>
            </div>

            {presenters.length > 0 && (
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                        Presenters / Hosts
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {presenters.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => togglePresenter(p.id)}
                                className={`px-3 py-1.5 text-xs font-bold border transition-colors ${presenterIds.includes(p.id)
                                    ? 'bg-green-700 text-white border-green-700'
                                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Status
                </label>
                <div className="flex gap-3">
                    {(['DRAFT', 'PUBLISHED'] as const).map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setStatus(s)}
                            className={`px-4 py-2 text-xs font-bold border transition-colors ${status === s
                                ? s === 'PUBLISHED'
                                    ? 'bg-green-700 text-white border-green-700'
                                    : 'bg-gray-900 text-white border-gray-900'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Image (optional, max 5MB)
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="text-sm text-gray-600 mb-2"
                />
                {previewUrl && (
                    <div className="mt-2 relative w-48 h-32 border border-gray-200 overflow-hidden bg-gray-50">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 right-0 bg-brand-green text-white text-[10px] font-bold px-1 py-0.5">
                            PREVIEW
                        </div>
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="bg-green-700 text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-green-800 transition-colors disabled:opacity-50"
            >
                {submitting ? 'Creating…' : 'Create Program'}
            </button>
        </form>
    )
}
