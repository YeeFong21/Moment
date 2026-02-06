'use client'

import { useEffect, useState } from 'react'

export default function FloatingHearts() {
    const [hearts, setHearts] = useState<{ id: number; left: number; duration: number; delay: number }[]>([])

    useEffect(() => {
        // Generate initial hearts
        const newHearts = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            duration: 15 + Math.random() * 20,
            delay: Math.random() * 20
        }))
        setHearts(newHearts)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {hearts.map((heart) => (
                <div
                    key={heart.id}
                    className="absolute bottom-[-50px] text-pink-500/10 animate-float"
                    style={{
                        left: `${heart.left}%`,
                        animationDuration: `${heart.duration}s`,
                        animationDelay: `${heart.delay}s`,
                        fontSize: `${Math.random() * 2 + 1}rem`
                    }}
                >
                    ♥
                </div>
            ))}
        </div>
    )
}
