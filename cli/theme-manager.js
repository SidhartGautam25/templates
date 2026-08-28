import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const THEMES = [
  {
    id: "theme1",
    name: "Theme 1 (Slate / Blue)",
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
    }
  },
  {
    id: "theme2",
    name: "Theme 2 (Forest / Green)",
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
    }
  },
  {
    id: "theme3",
    name: "Theme 3 (Purple / Violet)",
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
    }
  },
  {
    id: "theme4",
    name: "Theme 4 (Red / Crimson)",
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
    }
  },
  {
    id: "theme5",
    name: "Theme 5 (Amber / Gold)",
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
    }
  }
];

export const FONTS = [
  {
    id: "default",
    name: "Playfair Display (Serif) + Outfit (Sans-serif) [Default]",
    serif: "'Playfair Display', Georgia, serif",
    sans: "'Outfit', system-ui, sans-serif",
    importUrl: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
  },
  {
    id: "inter",
    name: "Inter (Sans-serif) + Inter (Sans-serif)",
    serif: "'Inter', system-ui, sans-serif",
    sans: "'Inter', system-ui, sans-serif",
    importUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
  },
  {
    id: "lora-montserrat",
    name: "Lora (Serif) + Montserrat (Sans-serif)",
    serif: "'Lora', Georgia, serif",
    sans: "'Montserrat', system-ui, sans-serif",
    importUrl: "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap"
  },
  {
    id: "merriweather-open-sans",
    name: "Merriweather (Serif) + Open Sans (Sans-serif)",
    serif: "'Merriweather', Georgia, serif",
    sans: "'Open Sans', system-ui, sans-serif",
    importUrl: "https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Open+Sans:wght@300;400;500;600;700&display=swap"
  },
  {
    id: "cinzel-montserrat",
    name: "Cinzel (Serif) + Montserrat (Sans-serif)",
    serif: "'Cinzel', serif",
    sans: "'Montserrat', system-ui, sans-serif",
    importUrl: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@300;400;500;600;700&display=swap"
  }
];

export function getSavedConfig(targetDir) {
  const configPath = join(targetDir, ".tempjsrc");
  if (existsSync(configPath)) {
    try {
      return JSON.parse(readFileSync(configPath, "utf8"));
    } catch {
      return {};
    }
  }
  return {};
}

export function resolveThemeId(id) {
  const theme = THEMES.find((t) => t.id === id);
  if (!theme) {
    throw new Error(
      `Unknown theme: ${id}. Valid options: ${THEMES.map((t) => t.id).join(", ")}`
    );
  }
  return theme.id;
}

export function resolveFontId(id) {
  const font = FONTS.find((f) => f.id === id);
  if (!font) {
    throw new Error(
      `Unknown font: ${id}. Valid options: ${FONTS.map((f) => f.id).join(", ")}`
    );
  }
  return font.id;
}

async function promptSelection(options, promptText, defaultValue) {
  const rl = createInterface({ input, output });
  try {
    console.log(`\n${promptText}`);
    for (let i = 0; i < options.length; i++) {
      const isDefault = options[i].id === defaultValue ? " (current default)" : "";
      console.log(`  [${i + 1}] ${options[i].name}${isDefault}`);
    }
    const defaultIndex = options.findIndex(o => o.id === defaultValue) + 1;
    const placeholder = defaultIndex > 0 ? defaultIndex : 1;
    const actualDefault = defaultIndex > 0 ? defaultValue : options[0].id;

    while (true) {
      const answer = await rl.question(`Choose an option (1-${options.length}) [${placeholder}]: `);
      const trimmed = answer.trim();
      if (trimmed === "") return actualDefault;
      const num = parseInt(trimmed, 10);
      if (num >= 1 && num <= options.length) {
        return options[num - 1].id;
      }
      console.log("Invalid option. Please try again.");
    }
  } finally {
    rl.close();
  }
}

export async function promptTheme(currentThemeId = "theme1", options = {}) {
  if (options.yes || options.theme) {
    return resolveThemeId(options.theme || currentThemeId || "theme1");
  }
  return promptSelection(THEMES, "Available Themes:", currentThemeId);
}

export async function promptFont(currentFontId = "default", options = {}) {
  if (options.yes || options.font) {
    return resolveFontId(options.font || currentFontId || "default");
  }
  return promptSelection(FONTS, "Available Font combinations:", currentFontId);
}

export async function findGlobalsCss(dir) {
  const commonPaths = [
    join(dir, "app/globals.css"),
    join(dir, "src/app/globals.css"),
    join(dir, "src/globals.css"),
    join(dir, "globals.css"),
  ];
  for (const p of commonPaths) {
    if (existsSync(p)) return p;
  }

  async function search(currentDir) {
    let entries;
    try {
      entries = await readdir(currentDir, { withFileTypes: true });
    } catch {
      return null;
    }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (
          entry.name === "node_modules" ||
          entry.name === ".next" ||
          entry.name === ".git" ||
          entry.name === "dist" ||
          entry.name === "build"
        ) {
          continue;
        }
        const found = await search(join(currentDir, entry.name));
        if (found) return found;
      } else if (entry.name === "globals.css") {
        return join(currentDir, entry.name);
      }
    }
    return null;
  }
  return search(dir);
}

