import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah', {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error(`AlQuran Cloud error: ${response.status}`);
    }

    const payload = await response.json();
    const surahs = payload?.data ?? [];

    const data = surahs.map((s: any) => ({
      number: s.number,
      surahName: s.englishName,
      surahNameArabic: s.name,
      surahNameTranslation: s.englishNameTranslation ?? '',
      numberOfAyahs: s.numberOfAyahs,
      revelationType: s.revelationType === 'Meccan' ? 'Meccan' : 'Medinan',
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('[/api/surahs]', error);
    return NextResponse.json([]);
  }
}
