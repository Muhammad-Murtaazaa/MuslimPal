import { HandCoins } from 'lucide-react'
import Link from 'next/link'
import GlassCard from './GlassCard'

type ZakatSummaryCardProps = {
  estimated: number | null
  currency: string
}

export default function ZakatSummaryCard({ estimated, currency }: ZakatSummaryCardProps) {
  const displayValue =
    estimated === null
      ? 'Not Calculated'
      : new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency,
          maximumFractionDigits: 2,
        }).format(estimated)

  return (
    <GlassCard
      title="Calculate Your Zakat"
      icon={<HandCoins className="text-emerald-800" size={18} />}
    >
      <p className="text-sm text-emerald-900/75">Your current estimated annual zakat.</p>
      <p className="mt-3 text-3xl font-bold text-emerald-950">{displayValue}</p>
      <p className="mt-2 text-xs text-emerald-900/70">Calculation uses 2.5% on net zakatable assets.</p>
      <Link
        href="/zakat"
        className="mt-4 inline-flex rounded-xl bg-[#064E3B] px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#0F766E]"
      >
        Open Zakat Calculator
      </Link>
    </GlassCard>
  )
}
