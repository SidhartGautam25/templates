/**
 * Optional core modules — copy on demand via new-template --modules or template:add-module.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

import { coreDir } from "./template-core-utils.mjs";
import { buildModulesHomePageSource } from "./template-modules-home.mjs";

const modulesRegistryPath = join(coreDir, "modules.json");
const modulesRoot = join(coreDir, "modules");

/**
 * @returns {{ modules: Record<string, CoreModuleDef> }}
 */
export function loadModulesRegistry() {
  if (!existsSync(modulesRegistryPath)) {
    throw new Error(`Missing modules registry: ${modulesRegistryPath}`);
  }
  return JSON.parse(readFileSync(modulesRegistryPath, "utf8"));
}

/**
 * @typedef {{
 *   label: string;
 *   description?: string;
 *   paths: string[];
 *   featureFlag?: string;
 *   default?: boolean;
 * }} CoreModuleDef
 */

/**
 * @param {string[]} moduleIds
 * @returns {string[]}
 */
export function resolveModuleIds(moduleIds) {
  const registry = loadModulesRegistry();
  const resolved = [];

  for (const id of moduleIds) {
    const trimmed = id.trim();
    if (!trimmed) continue;
    if (!registry.modules[trimmed]) {
      throw new Error(
        `Unknown core module "${trimmed}". Available: ${listModuleIds().join(", ")}`
      );
    }
    if (!resolved.includes(trimmed)) {
      resolved.push(trimmed);
    }
  }

  return resolved;
}

/**
 * @returns {string[]}
 */
export function listModuleIds() {
  const registry = loadModulesRegistry();
  return Object.keys(registry.modules);
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
 * Sample hero copy when hero-simple is first installed on a scaffold template.
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
 * Copy module files into a template and enable feature flags.
 * @param {string} templateRoot Absolute path to template directory
 * @param {string[]} moduleIds Resolved module ids
 * @param {{ displayName?: string }} [options]
 * @returns {string[]} Installed module ids
 */
export function copyModulesIntoTemplate(templateRoot, moduleIds, options = {}) {
  const registry = loadModulesRegistry();
  const resolved = resolveModuleIds(moduleIds);
  const displayName = options.displayName ?? "Your Site";

  for (const id of resolved) {
    const mod = registry.modules[id];
    const moduleDir = join(modulesRoot, id);

    if (!existsSync(moduleDir)) {
      throw new Error(`Module folder missing: packages/core/modules/${id}`);
    }

    for (const relPath of mod.paths) {
      const src = join(moduleDir, relPath);
      const dest = join(templateRoot, relPath);

      if (!existsSync(src)) {
        throw new Error(`Module file missing: packages/core/modules/${id}/${relPath}`);
      }

      mkdirSync(dirname(dest), { recursive: true });
      cpSync(src, dest, { force: true });
    }

    if (mod.featureFlag) {
      enableFeatureFlag(templateRoot, mod.featureFlag);
    }

    if (id === "hero-simple") {
      applyHeroSimpleDefaults(templateRoot, displayName);
    }
    if (id === "enquiry-modal") {
      applyEnquiryModalDefaults(templateRoot, displayName);
    }

    console.log(`  ✓ module: ${id} (${mod.label})`);
  }

  writeInstalledModulesManifest(templateRoot, resolved);

  return resolved;
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
  const uiModules = ["enquiry-modal", "footer", "hero-simple"];
  const installedUi = moduleIds.filter((id) => uiModules.includes(id));

  if (installedUi.length === 0) return;

  const destPage = join(templateRoot, "app", "page.tsx");
  mkdirSync(dirname(destPage), { recursive: true });
  writeFileSync(destPage, buildModulesHomePageSource(moduleIds), "utf8");
  console.log("  ✓ wired app/page.tsx with optional UI modules");
}

/**
 * Parse --modules enquiry-modal,footer from argv or a comma-separated string.
 * @param {string[] | string | undefined} input
 * @returns {string[]}
 */
export function parseModulesArg(input) {
  if (!input) return [];
  const raw = Array.isArray(input) ? input.join(",") : input;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
