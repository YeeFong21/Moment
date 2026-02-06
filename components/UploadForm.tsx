'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createEntry } from '@/app/date/[date]/new/actions'
import { createClient } from '@/lib/supabase/client'

interface UploadFormProps {
    date: string
}

export default function UploadForm({ date }: UploadFormProps) {
    const [type, setType] = useState<'photo' | 'quote'>('photo')
    const [previews, setPreviews] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newPreviews: string[] = []
        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                newPreviews.push(reader.result as string)
                if (newPreviews.length === files.length) {
                    setPreviews(newPreviews)
                }
            }
            reader.readAsDataURL(file)
        })
    }

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError(null)

        const result = await createEntry(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-950 via-gray-900 to-black">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Link
                    href={`/date/${date}`}
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-6"
                >
                    ← Cancel
                </Link>

                <h1 className="text-3xl font-bold text-white mb-2">
                    Add New Memory
                </h1>
                <p className="text-gray-400 mb-8">{formattedDate}</p>

                <form onSubmit={async (e) => {
                    e.preventDefault()
                    setLoading(true)
                    setError(null)

                    try {
                        const formData = new FormData(e.currentTarget)
                        let imagePaths: string[] = []

                        if (type === 'photo') {
                            const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement
                            const files = fileInput?.files

                            if (files && files.length > 0) {
                                const supabase = createClient()
                                const { data: { user } } = await supabase.auth.getUser()

                                if (!user) throw new Error('You must be logged in')

                                // Upload all files first
                                const uploadPromises = Array.from(files).map(async (file) => {
                                    const fileExt = file.name.split('.').pop()
                                    // Use a simpler path strategy: user_id/timestamp-random.ext
                                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
                                    const storagePath = `${user.id}/${fileName}`

                                    const { error: uploadError } = await supabase.storage
                                        .from('memories')
                                        .upload(storagePath, file)

                                    if (uploadError) throw uploadError
                                    return storagePath
                                })

                                imagePaths = await Promise.all(uploadPromises)
                            }
                        }

                        // Append paths to formData
                        formData.append('image_paths', JSON.stringify(imagePaths))

                        // We don't need to send the massive files to the server action anymore
                        formData.delete('photos')

                        const result = await createEntry(formData)
                        if (result?.error) {
                            setError(result.error)
                            setLoading(false)
                        }
                    } catch (err: any) {
                        console.error('Upload error:', err)
                        setError(err.message || 'Failed to upload images')
                        setLoading(false)
                    }
                }} className="space-y-6">
                    <input type="hidden" name="happened_on" value={date} />

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setType('photo')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${type === 'photo'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                }`}
                        >
                            📷 Photo
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('quote')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${type === 'quote'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                }`}
                        >
                            💭 Quote
                        </button>
                    </div>

                    <input type="hidden" name="type" value={type} />

                    {type === 'photo' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Upload Photos
                            </label>
                            <input
                                type="file"
                                name="photos"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                required
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                            />
                            {previews.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    {previews.map((preview, idx) => (
                                        <img
                                            key={idx}
                                            src={preview}
                                            alt={`Preview ${idx + 1}`}
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            {type === 'quote' ? 'Quote' : 'Caption (optional)'}
                        </label>
                        <textarea
                            name="text"
                            required={type === 'quote'}
                            rows={type === 'quote' ? 6 : 3}
                            placeholder={type === 'quote' ? 'Enter your quote here...' : 'Add a caption...'}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating...' : 'Create Memory'}
                    </button>
                </form>
            </div>
        </div>
    )
}
