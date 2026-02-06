'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/types/database'

export async function createEntry(formData: FormData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const type = formData.get('type') as 'photo' | 'quote'
    const text = formData.get('text') as string
    const happenedOn = formData.get('happened_on') as string
    const imagePathsJson = formData.get('image_paths') as string
    const imagePaths = imagePathsJson ? JSON.parse(imagePathsJson) : []

    // Create entry
    const { data: entry, error: entryError } = await supabase
        .from('entries')
        .insert({
            user_id: user.id,
            type,
            text: text || null,
            happened_on: happenedOn,
        })
        .select()
        .single()

    if (entryError) {
        return { error: entryError.message }
    }

    // If photo type, link uploaded images
    if (type === 'photo' && imagePaths.length > 0) {
        const imageRecords = imagePaths.map((path: string) => ({
            entry_id: entry.id,
            storage_path: path,
        }))

        const { error: imagesError } = await supabase
            .from('entry_images')
            .insert(imageRecords)

        if (imagesError) {
            console.error('Error linking images:', imagesError)
            // Consider deleting the entry or images if this fails, 
            // but for now let's just log it.
        }
    }

    revalidatePath(`/date/${happenedOn}`)
    revalidatePath('/')
    redirect(`/date/${happenedOn}`)
}
