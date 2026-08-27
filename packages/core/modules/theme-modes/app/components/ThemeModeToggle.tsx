"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { SITE } from "@/constants";
import {
  applyThemeModeToDocument,
  readThemeModeFromDocument,
  type ThemeAppearance,
  type ThemeMode,
} from "@/lib/theme/mode-toggle";

function getSiteAppearance(): ThemeAppearance {
  const siteTheme = SITE.theme as { appearance?: ThemeAppearance };
  return siteTheme.appearance ?? "system";
}

/**
 * Hydration-safe toggle — matches docsite ThemeToggle:
 * placeholder until mount, then read data-theme from DOM (set by ThemeModeInit script).
 */
export default function ThemeModeToggle({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMode(readThemeModeFromDocument(getSiteAppearance()));
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: ThemeMode = mode === "light" ? "dark" : "light";
    setMode(next);
    applyThemeModeToDocument(next);
  };

  if (!mounted) {
    return (
      <span
        className={`inline-flex h-9 w-9 rounded-full border border-primary/10 bg-bg-card ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 bg-bg-card text-text-main hover:border-primary/30 transition-colors cursor-pointer ${className}`}
      aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
      title={mode === "light" ? "Dark mode" : "Light mode"}
    >
      {mode === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}
