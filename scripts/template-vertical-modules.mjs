/**
 * Template-level vertical modules — room-types, projects, slug-pages, etc.
 * Source lives under templates/<name>/modules/<module-id>/ and is assembled into the template root.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

import { writeMergedPrismaSchema } from "./template-core-utils.mjs";

const REGISTRY_FILENAME = "template-modules.json";

/**
 * @typedef {{
 *   label: string;
 *   description?: string;
 *   paths: string[];
 *   prismaFragment?: string;
 *   featureFlag?: string;
 * }} TemplateModuleDef
 */

/**
 * @param {string} templateRoot
 * @returns {{ modules: Record<string, TemplateModuleDef> }}
 */
export function loadTemplateModulesRegistry(templateRoot) {
  const registryPath = join(templateRoot, REGISTRY_FILENAME);
  if (!existsSync(registryPath)) {
    throw new Error(`Missing ${REGISTRY_FILENAME} in ${templateRoot}`);
  }
  return JSON.parse(readFileSync(registryPath, "utf8"));
}

/**
 * @param {string} templateRoot
 * @returns {string}
 */
export function templateModulesRoot(templateRoot) {
  return join(templateRoot, "modules");
}

/**
 * @param {string} templateRoot
 * @returns {string[]}
 */
export function listTemplateModuleIds(templateRoot) {
  const registry = loadTemplateModulesRegistry(templateRoot);
  return Object.keys(registry.modules);
}

/**
 * @param {string} templateRoot
 * @param {string[]} moduleIds
 * @returns {string[]}
 */
export function resolveTemplateModuleIds(templateRoot, moduleIds) {
  const registry = loadTemplateModulesRegistry(templateRoot);
  const resolved = [];

  for (const id of moduleIds) {
    const trimmed = id.trim();
    if (!trimmed) continue;
    if (!registry.modules[trimmed]) {
      throw new Error(
        `Unknown template module "${trimmed}". Available: ${listTemplateModuleIds(templateRoot).join(", ")}`
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
function appendTemplatePrismaFragment(templateRoot, moduleId, fragmentRelPath, modulesRoot) {
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
 * Copy paths from modules/<id>/ into template root.
 * @param {string} templateRoot
 * @param {string[]} moduleIds
 * @param {{ writePrisma?: boolean }} [options]
 * @returns {string[]}
 */
export function assembleTemplateModules(templateRoot, moduleIds, options = {}) {
  const modulesRoot = templateModulesRoot(templateRoot);
  const registry = loadTemplateModulesRegistry(templateRoot);
  const resolved = resolveTemplateModuleIds(templateRoot, moduleIds);

  for (const id of resolved) {
    const mod = registry.modules[id];
    const moduleDir = join(modulesRoot, id);

    if (!existsSync(moduleDir)) {
      throw new Error(`Template module folder missing: ${moduleDir}`);
    }

    for (const relPath of mod.paths) {
      const src = join(moduleDir, relPath);
      const dest = join(templateRoot, relPath);

      if (!existsSync(src)) {
        throw new Error(`Template module file missing: ${join(moduleDir, relPath)}`);
      }

      mkdirSync(dirname(dest), { recursive: true });
      cpSync(src, dest, { force: true, recursive: true });
    }

    if (mod.prismaFragment) {
      appendTemplatePrismaFragment(templateRoot, id, mod.prismaFragment, modulesRoot);
    }

    if (mod.featureFlag) {
      enableFeatureFlag(templateRoot, mod.featureFlag);
    }

    console.log(`  ✓ template module: ${id} (${mod.label})`);
  }

  if (options.writePrisma ?? true) {
    writeMergedPrismaSchema(templateRoot);
  }

  writeInstalledTemplateModulesManifest(templateRoot, resolved);

  return resolved;
}

/**
 * Copy template root paths into modules/<id>/ (maintainer bootstrap).
 * @param {string} templateRoot
 * @param {string[]} moduleIds
 */
export function extractTemplateModules(templateRoot, moduleIds) {
  const modulesRoot = templateModulesRoot(templateRoot);
  const registry = loadTemplateModulesRegistry(templateRoot);
  const resolved = resolveTemplateModuleIds(templateRoot, moduleIds);

  for (const id of resolved) {
    const mod = registry.modules[id];

    for (const relPath of mod.paths) {
      const src = join(templateRoot, relPath);
      const dest = join(modulesRoot, id, relPath);

      if (!existsSync(src)) {
        console.warn(`  ⚠ skip extract (missing in template): ${relPath}`);
        continue;
      }

      mkdirSync(dirname(dest), { recursive: true });
      cpSync(src, dest, { force: true, recursive: true });
    }

    if (mod.prismaFragment) {
      const fragmentSrc = join(templateRoot, "prisma", mod.prismaFragment.replace(/^prisma\//, ""));
      const fragmentDest = join(modulesRoot, id, mod.prismaFragment);
      if (existsSync(fragmentSrc)) {
        mkdirSync(dirname(fragmentDest), { recursive: true });
        cpSync(fragmentSrc, fragmentDest, { force: true });
      }
    }

    console.log(`  ✓ extracted template module: ${id}`);
  }
}

/**
 * @param {string} templateRoot
 * @param {string[]} moduleIds
 */
/**
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

export function writeInstalledTemplateModulesManifest(templateRoot, moduleIds) {
  const manifestPath = join(templateRoot, ".tempjs-modules.json");
  let existing = { coreModules: [], templateModules: [] };

  if (existsSync(manifestPath)) {
    try {
      existing = JSON.parse(readFileSync(manifestPath, "utf8"));
    } catch {
      existing = { coreModules: [], templateModules: [] };
    }
  }

  const merged = [...new Set([...(existing.templateModules ?? []), ...moduleIds])];
  writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        ...existing,
        templateModules: merged,
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    ) + "\n",
    "utf8"
  );
}
