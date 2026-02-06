'use client'

import { useState } from 'react'
import { login, signup } from './actions'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [isSignup, setIsSignup] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setError(null)
        const result = isSignup ? await signup(formData) : await login(formData)
        if (result?.error) {
            setError(result.error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-950 via-gray-900 to-black p-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700">
                    <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Memories
                    </h1>
                    <p className="text-center text-gray-400 mb-8">Our shared moments together</p>

                    <form action={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-white placeholder-gray-400"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-white placeholder-gray-400"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-[1.02] transition-all shadow-lg"
                        >
                            {isSignup ? 'Sign Up' : 'Log In'}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setIsSignup(!isSignup)
                                setError(null)
                            }}
                            className="w-full text-sm text-gray-400 hover:text-purple-400 transition-colors"
                        >
                            {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
