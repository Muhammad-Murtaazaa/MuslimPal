'use client'

import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import GlassCard from './GlassCard'

type CurrentHijri = {
  date: string
  day: number
  month: string
  monthArabic: string
  year: number
  weekday: string
  gregorianDate: string
}

type HijriPayload = {
  currentHijri: CurrentHijri | null
}

export default function CurrentHijriDateCard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<CurrentHijri | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()
        const response = await fetch(`/api/hijri?month=${month}&year=${year}`)
        const payload = (await response.json()) as HijriPayload

        if (!cancelled && response.ok) {
          setData(payload.currentHijri ?? null)
        }
      } catch {
        if (!cancelled) setData(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <GlassCard title="Hijri Date" icon={<CalendarDays className="text-emerald-800 dark:text-pal-gold" size={18} />} className="h-full">
      {loading ? (
        <p className="text-sm text-emerald-900/70 dark:text-white/80">Loading Islamic date...</p>
      ) : data ? (
        <div className="space-y-2">
          <p className="text-2xl font-bold text-emerald-950 dark:text-pal-gold">
            {data.day} {data.month} {data.year} AH
          </p>
          <p className="text-sm text-emerald-900/75 dark:text-white/90">{data.monthArabic}</p>
          <p className="text-xs uppercase tracking-[0.12em] text-emerald-800/70 dark:text-white/75">
            {data.weekday} • Gregorian {data.gregorianDate}
          </p>
        </div>
      ) : (
        <p className="text-sm text-emerald-900/70 dark:text-white/80">Hijri date is currently unavailable.</p>
      )}
    </GlassCard>
  )
}
