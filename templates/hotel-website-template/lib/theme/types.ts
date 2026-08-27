/** Theme color keys stored in constants/site.ts and mirrored as CSS variables in app/globals.css */
export interface ThemeColors {
  primary: string;
  primaryHover: string;
  accent: string;
  accentDark: string;
  accentLight: string;
  textMain: string;
  textMuted: string;
  bgMain: string;
  bgLight: string;
  bgCard: string;
  footerBg: string;
  ctaPrimary: string;
  ctaPrimaryHover: string;
}

export const THEME_COLOR_FIELDS: { key: keyof ThemeColors; label: string; cssVar: string }[] = [
  { key: "primary", label: "Primary", cssVar: "--primary" },
  { key: "primaryHover", label: "Primary hover", cssVar: "--primary-hover" },
  { key: "accent", label: "Accent", cssVar: "--accent-gold" },
  { key: "accentDark", label: "Accent dark", cssVar: "--accent-gold-dark" },
  { key: "accentLight", label: "Accent light", cssVar: "--accent-gold-light" },
  { key: "textMain", label: "Text", cssVar: "--text-main" },
  { key: "textMuted", label: "Text muted", cssVar: "--text-muted" },
  { key: "bgMain", label: "Background", cssVar: "--bg-tan" },
  { key: "bgLight", label: "Background light", cssVar: "--bg-light" },
  { key: "bgCard", label: "Card background", cssVar: "--bg-card" },
  { key: "footerBg", label: "Footer background", cssVar: "--footer-bg" },
  { key: "ctaPrimary", label: "CTA primary", cssVar: "--cta-primary" },
  { key: "ctaPrimaryHover", label: "CTA hover", cssVar: "--cta-primary-hover" },
];
