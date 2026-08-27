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
 *   /** @deprecated Use skipAdminTabRegistry */
 *   skipAdminContentPage?: boolean;
 *   skipSeoMetadataReplace?: boolean;
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
