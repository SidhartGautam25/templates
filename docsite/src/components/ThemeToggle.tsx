"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("docsite-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fromDom = document.documentElement.getAttribute("data-theme");
    const initial =
      fromDom === "light" || fromDom === "dark" ? fromDom : getInitialTheme();
    setTheme(initial);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("docsite-theme", next);
  }

  if (!mounted) {
    return (
      <span className="inline-flex h-9 w-[4.5rem] rounded-full border border-[var(--color-doc-border)] bg-[var(--color-doc-surface-elevated)]" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-doc-border)] bg-[var(--color-doc-surface-elevated)] px-3 py-1.5 text-sm font-medium text-[var(--color-doc-text)] hover:bg-[var(--color-doc-nav-active-bg)] transition-colors"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span aria-hidden="true">{theme === "light" ? "☀️" : "🌙"}</span>
      <span>{theme === "light" ? "Light" : "Dark"}</span>
    </button>
  );
}
