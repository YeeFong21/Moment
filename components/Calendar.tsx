'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface CalendarProps {
    markedDates: string[]
    currentYear?: number
}

export default function Calendar({ markedDates }: CalendarProps) {
    const router = useRouter()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const containerRef = useRef<HTMLDivElement>(null)

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            })
        }
    }

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const formatDate = (year: number, month: number, day: number) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    }

    const isMarked = (date: string) => markedDates.includes(date)
    const isToday = (year: number, month: number, day: number) => {
        const today = new Date()
        return today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day
    }

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} />)
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDate(year, month, day)
        const marked = isMarked(dateStr)
        const today = isToday(year, month, day)

        days.push(
            <button
                key={day}
                onClick={() => router.push(`/date/${dateStr}`)}
                className={`
          relative w-12 h-12 rounded-full font-medium text-sm transition-all duration-300
          flex items-center justify-center group/day
          ${marked
                        ? 'bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 hover:scale-110'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }
          ${today ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-gray-900' : ''}
        `}
            >
                <span className="relative z-10">{day}</span>
                {marked && (
                    <span className="absolute -top-1 -right-1 text-xs animate-bounce delay-75">
                        ❤️
                    </span>
                )}
            </button>
        )
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 overflow-hidden group"
            >
                {/* Spotlight Effect */}
                <div
                    className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(236, 72, 153, 0.15), transparent 40%)`
                    }}
                />

                {/* Header */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <button
                        onClick={prevMonth}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        ←
                    </button>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-pink-300 via-rose-300 to-purple-300 bg-clip-text text-transparent font-serif tracking-wide">
                        {months[month]} {year}
                    </h2>
                    <button
                        onClick={nextMonth}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        →
                    </button>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-2 mb-4 text-center relative z-10">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="text-xs font-semibold text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 justify-items-center relative z-10">
                    {days}
                </div>
            </div>
        </div>
    )
}
