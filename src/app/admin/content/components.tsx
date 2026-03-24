'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ContentEntry {
    key: string
    title: string | null
    content: string
    imageUrl: string | null
}

interface Props {
    contents: ContentEntry[]
}

export function ContentList({ contents: initial }: Props) {
    const [contents, setContents] = useState(initial)
    const [editing, setEditing] = useState<ContentEntry | null>(null)

    return (
        <div className="space-y-8">
            <div className="divide-y divide-gray-100">
                {contents.map((c) => (
                    <div key={c.key} className="flex items-center justify-between py-4">
                        <div className="min-w-0 flex-1 mr-4">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-mono font-bold text-gray-500 rounded uppercase tracking-wider">
                                    {c.key}
                                </span>
                                {c.title && <div className="font-semibold text-gray-900 truncate">{c.title}</div>}
                            </div>
                            <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                                {c.content}
                            </div>
                        </div>
                        <button
                            onClick={() => setEditing(c)}
                            className="px-3 py-1.5 text-xs font-bold border border-gray-300 hover:bg-gray-50 transition-colors shrink-0"
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>

            {editing && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button 
                            onClick={() => setEditing(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">
                            Edit: <span className="text-brand-green">{editing.key}</span>
                        </h3>
                        
                        <EditContentForm 
                            entry={editing} 
                            onSuccess={(updated) => {
                                setContents(prev => prev.map(item => item.key === updated.key ? updated : item))
                                setEditing(null)
                            }}
                            onCancel={() => setEditing(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export function EditContentForm({ entry, onSuccess, onCancel }: { entry: ContentEntry, onSuccess: (updated: ContentEntry) => void, onCancel?: () => void }) {
    const [title, setTitle] = useState(entry.title || '')
    const [content, setContent] = useState(entry.content || '')
    const [imageUrl, setImageUrl] = useState(entry.imageUrl || '')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(entry.imageUrl)
    const [submitting, setSubmitting] = useState(false)
    const [ratioWarning, setRatioWarning] = useState(false)

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl !== entry.imageUrl) URL.revokeObjectURL(previewUrl)
        }
    }, [previewUrl, entry.imageUrl])

    function handleFileChange(file: File | null) {
        if (previewUrl && previewUrl !== entry.imageUrl) {
            URL.revokeObjectURL(previewUrl)
        }
        if (file) {
            setImageFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            
            // Soft aspect ratio check
            const img = new Image()
            img.onload = () => {
                const ratio = img.width / img.height
                // Example: Warning if not roughly 16:9 for banners
                if (entry.key.includes('banner') || entry.key.includes('hero')) {
                    if (Math.abs(ratio - (16/9)) > 0.2) setRatioWarning(true)
                    else setRatioWarning(false)
                } else {
                    setRatioWarning(false)
                }
            }
            img.src = url
        } else {
            setImageFile(null)
            setPreviewUrl(entry.imageUrl)
            setRatioWarning(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        const toastId = toast.loading('Saving changes...')

        try {
            let finalImageUrl = imageUrl

            if (imageFile) {
                const fd = new FormData()
                fd.append('file', imageFile)
                fd.append('filename', `content-${entry.key}-${Date.now()}`)

                const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
                if (!uploadRes.ok) throw new Error('Image upload failed')
                const uploadData = await uploadRes.json()
                finalImageUrl = uploadData.url
            }

            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: entry.key, title, content, imageUrl: finalImageUrl }),
            })

            if (!res.ok) throw new Error('Failed to update content')
            const updated = await res.json()
            toast.success('Content updated successfully', { id: toastId })
            onSuccess(updated)
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error saving content', { id: toastId })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Title (Optional)
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                    placeholder="Section Title"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Content *
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500 font-medium leading-relaxed"
                    placeholder="Enter text content here..."
                    required
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Background / Featured Image
                </label>
                <div className="text-[10px] text-gray-400 mb-2 font-bold uppercase tracking-wider">
                    Recommended: 16:9 ratio (e.g. 1920x1080) for banners • Max 5MB
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="text-sm text-gray-600 mb-2"
                />
                
                {ratioWarning && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-3 mb-4 animate-in slide-in-from-left duration-300">
                        <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            ASPECT RATIO WARNING
                        </div>
                        <p className="text-[10px] text-amber-700 mt-1">
                            This image doesn't match the recommended 16:9 aspect ratio. It may appear cropped or stretched in some areas.
                        </p>
                    </div>
                )}

                {previewUrl && (
                    <div className="mt-2 relative aspect-video w-full max-w-sm border border-gray-200 overflow-hidden bg-gray-50 shadow-inner">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-brand-green text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-wider">
                            UI PREVIEW
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gray-900 text-white px-6 py-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-green transition-all disabled:opacity-50"
                >
                    {submitting ? 'Saving…' : 'Save Changes'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 text-xs font-black uppercase tracking-[0.2em] border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    )
}
