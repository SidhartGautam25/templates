export const THEME_MODE_STORAGE_KEY = "tempjs-theme-mode";
export const THEME_MODE_INIT_SCRIPT_ID = "tempjs-theme-mode-init";

export type ThemeMode = "light" | "dark";
export type ThemeAppearance = "light" | "dark" | "system";

/**
 * Resolve theme from storage + site default — must match getThemeModeInitScript() logic.
 */
export function resolveThemeModeFromStorage(
  stored: string | null,
  siteDefault: ThemeAppearance,
  prefersDark: boolean
): ThemeMode {
  if (stored === "light" || stored === "dark") return stored;
  if (siteDefault === "light" || siteDefault === "dark") return siteDefault;
  return prefersDark ? "dark" : "light";
}

/** Client-only: read active mode after ThemeModeInit / inline script has run. */
export function readThemeModeFromDocument(siteDefault: ThemeAppearance = "system"): ThemeMode {
  const fromDom = document.documentElement.getAttribute("data-theme");
  if (fromDom === "light" || fromDom === "dark") return fromDom;

  let stored: string | null = null;
  try {
    stored = localStorage.getItem(THEME_MODE_STORAGE_KEY);
  } catch {
    stored = null;
  }

  return resolveThemeModeFromStorage(
    stored,
    siteDefault,
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function applyThemeModeToDocument(mode: ThemeMode) {
  document.documentElement.setAttribute("data-theme", mode);
  document.documentElement.style.colorScheme = mode;
  try {
    localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
  } catch {
    /* private mode / blocked storage */
  }
}

/**
 * Inline script for layout.tsx — sets data-theme before React hydrates (docsite pattern).
 * Pair with suppressHydrationWarning on <html> and <body>.
 */
export function getThemeModeInitScript(
  storageKey = THEME_MODE_STORAGE_KEY,
  siteDefault: ThemeAppearance = "system"
): string {
  const defaultLiteral = JSON.stringify(siteDefault);
  return `(function () {
  try {
    var stored = localStorage.getItem("${storageKey}");
    var siteDefault = ${defaultLiteral};
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (siteDefault === "light" || siteDefault === "dark"
        ? siteDefault
        : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();`;
}
