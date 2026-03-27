type VerseBookmark = {
  id: string;
  verse_id: string;
  created_at: string;
};

export type PageBookmark = {
  id: string;
  pageNumber: number;
  created_at: string;
};

const VERSE_BOOKMARKS_KEY = 'muslimpal:bookmarks:verses';
const PAGE_BOOKMARKS_KEY = 'muslimpal:bookmarks:pages';

const readLocalStorageArray = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

const writeLocalStorageArray = <T>(key: string, value: T[]): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const addBookmark = async (bookmark: VerseBookmark): Promise<void> => {
  const existing = readLocalStorageArray<VerseBookmark>(VERSE_BOOKMARKS_KEY);
  const withoutDuplicate = existing.filter((b) => b.id !== bookmark.id);
  writeLocalStorageArray(VERSE_BOOKMARKS_KEY, [...withoutDuplicate, bookmark]);
};

export const getBookmarks = async (): Promise<VerseBookmark[]> => {
  return readLocalStorageArray<VerseBookmark>(VERSE_BOOKMARKS_KEY);
};

export const removeBookmark = async (id: string): Promise<void> => {
  const existing = readLocalStorageArray<VerseBookmark>(VERSE_BOOKMARKS_KEY);
  writeLocalStorageArray(
    VERSE_BOOKMARKS_KEY,
    existing.filter((bookmark) => bookmark.id !== id)
  );
};

export const addPageBookmark = async (pageNumber: number): Promise<void> => {
  const existing = readLocalStorageArray<PageBookmark>(PAGE_BOOKMARKS_KEY);
  const id = `page:${pageNumber}`;
  const withoutDuplicate = existing.filter((bookmark) => bookmark.id !== id);
  writeLocalStorageArray(PAGE_BOOKMARKS_KEY, [
    ...withoutDuplicate,
    { id, pageNumber, created_at: new Date().toISOString() },
  ]);
};

export const removePageBookmark = async (pageNumber: number): Promise<void> => {
  const id = `page:${pageNumber}`;
  const existing = readLocalStorageArray<PageBookmark>(PAGE_BOOKMARKS_KEY);
  writeLocalStorageArray(
    PAGE_BOOKMARKS_KEY,
    existing.filter((bookmark) => bookmark.id !== id)
  );
};

export const getPageBookmarks = async (): Promise<PageBookmark[]> => {
  return readLocalStorageArray<PageBookmark>(PAGE_BOOKMARKS_KEY);
};

export const isPageBookmarked = async (pageNumber: number): Promise<boolean> => {
  const id = `page:${pageNumber}`;
  const existing = readLocalStorageArray<PageBookmark>(PAGE_BOOKMARKS_KEY);
  return existing.some((bookmark) => bookmark.id === id);
};
