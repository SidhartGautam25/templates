/**
 * Optional core modules — copy on demand via new-template --modules or template:add-module.
 */
import { join } from "node:path";

import { coreDir, writeMergedPrismaSchema } from "./template-core-utils.mjs";
import {
  copyModulesIntoProject,
  listModuleIds as listCoreModuleIds,
  loadModulesRegistry,
  parseModulesArg,
  parseModuleSpecs,
  moduleInstallOptionsFromSpecs,
  resolveModuleIds,
} from "./module-installer-core.mjs";

export { parseModulesArg, parseModuleSpecs, moduleInstallOptionsFromSpecs };

/**
 * @returns {{ modules: Record<string, CoreModuleDef> }}
 */
export function loadModulesRegistryFromCore() {
  return loadModulesRegistry(coreDir);
}

/**
 * @returns {string[]}
 */
export function listModuleIds() {
  return listCoreModuleIds(coreDir);
}

/**
 * @param {string[]} moduleIds
 * @returns {string[]}
 */
export function resolveModuleIdsFromCore(moduleIds) {
  return resolveModuleIds(coreDir, moduleIds);
}

/**
 * Copy module files into a template and enable feature flags.
 * @param {string} templateRoot Absolute path to template directory
 * @param {string[]} moduleIds Resolved module ids
 * @param {{
 *   displayName?: string;
 *   excludePaths?: string[];
 *   skipHomePage?: boolean;
 *   skipAdminTabRegistry?: boolean;
 *   skipAdminContentPage?: boolean; @deprecated Use skipAdminTabRegistry
 *   skipSeoMetadataReplace?: boolean;
 * }} [options]
 * @returns {string[]} Installed module ids
 */
export function copyModulesIntoTemplate(templateRoot, moduleIds, options = {}) {
  return copyModulesIntoProject(templateRoot, moduleIds, {
    coreDir,
    displayName: options.displayName,
    excludePaths: options.excludePaths,
    skipHomePage: options.skipHomePage,
    skipAdminTabRegistry: options.skipAdminTabRegistry,
    skipAdminContentPage: options.skipAdminContentPage,
    skipSeoMetadataReplace: options.skipSeoMetadataReplace,
    installOptions: options.installOptions,
    writePrismaSchema: writeMergedPrismaSchema,
  });
}

/**
 * @typedef {import("./module-installer-core.mjs").CoreModuleDef} CoreModuleDef
 */

const modulesRoot = join(coreDir, "modules");

export { modulesRoot };
