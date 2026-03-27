/*
  Adapted from PrayTimes.js (ver 2.3)
  Original Copyright (C) 2007-2011 PrayTimes.org
  Developer: Hamid Zarrabi-Zadeh
  License: GNU LGPL v3.0
*/

type Method = 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Tehran' | 'Jafari'

type MethodParams = {
  fajr: number
  isha: number | string
  maghrib?: number | string
  midnight?: 'Standard' | 'Jafari'
}

type Times = {
  imsak: number
  fajr: number
  sunrise: number
  dhuhr: number
  asr: number
  sunset: number
  maghrib: number
  isha: number
  midnight?: number
}

const METHODS: Record<Method, MethodParams> = {
  MWL: { fajr: 18, isha: 17 },
  ISNA: { fajr: 15, isha: 15 },
  Egypt: { fajr: 19.5, isha: 17.5 },
  Makkah: { fajr: 18.5, isha: '90 min' },
  Karachi: { fajr: 18, isha: 18 },
  Tehran: { fajr: 17.7, isha: 14, maghrib: 4.5, midnight: 'Jafari' },
  Jafari: { fajr: 16, isha: 14, maghrib: 4, midnight: 'Jafari' },
}

const DEFAULTS = {
  imsak: '10 min',
  dhuhr: '0 min',
  asr: 'Standard' as const,
  highLats: 'NightMiddle' as const,
  maghrib: '0 min',
  midnight: 'Standard' as const,
}

const DMath = {
  dtr: (d: number) => (d * Math.PI) / 180,
  rtd: (r: number) => (r * 180) / Math.PI,
  sin: (d: number) => Math.sin((d * Math.PI) / 180),
  cos: (d: number) => Math.cos((d * Math.PI) / 180),
  tan: (d: number) => Math.tan((d * Math.PI) / 180),
  arcsin: (d: number) => (180 * Math.asin(d)) / Math.PI,
  arccos: (d: number) => (180 * Math.acos(d)) / Math.PI,
  arctan2: (y: number, x: number) => (180 * Math.atan2(y, x)) / Math.PI,
  arccot: (x: number) => (180 * Math.atan(1 / x)) / Math.PI,
  fix: (a: number, b: number) => {
    const v = a - b * Math.floor(a / b)
    return v < 0 ? v + b : v
  },
  fixHour: (a: number) => {
    const v = a - 24 * Math.floor(a / 24)
    return v < 0 ? v + 24 : v
  },
  fixAngle: (a: number) => {
    const v = a - 360 * Math.floor(a / 360)
    return v < 0 ? v + 360 : v
  },
}

function evalParam(value: number | string): number {
  if (typeof value === 'number') return value
  return Number((value + '').split(/[^0-9.+-]/)[0])
}

function isMin(value: number | string): boolean {
  return (value + '').includes('min')
}

function julian(year: number, month: number, day: number): number {
  let y = year
  let m = month
  if (m <= 2) {
    y -= 1
    m += 12
  }
  const a = Math.floor(y / 100)
  const b = 2 - a + Math.floor(a / 4)
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5
}

function sunPosition(jd: number) {
  const d = jd - 2451545.0
  const g = DMath.fixAngle(357.529 + 0.98560028 * d)
  const q = DMath.fixAngle(280.459 + 0.98564736 * d)
  const l = DMath.fixAngle(q + 1.915 * DMath.sin(g) + 0.02 * DMath.sin(2 * g))
  const e = 23.439 - 0.00000036 * d
  const ra = DMath.arctan2(DMath.cos(e) * DMath.sin(l), DMath.cos(l)) / 15
  const eqt = q / 15 - DMath.fixHour(ra)
  const decl = DMath.arcsin(DMath.sin(e) * DMath.sin(l))
  return { declination: decl, equation: eqt }
}

function getTimezoneOffsetHours(date: Date): number {
  return -date.getTimezoneOffset() / 60
}

