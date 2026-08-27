import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

import { deriveDarkColorsFromLight } from "./dark-colors";
import type { ThemeAppearance } from "./mode-toggle";
import { THEME_COLOR_FIELDS, type ThemeColors } from "./types";

/**
 * Parse :root CSS variables from globals.css into ThemeColors (best-effort).
 */
export function parseThemeFromGlobalsCss(content: string): Partial<ThemeColors> {
  const colors: Partial<ThemeColors> = {};
  for (const field of THEME_COLOR_FIELDS) {
    const pattern = new RegExp(`${field.cssVar.replace(/-/g, "\\-")}\\s*:\\s*([^;\\n]+)`);
    const match = content.match(pattern);
    if (match?.[1]) {
      colors[field.key] = match[1].trim();
    }
  }
  return colors;
}

/**
 * Parse [data-theme="dark"] CSS variables from globals.css (best-effort).
 */
export function parseThemeDarkFromGlobalsCss(content: string): Partial<ThemeColors> {
  const blockMatch = content.match(/\[data-theme=["']dark["']\]\s*\{([\s\S]*?)\}/);
  if (!blockMatch?.[1]) return {};
  return parseThemeFromGlobalsCss(blockMatch[1]);
}

export function buildSiteTsThemeBlock(colors: ThemeColors): string {
  const lines = Object.entries(colors).map(([key, value]) => `      ${key}: "${value}",`);
  return `  theme: {\n    colors: {\n${lines.join("\n")}\n    },\n  },`;
}

export function buildSiteTsColorsBlock(colors: ThemeColors, indent = "    "): string {
  const lines = Object.entries(colors).map(([key, value]) => `${indent}${key}: "${value}",`);
  return `{\n${lines.join("\n")}\n${indent}}`;
}

export function buildGlobalsRootVars(colors: ThemeColors): string {
  const lines = THEME_COLOR_FIELDS.map((f) => `  ${f.cssVar}: ${colors[f.key]};`);
  return `:root {\n${lines.join("\n")}\n}`;
}

export function buildGlobalsDarkVars(colors: ThemeColors): string {
  const lines = THEME_COLOR_FIELDS.map((f) => `  ${f.cssVar}: ${colors[f.key]};`);
  return `[data-theme="dark"] {\n${lines.join("\n")}\n}`;
}

export function buildExportSnippets(
  colors: ThemeColors,
  options?: { colorsDark?: ThemeColors; appearance?: ThemeAppearance }
): { siteTs: string; globalsCss: string } {
  const dark = options?.colorsDark;
  const appearance = options?.appearance;

  let siteTs = buildSiteTsThemeBlock(colors);
  if (dark) {
    const lightLines = Object.entries(colors).map(([key, value]) => `      ${key}: "${value}",`);
    const darkLines = Object.entries(dark).map(([key, value]) => `      ${key}: "${value}",`);
    const appearanceLine =
      appearance ? `    appearance: "${appearance}" as const,\n` : "";
    siteTs = `  theme: {\n${appearanceLine}    colors: {\n${lightLines.join("\n")}\n    },\n    colorsDark: {\n${darkLines.join("\n")}\n    },\n  },`;
  }

  let globalsCss = buildGlobalsRootVars(colors);
  if (dark) {
    globalsCss = `${globalsCss}\n\n${buildGlobalsDarkVars(dark)}`;
  }

  return { siteTs, globalsCss };
}

function patchSiteTsColorBlock(siteContent: string, blockName: "colors" | "colorsDark", colors: ThemeColors): string {
  const blockRegex = new RegExp(`(${blockName}:\\s*\\{)([\\s\\S]*?)(\\n\\s*\\},)`);
  const match = siteContent.match(blockRegex);
  if (!match) return siteContent;

  let inner = match[2];
  for (const field of THEME_COLOR_FIELDS) {
    const pattern = new RegExp(`(${field.key}\\s*:\\s*)"[^"]*"`);
    if (pattern.test(inner)) {
      inner = inner.replace(pattern, `$1"${colors[field.key]}"`);
    }
  }

  return siteContent.replace(blockRegex, `${match[1]}${inner}${match[3]}`);
}

/**
 * Patch constants/site.ts theme.colors and app/globals.css CSS variables on disk.
 */
export function applyThemeToProjectFiles(
  projectRoot: string,
  colors: ThemeColors,
  options?: { colorsDark?: ThemeColors; appearance?: ThemeAppearance }
) {
  const sitePath = join(projectRoot, "constants", "site.ts");
  const globalsPath = join(projectRoot, "app", "globals.css");

  if (existsSync(sitePath)) {
    let siteContent = readFileSync(sitePath, "utf8");
    siteContent = patchSiteTsColorBlock(siteContent, "colors", colors);

    if (options?.colorsDark) {
      if (siteContent.includes("colorsDark:")) {
        siteContent = patchSiteTsColorBlock(siteContent, "colorsDark", options.colorsDark);
      }
      if (options.appearance && siteContent.includes("appearance:")) {
        siteContent = siteContent.replace(
          /appearance:\s*"[^"]*"/,
          `appearance: "${options.appearance}"`
        );
      }
    }

    writeFileSync(sitePath, siteContent, "utf8");
  }

  if (existsSync(globalsPath)) {
    let css = readFileSync(globalsPath, "utf8");
    for (const field of THEME_COLOR_FIELDS) {
      const escaped = field.cssVar.replace(/-/g, "\\-");
      const pattern = new RegExp(`(${escaped}\\s*:\\s*)[^;\\n]+`);
      if (pattern.test(css)) {
        css = css.replace(pattern, `$1${colors[field.key]}`);
      }
    }

    if (options?.colorsDark) {
      if (css.includes("[data-theme=\"dark\"]")) {
        for (const field of THEME_COLOR_FIELDS) {
          const escaped = field.cssVar.replace(/-/g, "\\-");
          const darkPattern = new RegExp(
            `(\\[data-theme=["']dark["']\\][\\s\\S]*?${escaped}\\s*:\\s*)[^;\\n]+`
          );
          if (darkPattern.test(css)) {
            css = css.replace(darkPattern, `$1${options.colorsDark[field.key]}`);
          }
        }
      } else {
        css = `${css.trim()}\n\n${buildGlobalsDarkVars(options.colorsDark)}\n`;
      }
    }

    writeFileSync(globalsPath, css, "utf8");
  } else {
    mkdirSync(dirname(globalsPath), { recursive: true });
    const snippets = buildExportSnippets(colors, {
      colorsDark: options?.colorsDark,
      appearance: options?.appearance,
    });
    writeFileSync(
      globalsPath,
      `@import "tailwindcss";\n\n${snippets.globalsCss}\n`,
      "utf8"
    );
  }
}

export function readThemeFromProject(projectRoot: string, fallback: ThemeColors): ThemeColors {
  const globalsPath = join(projectRoot, "app", "globals.css");
  if (existsSync(globalsPath)) {
    const parsed = parseThemeFromGlobalsCss(readFileSync(globalsPath, "utf8"));
    return { ...fallback, ...parsed };
  }
  return { ...fallback };
}

export function readThemeDarkFromProject(
  projectRoot: string,
  lightFallback: ThemeColors,
  darkFallback?: ThemeColors
): ThemeColors {
  const globalsPath = join(projectRoot, "app", "globals.css");
  const base = darkFallback ?? deriveDarkColorsFromLight(lightFallback);
  if (existsSync(globalsPath)) {
    const parsed = parseThemeDarkFromGlobalsCss(readFileSync(globalsPath, "utf8"));
    return { ...base, ...parsed };
  }
  return { ...base };
}

export function readThemeAppearanceFromSite(projectRoot: string): ThemeAppearance | undefined {
  const sitePath = join(projectRoot, "constants", "site.ts");
  if (!existsSync(sitePath)) return undefined;
  const content = readFileSync(sitePath, "utf8");
  const match = content.match(/appearance:\s*"([^"]+)"/);
  const value = match?.[1];
  if (value === "light" || value === "dark" || value === "system") return value;
  return undefined;
}
