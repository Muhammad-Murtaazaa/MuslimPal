 'use client'

import { useEffect, useMemo, useState } from 'react'
import { Compass, Clock3, MapPin } from 'lucide-react'
import { calculatePrayerTimes, calculateQiblaBearing, cardinalDirection } from '@/lib/prayTimes'

const FALLBACK = { lat: 24.8607, lng: 67.0011, label: 'Karachi (fallback)' }

type Coords = { lat: number; lng: number; label: string }

export default function PrayerTimesMasterPage() {
  const [coords, setCoords] = useState<Coords>(FALLBACK)
  const [loadingLocation, setLoadingLocation] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: 'Current location',
        })
        setLoadingLocation(false)
      },
      () => {
        setCoords(FALLBACK)
        setLoadingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [])

  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const prayerTimes = useMemo(() => calculatePrayerTimes(now, coords.lat, coords.lng, 'Makkah'), [now, coords])
  const qiblaDegrees = useMemo(() => calculateQiblaBearing(coords.lat, coords.lng), [coords])
  const qiblaDirection = useMemo(() => cardinalDirection(qiblaDegrees), [qiblaDegrees])

  const rows = [
    { prayer: 'Fajr', time: prayerTimes.fajr },
    { prayer: 'Dhuhr', time: prayerTimes.dhuhr },
    { prayer: 'Asr', time: prayerTimes.asr },
    { prayer: 'Maghrib', time: prayerTimes.maghrib },
    { prayer: 'Isha', time: prayerTimes.isha },
  ]

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-emerald-900/15 bg-white/70 p-5 backdrop-blur-md dark:border-pal-sage/25 dark:bg-pal-surface/85">
        <h1 className="font-serif text-3xl text-emerald-950 dark:text-pal-gold">Prayer Times & Qibla</h1>
        <p className="mt-2 text-sm text-emerald-900/75 dark:text-white/90">
          Times are now calculated live from the integrated Pray-Times logic for your location and current date.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1 text-xs text-emerald-900/80 dark:bg-pal-bg/50 dark:text-white/85">
          <MapPin size={13} />
          {loadingLocation ? 'Detecting location...' : coords.label}
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-2xl border border-emerald-900/15 bg-white/70 p-5 backdrop-blur-md dark:border-pal-sage/25 dark:bg-pal-surface/85">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-emerald-950 dark:text-pal-gold">
            <Clock3 size={16} /> Today's Prayer Times
          </h2>
          <div className="space-y-2">
            {rows.map((item) => (
              <div key={item.prayer} className="flex items-center justify-between rounded-xl bg-emerald-50/70 px-3 py-2 text-sm dark:bg-pal-bg/50">
                <span className="text-emerald-900 dark:text-white/85">{item.prayer}</span>
                <span className="font-semibold text-emerald-950 dark:text-pal-gold">{item.time}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-900/15 bg-white/70 p-5 backdrop-blur-md dark:border-pal-sage/25 dark:bg-pal-surface/85">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-emerald-950 dark:text-pal-gold">
            <Compass size={16} /> Qibla Orientation
          </h2>
          <div className="rounded-2xl bg-emerald-50/70 p-4 dark:bg-pal-bg/50">
            <p className="text-xs uppercase tracking-[0.12em] text-emerald-900/60 dark:text-white/75">Direction</p>
            <p className="mt-1 text-3xl font-bold text-emerald-950 dark:text-pal-gold">{qiblaDegrees}° {qiblaDirection}</p>
            <p className="mt-2 text-sm text-emerald-900/70 dark:text-white/85">Calculated from your coordinates toward the Kaaba in Makkah.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
