// Google Fonts URLs for browser (link tags)
export const googleFontsUrl =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";

// Static font file URLs for Satori (ArrayBuffer loading)
// Using bunny.net as a CORS-friendly Google Fonts mirror
const BUNNY_BASE = "https://fonts.bunny.net";

export const satoriFont = {
  interRegular: `${BUNNY_BASE}/inter/files/inter-latin-400-normal.woff`,
  interMedium: `${BUNNY_BASE}/inter/files/inter-latin-500-normal.woff`,
  interSemiBold: `${BUNNY_BASE}/inter/files/inter-latin-600-normal.woff`,
  interBold: `${BUNNY_BASE}/inter/files/inter-latin-700-normal.woff`,
  jetbrainsMonoRegular: `${BUNNY_BASE}/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff`,
} as const;

export async function loadFontBuffer(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font fetch failed: ${url} (${res.status})`);
  return res.arrayBuffer();
}

// Convenience: load the standard Inter set for Satori in one call
export async function loadInterFonts(): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: 400 | 500 | 600 | 700 }>
> {
  const [regular, medium, semiBold, bold] = await Promise.all([
    loadFontBuffer(satoriFont.interRegular),
    loadFontBuffer(satoriFont.interMedium),
    loadFontBuffer(satoriFont.interSemiBold),
    loadFontBuffer(satoriFont.interBold),
  ]);

  return [
    { name: "Inter", data: regular, weight: 400 },
    { name: "Inter", data: medium, weight: 500 },
    { name: "Inter", data: semiBold, weight: 600 },
    { name: "Inter", data: bold, weight: 700 },
  ];
}