export async function findSiteTs(dir) {
  const commonPaths = [
    join(dir, "constants/site.ts"),
    join(dir, "src/constants/site.ts"),
    join(dir, "constants/site.js"),
    join(dir, "src/constants/site.js"),
  ];
  for (const p of commonPaths) {
    if (existsSync(p)) return p;
  }

  async function search(currentDir) {
    let entries;
    try {
      entries = await readdir(currentDir, { withFileTypes: true });
    } catch {
      return null;
    }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (
          entry.name === "node_modules" ||
          entry.name === ".next" ||
          entry.name === ".git" ||
          entry.name === "dist" ||
          entry.name === "build"
        ) {
          continue;
        }
        const found = await search(join(currentDir, entry.name));
        if (found) return found;
      } else if (entry.name === "site.ts" || entry.name === "site.js") {
        return join(currentDir, entry.name);
      }
    }
    return null;
  }
  return search(dir);
}

export async function applyThemeAndFont(targetDir, themeId, fontId) {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const font = FONTS.find(f => f.id === fontId) || FONTS[0];

  // 1. Write metadata config file .tempjsrc
  const configPath = join(targetDir, ".tempjsrc");
  const config = {
    theme: theme.id,
    font: font.id,
    updatedAt: new Date().toISOString()
  };
  await writeFile(configPath, JSON.stringify(config, null, 2), "utf8");

  // 2. Find and update globals.css
  const globalsPath = await findGlobalsCss(targetDir);
  if (globalsPath) {
    const cssDir = join(globalsPath, "..");
    const themeCssPath = join(cssDir, "tempjs-theme.css");

    // Construct the theme css content
    const cssContent = `/* tempjs generated theme settings */
@import url('${font.importUrl}');

:root {
  --primary: ${theme.colors.primary};
  --primary-hover: ${theme.colors.primaryHover};
  --accent-gold: ${theme.colors.accent};
  --accent-gold-dark: ${theme.colors.accentDark};
  --accent-gold-light: ${theme.colors.accentLight};
  --text-main: ${theme.colors.textMain};
  --text-muted: ${theme.colors.textMuted};
  --bg-tan: ${theme.colors.bgMain};
  --bg-light: ${theme.colors.bgLight};
  --bg-card: ${theme.colors.bgCard};
  --footer-bg: ${theme.colors.footerBg};
  --cta-primary: ${theme.colors.ctaPrimary};
  --cta-primary-hover: ${theme.colors.ctaPrimaryHover};

  --font-serif: ${font.serif};
  --font-sans: ${font.sans};
}
`;
    await writeFile(themeCssPath, cssContent, "utf8");

    // Ensure it's imported in globals.css
    let globalsContent = await readFile(globalsPath, "utf8");
    if (!globalsContent.includes("tempjs-theme.css")) {
      // Prepend import at the top of the file
      globalsContent = `@import "./tempjs-theme.css";\n` + globalsContent;
    }

    // Always append/update a timestamp touch comment to force bundler/Tailwind CSS recompilation
    globalsContent = globalsContent.replace(/\/\* tempjs-touch: \d+ \*\/\s*$/, "");
    globalsContent = globalsContent.trim() + `\n/* tempjs-touch: ${Date.now()} */\n`;
    await writeFile(globalsPath, globalsContent, "utf8");
  } else {
    console.warn("Could not locate globals.css file in the project. CSS variables and font imports were not applied.");
  }

  // 3. Find and update site.ts
  const siteTsPath = await findSiteTs(targetDir);
  if (siteTsPath) {
    let siteContent = await readFile(siteTsPath, "utf8");
    const colorsRegex = /colors:\s*\{[\s\S]*?\}/;
    const replacement = `colors: {
      primary: "${theme.colors.primary}",
      primaryHover: "${theme.colors.primaryHover}",
      accent: "${theme.colors.accent}",
      accentDark: "${theme.colors.accentDark}",
      accentLight: "${theme.colors.accentLight}",
      textMain: "${theme.colors.textMain}",
      textMuted: "${theme.colors.textMuted}",
      bgMain: "${theme.colors.bgMain}",
      bgLight: "${theme.colors.bgLight}",
      bgCard: "${theme.colors.bgCard}",
      footerBg: "${theme.colors.footerBg}",
      ctaPrimary: "${theme.colors.ctaPrimary}",
      ctaPrimaryHover: "${theme.colors.ctaPrimaryHover}",
    }`;
    if (colorsRegex.test(siteContent)) {
      siteContent = siteContent.replace(colorsRegex, replacement);
      await writeFile(siteTsPath, siteContent, "utf8");
    }
  }

  console.log(`\nSuccessfully applied theme "${theme.name}" and font pairing "${font.name}".`);
}
