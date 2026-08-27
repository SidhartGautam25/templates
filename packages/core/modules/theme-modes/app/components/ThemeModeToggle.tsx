"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { THEME_MODE_STORAGE_KEY, type ThemeMode } from "@/lib/theme/mode-toggle";

function readDomTheme(): ThemeMode {
  const fromDom = document.documentElement.getAttribute("data-theme");
  if (fromDom === "light" || fromDom === "dark") return fromDom;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeModeToggle({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMode(readDomTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: ThemeMode = mode === "light" ? "dark" : "light";
    setMode(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_MODE_STORAGE_KEY, next);
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
