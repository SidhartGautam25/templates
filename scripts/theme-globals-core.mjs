/**
 * Shared theme CSS bridge for templates — used by sync-templates, new-template, and theme-modes install.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const THEME_COLOR_KEYS = [
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

export const THEME_CSS_VARS = [
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
];

export const TAILWIND_THEME_TOKENS = `
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

export const DEFAULT_LIGHT = {
  primary: "#2563eb",
  primaryHover: "#1d4ed8",
  accent: "#38bdf8",
  accentDark: "#0284c7",
  accentLight: "#eff6ff",
  textMain: "#0f172a",
  textMuted: "#64748b",
  bgMain: "#f8fafc",
  bgLight: "#f1f5f9",
  bgCard: "#ffffff",
  footerBg: "#e2e8f0",
  ctaPrimary: "#2563eb",
  ctaPrimaryHover: "#1d4ed8",
};

function log(quiet, message) {
  if (!quiet) console.log(message);
}

export function hexLuminance(hex) {
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

function buildRootLines(colors) {
  return THEME_CSS_VARS.map((cssVar, index) => {
    const key = THEME_COLOR_KEYS[index];
    return `  ${cssVar}: ${colors[key]};`;
  });
}

export function buildDarkBlock(colors) {
  const lines = THEME_CSS_VARS.map((cssVar, index) => {
    const key = THEME_COLOR_KEYS[index];
    return `  ${cssVar}: ${colors[key]} !important;`;
  });
  return `[data-theme="dark"] {\n  color-scheme: dark;\n${lines.join("\n")}\n}`;
}

export function parseThemeColorsFromSiteTs(siteContent) {
  const themeIdx = siteContent.indexOf("theme:");
  if (themeIdx < 0) return null;
  const slice = siteContent.slice(themeIdx);
  const colorsMatch = slice.match(/colors:\s*\{([\s\S]*?)\n\s*\},/);
  if (!colorsMatch?.[1]) return null;
  const inner = colorsMatch[1];
  const colors = {};
  for (const key of THEME_COLOR_KEYS) {
    const match = inner.match(new RegExp(`${key}\\s*:\\s*"([^"]+)"`));
    if (match?.[1]) colors[key] = match[1];
  }
  return Object.keys(colors).length > 0 ? colors : null;
}

export function parseDarkColorsFromSiteTs(siteContent) {
  const darkMatch = siteContent.match(/colorsDark:\s*\{([\s\S]*?)\n\s*\},/);
  if (!darkMatch?.[1]) return null;
  const inner = darkMatch[1];
  const colors = {};
  for (const key of THEME_COLOR_KEYS) {
    const match = inner.match(new RegExp(`${key}\\s*:\\s*"([^"]+)"`));
    if (match?.[1]) colors[key] = match[1];
  }
  return Object.keys(colors).length > 0 ? colors : null;
}

export function siteHasThemeModes(siteContent) {
  return /themeModes:\s*true/.test(siteContent);
}

export function applyGlobalsThemeBridge(templateRoot, light, options = {}) {
  const { dark = null, rootColorScheme, quiet = false } = options;
  const globalsPath = join(templateRoot, "app", "globals.css");
  if (!existsSync(globalsPath)) return;

  const scheme =
    rootColorScheme ??
    (hexLuminance(light.bgMain ?? "#ffffff") < 0.2 ? "dark" : "light");

  let css = readFileSync(globalsPath, "utf8");
  const rootBlock = `:root {\n  color-scheme: ${scheme};\n${buildRootLines(light).join("\n")}\n}`;

  if (css.includes(":root")) {
    css = css.replace(/:root\s*\{[\s\S]*?\}/, rootBlock);
    log(quiet, "  ✓ synced :root theme variables in app/globals.css");
  } else {
    css = css.replace(/@import\s+"tailwindcss";/, `@import "tailwindcss";\n\n${rootBlock}`);
    log(quiet, "  ✓ added :root theme variables to app/globals.css");
  }

  if (css.includes("@theme")) {
    if (!css.includes("--color-primary:")) {
      css = css.replace(/@theme\s*\{/, `@theme {${TAILWIND_THEME_TOKENS}`);
      log(quiet, "  ✓ registered theme colors in Tailwind @theme");
    }
  } else {
    css = css.replace(rootBlock, `${rootBlock}\n\n@theme {${TAILWIND_THEME_TOKENS}\n}`);
    log(quiet, "  ✓ added Tailwind @theme color tokens");
  }

  const bodyLayer = `@layer base {
  body {
    background-color: var(--bg-tan);
    color: var(--text-main);
    transition: background-color 0.2s ease, color 0.2s ease;
  }
}`;

  if (!css.includes("@layer base")) {
    css = css.replace(/\nbody\s*\{[^}]*\}/g, "\n");
    css = `${css.trim()}\n\n${bodyLayer}\n`;
    log(quiet, "  ✓ wired body to theme CSS variables");
  } else if (!css.includes("transition: background-color")) {
    css = css.replace(
      /(@layer base\s*\{\s*body\s*\{)([\s\S]*?)(\})/,
      (_, open, inner, close) => {
        if (inner.includes("transition:")) return `${open}${inner}${close}`;
        if (!inner.includes("background-color: var(--bg-tan)")) {
          return `${open}\n    background-color: var(--bg-tan);\n    color: var(--text-main);\n    transition: background-color 0.2s ease, color 0.2s ease;${close}`;
        }
        return `${open}${inner}\n    transition: background-color 0.2s ease, color 0.2s ease;${close}`;
      }
    );
    log(quiet, "  ✓ added theme transition on body");
  }

  if (dark) {
    if (css.includes("[data-theme=\"dark\"]")) {
      css = css.replace(/\[data-theme="dark"\]\s*\{[\s\S]*?\}/, buildDarkBlock(dark));
      log(quiet, "  ✓ refreshed [data-theme=\"dark\"] overrides");
    } else {
      css = `${css.trim()}\n\n${buildDarkBlock(dark)}\n`;
      log(quiet, "  ✓ added [data-theme=\"dark\"] overrides (!important)");
    }
  }

  writeFileSync(globalsPath, css, "utf8");
}

export function ensureTemplateThemeGlobals(templateRoot, options = {}) {
  const { quiet = false } = options;
  const sitePath = join(templateRoot, "constants", "site.ts");
  if (!existsSync(sitePath)) return;

  const siteContent = readFileSync(sitePath, "utf8");
  const light = parseThemeColorsFromSiteTs(siteContent) ?? { ...DEFAULT_LIGHT };
  const themeModes = siteHasThemeModes(siteContent);
  const dark = themeModes ? parseDarkColorsFromSiteTs(siteContent) : null;
  const darkRoot = hexLuminance(light.bgMain) < 0.2;

  applyGlobalsThemeBridge(templateRoot, light, {
    dark,
    rootColorScheme: themeModes ? "light" : darkRoot ? "dark" : "light",
    quiet,
  });

  removeLayoutInlineThemeVars(templateRoot, quiet);
  fixTempjsThemeCss(templateRoot, dark, quiet);
}

export function removeLayoutInlineThemeVars(templateRoot, quiet = false) {
  const layoutPath = join(templateRoot, "app", "layout.tsx");
  if (!existsSync(layoutPath)) return;

  let content = readFileSync(layoutPath, "utf8");
  if (!content.includes("SITE.theme.colors") || !content.includes("style={{")) return;

  content = content.replace(
    /\s*style=\{\{[\s\S]*?SITE\.theme\.colors[\s\S]*?\}\s*as React\.CSSProperties\}\}/,
    ""
  );
  writeFileSync(layoutPath, content, "utf8");
  log(quiet, "  ✓ removed inline theme CSS vars from app/layout.tsx <html>");
}

export function fixTempjsThemeCss(templateRoot, dark, quiet = false) {
  const globalsPath = join(templateRoot, "app", "globals.css");
  if (!existsSync(globalsPath)) return;

  const themeCssPath = join(globalsPath, "..", "tempjs-theme.css");
  if (!existsSync(themeCssPath)) return;

  let content = readFileSync(themeCssPath, "utf8");
  const hadImportant = content.includes("!important");
  content = content.replace(/\s!important/g, "");

  if (dark) {
    const darkBlock = buildDarkBlock(dark);
    if (content.includes("[data-theme=\"dark\"]")) {
      content = content.replace(/\[data-theme="dark"\]\s*\{[\s\S]*?\}/, darkBlock);
    } else {
      content = `${content.trim()}\n\n${darkBlock}\n`;
    }
  }

  writeFileSync(themeCssPath, content, "utf8");
  if (hadImportant || dark) {
    log(quiet, "  ✓ fixed app/tempjs-theme.css for theme-modes compatibility");
  }
}
