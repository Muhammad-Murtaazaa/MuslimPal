'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Link2, Search } from 'lucide-react'
import ScholarlyInsightCard from '@/components/cards/ScholarlyInsightCard'

type ScholarResult = {
  answer: string
  takeaways: string[]
  sources: { title: string; href: string }[]
}

function parseTakeaways(answer: string) {
  const candidate = answer
    .split('\n')
    .map((line) => line.replace(/^[-*\d.\s]+/, '').trim())
    .filter((line) => line.length > 0)

  return candidate.slice(0, 4)
}

function extractSources(answer: string) {
  const byUrl = new Map<string, { title: string; href: string }>()

  const markdownLinks = Array.from(answer.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi))
  for (const match of markdownLinks) {
    const title = match[1].trim()
    const href = match[2].trim()
    if (!byUrl.has(href)) byUrl.set(href, { title, href })
  }

  const plainUrls = answer.match(/https?:\/\/[^\s)]+/gi) ?? []
  for (const href of plainUrls) {
    if (byUrl.has(href)) continue
    try {
      const hostname = new URL(href).hostname.replace(/^www\./, '')
      byUrl.set(href, { title: hostname, href })
    } catch {
      // Ignore invalid URLs from model output.
    }
  }

  return Array.from(byUrl.values()).slice(0, 6)
}

export default function ScholarView() {
  const [query, setQuery] = useState('What are practical steps to improve khushu in salah?')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [result, setResult] = useState<ScholarResult | null>(null)

  useEffect(() => {
    if (cooldownSeconds <= 0) return
    const timer = window.setInterval(() => {
      setCooldownSeconds((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [cooldownSeconds])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!query.trim() || loading || cooldownSeconds > 0) return

    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: query }],
          context: 'scholar',
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: 'Service unavailable' }))
        const retryAfter = Number(payload?.retryAfterSeconds)
        if (response.status === 429 && Number.isFinite(retryAfter) && retryAfter > 0) {
          setCooldownSeconds(Math.ceil(retryAfter))
        }
        throw new Error(payload.error || 'Service unavailable')
      }

      const data = await response.json()
      setResult({
        answer: data.answer,
        takeaways: parseTakeaways(data.answer),
        sources: extractSources(data.answer),
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Service unavailable'
      setError(message)
      setResult({
        answer:
          'I could not retrieve a live answer right now. Please retry. This tool is educational and does not replace qualified scholarly counsel.',
        takeaways: [
          'Review the question with local scholars when possible.',
          'Use authentic sources and compare evidences.',
          'Treat AI output as a learning aid, not binding rulings.',
        ],
        sources: [],
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
      <section className="space-y-5">
        <form onSubmit={submit} className="rounded-2xl border border-emerald-900/15 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-pal-sage/25 dark:bg-pal-surface/85">
          <label className="mb-3 block text-xs uppercase tracking-[0.12em] text-emerald-900/70 dark:text-pal-gold">AI Scholar Query</label>
          <div className="group flex items-center rounded-2xl border border-emerald-900/20 bg-[#FCFCF9] px-3 transition-all focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/25 dark:border-pal-sage/35 dark:bg-pal-bg/55 dark:focus-within:border-pal-gold dark:focus-within:ring-pal-gold/35">
            <Search size={18} className="text-emerald-700 dark:text-pal-gold" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent px-3 py-3 text-sm text-emerald-950 outline-none placeholder:text-emerald-900/45 dark:text-white dark:placeholder:text-white/50"
              placeholder="Ask your scholarly question"
            />
            <button
              type="submit"
              disabled={loading || cooldownSeconds > 0}
              className="pal-btn-primary px-4 py-2 text-sm disabled:opacity-60"
            >
              {loading ? 'Thinking...' : cooldownSeconds > 0 ? `Wait ${cooldownSeconds}s` : 'Analyze'}
            </button>
          </div>
          <div className="pointer-events-none mt-2 h-1 w-full rounded bg-gradient-to-r from-transparent via-[#0F766E]/60 to-transparent opacity-0 transition duration-300 group-focus-within:opacity-100 dark:via-pal-gold/65" />
          {error ? <p className="mt-2 text-xs text-amber-700">{error}</p> : null}
        </form>

        {result ? (
          <ScholarlyInsightCard
            title="Scholarly Insight"
            answer={result.answer}
            takeaways={result.takeaways.length ? result.takeaways : ['No key takeaways were generated.']}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-emerald-900/20 bg-white/60 p-8 text-center text-sm text-emerald-900/70 dark:border-pal-sage/25 dark:bg-pal-surface/75 dark:text-white/85">
            Submit a question to generate scholarly insights and takeaways.
          </div>
        )}
      </section>

      <aside className="space-y-4 rounded-2xl border border-emerald-900/15 bg-white/70 p-4 backdrop-blur-md dark:border-pal-sage/25 dark:bg-pal-surface/85">
        <h2 className="font-serif text-xl text-emerald-950 dark:text-pal-gold">Referenced Sources</h2>
        {result?.sources?.length ? (
          result.sources.map((source) => (
            <article key={source.href} className="rounded-xl border border-emerald-900/10 bg-emerald-50/40 p-3 dark:border-pal-sage/25 dark:bg-pal-bg/50">
              <p className="font-medium text-emerald-950 dark:text-pal-gold">{source.title}</p>
              <a
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] hover:text-[#064E3B] dark:text-pal-gold dark:hover:text-gold-100"
              >
                <Link2 size={14} /> Open Source
              </a>
            </article>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-emerald-900/20 bg-emerald-50/30 p-3 text-xs text-emerald-900/75 dark:border-pal-sage/25 dark:bg-pal-bg/45 dark:text-white/80">
            No source links are available yet. When the AI response includes URLs, they will appear here automatically.
          </p>
        )}
      </aside>
    </div>
  )
}