function to12h(time: number): string {
  const fixed = DMath.fixHour(time + 0.5 / 60)
  const hours = Math.floor(fixed)
  const minutes = Math.floor((fixed - hours) * 60)
  const suffix = hours < 12 ? 'AM' : 'PM'
  const hour12 = ((hours + 11) % 12) + 1
  return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${suffix}`
}

export type PrayerTimesResult = {
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
}

export function calculatePrayerTimes(
  date: Date,
  latitude: number,
  longitude: number,
  method: Method = 'Makkah',
): PrayerTimesResult {
  const params = { ...DEFAULTS, ...METHODS[method] }
  const tz = getTimezoneOffsetHours(date)
  const jd = julian(date.getFullYear(), date.getMonth() + 1, date.getDate()) - longitude / (15 * 24)

  const midDay = (t: number) => DMath.fixHour(12 - sunPosition(jd + t).equation)

  const sunAngleTime = (angle: number, t: number, ccw = false) => {
    const decl = sunPosition(jd + t).declination
    const noon = midDay(t)
    const x =
      (-DMath.sin(angle) - DMath.sin(decl) * DMath.sin(latitude)) /
      (DMath.cos(decl) * DMath.cos(latitude))
    const arc = (1 / 15) * DMath.arccos(x)
    return noon + (ccw ? -arc : arc)
  }

  const asrTime = (factor: number, t: number) => {
    const decl = sunPosition(jd + t).declination
    const angle = -DMath.arccot(factor + DMath.tan(Math.abs(latitude - decl)))
    return sunAngleTime(angle, t)
  }

  const riseSetAngle = 0.833

  let times: Times = {
    imsak: 5,
    fajr: 5,
    sunrise: 6,
    dhuhr: 12,
    asr: 13,
    sunset: 18,
    maghrib: 18,
    isha: 18,
  }

  const dayPortion = (v: Times): Times => ({
    imsak: v.imsak / 24,
    fajr: v.fajr / 24,
    sunrise: v.sunrise / 24,
    dhuhr: v.dhuhr / 24,
    asr: v.asr / 24,
    sunset: v.sunset / 24,
    maghrib: v.maghrib / 24,
    isha: v.isha / 24,
  })

  const tp = dayPortion(times)
  times = {
    imsak: sunAngleTime(evalParam(params.imsak), tp.imsak, true),
    fajr: sunAngleTime(evalParam(params.fajr), tp.fajr, true),
    sunrise: sunAngleTime(riseSetAngle, tp.sunrise, true),
    dhuhr: midDay(tp.dhuhr),
    asr: asrTime(1, tp.asr),
    sunset: sunAngleTime(riseSetAngle, tp.sunset),
    maghrib: sunAngleTime(evalParam(params.maghrib), tp.maghrib),
    isha: sunAngleTime(evalParam(params.isha), tp.isha),
  }

  for (const key of Object.keys(times) as Array<keyof Times>) {
    times[key] += tz - longitude / 15
  }

  if (isMin(params.imsak)) times.imsak = times.fajr - evalParam(params.imsak) / 60
  if (isMin(params.maghrib)) times.maghrib = times.sunset + evalParam(params.maghrib) / 60
  if (isMin(params.isha)) times.isha = times.maghrib + evalParam(params.isha) / 60
  times.dhuhr += evalParam(params.dhuhr) / 60

  return {
    fajr: to12h(times.fajr),
    sunrise: to12h(times.sunrise),
    dhuhr: to12h(times.dhuhr),
    asr: to12h(times.asr),
    maghrib: to12h(times.maghrib),
    isha: to12h(times.isha),
  }
}

export function calculateQiblaBearing(latitude: number, longitude: number): number {
  const kaabaLat = DMath.dtr(21.4225)
  const kaabaLon = DMath.dtr(39.8262)
  const lat = DMath.dtr(latitude)
  const lon = DMath.dtr(longitude)

  const dLon = kaabaLon - lon
  const y = Math.sin(dLon)
  const x = Math.cos(lat) * Math.tan(kaabaLat) - Math.sin(lat) * Math.cos(dLon)
  const theta = Math.atan2(y, x)
  const bearing = (DMath.rtd(theta) + 360) % 360
  return Number(bearing.toFixed(1))
}

export function cardinalDirection(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const idx = Math.round(degrees / 22.5) % 16
  return dirs[idx]
}
