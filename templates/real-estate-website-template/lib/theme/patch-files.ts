import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

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

export function buildSiteTsThemeBlock(colors: ThemeColors): string {
  const lines = Object.entries(colors).map(([key, value]) => `      ${key}: "${value}",`);
  return `  theme: {\n    colors: {\n${lines.join("\n")}\n    },\n  },`;
}

export function buildGlobalsRootVars(colors: ThemeColors): string {
  const lines = THEME_COLOR_FIELDS.map((f) => `  ${f.cssVar}: ${colors[f.key]};`);
  return `:root {\n${lines.join("\n")}\n}`;
}

export function buildExportSnippets(colors: ThemeColors): { siteTs: string; globalsCss: string } {
  return {
    siteTs: buildSiteTsThemeBlock(colors),
    globalsCss: buildGlobalsRootVars(colors),
  };
}

/**
 * Patch constants/site.ts theme.colors and app/globals.css CSS variables on disk.
 */
export function applyThemeToProjectFiles(projectRoot: string, colors: ThemeColors) {
  const sitePath = join(projectRoot, "constants", "site.ts");
  const globalsPath = join(projectRoot, "app", "globals.css");

  if (existsSync(sitePath)) {
    let siteContent = readFileSync(sitePath, "utf8");
    for (const field of THEME_COLOR_FIELDS) {
      const pattern = new RegExp(`(${field.key}\\s*:\\s*)"[^"]*"`);
      if (pattern.test(siteContent)) {
        siteContent = siteContent.replace(pattern, `$1"${colors[field.key]}"`);
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
    writeFileSync(globalsPath, css, "utf8");
  } else {
    mkdirSync(dirname(globalsPath), { recursive: true });
    writeFileSync(
      globalsPath,
      `@import "tailwindcss";\n\n${buildGlobalsRootVars(colors)}\n`,
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
