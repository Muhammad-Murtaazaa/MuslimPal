import { NextRequest, NextResponse } from 'next/server'

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type RateEntry = {
  windowStart: number
  count: number
  lastRequestAt: number
}

const COOLDOWN_MS = 20 * 1000
const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 20

declare global {
  // eslint-disable-next-line no-var
  var __muslimpalGroqRateStore: Map<string, RateEntry> | undefined
}

const rateStore = globalThis.__muslimpalGroqRateStore ?? new Map<string, RateEntry>()
globalThis.__muslimpalGroqRateStore = rateStore

function getClientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()

  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  return 'unknown-client'
}

function checkRateLimit(clientKey: string): { limited: false } | { limited: true; retryAfterSeconds: number; reason: string } {
  const now = Date.now()
  const existing = rateStore.get(clientKey)

  if (!existing) {
    rateStore.set(clientKey, {
      windowStart: now,
      count: 1,
      lastRequestAt: now,
    })
    return { limited: false }
  }

  if (now - existing.lastRequestAt < COOLDOWN_MS) {
    const retryAfterSeconds = Math.ceil((COOLDOWN_MS - (now - existing.lastRequestAt)) / 1000)
    return { limited: true, retryAfterSeconds, reason: 'cooldown' }
  }

  if (now - existing.windowStart >= WINDOW_MS) {
    rateStore.set(clientKey, {
      windowStart: now,
      count: 1,
      lastRequestAt: now,
    })
    return { limited: false }
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - existing.windowStart)) / 1000)
    return { limited: true, retryAfterSeconds, reason: 'window_limit' }
  }

  existing.count += 1
  existing.lastRequestAt = now
  rateStore.set(clientKey, existing)
  return { limited: false }
}

const SYSTEM_PROMPT = `You are MuslimPal Scholar AI, an educational Islamic assistant.
Rules:
1) Provide Sharia-conscious educational guidance only.
2) Do not issue definitive fatwas; recommend consulting qualified scholars for binding rulings.
3) Keep tone respectful and practical.
4) Include this disclaimer in every response: "Disclaimer: This is an AI educational tool, not a substitute for qualified scholarly advice."`

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY || ''

  if (!apiKey) {
    return NextResponse.json({ error: 'GROQ_API_KEY is not configured.' }, { status: 500 })
  }

  const clientKey = getClientKey(request)
  const limitState = checkRateLimit(clientKey)
  if (limitState.limited) {
    return NextResponse.json(
      {
        error:
          limitState.reason === 'cooldown'
            ? `Please wait ${limitState.retryAfterSeconds}s before sending another message.`
            : `Rate limit reached. Try again in ${limitState.retryAfterSeconds}s.`,
        retryAfterSeconds: limitState.retryAfterSeconds,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(limitState.retryAfterSeconds) },
      },
    )
  }

  const body = await request.json()
  const incoming = (body.messages ?? []) as ChatMessage[]

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...incoming.filter((item) => item && item.role && item.content),
  ]

  if (!messages.length) {
    return NextResponse.json({ error: 'No messages provided.' }, { status: 400 })
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.3,
      max_tokens: 850,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    return NextResponse.json({ error: text }, { status: response.status })
  }

  const data = await response.json()
  const answer = data?.choices?.[0]?.message?.content ?? 'No answer was generated.'

  return NextResponse.json({ answer })
}
