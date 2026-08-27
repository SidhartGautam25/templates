/**
 * Compare installed core / template module files against their source-of-truth copies.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";

import { coreDir, listFilesRecursive } from "./template-core-utils.mjs";
import { loadModulesRegistryFromCore } from "./template-modules.mjs";
import {
  loadTemplateModulesRegistry,
  templateModulesRoot,
} from "./template-vertical-modules.mjs";

function hashContent(content) {
  return createHash("sha256").update(content).digest("hex");
}

/**
 * @param {string} basePath File or directory
 * @returns {string[]} Absolute file paths
 */
function expandModulePath(basePath) {
  if (!existsSync(basePath)) return [];
  const stat = statSync(basePath);
  if (stat.isDirectory()) {
    return listFilesRecursive(basePath);
  }
  return [basePath];
}

/**
 * @param {string} moduleSrcRoot modules/<id>/ directory
 * @param {string} templateRoot
 * @param {string[]} paths Registry path entries (files or dirs)
 */
function diffModulePaths(moduleSrcRoot, templateRoot, paths) {
  const matches = [];
  const differs = [];
  const missingInTemplate = [];
  const extraInTemplate = [];

  const trackedDest = new Set();

  for (const relPath of paths) {
    const srcBase = join(moduleSrcRoot, relPath);
    const destBase = join(templateRoot, relPath);

    for (const srcFile of expandModulePath(srcBase)) {
      const innerRel = relative(srcBase, srcFile).replace(/\\/g, "/");
      const destFile = innerRel ? join(destBase, innerRel) : destBase;
      const displayRel = innerRel ? `${relPath.replace(/\/$/, "")}/${innerRel}` : relPath;

      trackedDest.add(displayRel);

      if (!existsSync(destFile)) {
        missingInTemplate.push(displayRel);
        continue;
      }

      const srcHash = hashContent(readFileSync(srcFile, "utf8"));
      const destHash = hashContent(readFileSync(destFile, "utf8"));
      if (srcHash === destHash) {
        matches.push(displayRel);
      } else {
        differs.push(displayRel);
      }
    }
  }

  return { matches, differs, missingInTemplate, extraInTemplate };
}

/**
 * @param {string} templateRoot
 * @param {string[]} installedIds
 */
export function diffCoreModules(templateRoot, installedIds) {
  const registry = loadModulesRegistryFromCore();
  const modulesRoot = join(coreDir, "modules");
  const results = [];

  for (const id of installedIds) {
    const mod = registry.modules[id];
    if (!mod) {
      results.push({
        id,
        kind: "core",
        error: `Unknown core module id in manifest: ${id}`,
        matches: [],
        differs: [],
        missingInTemplate: [],
      });
      continue;
    }

    const moduleDir = join(modulesRoot, id);
    const diff = diffModulePaths(moduleDir, templateRoot, mod.paths);
    results.push({ id, kind: "core", label: mod.label, ...diff });
  }

  return results;
}

/**
 * @param {string} templateRoot
 * @param {string[]} installedIds
 */
export function diffTemplateModules(templateRoot, installedIds) {
  const registry = loadTemplateModulesRegistry(templateRoot);
  const modulesRoot = templateModulesRoot(templateRoot);
  const results = [];

  for (const id of installedIds) {
    const mod = registry.modules[id];
    if (!mod) {
      results.push({
        id,
        kind: "template",
        error: `Unknown template module id in manifest: ${id}`,
        matches: [],
        differs: [],
        missingInTemplate: [],
      });
      continue;
    }

    const moduleDir = join(modulesRoot, id);
    const diff = diffModulePaths(moduleDir, templateRoot, mod.paths);
    results.push({ id, kind: "template", label: mod.label, ...diff });
  }

  return results;
}

/**
 * @param {string} templateRoot
 */
export function readTempjsModulesManifest(templateRoot) {
  const manifestPath = join(templateRoot, ".tempjs-modules.json");
  if (!existsSync(manifestPath)) {
    return { coreModules: [], templateModules: [] };
  }
  try {
    const raw = JSON.parse(readFileSync(manifestPath, "utf8"));
    return {
      coreModules: raw.coreModules ?? [],
      templateModules: raw.templateModules ?? [],
    };
  } catch {
    return { coreModules: [], templateModules: [] };
  }
}

/**
 * @param {string[]} declared
 * @param {string[]} installed
 */
export function manifestListDiff(declared, installed) {
  const declaredSet = new Set(declared);
  const installedSet = new Set(installed);
  const onlyDeclared = declared.filter((id) => !installedSet.has(id));
  const onlyInstalled = installed.filter((id) => !declaredSet.has(id));
  return { onlyDeclared, onlyInstalled };
}
