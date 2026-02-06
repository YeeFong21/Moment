'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createEntry(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const type = formData.get('type') as 'photo' | 'quote'
    const text = formData.get('text') as string
    const happenedOn = formData.get('happened_on') as string
    const files = formData.getAll('photos') as File[]

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

    // If photo type, upload images
    if (type === 'photo' && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            if (!file || file.size === 0) continue

            const fileExt = file.name.split('.').pop()
            const fileName = `${entry.id}/${i + 1}.${fileExt}`
            const storagePath = `entries/${fileName}`

            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('memories')
                .upload(storagePath, file, {
                    upsert: false
                })

            if (uploadError) {
                console.error('Upload error:', uploadError)
                continue
            }

            // Create entry_image record
            await supabase
                .from('entry_images')
                .insert({
                    entry_id: entry.id,
                    storage_path: storagePath,
                })
        }
    }

    revalidatePath(`/date/${happenedOn}`)
    revalidatePath('/')
    redirect(`/date/${happenedOn}`)
}
