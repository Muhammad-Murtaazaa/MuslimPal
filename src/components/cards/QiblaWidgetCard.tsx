import { Compass } from 'lucide-react'
import Link from 'next/link'
import GlassCard from './GlassCard'

type QiblaWidgetCardProps = {
  direction: string | null
  degrees: number | null
  hasLocation: boolean
  loadingLocation: boolean
  locationDenied: boolean
  onRequestLocation: () => void
}

export default function QiblaWidgetCard({
  direction,
  degrees,
  hasLocation,
  loadingLocation,
  locationDenied,
  onRequestLocation,
}: QiblaWidgetCardProps) {
  const bearingText =
    hasLocation && degrees !== null && direction
      ? `${degrees.toFixed(1)}° ${direction}`
      : '--'

  return (
    <GlassCard title="Qibla Direction" icon={<Compass className="text-emerald-800 dark:text-pal-gold" size={18} />}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-emerald-900/60 dark:text-white/75">Qibla Bearing</p>
          <p className="text-2xl font-bold text-emerald-950 dark:text-pal-gold">{bearingText}</p>
        </div>
        <div className="relative h-20 w-20 rounded-full border border-emerald-700/20 bg-emerald-50">
          <span className="absolute inset-x-0 top-1 text-center text-[10px] font-semibold text-emerald-800/80">N</span>
          <span className="absolute right-1 inset-y-0 my-auto h-fit text-[10px] text-emerald-800/70">E</span>
          <span className="absolute inset-x-0 bottom-1 text-center text-[10px] text-emerald-800/70">S</span>
          <span className="absolute left-1 inset-y-0 my-auto h-fit text-[10px] text-emerald-800/70">W</span>
          <div
            className="absolute left-1/2 top-1/2 h-0 w-0 transition-transform duration-300"
            style={{ transform: `translate(-50%, -50%) rotate(${degrees ?? 0}deg)` }}
          >
            <span className="absolute left-1/2 top-0 h-9 w-0.5 -translate-x-1/2 -translate-y-full rounded bg-[#D4AF37]" />
          </div>
          <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-700/70" />
        </div>
      </div>
      {hasLocation && degrees !== null && (
        <p className="mt-3 text-xs text-emerald-900/70 dark:text-white/85">Compass is aligned to True North; the needle points toward Qibla.</p>
      )}
      {!hasLocation && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-emerald-900/70 dark:text-white/85">
            {locationDenied
              ? 'Location access is blocked. Enable permission for precise qibla direction.'
              : 'Allow location to make qibla direction fully accurate.'}
          </p>
          <button
            type="button"
            onClick={onRequestLocation}
            disabled={loadingLocation}
            className="pal-btn-primary px-3 py-2 text-xs uppercase tracking-[0.1em] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loadingLocation ? 'Locating...' : 'Use My Location'}
          </button>
        </div>
      )}
      <Link
        href="/pray-times-master"
        className="pal-btn-primary mt-4 inline-flex px-3 py-2 text-xs uppercase tracking-[0.1em]"
      >
        Open Prayer Times & Qibla
      </Link>
    </GlassCard>
  )
}
