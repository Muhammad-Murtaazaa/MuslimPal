// src/utils/api.ts
import axios from 'axios';

// Optional: set NEXT_PUBLIC_APP_URL to call APIs from a specific base URL.
// If omitted, relative URLs are used.
const APP_BASE = process.env.NEXT_PUBLIC_APP_URL ?? '';

// Fetch all Surahs — AlQuran Cloud (proxied by internal route)
export const fetchSurahs = async () => {
  const response = await axios.get(`${APP_BASE}/api/surahs`);
  // Handle both error responses and successful responses
  if (response.status >= 400) {
    throw new Error(`API error: ${response.status}`);
  }
  if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
    throw new Error('No surahs data received from API');
  }
  return response.data;
};

// Fetch a specific Surah — AlQuran Cloud (proxied by internal route)
export const fetchSurah = async (surahNumber: number, audioEdition?: string) => {
  const query = audioEdition ? `?audioEdition=${encodeURIComponent(audioEdition)}` : '';
  const response = await axios.get(`${APP_BASE}/api/surah/${surahNumber}${query}`);
  return response.data;
};

// Fetch reciters — AlQuran Cloud audio editions
// Returns { [identifier]: { name, edition } }
export const fetchReciters = async (): Promise<Record<string, { name: string; edition: string }>> => {
  const response = await axios.get(`${APP_BASE}/api/reciters`);
  return response.data;
};

// Page-based Quran reading (Madina Mushaf, 604 pages)
export type QuranPageAyah = {
  number: number;       // global ayah number
  text: string;         // Uthmani Arabic text
  numberInSurah: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
  };
};

export type QuranPageData = {
  pageNumber: number;
  ayahs: QuranPageAyah[];
};

export const fetchQuranPage = async (pageNumber: number): Promise<QuranPageData> => {
  const response = await axios.get(`https://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani`);
  const data = response.data.data;
  return {
    pageNumber: data.number,
    ayahs: data.ayahs.map((a: any) => ({
      number: a.number,
      text: a.text,
      numberInSurah: a.numberInSurah,
      surah: {
        number: a.surah.number,
        name: a.surah.name,
        englishName: a.surah.englishName,
        englishNameTranslation: a.surah.englishNameTranslation,
        numberOfAyahs: a.surah.numberOfAyahs,
      },
    })),
  };
};

export type AyahSearchMatch = {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
};

export const searchAyahs = async (query: string): Promise<AyahSearchMatch[]> => {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // Supports both text query and ayah references through AlQuran Cloud search API.
  const response = await axios.get(
    `https://api.alquran.cloud/v1/search/${encodeURIComponent(trimmed)}/all/en`
  );

  const matches = response?.data?.data?.matches ?? [];
  return matches.slice(0, 20).map((m: any) => ({
    surahNumber: m.surah.number,
    surahName: m.surah.englishName,
    ayahNumber: m.numberInSurah,
    text: m.text,
  }));
};
