export const colors = {
  white: "#ffffff",
  black: "#000000",
  zinc50: "#fafafa",
  zinc100: "#f4f4f5",
  zinc200: "#e4e4e7",
  zinc300: "#d4d4d8",
  zinc400: "#a1a1aa",
  zinc500: "#71717a",
  zinc600: "#52525b",
  zinc700: "#3f3f46",
  zinc800: "#27272a",
  zinc900: "#18181b",
  zinc950: "#09090b",
  blue400: "#60a5fa",
  blue500: "#3b82f6",
  blue600: "#2563eb",
  purple400: "#c084fc",
  purple500: "#a855f7",
  purple600: "#9333ea",
  pink400: "#f472b6",
  pink500: "#ec4899",
  green400: "#4ade80",
  green500: "#22c55e",
  orange400: "#fb923c",
  orange500: "#f97316",
} as const;

export const fontFamilies = {
  sans: "Inter, system-ui, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
} as const;

export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  "2xl": 64,
  "3xl": 80,
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60,
  "7xl": 72,
} as const;

export const STANDARD_DIMENSIONS = [
  { w: 1200, h: 630, label: "OG Image" },
  { w: 1600, h: 900, label: "Twitter" },
  { w: 1200, h: 627, label: "LinkedIn" },
  { w: 1080, h: 1080, label: "Square" },
] as const satisfies Array<{ w: number; h: number; label: string }>;
