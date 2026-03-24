'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

interface Props {
    program: Program
    allPresenters: Presenter[]
}

export function EditProgramForm({ program, allPresenters }: Props) {
    const router = useRouter()
    const [title, setTitle] = useState(program.title)
    const [slug, setSlug] = useState(program.slug)
    const [description, setDescription] = useState(program.description)
    const [days, setDays] = useState<string[]>(program.days)
    const [startTime, setStartTime] = useState(program.startTime)
    const [endTime, setEndTime] = useState(program.endTime)
    const [order, setOrder] = useState(program.order)
    const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>(program.status)
    const [presenterIds, setPresenterIds] = useState<string[]>(
        program.presenters.map((p) => p.id)
    )
    const [imageUrl, setImageUrl] = useState(program.imageUrl || '')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

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
        setSuccess(false)
        if (!title.trim() || !slug.trim() || !description.trim()) {
            setError('Title, slug, and description are required.')
            return
        }
        setSubmitting(true)

        try {
            let finalImageUrl = imageUrl || null

            if (imageFile) {
                const fd = new FormData()
                fd.append('file', imageFile)
                fd.append('filename', `program-${slug}-${Date.now()}`)

                const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })

                if (!uploadRes.ok) {
                    const uploadErr = await uploadRes.json()
                    throw new Error(uploadErr.error || 'Image upload failed')
                }

                const uploadData = await uploadRes.json()
                finalImageUrl = uploadData.url
            }

            const res = await fetch(`/api/programs/${program.id}`, {
                method: 'PUT',
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
                    imageUrl: finalImageUrl,
                    presenterIds,
                }),
            })

            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Failed to update program')
                return
            }

            setSuccess(true)
            setImageUrl(data.imageUrl || '')
            setImageFile(null)
            setPreviewUrl(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error. Please try again.')
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
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
                    Program updated successfully.
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
                    rows={4}
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

            {allPresenters.length > 0 && (
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                        Presenters / Hosts
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {allPresenters.map((p) => (
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

            {imageUrl && (
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                        Current Image
                    </label>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Current" className="h-24 object-cover border border-gray-200" />
                </div>
            )}

            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Replace Image (optional, max 5MB)
                </label>
                <div className="text-[10px] text-gray-400 mb-2 font-bold uppercase tracking-wider">
                    Recommended: 16:9 ratio (e.g. 1280x720) • Format: JPG, PNG, WebP
                </div>
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
                            alt="New Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 right-0 bg-brand-green text-white text-[10px] font-bold px-1 py-0.5">
                            NEW PREVIEW
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-green-700 text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-green-800 transition-colors disabled:opacity-50"
                >
                    {submitting ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/admin/programs')}
                    className="px-6 py-2.5 text-sm font-bold border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                    Back
                </button>
            </div>
        </form>
    )
}
