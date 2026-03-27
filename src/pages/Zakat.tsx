'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, Circle, Coins, Scale } from 'lucide-react'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'PKR', 'SAR', 'AED', 'INR'] as const
type CurrencyCode = (typeof CURRENCIES)[number]

const USD_GOLD_PER_GRAM = 88.03
const USD_SILVER_PER_GRAM = 1.04

function formatMoney(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function ZakatView() {
  const [step, setStep] = useState(1)
  const [currency, setCurrency] = useState<CurrencyCode>('USD')
  const [fxRate, setFxRate] = useState(1)
  const [ratesLoading, setRatesLoading] = useState(false)
  const [cash, setCash] = useState(0)
  const [business, setBusiness] = useState(0)
  const [goldGrams, setGoldGrams] = useState(0)
  const [silverGrams, setSilverGrams] = useState(0)
  const [liabilities, setLiabilities] = useState(0)
  const [goldPricePerGram, setGoldPricePerGram] = useState(USD_GOLD_PER_GRAM)
  const [silverPricePerGram, setSilverPricePerGram] = useState(USD_SILVER_PER_GRAM)

  useEffect(() => {
    let cancelled = false

    const fetchRate = async () => {
      if (currency === 'USD') {
        setFxRate(1)
        setGoldPricePerGram(USD_GOLD_PER_GRAM)
        setSilverPricePerGram(USD_SILVER_PER_GRAM)
        return
      }

      setRatesLoading(true)
      try {
        const response = await fetch(`https://open.er-api.com/v6/latest/USD`)
        const data = await response.json()
        const nextRate = Number(data?.rates?.[currency])
        const validRate = Number.isFinite(nextRate) && nextRate > 0 ? nextRate : 1
        if (!cancelled) {
          setFxRate(validRate)
          setGoldPricePerGram(USD_GOLD_PER_GRAM * validRate)
          setSilverPricePerGram(USD_SILVER_PER_GRAM * validRate)
        }
      } catch {
        if (!cancelled) {
          setFxRate(1)
          setGoldPricePerGram(USD_GOLD_PER_GRAM)
          setSilverPricePerGram(USD_SILVER_PER_GRAM)
        }
      } finally {
        if (!cancelled) setRatesLoading(false)
      }
    }

    void fetchRate()
    return () => {
      cancelled = true
    }
  }, [currency])

  const goldValue = goldGrams * goldPricePerGram
  const silverValue = silverGrams * silverPricePerGram

  const netAssets = useMemo(
    () => Math.max(cash + business + goldValue + silverValue - liabilities, 0),
    [cash, business, goldValue, silverValue, liabilities],
  )

  // Gold nisab standard is 85 grams of gold.
  const nisabThreshold = useMemo(() => 85 * goldPricePerGram, [goldPricePerGram])
  const reachedNisab = netAssets >= nisabThreshold
  const zakat = useMemo(() => (reachedNisab ? netAssets * 0.025 : 0), [netAssets, reachedNisab])

  useEffect(() => {
    window.localStorage.setItem(
      'muslimpal_zakat_estimate',
      JSON.stringify({ amount: Number(zakat.toFixed(2)), currency }),
    )
  }, [zakat, currency])

  const steps = ['Assets', 'Liabilities', 'Review']

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <section className="space-y-6">
        <header>
          <h1 className="font-serif text-3xl text-emerald-950">Purify Your Wealth</h1>
          <p className="mt-1 text-sm text-emerald-900/75">Calculate zakat across assets and liabilities in three guided steps.</p>
        </header>

        <div className="grid gap-3 rounded-2xl border border-emerald-900/15 bg-white/70 p-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs text-emerald-900/70">Currency</label>
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
              className="w-full rounded-xl border border-emerald-900/20 px-3 py-2 text-sm"
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs text-emerald-900/70">Gold Price / g ({currency})</label>
            <input
              type="number"
              value={goldPricePerGram}
              onChange={(event) => setGoldPricePerGram(Number(event.target.value || 0))}
              className="w-full rounded-xl border border-emerald-900/20 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs text-emerald-900/70">Silver Price / g ({currency})</label>
            <input
              type="number"
              value={silverPricePerGram}
              onChange={(event) => setSilverPricePerGram(Number(event.target.value || 0))}
              className="w-full rounded-xl border border-emerald-900/20 px-3 py-2 text-sm"
            />
          </div>
          <p className="md:col-span-3 text-xs text-emerald-900/65">
            {ratesLoading
              ? 'Updating FX rates...'
              : `FX base USD->${currency}: ${fxRate.toFixed(4)}. Edit metal prices for exact local market accuracy.`}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-emerald-900/15 bg-white/70 p-3">
          {steps.map((item, index) => {
            const current = index + 1
            const done = current < step
            const active = current === step
            return (
              <button
                key={item}
                onClick={() => setStep(current)}
                className={`rounded-xl px-3 py-2 text-sm transition ${
                  active ? 'bg-[#064E3B] text-white' : 'bg-emerald-50 text-emerald-900'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {done ? <Check size={14} /> : <Circle size={14} />}
                  {item}
                </span>
              </button>
            )
          })}
        </div>

        <div className="space-y-4">
          {(step === 1 || step === 3) && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-900/15 bg-white/70 p-4">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-emerald-950">
                  <Coins size={16} /> Liquid Assets
                </h3>
                <label className="mb-3 block text-xs text-emerald-900/70">Cash ({currency})</label>
                <input
                  type="number"
                  value={cash}
                  onChange={(event) => setCash(Number(event.target.value || 0))}
                  className="mb-3 w-full rounded-xl border border-emerald-900/20 px-3 py-2"
                />
                <label className="mb-3 block text-xs text-emerald-900/70">Business ({currency})</label>
                <input
                  type="number"
                  value={business}
                  onChange={(event) => setBusiness(Number(event.target.value || 0))}
                  className="w-full rounded-xl border border-emerald-900/20 px-3 py-2"
                />
              </div>

              <div className="rounded-2xl border border-emerald-900/15 bg-white/70 p-4">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-emerald-950">
                  <Scale size={16} /> Gold & Silver
                </h3>
                <label className="mb-3 block text-xs text-emerald-900/70">Gold (grams)</label>
                <input
                  type="number"
                  value={goldGrams}
                  onChange={(event) => setGoldGrams(Number(event.target.value || 0))}
                  className="mb-3 w-full rounded-xl border border-emerald-900/20 px-3 py-2"
                />
                <label className="mb-3 block text-xs text-emerald-900/70">Silver (grams)</label>
                <input
                  type="number"
                  value={silverGrams}
                  onChange={(event) => setSilverGrams(Number(event.target.value || 0))}
                  className="w-full rounded-xl border border-emerald-900/20 px-3 py-2"
                />
              </div>
            </div>
          )}

          {(step === 2 || step === 3) && (
            <div className="rounded-2xl border border-emerald-900/15 bg-white/70 p-4">
              <h3 className="mb-2 font-semibold text-emerald-950">Liabilities</h3>
              <label className="mb-3 block text-xs text-emerald-900/70">Short-term debt ({currency})</label>
              <input
                type="number"
                value={liabilities}
                onChange={(event) => setLiabilities(Number(event.target.value || 0))}
                className="w-full rounded-xl border border-emerald-900/20 px-3 py-2"
              />
            </div>
          )}
        </div>
      </section>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-emerald-900/20 bg-white/75 p-5 backdrop-blur-md shadow-sm">
          <p className="text-xs uppercase tracking-[0.12em] text-emerald-900/70">Estimated Zakat</p>
          <p className="mt-2 text-4xl font-bold text-emerald-950">{formatMoney(zakat, currency)}</p>

          <div className="mt-5 rounded-xl bg-emerald-50 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-emerald-900/70">Nisab Status</p>
            <p className={`mt-1 font-semibold ${reachedNisab ? 'text-emerald-800' : 'text-amber-700'}`}>
              {reachedNisab ? 'Reached' : 'Not Reached'}
            </p>
            <p className="mt-1 text-xs text-emerald-900/70">Threshold (85g gold): {formatMoney(nisabThreshold, currency)}</p>
          </div>
        </div>
      </aside>
    </div>
  )
}
