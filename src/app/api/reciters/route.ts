import { NextResponse } from 'next/server';


export const dynamic = 'force-static';

export async function GET() {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/edition/format/audio', {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error(`AlQuran Cloud error: ${response.status}`);
    }

    const payload = await response.json();
    const editions: Array<{ identifier: string; englishName: string; name: string; language: string }> =
      payload?.data ?? [];

    const audioEditions = editions.filter((item) => item.identifier && item.language === 'ar');

    const result: Record<string, { name: string; edition: string }> = {};
    for (const item of audioEditions) {
      result[item.identifier] = {
        name: item.englishName || item.name || item.identifier,
        edition: item.identifier,
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[/api/reciters]', error);
    return NextResponse.json({});
  }
}
