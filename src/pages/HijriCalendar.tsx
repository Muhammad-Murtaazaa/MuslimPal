'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

type HijriCurrent = {
  date: string
  day: number
  month: string
  monthArabic: string
  year: number
  weekday: string
  gregorianDate: string
}

type CalendarEntry = {
  gregorian: {
    date: string
    day: number
    month: string
    monthNumber: number
    year: number
    weekday: string
  }
  hijri: {
    date: string
    day: number
    month: string
    monthArabic: string
    monthNumber: number
    year: number
    holidays: string[]
  }
}

type HijriApiResponse = {
  currentHijri: HijriCurrent | null
  calendar: CalendarEntry[]
  requested: { month: number; year: number }
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function HijriCalendarView() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentHijri, setCurrentHijri] = useState<HijriCurrent | null>(null)
  const [entries, setEntries] = useState<CalendarEntry[]>([])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(`/api/hijri?month=${month}&year=${year}`)
        const payload = (await response.json()) as HijriApiResponse & { error?: string }

        if (!response.ok) {
          throw new Error(payload.error || 'Unable to load Hijri calendar.')
        }

        if (!cancelled) {
          setCurrentHijri(payload.currentHijri)
          setEntries(payload.calendar || [])
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Unable to load Hijri calendar.'
          setError(message)
          setEntries([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [month, year])

  const monthLabel = useMemo(() => {
    const date = new Date(year, month - 1, 1)
    return date.toLocaleString(undefined, { month: 'long', year: 'numeric' })
  }, [month, year])

  const calendarGrid = useMemo(() => {
    if (!entries.length) return [] as Array<CalendarEntry | null>

    const firstDate = entries[0]?.gregorian?.date
    const first = firstDate ? new Date(firstDate.split('-').reverse().join('-')) : null
    const startDay = first ? first.getDay() : 0

    const leading = Array.from({ length: startDay }, () => null)
    return [...leading, ...entries]
  }, [entries])

  const goPrevMonth = () => {
    if (month === 1) {
      setMonth(12)
      setYear((prev) => prev - 1)
      return
    }
    setMonth((prev) => prev - 1)
  }

  const goNextMonth = () => {
    if (month === 12) {
      setMonth(1)
      setYear((prev) => prev + 1)
      return
    }
    setMonth((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-emerald-900/15 bg-white/75 p-5 shadow-sm backdrop-blur-md dark:border-pal-sage/25 dark:bg-pal-surface/85">
        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs uppercase tracking-[0.12em] text-emerald-900/70 dark:bg-pal-bg/50 dark:text-pal-gold">
          <CalendarDays size={14} /> Islamic Date
        </p>
        <h1 className="mt-3 font-serif text-3xl text-emerald-950 dark:text-pal-gold">Hijri Calendar</h1>
        <p className="mt-1 text-sm text-emerald-900/75 dark:text-white/90">
          Live Hijri date and monthly Islamic calendar powered by Aladhan API.
        </p>

        <div className="mt-4 rounded-2xl border border-emerald-900/15 bg-emerald-50/60 p-4 dark:border-pal-sage/25 dark:bg-pal-bg/50">
          <p className="text-xs uppercase tracking-[0.12em] text-emerald-900/60 dark:text-white/75">Current Islamic Date</p>
          {currentHijri ? (
            <>
              <p className="mt-1 text-2xl font-bold text-emerald-950 dark:text-pal-gold">
                {currentHijri.day} {currentHijri.month} {currentHijri.year} AH
              </p>
              <p className="text-sm text-emerald-900/75 dark:text-white/85">
                {currentHijri.monthArabic} | {currentHijri.weekday} | Gregorian {currentHijri.gregorianDate}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-emerald-900/75 dark:text-white/85">Current Hijri date unavailable.</p>
          )}
        </div>
      </header>

      <section className="rounded-3xl border border-emerald-900/15 bg-white/75 p-5 shadow-sm backdrop-blur-md dark:border-pal-sage/25 dark:bg-pal-surface/85">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrevMonth}
            className="pal-btn-ghost inline-flex items-center gap-1 px-3 py-2 text-sm text-emerald-900 hover:bg-emerald-50 dark:text-pal-gold"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <h2 className="font-semibold text-emerald-950 dark:text-pal-gold">{monthLabel}</h2>
          <button
            type="button"
            onClick={goNextMonth}
            className="pal-btn-ghost inline-flex items-center gap-1 px-3 py-2 text-sm text-emerald-900 hover:bg-emerald-50 dark:text-pal-gold"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {WEEKDAYS.map((day) => (
            <div key={day} className="rounded-lg bg-emerald-100/70 px-2 py-2 text-center text-xs font-semibold uppercase text-emerald-800 dark:bg-pal-bg/55 dark:text-pal-gold">
              {day}
            </div>
          ))}

          {calendarGrid.map((item, idx) => {
            if (!item) {
              return <div key={`empty-${idx}`} className="min-h-[84px] rounded-lg border border-transparent" />
            }

            return (
              <div key={item.gregorian.date} className="min-h-[84px] rounded-lg border border-emerald-900/15 bg-white p-2 dark:border-pal-sage/25 dark:bg-pal-bg/45">
                <p className="text-xs font-semibold text-emerald-900 dark:text-white/80">{item.gregorian.day}</p>
                <p className="mt-1 text-sm font-bold text-emerald-950 dark:text-pal-gold">{item.hijri.day}</p>
                <p className="text-[10px] text-emerald-900/70 dark:text-white/75">{item.hijri.month}</p>
                {item.hijri.holidays?.length ? (
                  <p className="mt-1 line-clamp-1 text-[10px] text-amber-700">{item.hijri.holidays[0]}</p>
                ) : null}
              </div>
            )
          })}
        </div>

        {loading ? <p className="mt-4 text-sm text-emerald-900/70 dark:text-white/80">Loading Hijri calendar...</p> : null}
        {error ? <p className="mt-4 text-sm text-amber-700">{error}</p> : null}
      </section>
    </div>
  )
}
