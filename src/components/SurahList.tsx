'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchSurahs, searchAyahs, AyahSearchMatch } from '../utils/api';

const SurahList = () => {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [revelationFilter, setRevelationFilter] = useState<'All' | 'Meccan' | 'Madani'>('All');
  const [ayahSearch, setAyahSearch] = useState('');
  const [ayahMatches, setAyahMatches] = useState<AyahSearchMatch[]>([]);
  const [isSearchingAyah, setIsSearchingAyah] = useState(false);
  const [ayahSearchError, setAyahSearchError] = useState('');

  useEffect(() => {
    const loadSurahs = async () => {
      const data = await fetchSurahs();
      setSurahs(data);
    };
    loadSurahs();
  }, []);

  const filteredSurahs = surahs.filter((surah) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      surah.surahName.toLowerCase().includes(searchLower) ||
      surah.surahNameArabic.includes(searchTerm) ||
      surah.surahNameTranslation.toLowerCase().includes(searchLower) ||
      surah.number.toString().includes(searchTerm);
    const matchesRevelation =
      revelationFilter === 'All' ||
      (revelationFilter === 'Madani' ? surah.revelationType === 'Medinan' : surah.revelationType === revelationFilter);
    return matchesSearch && matchesRevelation;
  });

  const handleAyahSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ayahSearch.trim()) {
      setAyahMatches([]);
      return;
    }

    setIsSearchingAyah(true);
    setAyahSearchError('');
    try {
      const data = await searchAyahs(ayahSearch);
      setAyahMatches(data);
    } catch {
      setAyahSearchError('Unable to search ayat right now. Please try again.');
      setAyahMatches([]);
    } finally {
      setIsSearchingAyah(false);
    }
  };

  const lastReadPage = typeof window !== 'undefined' ? localStorage.getItem('lastReadPage') : null;
  const continuePage = Number(lastReadPage || '1');

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold dark:text-gray-100">Quran Reader</h1>
        <div className="flex gap-2">
          <Link
            href={`/read/${continuePage >= 1 && continuePage <= 604 ? continuePage : 1}`}
            className="rounded-xl bg-[#064E3B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
          >
            Continue by Page
          </Link>
          <Link
            href="/read/1"
            className="rounded-xl border border-emerald-900/20 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
          >
            Start Page 1
          </Link>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-emerald-900/15 bg-white/70 p-4 backdrop-blur-md">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-900/70">Search Ayat</h2>
        <form onSubmit={handleAyahSearch} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="Search ayah text or reference (example: Allah or 2:255)"
            className="w-full rounded-xl border border-gray-200 bg-white p-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            value={ayahSearch}
            onChange={(e) => setAyahSearch(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-xl bg-[#064E3B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
          >
            {isSearchingAyah ? 'Searching...' : 'Search'}
          </button>
        </form>

        {ayahSearchError ? <p className="mt-2 text-xs text-amber-700">{ayahSearchError}</p> : null}

        {ayahMatches.length > 0 && (
          <div className="mt-4 space-y-2">
            {ayahMatches.map((match, idx) => (
              <Link
                key={`${match.surahNumber}:${match.ayahNumber}:${idx}`}
                href={`/surah/${match.surahNumber}`}
                className="block rounded-xl border border-emerald-900/10 bg-emerald-50/50 p-3 transition hover:bg-emerald-100/50"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-emerald-800">
                  Surah {match.surahName} - Ayah {match.ayahNumber}
                </p>
                <p className="mt-1 text-sm text-emerald-950/85 line-clamp-2">{match.text}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <h2 className="mb-2 text-lg font-semibold text-emerald-950">All Surah Cards</h2>
      <div className="mb-6 flex flex-col gap-3">
        <input
          type="text"
          placeholder="Search surahs..."
          className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-gold-500 dark:focus:ring-gold-400
            shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          {(['All', 'Meccan', 'Madani'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setRevelationFilter(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                revelationFilter === type
                  ? type === 'Meccan'
                    ? 'bg-amber-500 dark:bg-amber-600 text-white'
                    : type === 'Madani'
                    ? 'bg-teal-500 dark:bg-teal-600 text-white'
                    : 'bg-gold-500 text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSurahs.map((surah) => (
          <Link key={surah.number} href={`/surah/${surah.number}`}>
            <div className="
              bg-white dark:bg-gray-800
              rounded-xl shadow-md hover:shadow-lg
              transition-all duration-200 hover:-translate-y-0.5
              p-4 flex flex-col gap-2
              border border-gray-100 dark:border-gray-700
              cursor-pointer h-full
            ">
              {/* Top row: number badge + revelation type */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full
                  bg-gold-100 dark:bg-gold-900 text-gold-700 dark:text-gold-300
                  text-sm font-bold">
                  {surah.number}
                </span>
                {surah.revelationType && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    surah.revelationType === 'Meccan'
                      ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                      : 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300'
                  }`}>
                    {surah.revelationType}
                  </span>
                )}
              </div>

              {/* Arabic name */}
              <p className="text-2xl font-arabic text-right text-gray-800 dark:text-gray-100 leading-loose">
                {surah.surahNameArabic}
              </p>

              {/* English name + translation */}
              <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
                {surah.surahName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                {surah.surahNameTranslation}
              </p>

              {/* Verse count */}
              {surah.numberOfAyahs && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-auto">
                  {surah.numberOfAyahs} verses
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SurahList;
