/**
 * Shared core module installer — used by monorepo scripts and tempjs add-module.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

import { buildModulesHomePageSource } from "./template-modules-home.mjs";
import {
  applyAdminTabRegistry,
  applyAdminDashboard,
} from "./template-modules-admin.mjs";

/**
 * @typedef {{
 *   label: string;
 *   description?: string;
 *   paths: string[];
 *   featureFlag?: string;
 *   prismaFragment?: string;
 *   default?: boolean;
 * }} CoreModuleDef
 */

/**
 * @param {string} coreDir Absolute path to packages/core
 */
export function loadModulesRegistry(coreDir) {
  const modulesRegistryPath = join(coreDir, "modules.json");
  if (!existsSync(modulesRegistryPath)) {
    throw new Error(`Missing modules registry: ${modulesRegistryPath}`);
  }
  return JSON.parse(readFileSync(modulesRegistryPath, "utf8"));
}

/**
 * @param {string} coreDir
 * @returns {string[]}
 */
export function listModuleIds(coreDir) {
  const registry = loadModulesRegistry(coreDir);
  return Object.keys(registry.modules);
}

/**
 * @param {string} coreDir
 * @param {string[]} moduleIds
 * @returns {string[]}
 */
export function resolveModuleIds(coreDir, moduleIds) {
  const registry = loadModulesRegistry(coreDir);
  const resolved = [];

  for (const id of moduleIds) {
    const trimmed = id.trim();
    if (!trimmed) continue;
    if (!registry.modules[trimmed]) {
      throw new Error(
        `Unknown core module "${trimmed}". Available: ${listModuleIds(coreDir).join(", ")}`
      );
    }
    if (!resolved.includes(trimmed)) {
      resolved.push(trimmed);
    }
  }

  return resolved;
}

/**
 * @param {string} templateRoot
 * @param {string} moduleId
 * @param {string} fragmentRelPath
 * @param {string} modulesRoot
 */
