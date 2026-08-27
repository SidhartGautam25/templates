import type { ThemeColors } from "./types";

/** Sensible dark palette defaults when a template opts into theme-modes. */
export const DEFAULT_DARK_THEME_COLORS: ThemeColors = {
  primary: "#60a5fa",
  primaryHover: "#3b82f6",
  accent: "#38bdf8",
  accentDark: "#0ea5e9",
  accentLight: "#1e3a5f",
  textMain: "#f1f5f9",
  textMuted: "#94a3b8",
  bgMain: "#0f172a",
  bgLight: "#1e293b",
  bgCard: "#1e293b",
  footerBg: "#020617",
  ctaPrimary: "#60a5fa",
  ctaPrimaryHover: "#3b82f6",
};

/**
 * Derive a dark palette from the current light theme (best-effort contrast flip).
 */
export function deriveDarkColorsFromLight(light: ThemeColors): ThemeColors {
  return {
    primary: light.primary,
    primaryHover: light.primaryHover,
    accent: light.accent,
    accentDark: light.accentDark,
    accentLight: light.accentDark,
    textMain: "#f1f5f9",
    textMuted: "#94a3b8",
    bgMain: "#0f172a",
    bgLight: "#1e293b",
    bgCard: "#1e293b",
    footerBg: "#020617",
    ctaPrimary: light.ctaPrimary,
    ctaPrimaryHover: light.ctaPrimaryHover,
  };
}
