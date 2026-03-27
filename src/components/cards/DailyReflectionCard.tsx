'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookOpenText } from 'lucide-react'
import GlassCard from './GlassCard'

type Reflection = {
  arabic: string
  english: string
  reference: string
}

const REFLECTIONS: Reflection[] = [
  {
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    english: 'For indeed, with hardship comes ease.',
    reference: 'Surah Ash-Sharh 94:5',
  },
  {
    arabic: 'وَاللَّهُ خَيْرُ الرَّازِقِينَ',
    english: 'And Allah is the best of providers.',
    reference: 'Surah Al-Jumuah 62:11',
  },
  {
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    english: 'My Lord, increase me in knowledge.',
    reference: 'Surah Taha 20:114',
  },
]

export default function DailyReflectionCard() {
  const [index, setIndex] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % REFLECTIONS.length)
        setFading(false)
      }, 350)
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const reflection = useMemo(() => REFLECTIONS[index], [index])

  return (
    <GlassCard
      title="Daily Reflection"
      icon={<BookOpenText className="text-emerald-800" size={18} />}
      className="h-full"
    >
      <div
        className={`space-y-4 transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
      >
        <p className="font-serif text-2xl leading-relaxed text-emerald-900">{reflection.arabic}</p>
        <p className="text-sm text-emerald-950/80">{reflection.english}</p>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-emerald-800/70">{reflection.reference}</p>
      </div>
    </GlassCard>
  )
}
