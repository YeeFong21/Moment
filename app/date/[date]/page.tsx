import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import EntryCard from '@/components/EntryCard'
import type { Database } from '@/lib/types/database'

interface PageProps {
    params: Promise<{ date: string }>
}

export default async function DatePage({ params }: PageProps) {
    const { date } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch entries for this date
    const { data: entries } = await supabase
        .from('entries')
        .select('*')
        .eq('happened_on', date)
        .order('created_at', { ascending: false })
        .returns<(Database['public']['Tables']['entries']['Row'])[]>()

    // Fetch images for all entries
    const entryIds = entries?.map(e => e.id) || []

    // Only query images if we have entries
    const { data: images } = entryIds.length > 0
        ? await supabase
            .from('entry_images')
            .select('*')
            .in('entry_id', entryIds)
            .returns<(Database['public']['Tables']['entry_images']['Row'])[]>()
        : { data: [] }

    const entriesWithImages = entries?.map(entry => ({
        ...entry,
        images: images?.filter(img => img.entry_id === entry.id) || []
    })) || []

    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-950 via-gray-900 to-black">
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-4"
                    >
                        ← Back to Calendar
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {formattedDate}
                    </h1>
                    <p className="text-gray-400">
                        {entriesWithImages.length} {entriesWithImages.length === 1 ? 'memory' : 'memories'}
                    </p>
                </div>

                <Link
                    href={`/date/${date}/new`}
                    className="block w-full mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-center"
                >
                    + Add New Memory
                </Link>

                <div className="space-y-6">
                    {entriesWithImages.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <p>No memories yet for this date.</p>
                            <p className="text-sm mt-2">Click above to add your first one!</p>
                        </div>
                    ) : (
                        entriesWithImages.map(entry => (
                            <EntryCard
                                key={entry.id}
                                entry={entry}
                                images={entry.images}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
