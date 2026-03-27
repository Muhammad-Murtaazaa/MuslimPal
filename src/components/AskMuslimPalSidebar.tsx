'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink, MessageCircle, Send } from 'lucide-react'
import GlassCard from './cards/GlassCard'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type AskMuslimPalSidebarProps = {
  fullPage?: boolean
}

export default function AskMuslimPalSidebar({ fullPage = false }: AskMuslimPalSidebarProps) {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Assalamu alaikum. I can help with Islamic learning topics and practical worship guidance in a Sharia-conscious educational format.',
    },
  ])

  const placeholder = useMemo(() => 'Ask about prayer, zakat, adab, fiqh basics...', [])

  useEffect(() => {
    if (cooldownSeconds <= 0) return
    const timer = window.setInterval(() => {
      setCooldownSeconds((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [cooldownSeconds])

  const openFullWindow = () => {
    router.push('/scholar')
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!input.trim() || loading || cooldownSeconds > 0) return
    setError('')

    const nextUser = { role: 'user' as const, content: input.trim() }
    const nextMessages = [...messages, nextUser]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, context: 'chat' }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: 'Unable to reach MuslimPal AI service.' }))
        const retryAfter = Number(payload?.retryAfterSeconds)
        if (response.status === 429 && Number.isFinite(retryAfter) && retryAfter > 0) {
          setCooldownSeconds(Math.ceil(retryAfter))
        }
        throw new Error(payload.error || 'Unable to reach MuslimPal AI service.')
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer || 'No response generated.' }])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'I could not connect right now.'
      setError(message)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I could not connect right now. Please try again shortly. Reminder: this assistant is an educational AI and not a fatwa authority.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard
      title="Ask MuslimPal"
      icon={<MessageCircle className="text-emerald-800 dark:text-pal-gold" size={18} />}
      className={fullPage ? '' : 'sticky top-24'}
    >
      <div className={`${fullPage ? 'max-h-[65vh]' : 'max-h-[360px]'} space-y-3 overflow-y-auto pr-1`}>
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-2xl px-3 py-2 text-sm leading-6 ${
              message.role === 'assistant'
                ? 'bg-emerald-50 text-emerald-900 dark:bg-pal-bg/50 dark:text-white/90'
                : 'bg-[#064E3B] text-white'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>

      {!fullPage && (
        <button
          type="button"
          onClick={openFullWindow}
          className="pal-btn-ghost mt-3 inline-flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-[0.1em] text-emerald-900 dark:text-pal-gold"
        >
          <ExternalLink size={14} /> Open AI Scholar
        </button>
      )}

      <form className="mt-4 flex gap-2" onSubmit={submit}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              void submit(event as unknown as FormEvent<HTMLFormElement>)
            }
          }}
          className="w-full rounded-xl border border-emerald-900/20 bg-white/80 px-3 py-2 text-sm text-emerald-950 outline-none transition placeholder:text-emerald-900/45 focus:border-[#0F766E] dark:border-pal-sage/35 dark:bg-pal-bg/55 dark:text-white dark:placeholder:text-white/50 dark:focus:border-pal-gold"
          placeholder={placeholder}
        />
        <button
          type="submit"
          disabled={loading || cooldownSeconds > 0}
          className="pal-btn-primary inline-flex items-center justify-center px-3 text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {cooldownSeconds > 0 ? <span className="text-xs font-semibold">{cooldownSeconds}s</span> : <Send size={16} />}
        </button>
      </form>
      {error ? <p className="mt-2 text-xs text-amber-700">{error}</p> : null}
    </GlassCard>
  )
}
