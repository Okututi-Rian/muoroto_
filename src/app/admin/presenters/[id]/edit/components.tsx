'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
    presenter: Presenter
}

export function EditPresenterForm({ presenter }: Props) {
    const router = useRouter()
    const [name, setName] = useState(presenter.name)
    const [slug, setSlug] = useState(presenter.slug)
    const [bio, setBio] = useState(presenter.bio)
    const [imageUrl, setImageUrl] = useState(presenter.imageUrl || '')
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

    function handleNameChange(val: string) {
        setName(val)
        setSlug(slugify(val))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSuccess(false)
        if (!name.trim() || !slug.trim() || !bio.trim()) {
            setError('Name, slug, and bio are required.')
            return
        }
        setSubmitting(true)

        try {
            let finalImageUrl = imageUrl || null

            // Upload new image if provided
            if (imageFile) {
                const fd = new FormData()
                fd.append('file', imageFile)
                fd.append('filename', `presenter-${slug}-${Date.now()}`)

                const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })

                if (!uploadRes.ok) {
                    const uploadErr = await uploadRes.json()
                    throw new Error(uploadErr.error || 'Image upload failed')
                }

                const uploadData = await uploadRes.json()
                finalImageUrl = uploadData.url
            }

            const res = await fetch(`/api/presenters/${presenter.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, slug, bio, imageUrl: finalImageUrl }),
            })

            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Failed to update presenter')
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
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
                    Presenter updated successfully.
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
                    Bio *
                </label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                    required
                />
            </div>

            {imageUrl && (
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                        Current Image
                    </label>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Current" className="h-24 w-24 object-cover border border-gray-200" />
                </div>
            )}

            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Replace Photo (optional, max 5MB)
                </label>
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
                    className="bg-gray-900 text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                    {submitting ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/admin/presenters')}
                    className="px-6 py-2.5 text-sm font-bold border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                    Back
                </button>
            </div>
        </form>
    )
}
