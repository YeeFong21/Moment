'use client'

import { useState } from 'react'

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

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)
    }

    if (entry.type === 'quote') {
        return (
            <div className="bg-gradient-to-br from-rose-900/30 to-pink-900/30 backdrop-blur-sm rounded-xl p-8 border border-rose-700/50 shadow-xl max-w-2xl w-full mx-auto">
                <div className="flex flex-col gap-4">
                    <span className="text-6xl text-rose-400/50 leading-none font-serif">“</span>
                    <p className="text-2xl text-gray-100 italic font-light leading-relaxed whitespace-pre-wrap break-words">
                        {entry.text}
                    </p>
                    <span className="text-6xl text-rose-400/50 leading-none self-end font-serif">”</span>
                </div>
                <p className="text-sm text-rose-300/50 mt-6 text-right font-medium">
                    {new Date(entry.created_at).toLocaleString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        month: 'short',
                        day: 'numeric'
                    })}
                </p>
            </div>
        )
    }

    const validUrls = imageUrls.filter(Boolean) as string[]
    const hasMultipleImages = validUrls.length > 1

    return (
        <div className="bg-gray-800/20 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 shadow-2xl max-w-2xl w-full mx-auto">
            {/* Image Carousel */}
            {validUrls.length > 0 && (
                <div className="relative group">
                    <img
                        src={validUrls[currentImageIndex]}
                        alt="Memory"
                        className="w-full h-auto object-contain bg-black/50"
                    />

                    {hasMultipleImages && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100"
                            >
                                ←
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100"
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
            {entry.text && (
                <div className="p-6 bg-gray-900/40">
                    <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap break-words font-light">
                        {entry.text}
                    </p>
                </div>
            )}

            <div className="px-6 pb-4 pt-2">
                <p className="text-xs text-gray-500 font-medium tracking-wide">
                    {new Date(entry.created_at).toLocaleString()}
                </p>
            </div>
        </div>
    )
}
