'use client'

import { useState, useEffect } from 'react'
import { deleteEntry, updateEntry } from '@/app/date/[date]/actions'

interface MemoryItemProps {
    entry: {
        id: string
        type: 'photo' | 'quote'
        text: string | null
        created_at: string
    }
    imageUrls: (string | null)[]
}

export default function MemoryItem({ entry, imageUrls }: MemoryItemProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [formattedDate, setFormattedDate] = useState<string>('')
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(entry.text || '')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setFormattedDate(new Date(entry.created_at).toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric'
        }))
    }, [entry.created_at])

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this memory permanently?')) return

        setIsLoading(true)
        const result = await deleteEntry(entry.id)
        if (result.error) {
            alert('Error deleting: ' + result.error)
            setIsLoading(false)
        }
    }

    const handleUpdate = async () => {
        setIsLoading(true)
        const result = await updateEntry(entry.id, editText)
        setIsLoading(false)

        if (result.error) {
            alert('Error updating: ' + result.error)
        } else {
            setIsEditing(false)
        }
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)
    }

    const cancelEdit = () => {
        setIsEditing(false)
        setEditText(entry.text || '')
    }

    // JSX for Action Buttons
    const actionButtons = (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all"
                title="Edit"
            >
                ✏️
            </button>
            <button
                onClick={handleDelete}
                className="p-2 bg-red-900/40 hover:bg-red-900/60 text-white rounded-full backdrop-blur-sm transition-all"
                title="Delete"
            >
                🗑️
            </button>
        </div>
    )

    // JSX for Edit Form
    const editForm = (
        <div className="flex flex-col gap-3 w-full relative z-20">
            <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-black/40 text-white p-3 rounded-lg border border-rose-500/50 focus:border-rose-500 outline-none min-h-[100px] backdrop-blur-md"
                autoFocus
            />
            <div className="flex gap-2 justify-end">
                <button
                    onClick={cancelEdit}
                    className="px-3 py-1 text-sm text-gray-300 hover:text-white"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    onClick={handleUpdate}
                    className="px-4 py-1 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-colors shadow-lg"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </div>
    )

    if (entry.type === 'quote') {
        return (
            <div className={`bg-gradient-to-br from-rose-900/30 to-pink-900/30 backdrop-blur-sm rounded-xl p-8 border border-rose-700/50 shadow-xl max-w-2xl w-full mx-auto relative group ${isLoading ? 'opacity-50' : ''}`}>
                {!isEditing && actionButtons}

                <div className="flex flex-col gap-4">
                    <span className="text-6xl text-rose-400/50 leading-none font-serif">“</span>
                    {isEditing ? (
                        editForm
                    ) : (
                        <p className="text-2xl text-gray-100 italic font-light leading-relaxed whitespace-pre-wrap break-words">
                            {entry.text}
                        </p>
                    )}
                    <span className="text-6xl text-rose-400/50 leading-none self-end font-serif">”</span>
                </div>
                <p className="text-sm text-rose-300/50 mt-6 text-right font-medium min-h-[1.25rem]">
                    {formattedDate}
                </p>
            </div>
        )
    }

    const validUrls = imageUrls.filter(Boolean) as string[]
    const hasMultipleImages = validUrls.length > 1

    return (
        <div className={`bg-gradient-to-br from-rose-900/20 to-pink-900/20 backdrop-blur-md rounded-2xl overflow-hidden border border-rose-500/30 shadow-2xl max-w-2xl w-full mx-auto relative group ${isLoading ? 'opacity-50' : ''}`}>
            {!isEditing && actionButtons}

            {/* Image Carousel */}
            {validUrls.length > 0 && (
                <div className="relative group/image">
                    <img
                        src={validUrls[currentImageIndex]}
                        alt="Memory"
                        className="w-full h-auto object-contain bg-black/50"
                    />

                    {hasMultipleImages && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-all opacity-0 group-hover/image:opacity-100"
                            >
                                ←
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-all opacity-0 group-hover/image:opacity-100"
                            >
                                →
                            </button>

                            {/* Dots indicator */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {validUrls.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/40'
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Caption Section */}
            {(entry.text || isEditing) && (
                <>
                    {/* If editing, show form in a distinct container */}
                    {isEditing ? (
                        <div className="p-6 bg-gray-900/40 border-t border-rose-500/20">
                            {editForm}
                        </div>
                    ) : (
                        <div className="p-6 bg-gray-900/40 border-t border-rose-500/10">
                            <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap break-words font-light">
                                {entry.text}
                            </p>
                        </div>
                    )}
                </>
            )}

            <div className="px-6 pb-4 pt-2">
                <p className="text-xs text-rose-300/60 font-medium tracking-wide min-h-[1rem]">
                    {formattedDate}
                </p>
            </div>
        </div>
    )
}
