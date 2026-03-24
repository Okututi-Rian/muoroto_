'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ConfirmModal } from '@/components/ConfirmModal'

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
    slug: string
    bio: string
    imageUrl: string | null
}

interface Props {
    presenters: Presenter[]
}

export function PresenterList({ presenters: initial }: Props) {
    const router = useRouter()
    const [presenters, setPresenters] = useState(initial)
    const [deleting, setDeleting] = useState<string | null>(null)

    const [confirmDelete, setConfirmDelete] = useState<{ id: string, name: string } | null>(null)

    async function handleDelete(id: string) {
        setDeleting(id)
        const toastId = toast.loading(`Deleting "${confirmDelete?.name}"...`)
        try {
            const res = await fetch(`/api/presenters/${id}`, { method: 'DELETE' })
            if (!res.ok) {
                const data = await res.json()
                toast.error(`Error: ${data.error}`, { id: toastId })
                return
            }
            setPresenters((prev) => prev.filter((p) => p.id !== id))
            toast.success(`"${confirmDelete?.name}" deleted successfully`, { id: toastId })
        } catch {
            toast.error('Network error. Please try again.', { id: toastId })
        } finally {
            setDeleting(null)
            setConfirmDelete(null)
        }
    }

    if (presenters.length === 0) {
        return (
            <p className="text-gray-400 text-sm py-4">No presenters yet. Create one below.</p>
        )
    }

    return (
        <div className="divide-y divide-gray-100">
            {presenters.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-4">
                    <div>
                        <div className="font-semibold text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-400 font-mono">{p.slug}</div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-1 max-w-md">{p.bio}</div>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-4">
                        <button
                            onClick={() => router.push(`/admin/presenters/${p.id}/edit`)}
                            className="px-3 py-1.5 text-xs font-bold border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setConfirmDelete({ id: p.id, name: p.name })}
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
                description={`This action will permanently delete "${confirmDelete?.name}". This action cannot be undone.`}
                confirmText="Delete Presenter"
                isLoading={!!deleting}
            />
        </div>
    )
}

export function CreatePresenterForm() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [bio, setBio] = useState('')
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

    function handleNameChange(val: string) {
        setName(val)
        setSlug(slugify(val))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        if (!name.trim() || !slug.trim() || !bio.trim()) {
            setError('Name, slug, and bio are required.')
            return
        }
        setSubmitting(true)

        try {
            let imageUrl: string | null = null

            // Upload image if provided
            if (imageFile) {
                const uploadToastId = toast.loading('Uploading image...')
                const fd = new FormData()
                fd.append('file', imageFile)
                fd.append('filename', `presenter-${slug}-${Date.now()}`)

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

            const res = await fetch('/api/presenters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, slug, bio, imageUrl }),
            })

            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Failed to create presenter')
                return
            }

            setName('')
            setSlug('')
            setBio('')
            setImageFile(null)
            setPreviewUrl(null)
            toast.success('Presenter created successfully')
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
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                        Name *
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                        placeholder="John Kamau"
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
                        placeholder="john-kamau"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Bio *
                </label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                    placeholder="Brief biography..."
                    required
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Photo (optional, max 5MB)
                </label>
                <div className="text-[10px] text-gray-400 mb-2 font-bold uppercase tracking-wider">
                    Recommended: 1:1 ratio (e.g. 800x800) • Format: JPG, PNG, WebP
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="text-sm text-gray-600 mb-2"
                />
                {previewUrl && (
                    <div className="mt-2 relative w-32 h-32 border border-gray-200 overflow-hidden bg-gray-50">
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
                className="bg-gray-900 text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
                {submitting ? 'Creating…' : 'Create Presenter'}
            </button>
        </form>
    )
}
