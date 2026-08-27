export const THEME_MODE_STORAGE_KEY = "tempjs-theme-mode";

export type ThemeMode = "light" | "dark";
export type ThemeAppearance = "light" | "dark" | "system";

export function resolveThemeMode(
  stored: string | null,
  prefersDark: boolean
): ThemeMode {
  if (stored === "light" || stored === "dark") return stored;
  return prefersDark ? "dark" : "light";
}

/** Inline script for layout.tsx — sets data-theme before paint to avoid flash. */
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
  } catch (e) {}
})();`;
}
