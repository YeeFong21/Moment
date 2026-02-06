'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/types/database'

export async function deleteEntry(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any

    // 1. Get images to delete from storage first
    const { data: images } = await supabase
        .from('entry_images')
        .select('storage_path')
        .eq('entry_id', id)

    // 2. Delete images from storage
    if (images && images.length > 0) {
        const paths = images.map((img: any) => img.storage_path)
        await supabase.storage
            .from('memories')
            .remove(paths)
    }

    // 3. Delete entry (cascade should handle database rows for images, but explicit is safer)
    const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/date/[date]')
    // We can't know the exact date easily here without querying first, 
    // but revalidating the layout or specific paths is good.
    // Ideally we pass the date to deleteEntry to revalidate specific path.
    return { success: true }
}

export async function updateEntry(id: string, text: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any

    const { error } = await supabase
        .from('entries')
        .update({ text })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/date/[date]')
    return { success: true }
}
