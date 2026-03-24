'use client'

import { useState, useEffect } from 'react'
import { Status, News } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ConfirmModal } from '@/components/ConfirmModal'
// import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
}


interface ListProps {
    news: News[]
}

export function NewsList({ news: initial }: ListProps) {
    const router = useRouter()
    const [news, setNews] = useState(initial)
    const [deleting, setDeleting] = useState<string | null>(null)

    const [confirmDelete, setConfirmDelete] = useState<{ id: string, title: string } | null>(null)

    async function handleDelete(id: string) {
        setDeleting(id)
        const toastId = toast.loading(`Deleting "${confirmDelete?.title}"...`)
        try {
            const res = await fetch(`/api/news/${id}`, { method: 'DELETE' })
            if (!res.ok) {
                const data = await res.json()
                toast.error(`Error: ${data.error}`, { id: toastId })
                return
            }
            setNews((prev) => prev.filter((n) => n.id !== id))
            toast.success(`"${confirmDelete?.title}" deleted successfully`, { id: toastId })
        } catch {
            toast.error('Network error. Please try again.', { id: toastId })
        } finally {
            setDeleting(null)
            setConfirmDelete(null)
        }
    }

    if (news.length === 0) {
        return (
            <div className="text-center py-12 bg-white border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm">No news articles yet. Create one below.</p>
            </div>
        )
    }

    return (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
            {news.map((n) => (
                <div key={n.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                        {n.featuredImage ? (
                            <div className="w-16 h-16 bg-gray-100 overflow-hidden border border-gray-200">
                                <img src={n.featuredImage} alt="" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 bg-gray-50 flex items-center justify-center border border-gray-200 text-[10px] font-bold text-gray-300">
                                NO IMG
                            </div>
                        )}
                        <div>
                            <div className="font-bold text-gray-900 leading-tight">{n.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant={n.status === 'PUBLISHED' ? 'default' : 'outline'} className={n.status === 'PUBLISHED' ? 'bg-green-600' : ''}>
                                    {n.status}
                                </Badge>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => router.push(`/admin/news/${n.id}/edit`)}
                            className="px-3 py-1.5 text-xs font-bold border border-gray-300 hover:bg-gray-50 transition-colors uppercase tracking-tight"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setConfirmDelete({ id: n.id, title: n.title })}
                            disabled={deleting === n.id}
                            className="px-3 py-1.5 text-xs font-bold border border-red-100 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 uppercase tracking-tight"
                        >
                            {deleting === n.id ? 'Deleting…' : 'Delete'}
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
                confirmText="Delete Article"
                isLoading={!!deleting}
            />
        </div>
    )
}

interface FormProps {
    initialData?: News
}

export function NewsForm({ initialData }: FormProps) {
    const router = useRouter()
    const [title, setTitle] = useState(initialData?.title || '')
    const [slug, setSlug] = useState(initialData?.slug || '')
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
    const [content, setContent] = useState(initialData?.content || '')
    const [status, setStatus] = useState<Status>(initialData?.status || 'DRAFT')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.featuredImage || null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    // Cleanup local preview blob if we created one
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    function handleFileChange(file: File | null) {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl)
        }
        if (file) {
            setImageFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        } else {
            setImageFile(null)
            setPreviewUrl(initialData?.featuredImage || null)
        }
    }

    function handleTitleChange(val: string) {
        setTitle(val)
        if (!initialData) {
            setSlug(slugify(val))
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        if (!title.trim() || !slug.trim() || !excerpt.trim() || !content.trim()) {
            setError('All fields except image are required.')
            return
        }
        setSubmitting(true)

        try {
            let featuredImage = initialData?.featuredImage || null

            // Upload image if a new one is selected
            if (imageFile) {
                const uploadToastId = toast.loading('Uploading featured image...')
                const fd = new FormData()
                fd.append('file', imageFile)
                fd.append('filename', `news-${slug}-${Date.now()}`)

                const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })

                if (!uploadRes.ok) {
                    const uploadErr = await uploadRes.json()
                    toast.error(uploadErr.error || 'Image upload failed', { id: uploadToastId })
                    throw new Error(uploadErr.error || 'Image upload failed')
                }

                const uploadData = await uploadRes.json()
                featuredImage = uploadData.url
                toast.success('Image uploaded successfully', { id: uploadToastId })
            }

            const url = initialData ? `/api/news/${initialData.id}` : '/api/news'
            const method = initialData ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, slug, excerpt, content, featuredImage, status }),
            })

            await res.json()
            toast.success(initialData ? 'Article updated successfully' : 'Article published successfully')
            router.push('/admin/news')
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
        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 p-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 font-bold">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                        Article Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors"
                        placeholder="Latest Update from Muoroto FM"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                        URL Slug *
                    </label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full border border-gray-200 px-4 py-3 text-sm font-mono focus:outline-none focus:border-brand-green transition-colors"
                        placeholder="latest-update"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                    Short Excerpt *
                </label>
                <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={2}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors"
                    placeholder="A brief summary for the listing page..."
                    required
                />
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                    Full Content *
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors font-serif"
                    placeholder="Write your article content here..."
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                        Featured Image
                    </label>
                    <div className="text-[10px] text-gray-400 mb-2 font-bold uppercase tracking-wider">
                        Recommended: 16:9 ratio (e.g. 1280x720) • Format: JPG, PNG, WebP
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        className="text-xs text-gray-500 mb-4 block w-full
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-none file:border-0
                            file:text-xs file:font-black file:uppercase
                            file:bg-gray-100 file:text-gray-700
                            hover:file:bg-gray-200"
                    />
                    {previewUrl && (
                        <div className="relative aspect-video w-full bg-gray-50 border border-gray-100 overflow-hidden">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4 bg-brand-green text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest">
                                PREVIEW
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                        Publishing Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Status)}
                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors appearance-none bg-white rounded-none"
                    >
                        <option value="DRAFT">DRAFT (Hidden from public)</option>
                        <option value="PUBLISHED">PUBLISHED (Live on site)</option>
                    </select>
                    <p className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                        {status === 'DRAFT' ? 'This article will NOT be visible to visitors.' : 'This article will go live immediately upon saving.'}
                    </p>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-brand-black text-white px-10 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-green transition-all disabled:opacity-50"
                >
                    {submitting ? 'Saving…' : initialData ? 'Update Article' : 'Publish Article'}
                </button>
            </div>
        </form>
    )
}
