import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import UploadForm from '@/components/UploadForm'

interface PageProps {
    params: Promise<{ date: string }>
}

export default async function NewEntryPage({ params }: PageProps) {
    const { date } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return <UploadForm date={date} />
}
