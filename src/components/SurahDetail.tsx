'use client'

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchReciters, fetchSurah } from '../utils/api';
import CustomAudioPlayer, { AudioPlayerRef } from './AudioPlayer';
import {
  FaArrowLeft,
  FaBookOpen,
  FaBookmark,
  FaCog,
  FaList,
  FaPause,
  FaPlay,
  FaRegBookmark,
  FaSearch,
  FaTimes,
} from 'react-icons/fa';
import { addBookmark, getBookmarks, removeBookmark as removeBookmarkDB } from '../utils/bookmarksStorage';
import { bookmarkChannel } from '../utils/sync';

import '../css/surah.css';

type SurahPayload = {
  surahNo: number;
  surahName: string;
  surahNameArabic: string;
  surahNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  arabic1: string[];
  english: string[];
  ayahAudio: Array<string | null>;
};

const SurahDetail = () => {
  const params = useParams<{ surahNumber: string }>();
  const surahNumber = params?.surahNumber;
  const router = useRouter();

  const [surah, setSurah] = useState<SurahPayload | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [reciters, setReciters] = useState<Record<string, { name: string; edition: string }>>({});
  const [selectedReciter, setSelectedReciter] = useState<string>('');
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState<number>(4);
  const [repeatCount, setRepeatCount] = useState<number>(1);
  const [currentRepeat, setCurrentRepeat] = useState<number>(0);
  const [reciterSearch, setReciterSearch] = useState('');
  const [readingMode, setReadingMode] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const chapterAudioPlayerRef = useRef<AudioPlayerRef>(null);

  const filteredReciters = Object.entries(reciters).filter(([, { name }]) =>
    name.toLowerCase().includes(reciterSearch.toLowerCase())
  );

  const reloadBookmarks = async () => {
    const data = await getBookmarks();
    setBookmarks(new Set(data.map((b) => b.verse_id)));
  };

  useEffect(() => {
    void reloadBookmarks();
  }, [surahNumber]);

  useEffect(() => {
    const handleVisibility = async () => {
      if (document.visibilityState === 'visible') {
        await reloadBookmarks();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    const listener = async (msg: MessageEvent) => {
      if (msg.data === 'BOOKMARKS_UPDATED') {
        await reloadBookmarks();
      }
    };

    bookmarkChannel.addEventListener('message', listener);
    return () => bookmarkChannel.removeEventListener('message', listener);
  }, []);

  const toggleBookmark = async (verseId: string) => {
    if (bookmarks.has(verseId)) {
      await removeBookmarkDB(verseId);
      const updated = new Set(bookmarks);
      updated.delete(verseId);
      setBookmarks(updated);
    } else {
      await addBookmark({
        id: verseId,
        verse_id: verseId,
        created_at: new Date().toISOString(),
      });
      const updated = new Set(bookmarks);
      updated.add(verseId);
      setBookmarks(updated);
    }

    bookmarkChannel.postMessage('BOOKMARKS_UPDATED');
  };

  const stopAllAudio = () => {
    chapterAudioPlayerRef.current?.clearSegment();
    chapterAudioPlayerRef.current?.pause();
    setIsPlaying(false);
    setCurrentVerseIndex(null);
    setCurrentRepeat(0);
  };

  const loadSurah = async (edition: string) => {
    if (!surahNumber) return;
    try {
      setLoadError(null);
      const surahData = await fetchSurah(Number(surahNumber), edition);
      if (!surahData || !surahData.arabic1) {
        throw new Error('Invalid surah data structure');
      }
      setSurah(surahData);
      stopAllAudio();
    } catch (error) {
      console.error('Error loading Surah:', error);
      setLoadError(`Failed to load surah: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSurah(null);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const reciterList = await fetchReciters();
        setReciters(reciterList);

        const defaultReciter = Object.keys(reciterList)[0] ?? '';
        if (defaultReciter) {
          setSelectedReciter(defaultReciter);
          await loadSurah(defaultReciter);
        }
      } catch (error) {
        console.error('Error loading Surah:', error);
      }
    };

    void loadData();
  }, [surahNumber]);

  useEffect(() => {
    if (!surahNumber || !selectedReciter) return;
    void loadSurah(selectedReciter);
  }, [selectedReciter, surahNumber]);

  const handleVerseAudio = (index: number) => {
    if (!surah?.ayahAudio?.[index]) return;

    if (currentVerseIndex === index && isPlaying) {
      stopAllAudio();
      return;
    }

    setCurrentVerseIndex(index);
    setCurrentRepeat(0);
    setIsPlaying(true);
  };

  const handlePlayerEnded = () => {
    if (currentVerseIndex === null) {
      setIsPlaying(false);
      return;
    }

    if (currentRepeat + 1 < repeatCount) {
      setCurrentRepeat((prev) => prev + 1);
      chapterAudioPlayerRef.current?.seekTo(0);
      chapterAudioPlayerRef.current?.play();
      setIsPlaying(true);
      return;
    }

    setIsPlaying(false);
    setCurrentRepeat(0);
  };

  const getVerseId = (i: number) => `${surah?.surahNo}:${i + 1}`;

  const convertToArabicNumerals = (num: number) => {
    const map = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num
      .toString()
      .split('')
      .map((n) => map[parseInt(n)])
      .join('');
  };

  const getFontSizeClass = (size: number) =>
    ({
      1: 'text-xl',
      2: 'text-2xl',
      3: 'text-3xl',
      4: 'text-4xl',
    }[size] || 'text-2xl');

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="pal-btn-primary px-4 py-2 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!surah || !surah.arabic1 || !surah.english) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-36 relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
              border border-gray-200 dark:border-gray-700
              text-gray-600 dark:text-gray-400
              hover:bg-gray-50 dark:hover:bg-gray-800
              hover:text-gray-900 dark:hover:text-gray-200
              transition-colors"
          >
            <FaArrowLeft size={13} />
            <span>Back</span>
          </button>

          {Number(surahNumber) < 114 && (
            <button
              onClick={() => router.push(`/surah/${Number(surahNumber) + 1}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
                border border-gray-200 dark:border-gray-700
                text-gray-600 dark:text-gray-400
                hover:bg-gray-50 dark:hover:bg-gray-800
                hover:text-gray-900 dark:hover:text-gray-200
                transition-colors"
            >
              <span>Next</span>
              <FaArrowLeft size={13} className="rotate-180" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setReadingMode(!readingMode)}
            className={`p-2 rounded-lg transition-colors ${
              readingMode
                ? 'bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
            title={readingMode ? 'Verse mode' : 'Reading mode'}
          >
            {readingMode ? <FaList size={16} /> : <FaBookOpen size={16} />}
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-800
              hover:text-gray-700 dark:hover:text-gray-200
              transition-colors"
          >
            <FaCog size={18} />
          </button>
        </div>
      </div>

      {showSettings && (
        <>
          <div className="fixed inset-0 bg-black/40 z-20" onClick={() => setShowSettings(false)} />

          <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-30 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <h3 className="font-bold text-lg dark:text-gray-100">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <label className="text-sm font-medium dark:text-gray-300 block mb-2">Arabic Font Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`px-3 py-2 rounded-md text-sm transition-colors ${
                        fontSize === size
                          ? 'bg-gold-500 text-gray-900'
                          : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {['Small', 'Medium', 'Large', 'X-Large'][size - 1]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2 dark:text-gray-300">Verse Repeat</label>
                <select
                  value={repeatCount}
                  onChange={(e) => setRepeatCount(Number(e.target.value))}
                  className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value={1}>No repeat</option>
                  <option value={2}>2 times</option>
                  <option value={3}>3 times</option>
                  <option value={5}>5 times</option>
                  <option value={10}>10 times</option>
                </select>
              </div>

              <div className="flex flex-col min-h-0">
                <label className="text-sm font-medium block mb-2 dark:text-gray-300">Recitation</label>

                <div className="relative mb-2">
                  <FaSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={reciterSearch}
                    onChange={(e) => setReciterSearch(e.target.value)}
                    placeholder="Search reciter..."
                    className="w-full rounded border border-gray-200 bg-white py-2 pl-8 pr-3 text-sm text-gray-900
                      placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gold-500 dark:border-pal-sage/35 dark:bg-pal-bg/55 dark:text-white dark:placeholder:text-white/50 dark:focus:ring-pal-gold/60"
                  />
                </div>

                <div className="overflow-y-auto max-h-64 rounded border border-gray-200 dark:border-gray-700">
                  {filteredReciters.length === 0 ? (
                    <p className="text-sm text-gray-400 p-3 text-center">No results</p>
                  ) : (
                    filteredReciters.map(([id, { name }]) => (
                      <button
                        key={id}
                        onClick={() => {
                          setSelectedReciter(id);
                          setShowSettings(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0 ${
                          selectedReciter === id
                            ? 'bg-gold-50 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="text-center py-6 border-b border-gray-100 dark:border-gray-700 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-pal-gold">{surah.surahName}</h1>
        <p className="text-4xl font-arabic mt-2 text-gray-700 dark:text-pal-gold leading-loose">{surah.surahNameArabic}</p>
        <p className="text-gray-500 dark:text-white/85 text-sm mt-1">{surah.surahNameTranslation}</p>
        {surah.surahNo !== 1 && surah.surahNo !== 9 && (
          <p className="text-2xl font-arabic mt-4 text-gray-600 dark:text-white/80 leading-loose">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
        )}
      </div>

      {readingMode ? (
        <div className="mt-4 max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className={`${getFontSizeClass(fontSize)} font-arabic text-right text-gray-900 dark:text-gray-100`} dir="rtl">
            {surah.arabic1.map((ayah: string, index: number) => (
              <span key={index} className="inline leading-[3.5rem]">
                {ayah}{' '}
                <span className="text-gold-600 dark:text-gold-400 text-base">﴿{convertToArabicNumerals(index + 1)}﴾</span>{' '}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {surah.arabic1.map((ayah: string, index: number) => {
            const verseId = getVerseId(index);
            const isBookmarked = bookmarks.has(verseId);
            const verseAudioUrl = surah?.ayahAudio?.[index];

            return (
              <div
                key={index}
                id={`ayah-${index + 1}`}
                className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-100 dark:bg-gold-900 text-gold-700 dark:text-gold-300 text-sm font-bold">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => void toggleBookmark(verseId)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                    >
                      {isBookmarked ? <FaBookmark className="text-yellow-500" size={16} /> : <FaRegBookmark size={16} />}
                    </button>
                    <button
                      onClick={() => handleVerseAudio(index)}
                      className={`p-2 rounded-full transition-colors ${
                        verseAudioUrl
                          ? currentVerseIndex === index && isPlaying
                            ? 'bg-gold-600 text-gray-900 shadow-md shadow-gold-200 dark:shadow-gold-900/40'
                            : 'bg-gold-500 hover:bg-gold-600 text-gray-900'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      }`}
                      disabled={!verseAudioUrl}
                    >
                      {currentVerseIndex === index && isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
                    </button>
                  </div>
                </div>

                <p className={`${getFontSizeClass(fontSize)} font-arabic text-right text-gray-900 dark:text-gray-100 leading-loose`} dir="rtl">
                  {ayah} <span className="text-gold-500 dark:text-gold-400">﴿{convertToArabicNumerals(index + 1)}﴾</span>
                </p>

                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-3">
                  {surah.english[index]}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {currentVerseIndex !== null && surah?.ayahAudio?.[currentVerseIndex] && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-2xl border-t border-gray-200 dark:border-gray-700 p-3">
          <CustomAudioPlayer
            ref={chapterAudioPlayerRef}
            audioUrl={surah.ayahAudio[currentVerseIndex] || ''}
            title={`${surah.surahName} - Ayah ${currentVerseIndex + 1}`}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handlePlayerEnded}
          />
        </div>
      )}
    </div>
  );
};

export default SurahDetail;