function appendPrismaFragment(templateRoot, moduleId, fragmentRelPath, modulesRoot) {
  const fragmentPath = join(modulesRoot, moduleId, fragmentRelPath);
  if (!existsSync(fragmentPath)) {
    throw new Error(`Prisma fragment missing: ${fragmentPath}`);
  }

  const fragment = readFileSync(fragmentPath, "utf8").trim();
  const modelMatch = fragment.match(/model\s+(\w+)\s*\{/);
  const modelName = modelMatch?.[1];

  const domainPath = join(templateRoot, "prisma", "domain.prisma");
  let domain = existsSync(domainPath) ? readFileSync(domainPath, "utf8") : "";

  if (modelName && domain.includes(`model ${modelName}`)) {
    console.log(`  · prisma model ${modelName} already in domain.prisma`);
    return;
  }

  domain = domain.trim();
  domain = domain ? `${domain}\n\n${fragment}\n` : `${fragment}\n`;
  mkdirSync(dirname(domainPath), { recursive: true });
  writeFileSync(domainPath, domain, "utf8");
  console.log(`  ✓ appended prisma fragment: ${modelName ?? fragmentRelPath}`);
}

/**
 * @param {string} templateRoot
 * @param {{ skipMetadataReplace?: boolean }} [patchOptions]
 */
function applySeoLayoutPatch(templateRoot, patchOptions = {}) {
  const layoutPath = join(templateRoot, "app", "layout.tsx");
  if (!existsSync(layoutPath)) return;

  let content = readFileSync(layoutPath, "utf8");

  if (!content.includes("SiteJsonLd")) {
    const cssImport = content.match(/import\s+["']\.\/globals\.css["'];?/);
    if (cssImport) {
      content = content.replace(
        cssImport[0],
        `${cssImport[0]}\nimport SiteJsonLd from "@/app/components/SiteJsonLd";`
      );
    } else {
      content = `import SiteJsonLd from "@/app/components/SiteJsonLd";\n${content}`;
    }

    if (content.includes("<QueryProvider>")) {
      content = content.replace("<QueryProvider>", "<SiteJsonLd />\n        <QueryProvider>");
    } else if (content.includes("<body")) {
      content = content.replace(/<body([^>]*)>/, "<body$1>\n        <SiteJsonLd />");
    }

    writeFileSync(layoutPath, content, "utf8");
    console.log("  ✓ wired SiteJsonLd into app/layout.tsx");
    content = readFileSync(layoutPath, "utf8");
  }

  if (!patchOptions.skipMetadataReplace && !content.includes("buildPageMetadata")) {
    content = content.replace(
      'import type { Metadata } from "next";',
      'import type { Metadata } from "next";\nimport { buildPageMetadata } from "@/lib/seo/metadata";'
    );
    content = content.replace(
      /export const metadata: Metadata = \{[\s\S]*?\};/,
      "export const metadata: Metadata = buildPageMetadata();"
    );
    writeFileSync(layoutPath, content, "utf8");
    console.log("  ✓ upgraded app/layout.tsx metadata via buildPageMetadata()");
  }
}

/**
 * @param {string} templateRoot
 */
function applyBlogComposeSitemapPatch(templateRoot) {
  const sitemapPath = join(templateRoot, "app", "sitemap.ts");
  if (!existsSync(sitemapPath)) return;

  let content = readFileSync(sitemapPath, "utf8");
  if (content.includes("lib/blog/register-sitemap")) return;
  if (!content.includes("buildAppSitemap")) return;

  const importLine = 'import "@/lib/blog/register-sitemap";';
  if (content.includes('from "@/lib/seo/sitemap"')) {
    content = content.replace(
      /import\s*\{[^}]*buildAppSitemap[^}]*\}\s*from\s*"@\/lib\/seo\/sitemap";/,
      (match) => `${match}\n${importLine}`
    );
  } else {
    content = `${importLine}\n${content}`;
  }

  writeFileSync(sitemapPath, content, "utf8");
  console.log("  ✓ wired blog post slugs into app/sitemap.ts");
}

const THEME_COLOR_KEYS = [
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

const THEME_CSS_VARS = [
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

/**
 * @param {Record<string, string>} light
 */
function deriveDarkColorsFromLight(light) {
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

/**
 * @param {string} siteContent
 */
function parseLightColorsFromSiteTs(siteContent) {
  const themeIdx = siteContent.indexOf("theme:");
  if (themeIdx < 0) return null;
  const slice = siteContent.slice(themeIdx);
  const colorsMatch = slice.match(/colors:\s*\{([\s\S]*?)\n\s*\},/);
  if (!colorsMatch?.[1]) return null;
  const inner = colorsMatch[1];
  /** @type {Record<string, string>} */
  const colors = {};
  for (const key of THEME_COLOR_KEYS) {
    const match = inner.match(new RegExp(`${key}\\s*:\\s*"([^"]+)"`));
    if (match?.[1]) colors[key] = match[1];
  }
  return Object.keys(colors).length > 0 ? colors : null;
}

/**
 * @param {string} templateRoot
 */
function applyThemeModesSitePatch(templateRoot) {
  const sitePath = join(templateRoot, "constants", "site.ts");
  if (!existsSync(sitePath)) return;

  let content = readFileSync(sitePath, "utf8");
  if (content.includes("colorsDark:")) {
    console.log("  · theme colorsDark already in site.ts");
    return;
  }

  const light = parseLightColorsFromSiteTs(content) ?? {};
  const dark = deriveDarkColorsFromLight(light);
  const darkLines = THEME_COLOR_KEYS.map((key) => `      ${key}: "${dark[key]}",`).join("\n");

  if (!content.includes("appearance:")) {
    content = content.replace(
      /(theme:\s*\{\s*\n)(\s*)colors:/,
      `$1$2appearance: "system" as const,\n$2colors:`
    );
  }

  const themeIdx = content.indexOf("theme:");
  if (themeIdx < 0) return;
  const before = content.slice(0, themeIdx);
  const themeSlice = content.slice(themeIdx);
  const patchedTheme = themeSlice.replace(
    /(\n\s*colors:\s*\{[\s\S]*?\n\s*\},)(\n)/,
    `$1\n    colorsDark: {\n${darkLines}\n    },$2`
  );
  content = before + patchedTheme;

  writeFileSync(sitePath, content, "utf8");
  console.log("  ✓ added theme.appearance and theme.colorsDark to constants/site.ts");
}

/**
 * @param {string} templateRoot
 * @param {Record<string, string>} dark
 */
function applyThemeModesCssPatch(templateRoot, dark) {
  const globalsPath = join(templateRoot, "app", "globals.css");
  if (!existsSync(globalsPath)) return;

  let css = readFileSync(globalsPath, "utf8");
  if (css.includes("[data-theme=\"dark\"]")) {
    console.log("  · [data-theme=\"dark\"] already in globals.css");
  } else {
    const lines = THEME_CSS_VARS.map((cssVar, index) => {
      const key = THEME_COLOR_KEYS[index];
      return `  ${cssVar}: ${dark[key]};`;
    });
    css = `${css.trim()}\n\n[data-theme="dark"] {\n${lines.join("\n")}\n}\n`;
    console.log("  ✓ appended [data-theme=\"dark\"] CSS variables to app/globals.css");
  }

  if (!css.includes("color-scheme:")) {
    css = css.replace(
      /:root\s*\{/,
      ":root {\n  color-scheme: light;"
    );
    if (css.includes("[data-theme=\"dark\"]")) {
      css = css.replace(
        /\[data-theme="dark"\]\s*\{/,
        "[data-theme=\"dark\"] {\n  color-scheme: dark;"
      );
    }
    console.log("  ✓ set color-scheme on :root and [data-theme=\"dark\"] for native UI");
  }

  writeFileSync(globalsPath, css, "utf8");
}

/**
 * @param {string} templateRoot
 */
function applyThemeModesLayoutPatch(templateRoot) {
  const layoutPath = join(templateRoot, "app", "layout.tsx");
  if (!existsSync(layoutPath)) return;

  let content = readFileSync(layoutPath, "utf8");

  if (content.includes("SITE.theme.colors") && content.includes("style={{")) {
    content = content.replace(/\s*style=\{\{[\s\S]*?SITE\.theme\.colors[\s\S]*?\}\s*as React\.CSSProperties\}\}/, "");
    console.log("  ✓ removed inline theme CSS vars from <html> (uses data-theme CSS instead)");
  }

  if (!content.includes("ThemeModeInit")) {
    const cssImport = content.match(/import\s+["']\.\/globals\.css["'];?/);
    if (cssImport) {
      content = content.replace(
        cssImport[0],
        `${cssImport[0]}\nimport ThemeModeInit from "@/app/components/ThemeModeInit";`
      );
    } else {
      content = `import ThemeModeInit from "@/app/components/ThemeModeInit";\n${content}`;
    }

    if (content.includes("<body")) {
      content = content.replace(/<body([^>]*)>/, "<body$1>\n        <ThemeModeInit />");
    }

    writeFileSync(layoutPath, content, "utf8");
    console.log("  ✓ wired ThemeModeInit into app/layout.tsx");
    content = readFileSync(layoutPath, "utf8");
  }

  if (!/<html[^>]*suppressHydrationWarning/.test(content)) {
    content = content.replace(/<html([^>]*)>/, "<html$1 suppressHydrationWarning>");
    writeFileSync(layoutPath, content, "utf8");
    console.log("  ✓ added suppressHydrationWarning on <html> for theme mode init");
    content = readFileSync(layoutPath, "utf8");
  }

  if (!/<body[^>]*suppressHydrationWarning/.test(content)) {
    content = content.replace(/<body([^>]*)>/, (match, attrs) => {
      if (attrs.includes("suppressHydrationWarning")) return match;
      return `<body${attrs} suppressHydrationWarning>`;
    });
    writeFileSync(layoutPath, content, "utf8");
    console.log("  ✓ added suppressHydrationWarning on <body> for theme mode init");
  }
}

/**
 * @param {string} templateRoot
 */
function applyThemeModesInstall(templateRoot) {
  const sitePath = join(templateRoot, "constants", "site.ts");
  const light = existsSync(sitePath)
    ? parseLightColorsFromSiteTs(readFileSync(sitePath, "utf8")) ?? {}
    : {};
  const dark = deriveDarkColorsFromLight(light);
  applyThemeModesSitePatch(templateRoot);
  applyThemeModesCssPatch(templateRoot, dark);
  applyThemeModesLayoutPatch(templateRoot);
}

/**
 * @param {string} templateRoot
 * @param {string} featureFlag
 */
function enableFeatureFlag(templateRoot, featureFlag) {
  const sitePath = join(templateRoot, "constants", "site.ts");
  if (!existsSync(sitePath)) return;

  let content = readFileSync(sitePath, "utf8");
  const pattern = new RegExp(`(${featureFlag}\\s*:\\s*)false`);
  if (!pattern.test(content)) {
    console.warn(`  ⚠ feature flag ${featureFlag} not found in constants/site.ts`);
    return;
  }
  content = content.replace(pattern, "$1true");
  writeFileSync(sitePath, content, "utf8");
}

/**
 * @param {string} templateRoot
 * @param {string} displayName
 */
function applyHeroSimpleDefaults(templateRoot, displayName) {
  const sitePath = join(templateRoot, "constants", "site.ts");
  if (!existsSync(sitePath)) return;

  let content = readFileSync(sitePath, "utf8");
  const replacements = [
    ['eyebrow: "WELCOME"', `eyebrow: "WELCOME TO ${displayName.toUpperCase()}"`],
    ['headline: "Your headline here"', `headline: "${displayName}"`],
    [
      'subheadline: "Your subheadline here."',
      'subheadline: "Edit constants/site.ts to customize hero copy and add hero images."',
    ],
    [
      "features: [] as { icon: string; label: string }[]",
      "features: [{ icon: \"sparkles\", label: \"Quality\" }, { icon: \"shield\", label: \"Trusted\" }] as { icon: string; label: string }[]",
    ],
    [
      "ctaButtons: [] as { label: string; enquiryLabel: string }[]",
      "ctaButtons: [{ label: \"Contact us\", enquiryLabel: \"General enquiry\" }] as { label: string; enquiryLabel: string }[]",
    ],
  ];

  for (const [find, replace] of replacements) {
    if (content.includes(find)) {
      content = content.replace(find, replace);
    }
  }

  writeFileSync(sitePath, content, "utf8");
}

/**
 * @param {string} templateRoot
 * @param {string} displayName
 */
function applyEnquiryModalDefaults(templateRoot, displayName) {
  const sitePath = join(templateRoot, "constants", "site.ts");
  if (!existsSync(sitePath)) return;

  let content = readFileSync(sitePath, "utf8");
  const replacements = [
    ['modalTitle: "Demo Client Site"', `modalTitle: "${displayName}"`],
    [
      "selectionOptions: [] as { value: string; label: string }[]",
      "selectionOptions: [{ value: \"General enquiry\", label: \"General enquiry\" }] as { value: string; label: string }[]",
    ],
  ];

  for (const [find, replace] of replacements) {
    if (content.includes(find)) {
      content = content.replace(find, replace);
    }
  }

  writeFileSync(sitePath, content, "utf8");
}

/**
 * @param {string} templateRoot
 * @param {string[]} moduleIds
 */
export function writeInstalledModulesManifest(templateRoot, moduleIds) {
  const manifestPath = join(templateRoot, ".tempjs-modules.json");
  let existing = { coreModules: [] };

  if (existsSync(manifestPath)) {
    try {
      existing = JSON.parse(readFileSync(manifestPath, "utf8"));
    } catch {
      existing = { coreModules: [] };
    }
  }

  const merged = [...new Set([...(existing.coreModules ?? []), ...moduleIds])];
  writeFileSync(
    manifestPath,
    JSON.stringify({ coreModules: merged, updatedAt: new Date().toISOString() }, null, 2) + "\n",
    "utf8"
  );
}

/**
 * @param {string} templateRoot
 * @param {string[]} moduleIds
 */
export function applyModulesHomePage(templateRoot, moduleIds) {
  const uiModules = [
    "enquiry-modal",
    "footer",
    "hero-simple",
    "gallery",
    "reviews",
    "blog-compose",
  ];
  const installedUi = moduleIds.filter((id) => uiModules.includes(id));

  if (installedUi.length === 0) return;

  const destPage = join(templateRoot, "app", "page.tsx");
  mkdirSync(dirname(destPage), { recursive: true });
  writeFileSync(destPage, buildModulesHomePageSource(moduleIds), "utf8");
  console.log("  ✓ wired app/page.tsx with optional UI modules");
}

/**
 * Copy module files into a project and enable feature flags.
 * @param {string} templateRoot Absolute path to project/template directory
 * @param {string[]} moduleIds Module ids (resolved or raw)
 * @param {{
 *   coreDir: string;
 *   displayName?: string;
 *   excludePaths?: string[];
 *   skipHomePage?: boolean;
 *   skipAdminTabRegistry?: boolean;
 *   skipAdminContentPage?: boolean;
 *   skipSeoMetadataReplace?: boolean;
 *   installOptions?: { blogSidebar?: boolean };
 *   writePrismaSchema?: (root: string) => void;
 * }} options
 * @returns {string[]} Installed module ids
 */
export function copyModulesIntoProject(templateRoot, moduleIds, options) {
  const { coreDir } = options;
  const modulesRoot = join(coreDir, "modules");
  const registry = loadModulesRegistry(coreDir);
  const resolved = resolveModuleIds(coreDir, moduleIds);
  const displayName = options.displayName ?? "Your Site";
  const exclude = new Set(options.excludePaths ?? []);

  for (const id of resolved) {
    const mod = registry.modules[id];
    const moduleDir = join(modulesRoot, id);

    if (!existsSync(moduleDir)) {
      throw new Error(`Module folder missing: ${moduleDir}`);
    }

    for (const relPath of mod.paths) {
      if (exclude.has(relPath)) {
        console.log(`  · skipped path (excluded): ${relPath}`);
        continue;
      }

      const src = join(moduleDir, relPath);
      const dest = join(templateRoot, relPath);

      if (!existsSync(src)) {
        throw new Error(`Module file missing: ${join(moduleDir, relPath)}`);
      }

      mkdirSync(dirname(dest), { recursive: true });
      cpSync(src, dest, { force: true, recursive: true });
    }

    if (mod.featureFlag) {
      enableFeatureFlag(templateRoot, mod.featureFlag);
    }

    if (mod.prismaFragment) {
      appendPrismaFragment(templateRoot, id, mod.prismaFragment, modulesRoot);
    }

    if (id === "hero-simple") {
      applyHeroSimpleDefaults(templateRoot, displayName);
    }
    if (id === "enquiry-modal") {
      applyEnquiryModalDefaults(templateRoot, displayName);
    }
    if (id === "theme-modes") {
      applyThemeModesInstall(templateRoot);
    }

    console.log(`  ✓ module: ${id} (${mod.label})`);
  }

  if (resolved.includes("blog-compose")) {
    applyBlogComposeSitemapPatch(templateRoot);
    if (options.installOptions?.blogSidebar) {
      enableFeatureFlag(templateRoot, "blogSidebar");
      console.log("  ✓ enabled SITE.features.blogSidebar (blog article sidebar)");
    }
  }

  if (options.writePrismaSchema) {
    options.writePrismaSchema(templateRoot);
  }

  writeInstalledModulesManifest(templateRoot, resolved);

  if (resolved.includes("seo")) {
    applySeoLayoutPatch(templateRoot, {
      skipMetadataReplace: options.skipSeoMetadataReplace,
    });
  }

  if (!options.skipHomePage) {
    applyModulesHomePage(templateRoot, resolved);
  }

  const skipAdminTabRegistry =
    options.skipAdminTabRegistry ?? options.skipAdminContentPage ?? false;

  if (
    !skipAdminTabRegistry &&
    resolved.some((id) => id === "gallery" || id === "reviews" || id === "blog-compose")
  ) {
    applyAdminTabRegistry(templateRoot, resolved);
  }

  return resolved;
}

/**
 * @param {string[] | string | undefined} input
 * @returns {{ id: string, extras: string[] }[]}
 */
export function parseModuleSpecs(input) {
  if (!input) return [];
  const raw = Array.isArray(input) ? input.join(",") : input;
  const specs = [];
  for (const part of raw.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const pieces = trimmed.split("+").map((s) => s.trim()).filter(Boolean);
    if (pieces.length === 0) continue;
    specs.push({ id: pieces[0], extras: pieces.slice(1) });
  }
  return specs;
}

/**
 * @param {{ id: string, extras: string[] }[]} specs
 */
export function moduleInstallOptionsFromSpecs(specs) {
  return {
    blogSidebar:
      specs.some((s) => s.id === "blog-compose" && s.extras.includes("sidebar")),
  };
}

/**
 * @param {string[] | string | undefined} input
 * @returns {string[]}
 */
export function parseModulesArg(input) {
  return parseModuleSpecs(input).map((s) => s.id);
}
