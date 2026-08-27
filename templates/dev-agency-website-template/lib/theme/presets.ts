import type { ThemeColors } from "./types";

export interface ThemePreset {
  id: string;
  name: string;
  colors: ThemeColors;
}

/** Presets aligned with tempjs CLI theme1–theme5 (cli/theme-manager.js). */
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "theme1",
    name: "Slate / Blue",
    colors: {
      primary: "#2563EB",
      primaryHover: "#1D4ED8",
      accent: "#38BDF8",
      accentDark: "#0284C7",
      accentLight: "#EFF6FF",
      textMain: "#0F172A",
      textMuted: "#64748B",
      bgMain: "#F8FAFC",
      bgLight: "#EFF6FF",
      bgCard: "#FFFFFF",
      footerBg: "#E2E8F0",
      ctaPrimary: "#2563EB",
      ctaPrimaryHover: "#1D4ED8",
    },
  },
  {
    id: "theme2",
    name: "Forest / Green",
    colors: {
      primary: "#58812F",
      primaryHover: "#466725",
      accent: "#8BC34A",
      accentDark: "#689F38",
      accentLight: "#F1F5EA",
      textMain: "#1D3108",
      textMuted: "#4A5441",
      bgMain: "#F9FAF7",
      bgLight: "#F1F5EA",
      bgCard: "#FFFFFF",
      footerBg: "#E6EBDC",
      ctaPrimary: "#58812F",
      ctaPrimaryHover: "#466725",
    },
  },
  {
    id: "theme3",
    name: "Purple / Violet",
    colors: {
      primary: "#7C3AED",
      primaryHover: "#6D28D9",
      accent: "#A78BFA",
      accentDark: "#8B5CF6",
      accentLight: "#F5F3FF",
      textMain: "#2E1065",
      textMuted: "#6B6382",
      bgMain: "#FAF9FF",
      bgLight: "#F5F3FF",
      bgCard: "#FFFFFF",
      footerBg: "#E9E3FF",
      ctaPrimary: "#7C3AED",
      ctaPrimaryHover: "#6D28D9",
    },
  },
  {
    id: "theme4",
    name: "Red / Crimson",
    colors: {
      primary: "#DC2626",
      primaryHover: "#B91C1C",
      accent: "#F87171",
      accentDark: "#EF4444",
      accentLight: "#FEF2F2",
      textMain: "#450A0A",
      textMuted: "#7F1D1D",
      bgMain: "#FFFBFB",
      bgLight: "#FEF2F2",
      bgCard: "#FFFFFF",
      footerBg: "#FEE2E2",
      ctaPrimary: "#DC2626",
      ctaPrimaryHover: "#B91C1C",
    },
  },
  {
    id: "theme5",
    name: "Amber / Gold",
    colors: {
      primary: "#D97706",
      primaryHover: "#B45309",
      accent: "#FBBF24",
      accentDark: "#F59E0B",
      accentLight: "#FFFBEB",
      textMain: "#1C1917",
      textMuted: "#78350F",
      bgMain: "#FFFCF5",
      bgLight: "#FFFBEB",
      bgCard: "#FFFFFF",
      footerBg: "#FEF3C7",
      ctaPrimary: "#D97706",
      ctaPrimaryHover: "#B45309",
    },
  },
];
