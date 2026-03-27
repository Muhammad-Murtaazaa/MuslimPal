'use client'

import { useEffect, useMemo, useState } from 'react'
import { DAILY_DUAS, DuaCategory } from '@/data/duas'

const categories: Array<DuaCategory | 'All'> = [
  'All',
  'Morning',
  'Evening',
  'Sleep',
  'Waking',
  'Home',
  'Food',
  'Protection',
  'Forgiveness',
]

export default function DuaList() {
  const today = new Date().toISOString().slice(0, 10)
  const dailyZikrIds = useMemo(() => DAILY_DUAS.filter((item) => item.isDailyZikr).map((item) => item.id), [])

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<DuaCategory | 'All'>('All')
  const [completedToday, setCompletedToday] = useState<string[]>([])
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('muslimpal-daily-zikr')
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as { date?: string; completedIds?: string[] }
      if (parsed.date === today && Array.isArray(parsed.completedIds)) {
        setCompletedToday(parsed.completedIds)
      }
    } catch {
      // Ignore broken local storage payloads.
    }
  }, [today])

  useEffect(() => {
    localStorage.setItem(
      'muslimpal-daily-zikr',
      JSON.stringify({ date: today, completedIds: completedToday })
    )
  }, [completedToday, today])

  const toggleCompleted = (id: string) => {
    setCompletedToday((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 1400)
    } catch {
      setCopiedKey(null)
    }
  }

  const completedDailyCount = completedToday.filter((id) => dailyZikrIds.includes(id)).length
  const totalDailyCount = dailyZikrIds.length

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return DAILY_DUAS.filter((dua) => {
      const categoryMatch = category === 'All' || dua.category === category
      if (!categoryMatch) return false
      if (!q) return true

      const haystack = [
        dua.title,
        dua.category,
        dua.transliteration,
        dua.translation,
        dua.reference,
        dua.authenticity,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(q)
    })
  }, [category, query])

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-emerald-900/15 bg-white/75 p-5 shadow-sm backdrop-blur-md dark:border-pal-sage/25 dark:bg-pal-surface/85">
        <h1 className="font-serif text-3xl text-emerald-950 dark:text-pal-gold">Daily Duas and Zikr</h1>
        <p className="mt-2 text-sm text-emerald-900/75 dark:text-white/90">
          A practical collection with Arabic text, transliteration, translation, and authenticity references.
        </p>
        <p className="mt-2 text-xs text-amber-700">
          Note: Verify religious rulings with qualified scholars. This section is for daily remembrance and learning.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, meaning, or reference (example: forgiveness, Bukhari)"
            className="w-full rounded-xl border border-emerald-900/20 bg-[#FCFCF9] px-3 py-2 text-sm text-emerald-950 outline-none transition placeholder:text-emerald-900/45 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 dark:border-pal-sage/35 dark:bg-pal-bg/55 dark:text-white dark:placeholder:text-white/50 dark:focus:border-pal-gold dark:focus:ring-pal-gold/35"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as DuaCategory | 'All')}
            className="rounded-xl border border-emerald-900/20 bg-[#FCFCF9] px-3 py-2 text-sm text-emerald-950 outline-none transition focus:border-[#0F766E] dark:border-pal-sage/35 dark:bg-pal-bg/55 dark:text-white dark:focus:border-pal-gold"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 rounded-xl border border-emerald-900/15 bg-emerald-50/60 p-3 dark:border-pal-sage/25 dark:bg-pal-bg/50">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-emerald-900/70 dark:text-pal-gold">Daily Zikr Tracker</p>
          <p className="mt-1 text-sm text-emerald-900 dark:text-white/90">
            Completed today: {completedDailyCount}/{totalDailyCount}
          </p>
        </div>
      </header>

      <div className="grid gap-4">
        {filtered.map((dua) => (
          <article
            key={dua.id}
            className="rounded-2xl border border-emerald-900/15 bg-white/80 p-5 shadow-sm backdrop-blur-md dark:border-pal-sage/25 dark:bg-pal-surface/90"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-emerald-950 dark:text-pal-gold">{dua.title}</h2>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                {dua.category}
              </span>
              {dua.repetitions ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  {dua.repetitions}
                </span>
              ) : null}
            </div>

            <p dir="rtl" className="mt-4 text-right text-lg leading-9 text-emerald-950 md:text-2xl md:leading-[3rem] dark:text-pal-gold">
              {dua.arabic}
            </p>

            <div className="mt-4 space-y-2">
              <p className="text-sm italic text-emerald-900/90 dark:text-white/90">{dua.transliteration}</p>
              <p className="text-sm text-emerald-900/80 dark:text-white/85">{dua.translation}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => copyText(dua.arabic, `${dua.id}-ar`)}
                className="pal-btn-ghost rounded-md px-2 py-1 font-medium text-emerald-900 hover:bg-emerald-50 dark:text-pal-gold"
              >
                {copiedKey === `${dua.id}-ar` ? 'Copied Arabic' : 'Copy Arabic'}
              </button>
              <button
                type="button"
                onClick={() => copyText(dua.transliteration, `${dua.id}-tr`)}
                className="pal-btn-ghost rounded-md px-2 py-1 font-medium text-emerald-900 hover:bg-emerald-50 dark:text-pal-gold"
              >
                {copiedKey === `${dua.id}-tr` ? 'Copied Transliteration' : 'Copy Transliteration'}
              </button>
              {dua.isDailyZikr ? (
                <button
                  type="button"
                  onClick={() => toggleCompleted(dua.id)}
                  className="pal-btn-ghost rounded-md px-2 py-1 font-medium text-emerald-900 hover:bg-emerald-50 dark:text-pal-gold"
                >
                  {completedToday.includes(dua.id) ? 'Completed Today' : 'Mark Completed Today'}
                </button>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">Reference: {dua.reference}</span>
              <span className="rounded-md bg-blue-100 px-2 py-1 text-blue-700">Authenticity: {dua.authenticity}</span>
            </div>
          </article>
        ))}

        {!filtered.length ? (
          <div className="rounded-2xl border border-dashed border-emerald-900/20 bg-white/60 p-6 text-center text-sm text-emerald-900/75 dark:border-pal-sage/25 dark:bg-pal-surface/75 dark:text-white/80">
            No duas found for your search/filter. Try a broader keyword or switch category.
          </div>
        ) : null}
      </div>
    </section>
  )
}