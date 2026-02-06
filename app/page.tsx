import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Calendar from '@/components/Calendar'
import { logout } from './login/actions'

export default async function HomePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch all dates that have entries
    const { data: entries } = await supabase
        .from('entries')
        .select('happened_on')

    const markedDates = entries ? [...new Set(entries.map(e => e.happened_on))] : []

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-950 via-gray-900 to-black">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Our Memories
                        </h1>
                        <p className="text-gray-400 mt-2">Click a highlighted date to view memories</p>
                    </div>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-all text-gray-300"
                        >
                            Logout
                        </button>
                    </form>
                </div>

                <Calendar
                    markedDates={markedDates}
                    currentYear={new Date().getFullYear()}
                />
            </div>
        </div>
    )
}
