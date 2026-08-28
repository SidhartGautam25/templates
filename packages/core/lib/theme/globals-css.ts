import type { ThemeColors } from "./types";

export const THEME_CSS_VAR_NAMES = [
  "--primary",
  "--primary-hover",
  "--accent-gold",
  "--accent-gold-dark",
  "--accent-gold-light",
  "--text-main",
  "--text-muted",
  "--bg-tan",
  "--bg-light",
  "--bg-card",
  "--footer-bg",
  "--cta-primary",
  "--cta-primary-hover",
] as const;

export const THEME_COLOR_KEYS: (keyof ThemeColors)[] = [
  "primary",
  "primaryHover",
  "accent",
  "accentDark",
  "accentLight",
  "textMain",
  "textMuted",
  "bgMain",
  "bgLight",
  "bgCard",
  "footerBg",
  "ctaPrimary",
  "ctaPrimaryHover",
];

export const TAILWIND_THEME_COLOR_TOKENS = `
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-accent-gold: var(--accent-gold);
  --color-accent-gold-dark: var(--accent-gold-dark);
  --color-accent-gold-light: var(--accent-gold-light);
  --color-text-main: var(--text-main);
  --color-text-muted: var(--text-muted);
  --color-bg-tan: var(--bg-tan);
  --color-bg-light: var(--bg-light);
  --color-bg-card: var(--bg-card);
  --color-footer-bg: var(--footer-bg);
  --color-cta-primary: var(--cta-primary);
  --color-cta-primary-hover: var(--cta-primary-hover);
`;

export function buildRootVarsBlock(colors: ThemeColors, indent = "  "): string {
  const lines = THEME_COLOR_KEYS.map((key, i) => {
    const cssVar = THEME_CSS_VAR_NAMES[i];
    return `${indent}${cssVar}: ${colors[key]};`;
  });
  return `${indent}color-scheme: light;\n${lines.join("\n")}`;
}

export function buildDarkVarsBlock(colors: ThemeColors, important = true): string {
  const suffix = important ? " !important" : "";
  const lines = THEME_COLOR_KEYS.map((key, i) => {
    const cssVar = THEME_CSS_VAR_NAMES[i];
    return `  ${cssVar}: ${colors[key]}${suffix};`;
  });
  return `[data-theme="dark"] {\n  color-scheme: dark;\n${lines.join("\n")}\n}`;
}

export function hexLuminance(hex: string): number {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw.slice(0, 6);
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const [lr, lg, lb] = [r, g, b].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export function isDarkBackgroundColor(hex: string): boolean {
  return hexLuminance(hex) < 0.2;
}

/** Default light palette when migrating a dark-first template to theme-modes. */
export const DEFAULT_LIGHT_THEME_COLORS: ThemeColors = {
  primary: "#7c3aed",
  primaryHover: "#6d28d9",
  accent: "#38bdf8",
  accentDark: "#0284c7",
  accentLight: "#f5f3ff",
  textMain: "#0f172a",
  textMuted: "#64748b",
  bgMain: "#f8fafc",
  bgLight: "#f1f5f9",
  bgCard: "#ffffff",
  footerBg: "#e2e8f0",
  ctaPrimary: "#7c3aed",
  ctaPrimaryHover: "#6d28d9",
};
