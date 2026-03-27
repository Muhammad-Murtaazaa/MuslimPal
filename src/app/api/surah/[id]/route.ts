
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ id: String(i + 1) }));
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const surahNumber = Number(id);

  if (!surahNumber || surahNumber < 1 || surahNumber > 114) {
    return NextResponse.json({ error: 'Invalid surah number' }, { status: 400 });
  }

  try {
    const audioEdition = req.nextUrl.searchParams.get('audioEdition') || 'ar.alafasy';

    const [arabicRes, englishRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`, {
        next: { revalidate: 86400 },
      }),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`, {
        next: { revalidate: 86400 },
      }),
    ]);

    if (!arabicRes.ok || !englishRes.ok) {
      throw new Error(`AlQuran Cloud error: arabic=${arabicRes.status} english=${englishRes.status}`);
    }

    const arabicPayload = await arabicRes.json();
    const englishPayload = await englishRes.json();

    const arabicData = arabicPayload?.data;
    const englishData = englishPayload?.data;

    const arabicAyahs = arabicData?.ayahs ?? [];
    const englishAyahs = englishData?.ayahs ?? [];

    let ayahAudio: Array<string | null> = [];
    try {
      const audioRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${audioEdition}`, {
        next: { revalidate: 86400 },
      });
      if (audioRes.ok) {
        const audioPayload = await audioRes.json();
        const audioAyahs = audioPayload?.data?.ayahs ?? [];
        const audioMap = new Map<number, string>();
        for (const ayah of audioAyahs) {
          if (ayah?.numberInSurah && ayah?.audio) {
            audioMap.set(ayah.numberInSurah, ayah.audio);
          }
        }
        ayahAudio = arabicAyahs.map((v: any) => audioMap.get(v.numberInSurah) ?? null);
      }
    } catch {
      ayahAudio = arabicAyahs.map(() => null);
    }

    const englishMap = new Map<number, string>();
    for (const ayah of englishAyahs) {
      englishMap.set(ayah.numberInSurah, ayah.text ?? '');
    }

    return NextResponse.json({
      surahNo: surahNumber,
      surahName: arabicData?.englishName ?? '',
      surahNameArabic: arabicData?.name ?? '',
      surahNameTranslation: arabicData?.englishNameTranslation ?? '',
      numberOfAyahs: arabicData?.numberOfAyahs ?? arabicAyahs.length,
      revelationType: arabicData?.revelationType === 'Meccan' ? 'Meccan' : 'Medinan',
      arabic1: arabicAyahs.map((v: any) => v.text ?? ''),
      english: arabicAyahs.map((v: any) => englishMap.get(v.numberInSurah) ?? ''),
      globalAyahNumbers: arabicAyahs.map((v: any) => v.number),
      ayahAudio,
    });
  } catch (error) {
    console.error(`[/api/surah/${id}]`, error);
    return NextResponse.json({});
  }
}
