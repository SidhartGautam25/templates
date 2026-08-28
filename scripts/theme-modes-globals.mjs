/**
 * theme-modes module install — site migration + globals wiring.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  applyGlobalsThemeBridge,
  buildDarkBlock,
  DEFAULT_LIGHT,
  fixTempjsThemeCss,
  hexLuminance,
  parseDarkColorsFromSiteTs,
  parseThemeColorsFromSiteTs,
  removeLayoutInlineThemeVars,
  THEME_COLOR_KEYS,
} from "./theme-globals-core.mjs";

function deriveDarkFromLight(light) {
  return {
    primary: light.primary ?? "#60a5fa",
    primaryHover: light.primaryHover ?? "#3b82f6",
    accent: light.accent ?? "#38bdf8",
    accentDark: light.accentDark ?? "#0ea5e9",
    accentLight: light.accentDark ?? "#1e3a5f",
    textMain: "#f1f5f9",
    textMuted: "#94a3b8",
    bgMain: "#0f172a",
    bgLight: "#1e293b",
    bgCard: "#1e293b",
    footerBg: "#020617",
    ctaPrimary: light.ctaPrimary ?? "#60a5fa",
    ctaPrimaryHover: light.ctaPrimaryHover ?? "#3b82f6",
  };
}

export function migrateThemeSiteForModes(templateRoot) {
  const sitePath = join(templateRoot, "constants", "site.ts");
  if (!existsSync(sitePath)) return { light: DEFAULT_LIGHT, dark: DEFAULT_LIGHT };

  let content = readFileSync(sitePath, "utf8");
  const current = parseThemeColorsFromSiteTs(content) ?? DEFAULT_LIGHT;
  const darkFirst = current.bgMain && hexLuminance(current.bgMain) < 0.2;

  if (content.includes("colorsDark:")) {
    const dark = parseDarkColorsFromSiteTs(content) ?? deriveDarkFromLight(current);
    const light = darkFirst ? { ...DEFAULT_LIGHT } : current;
    return { light, dark };
  }

  const light = darkFirst ? { ...DEFAULT_LIGHT } : { ...current };
  const dark = darkFirst ? { ...current } : deriveDarkFromLight(current);

  const darkLines = THEME_COLOR_KEYS.map((key) => `      ${key}: "${dark[key]}",`).join("\n");
  const lightLines = THEME_COLOR_KEYS.map((key) => `      ${key}: "${light[key]}",`).join("\n");

  if (!content.includes("appearance:")) {
    content = content.replace(
      /(theme:\s*\{\s*\n)(\s*)colors:/,
      `$1$2appearance: "dark" as const,\n$2colors:`
    );
  }

  if (darkFirst) {
    content = content.replace(
      /colors:\s*\{[\s\S]*?\n\s*\},/,
      `colors: {\n${lightLines}\n    },`
    );
  }

  const themeIdx = content.indexOf("theme:");
  const before = content.slice(0, themeIdx);
  const themeSlice = content.slice(themeIdx);
  const patchedTheme = themeSlice.replace(
    /(\n\s*colors:\s*\{[\s\S]*?\n\s*\},)(\n)/,
    `$1\n    colorsDark: {\n${darkLines}\n    },$2`
  );
  content = before + patchedTheme;

  writeFileSync(sitePath, content, "utf8");
  console.log(
    darkFirst
      ? "  ✓ migrated dark-first palette to colorsDark + light colors in site.ts"
      : "  ✓ added theme.colorsDark and appearance in site.ts"
  );

  return { light, dark };
}

export function applyThemeModesGlobalsPatch(templateRoot, light, dark) {
  applyGlobalsThemeBridge(templateRoot, light, {
    dark,
    rootColorScheme: "light",
    quiet: false,
  });
}

export function applyThemeModesAgencyNavbarPatch(templateRoot) {
  const navbarPath = join(templateRoot, "app", "components", "AgencyNavbar.tsx");
  if (!existsSync(navbarPath)) return;

  let content = readFileSync(navbarPath, "utf8");
  if (content.includes("ThemeModeToggle")) return;

  content = content.replace(
    'import { SITE } from "@/constants";',
    'import { SITE } from "@/constants";\nimport ThemeModeToggle from "@/app/components/ThemeModeToggle";'
  );
  content = content.replace(
    /(\{SITE\.navigation\.contact\}\s*\n\s*<\/button>)(\s*\n\s*<\/nav>)/,
    `$1\n          <ThemeModeToggle />$2`
  );
  writeFileSync(navbarPath, content, "utf8");
  console.log("  ✓ wired ThemeModeToggle into AgencyNavbar");
}

export { fixTempjsThemeCss, removeLayoutInlineThemeVars, buildDarkBlock };
