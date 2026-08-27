import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { rm } from "node:fs/promises";

import { getPackageRoot } from "./config.js";
import { fetchCoreModulesFromGitHub, resolveLocalCoreDir } from "./fetch-core-modules.js";
import { readProjectStamp } from "./project-stamp.js";

const scriptsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "scripts");

/**
 * @param {string} projectDir
 */
function assertInitializedProject(projectDir) {
  const stamp = readProjectStamp(projectDir);
  if (!stamp) {
    throw new Error(
      "This directory does not look like a tempjs project (missing .tempjs.json).\n" +
        "Run tempjs <template-id> from an empty directory first."
    );
  }
}

/**
 * @param {string} coreDir
 * @param {string} projectDir
 */
function writeMergedPrismaSchema(coreDir, projectDir) {
  const coreSchemaPath = join(coreDir, "prisma", "schema.prisma");
  if (!existsSync(coreSchemaPath)) {
    return;
  }

  let merged = readFileSync(coreSchemaPath, "utf8").trim();
  const domainPath = join(projectDir, "prisma", "domain.prisma");

  if (existsSync(domainPath)) {
    const domainPart = readFileSync(domainPath, "utf8").trim();
    if (domainPart) {
      merged = `${merged}\n\n${domainPart}`;
    }
  }

  const destSchema = join(projectDir, "prisma", "schema.prisma");
  mkdirSync(dirname(destSchema), { recursive: true });
  writeFileSync(destSchema, `${merged}\n`, "utf8");
  console.log("  ✓ merged prisma/schema.prisma");
}

/**
 * @param {import('./config.js').RepositoryConfig} repo
 * @param {{ useRemote?: boolean }} [options]
 * @returns {Promise<{ coreDir: string, cleanupDir: string }>}
 */
async function resolveCoreDir(repo, options = {}) {
  const packageRoot = getPackageRoot();
  const localCore = resolveLocalCoreDir(packageRoot);

  if (localCore && !options.useRemote) {
    return { coreDir: localCore, cleanupDir: "" };
  }

  return fetchCoreModulesFromGitHub(repo);
}

/**
 * Add optional core modules to an initialized client project.
 * @param {string} projectDir
 * @param {string[]} moduleIds
 * @param {import('./config.js').RepositoryConfig} repo
 * @param {{ useRemote?: boolean }} [options]
 */
export async function runAddModule(projectDir, moduleIds, repo, options = {}) {
  assertInitializedProject(projectDir);

  if (moduleIds.length === 0) {
    throw new Error("No module ids provided. Example: tempjs add-module seo,gallery");
  }

  const stamp = readProjectStamp(projectDir);
  const displayName = stamp?.template
    ? stamp.template.replace(/-website-template$/, "").replace(/-/g, " ")
    : "Your Site";

  const { coreDir, cleanupDir } = await resolveCoreDir(repo, {
    useRemote: options.useRemote,
  });

  const installerPath = join(scriptsDir, "module-installer-core.mjs");
  const { copyModulesIntoProject, listModuleIds, resolveModuleIds, parseModuleSpecs, moduleInstallOptionsFromSpecs } = await import(
    pathToFileURL(installerPath).href
  );

  const specs = parseModuleSpecs(moduleIds.join(","));
  const resolvedIds = specs.map((s) => s.id);
  const available = listModuleIds(coreDir);
  const resolved = resolveModuleIds(coreDir, resolvedIds);
  const installOptions = moduleInstallOptionsFromSpecs(specs);

  console.log(`Adding core modules to ${relative(process.cwd(), projectDir) || "."}:`);
  console.log(`  modules: ${resolved.join(", ")}`);

  try {
    const installed = copyModulesIntoProject(projectDir, resolved, {
      coreDir,
      displayName,
      skipHomePage: true,
      skipSeoMetadataReplace: true,
      installOptions,
      writePrismaSchema: () => writeMergedPrismaSchema(coreDir, projectDir),
    });

    const cmsModules = installed.filter((id) => id === "gallery" || id === "reviews");
    if (cmsModules.length > 0) {
      console.log(
        `  Admin tabs: gallery/reviews wired on /admin via app/admin/registry.ts`
      );
    }

    console.log(`\n✓ Installed: ${installed.join(", ")}`);
    console.log("\nNext steps:");
    console.log("  pnpm prisma db push");
    console.log("  pnpm dev");
    if (cmsModules.length > 0) {
      console.log("  Open /admin — Gallery and Reviews tabs appear when SITE.features flags are true");
    }
    console.log(`\nAvailable modules: ${available.join(", ")}`);
  } finally {
    if (cleanupDir) {
      await rm(cleanupDir, { recursive: true, force: true });
    }
  }
}

/**
 * @param {import('./config.js').RepositoryConfig} repo
 */
export async function printAvailableModules(repo) {
  const packageRoot = getPackageRoot();
  const localCore = resolveLocalCoreDir(packageRoot);

  let coreDir = localCore;
  let cleanupDir = "";

  if (!coreDir) {
    const fetched = await fetchCoreModulesFromGitHub(repo);
    coreDir = fetched.coreDir;
    cleanupDir = fetched.cleanupDir;
  }

  try {
    const installerPath = join(scriptsDir, "module-installer-core.mjs");
    const { listModuleIds, loadModulesRegistry } = await import(pathToFileURL(installerPath).href);
    const registry = loadModulesRegistry(coreDir);
    for (const id of listModuleIds(coreDir)) {
      const mod = registry.modules[id];
      console.log(`  ${id.padEnd(16)} ${mod.label}`);
      if (mod.description) {
        console.log(`                   ${mod.description}`);
      }
    }
  } finally {
    if (cleanupDir) {
      await rm(cleanupDir, { recursive: true, force: true });
    }
  }
}
