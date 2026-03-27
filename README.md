# MuslimPal

MuslimPal is a modern, web-first Islamic utility platform built with Next.js App Router.
It combines Quran reading and recitation, prayer and qibla tools, AI Scholar assistance,
zakat estimation, Hijri calendar tools, bookmarks, and daily duas/zikr in one clean experience.

## Table of Contents

- Overview
- Core Features
- Tech Stack
- Project Structure
- Routes
- API Endpoints
- External Data Sources
- Environment Variables
- Local Development
- Build and Run
- Deployment Notes
- Troubleshooting
- Security and Privacy Notes
- Developer
- License

## Overview

MuslimPal is designed for practical daily use:

- Read Quran by surah or page
- Search surahs and ayahs
- Listen to recitation editions
- View prayer times and qibla direction based on location
- Calculate zakat with currency handling
- Ask AI Scholar questions with a Sharia-conscious educational prompt
- View current Hijri date and browse monthly Hijri/Gregorian calendar mapping
- Browse daily duas and zikr with references

The application is currently web-only.

## Core Features

### 1. Dashboard

- Upcoming prayer and live countdown
- Location-aware qibla bearing widget
- Current Hijri date widget
- Clickable quick-access cards that open each related feature page in the same tab

### 2. Quran Reader

- Surah list and detail pages
- Meccan/Medinan filtering
- Ayah and surah search
- Recitation edition selection

### 3. Prayer Times and Qibla

- Prayer calculations from local coordinates
- Qibla bearing and cardinal direction
- Permission-aware location UX

### 4. AI Scholar

- Uses Groq chat completions via server route
- Enforced educational disclaimer and constraints
- Request cooldown and rate-limit safeguards on server + client
- Source link extraction on scholar UI where applicable

### 5. Zakat

- Zakat estimate flow with persisted values
- Currency-aware behavior

### 6. Dua Collection

- Daily duas and zikr entries
- Arabic text, transliteration, translation
- Reference/authenticity labels
- Search/filter + completion tracking utilities

### 7. Bookmarks

- Local bookmark persistence using browser localStorage
- Sync support via browser BroadcastChannel

### 8. Hijri Calendar

- Current Islamic date card for the dashboard
- Full monthly Hijri calendar view with Gregorian mapping
- Powered by Aladhan calendar conversion API via app proxy

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide + React Icons |
| Client Data | localStorage |
| HTTP | axios + native fetch |

## Project Structure

```text
src/
	app/
		page.tsx                    # Home/dashboard route
		about/                      # About page
		privacy/                    # Privacy page
		terms/                      # Terms page
		scholar/                    # AI Scholar page
		zakat/                      # Zakat page
		dua/                        # Dua collection page
		hijri-calendar/             # Hijri calendar page
		read/                       # Quran reader routes
		pray-times-master/          # Prayer + qibla page
		bookmarks/                  # Bookmarks page
		api/
			groq/route.ts             # AI backend proxy
			hijri/route.ts            # Hijri date/calendar proxy
			surahs/route.ts           # Surah list proxy
			surah/[id]/route.ts       # Surah detail/audio proxy
			reciters/route.ts         # Reciter editions proxy
	components/                   # Shared UI components
	pages/                        # Feature page views used by app routes
	lib/                          # Prayer and qibla calculation logic
	utils/                        # API helpers and bookmark storage helpers
	data/                         # Static app data (e.g., duas)
```

## Routes

### User-facing pages

- `/` Dashboard
- `/about`
- `/privacy`
- `/terms`
- `/scholar`
- `/zakat`
- `/dua`
- `/hijri-calendar`
- `/read`
- `/read/[pageNumber]`
- `/surah/[surahNumber]`
- `/pray-times-master`
- `/bookmarks`

### API routes

- `POST /api/groq`
- `GET /api/hijri`
- `GET /api/surahs`
- `GET /api/surah/:id`
- `GET /api/reciters`

## API Endpoints

### `POST /api/groq`

Server-side AI endpoint that:

- Validates `GROQ_API_KEY`
- Prepends a MuslimPal system prompt
- Enforces per-client cooldown and window-based request limits
- Calls Groq chat completions
- Returns `{ answer }` on success or cooldown metadata on rate-limited requests

### `GET /api/hijri`

- Returns current Hijri date information and monthly calendar conversion data
- Supports `month` and `year` query params
- Source: Aladhan API

### `GET /api/surahs`

- Proxies and normalizes surah list data
- Source: AlQuran Cloud
- Cached with revalidate window in route

### `GET /api/surah/:id`

- Returns surah metadata, Arabic ayahs, English translation, and optional ayah audio URLs
- Supports `audioEdition` query param
- Source: AlQuran Cloud

### `GET /api/reciters`

- Returns Arabic audio editions suitable for recitation selection
- Source: AlQuran Cloud edition endpoint

## External Data Sources

- AlQuran Cloud: Quran text, translations, recitation editions
- Groq: AI Scholar response generation
- Aladhan: Hijri date and monthly calendar conversion data
- Exchange rate provider used in zakat flow (client-side logic)

## Environment Variables

Create `.env.local` from `.env.example`.

### Required

- `GROQ_API_KEY`
	- Used by: `POST /api/groq`

### Optional

- `NEXT_PUBLIC_APP_URL`
	- Purpose: force API base URL for frontend helper calls
	- If omitted, app uses relative URLs

## Local Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
npm install
cp .env.example .env.local
```

Update `.env.local` with your actual values.

### Start dev server

```bash
npm run dev
```

Default local URL: `http://localhost:3000`

## Build and Run

### Production build

```bash
npm run build
```

### Start production server

```bash
npm run start
```

### Lint

```bash
npm run lint
```

## Deployment Notes

- App is configured for modern Next.js deployment targets
- Ensure `GROQ_API_KEY` is configured in deployment environment
- `NEXT_PUBLIC_APP_URL` is optional and usually not needed unless forcing absolute API base URLs

## Troubleshooting

### 1. AI Scholar returns configuration error

Check that `GROQ_API_KEY` is present and valid in environment variables.

### 2. Qibla or prayer data appears fallback-based

Allow browser location access for best accuracy.

### 3. AI requests temporarily blocked

If you hit cooldown/rate limits, wait for the retry time shown in the scholar UI and try again.

### 4. No reciter audio appears

Check internet connectivity and AlQuran Cloud availability.

### 5. Hijri calendar not loading

Check internet connectivity and Aladhan API availability.

### 6. Stale local settings/bookmarks

Clear site localStorage for a hard reset.

## Security and Privacy Notes

- Core app usage does not require user account signup
- Bookmarks and preference data are stored locally in browser storage
- Avoid entering highly sensitive personal information in AI prompts

## Developer

- Muhammad Murtaza
- GitHub: https://github.com/Muhammad-Murtaazaa
- LinkedIn: https://www.linkedin.com/in/muhammad-murtaza-577381327/
- Portfolio: https://muhammadmurtaza.netlify.app/

## License

MIT
