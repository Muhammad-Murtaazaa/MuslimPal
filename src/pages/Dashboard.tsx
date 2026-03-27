'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Clock3, Sparkles } from 'lucide-react'
import DailyReflectionCard from '@/components/cards/DailyReflectionCard'
import CurrentHijriDateCard from '@/components/cards/CurrentHijriDateCard'
import GlassCard from '@/components/cards/GlassCard'
import QiblaWidgetCard from '@/components/cards/QiblaWidgetCard'
import ZakatSummaryCard from '@/components/cards/ZakatSummaryCard'
import AskMuslimPalSidebar from '@/components/AskMuslimPalSidebar'
import { calculatePrayerTimes, calculateQiblaBearing, cardinalDirection } from '@/lib/prayTimes'

type Coords = {
  lat: number
  lng: number
  label: string
}

const FALLBACK_COORDS: Coords = {
  lat: 24.8607,
  lng: 67.0011,
  label: 'Karachi (fallback)',
}

type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'

function parsePrayerTime(baseDate: Date, label: string): Date {
  const [time, suffix] = label.split(' ')
  const [hourText, minuteText] = time.split(':')
  let hour = Number(hourText)
  const minute = Number(minuteText)

  const normalizedSuffix = (suffix ?? 'AM').toUpperCase()
  if (normalizedSuffix === 'PM' && hour !== 12) hour += 12
  if (normalizedSuffix === 'AM' && hour === 12) hour = 0

  const result = new Date(baseDate)
  result.setHours(hour, minute, 0, 0)
  return result
}

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}

function getUpcomingPrayer(now: Date, coords: Coords) {
  const todays = calculatePrayerTimes(now, coords.lat, coords.lng, 'Makkah')
  const schedule: Array<{ name: PrayerName; at: Date }> = [
    { name: 'Fajr', at: parsePrayerTime(now, todays.fajr) },
    { name: 'Dhuhr', at: parsePrayerTime(now, todays.dhuhr) },
    { name: 'Asr', at: parsePrayerTime(now, todays.asr) },
    { name: 'Maghrib', at: parsePrayerTime(now, todays.maghrib) },
    { name: 'Isha', at: parsePrayerTime(now, todays.isha) },
  ]

  const next = schedule.find((item) => item.at.getTime() > now.getTime())
  if (next) return next

  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const tomorrowTimes = calculatePrayerTimes(tomorrow, coords.lat, coords.lng, 'Makkah')
  return {
    name: 'Fajr' as PrayerName,
    at: parsePrayerTime(tomorrow, tomorrowTimes.fajr),
  }
}

export default function DashboardView() {
  const [now, setNow] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [coords, setCoords] = useState<Coords>(FALLBACK_COORDS)
  const [locating, setLocating] = useState(false)
  const [locationDenied, setLocationDenied] = useState(false)
  const [zakatEstimate, setZakatEstimate] = useState<number | null>(null)
  const [zakatCurrency, setZakatCurrency] = useState('USD')

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationDenied(true)
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: 'Current location',
        })
        setLocationDenied(false)
        setLocating(false)
      },
      () => {
        setLocationDenied(true)
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const loadZakat = () => {
      const raw = window.localStorage.getItem('muslimpal_zakat_estimate')
      if (!raw) {
        setZakatEstimate(null)
        setZakatCurrency('USD')
        return
      }

      try {
        const parsed = JSON.parse(raw) as { amount?: unknown; currency?: unknown }
        const amount = Number(parsed.amount)
        setZakatEstimate(Number.isFinite(amount) ? amount : null)
        setZakatCurrency(typeof parsed.currency === 'string' ? parsed.currency : 'USD')
      } catch {
        const value = Number(raw)
        setZakatEstimate(Number.isFinite(value) ? value : null)
        setZakatCurrency('USD')
      }
    }

    loadZakat()
    window.addEventListener('storage', loadZakat)
    return () => window.removeEventListener('storage', loadZakat)
  }, [])

  const upcoming = useMemo(() => getUpcomingPrayer(now, coords), [now, coords])
  const countdown = useMemo(() => formatCountdown(upcoming.at.getTime() - now.getTime()), [upcoming, now])

  const hasCurrentLocation = coords.label === 'Current location'
  const qiblaDegrees = useMemo(
    () => (hasCurrentLocation ? calculateQiblaBearing(coords.lat, coords.lng) : null),
    [coords, hasCurrentLocation],
  )
  const qiblaDirection = useMemo(
    () => (qiblaDegrees === null ? null : cardinalDirection(qiblaDegrees)),
    [qiblaDegrees],
  )

  const safeCountdown = mounted ? countdown : '--:--:--'

  return (
    <div className="space-y-6">
      <GlassCard className="overflow-hidden bg-linear-to-r from-[#064E3B] to-[#0F766E] text-white">
        <div className="grid gap-5 md:grid-cols-2 md:items-center">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.15em]">
              <Sparkles size={14} /> MuslimPal Dashboard
            </p>
            <h1 className="font-serif text-3xl md:text-4xl">Upcoming Prayer: {upcoming.name}</h1>
            <p className="text-sm text-emerald-50/90">Stay prepared and align your day around worship with precision and calm.</p>
            <p className="text-xs uppercase tracking-[0.12em] text-emerald-50/70">{coords.label}</p>
            <span
              className={`inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                hasCurrentLocation
                  ? 'bg-emerald-100/20 text-emerald-50'
                  : 'bg-amber-200/20 text-amber-100'
              }`}
            >
              {hasCurrentLocation ? 'Location: Live' : 'Location: Permission Required'}
            </span>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
            <p className="flex items-center gap-2 text-sm uppercase tracking-[0.12em] text-emerald-50/80">
              <Clock3 size={16} /> Live Countdown
            </p>
            <p className="mt-2 text-4xl font-bold tracking-wider md:text-5xl">{safeCountdown}</p>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <Link href="/hijri-calendar" className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F766E]/40">
              <CurrentHijriDateCard />
            </Link>
            <Link href="/dua" className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F766E]/40">
              <DailyReflectionCard />
            </Link>
          </div>
          <div className="space-y-5">
            <ZakatSummaryCard estimated={zakatEstimate} currency={zakatCurrency} />
            <QiblaWidgetCard
              direction={qiblaDirection}
              degrees={qiblaDegrees}
              hasLocation={hasCurrentLocation}
              loadingLocation={locating}
              locationDenied={locationDenied}
              onRequestLocation={requestLocation}
            />
          </div>
        </div>
        <AskMuslimPalSidebar />
      </div>
    </div>
  )
}
