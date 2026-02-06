import { createClient } from '@/lib/supabase/server'
import MemoryItem from './MemoryItem'

interface EntryCardProps {
    entry: {
        id: string
        type: 'photo' | 'quote'
        text: string | null
        created_at: string
    }
    images?: {
        storage_path: string
    }[]
}

export default async function EntryCard({ entry, images }: EntryCardProps) {
    const supabase = await createClient()

    // Generate signed URLs for all images
    const imageUrls = images && images.length > 0
        ? await Promise.all(
            images.map(async (img) => {
                const { data } = await supabase.storage
                    .from('memories')
                    .createSignedUrl(img.storage_path, 60 * 60 * 24) // 24 hours
                return data?.signedUrl || null
            })
        )
        : []

    return <MemoryItem entry={entry} imageUrls={imageUrls} />
}
