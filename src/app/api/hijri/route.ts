import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type AladhanCalendarDay = {
  hijri?: {
    date?: string
    day?: string
    month?: { number?: number; en?: string; ar?: string }
    year?: string
    holidays?: string[]
  }
  gregorian?: {
    date?: string
    day?: string
    month?: { number?: number; en?: string }
    year?: string
    weekday?: { en?: string }
  }
}

export async function GET(request: NextRequest) {
  const now = new Date()
  const month = Number(request.nextUrl.searchParams.get('month') ?? now.getMonth() + 1)
  const year = Number(request.nextUrl.searchParams.get('year') ?? now.getFullYear())

  if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year) || year < 1900 || year > 2100) {
    return NextResponse.json({ error: 'Invalid month or year' }, { status: 400 })
  }

  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = String(now.getFullYear())
  const todayDate = `${dd}-${mm}-${yyyy}`

  try {
    const [todayRes, monthRes] = await Promise.all([
      fetch(`https://api.aladhan.com/v1/gToH?date=${todayDate}`),
      fetch(`https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`),
    ])

    if (!todayRes.ok || !monthRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch Hijri calendar data' }, { status: 502 })
    }

    const todayPayload = await todayRes.json()
    const monthPayload = await monthRes.json()

    const today = todayPayload?.data ?? null
    const days: AladhanCalendarDay[] = monthPayload?.data ?? []

    const calendarDays = days.map((item) => ({
      gregorian: {
        date: item.gregorian?.date ?? '',
        day: Number(item.gregorian?.day ?? 0),
        month: item.gregorian?.month?.en ?? '',
        monthNumber: Number(item.gregorian?.month?.number ?? 0),
        year: Number(item.gregorian?.year ?? 0),
        weekday: item.gregorian?.weekday?.en ?? '',
      },
      hijri: {
        date: item.hijri?.date ?? '',
        day: Number(item.hijri?.day ?? 0),
        month: item.hijri?.month?.en ?? '',
        monthArabic: item.hijri?.month?.ar ?? '',
        monthNumber: Number(item.hijri?.month?.number ?? 0),
        year: Number(item.hijri?.year ?? 0),
        holidays: item.hijri?.holidays ?? [],
      },
    }))

    return NextResponse.json({
      currentHijri: today
        ? {
            date: today.hijri?.date ?? '',
            day: Number(today.hijri?.day ?? 0),
            month: today.hijri?.month?.en ?? '',
            monthArabic: today.hijri?.month?.ar ?? '',
            year: Number(today.hijri?.year ?? 0),
            weekday: today.gregorian?.weekday?.en ?? '',
            gregorianDate: today.gregorian?.date ?? '',
          }
        : null,
      calendar: calendarDays,
      requested: { month, year },
    })
  } catch (error) {
    console.error('[/api/hijri]', error)
    return NextResponse.json({ error: 'Unexpected Hijri API error' }, { status: 500 })
  }
}
