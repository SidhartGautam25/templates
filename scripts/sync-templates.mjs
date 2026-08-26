#!/usr/bin/env node
/**
 * Sync packages/core into each template directory, then apply template overlays.
 *
 * Usage: node scripts/sync-templates.mjs
 *        node scripts/sync-templates.mjs --check  (verify templates match without writing)
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const coreDir = join(root, "packages", "core");
const overlaysDir = join(root, "templates", "overlays");
const templatesDir = join(root, "templates");
const manifestPath = join(root, "templates.json");

const checkOnly = process.argv.includes("--check");

const SHARED_PRISMA_MODELS = ["Lead", "PromoBanner"];

/**
 * @returns {Array<{ id: string, overlay: string }>}
 */
function loadTemplateTargets() {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  return Object.values(manifest.templates).map((entry) => ({
    id: entry.directory,
    overlay: entry.directory,
  }));
}

/**
 * @param {string} dir
 * @returns {string[]}
 */
function listFilesRecursive(dir) {
  const results = [];
  if (!existsSync(dir)) return results;

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...listFilesRecursive(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

/**
 * @param {string} filePath
 */
function hashFile(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

const CORE_EXCLUDE = new Set(["package.json", "README.md", "MAINTAINERS.md"]);

/** Paths under packages/core that are maintainer-only (not copied to generated projects). */
const CORE_PATH_PREFIX_EXCLUDE = ["scripts/dev"];

/**
 * @param {string} rel Path relative to copy source root
 * @param {Set<string>} excludeFileNames
 */
function shouldCopyPath(rel, excludeFileNames) {
  if (!rel) return true;
  if (CORE_PATH_PREFIX_EXCLUDE.some((prefix) => rel === prefix || rel.startsWith(`${prefix}/`))) {
    return false;
  }
  const base = rel.split("/").pop() ?? "";
  return !excludeFileNames.has(base);
}

/**
 * @param {string} src
 * @param {string} dest
 * @param {{ excludeFileNames?: Set<string> }} [options]
 */
function copyTree(src, dest, options = {}) {
  const excludeFileNames = options.excludeFileNames ?? new Set();
  cpSync(src, dest, {
    recursive: true,
    force: true,
    filter: (path) => {
      const rel = relative(src, path).replace(/\\/g, "/");
      return shouldCopyPath(rel, excludeFileNames);
    },
  });
}

/**
 * @param {string} schema
 * @param {string} modelName
 */
function stripPrismaModel(schema, modelName) {
  const regex = new RegExp(`model\\s+${modelName}\\s*\\{[\\s\\S]*?\\n\\}`, "g");
  return schema.replace(regex, "").trim();
}

/**
 * @param {string} schema
 */
function stripPrismaPreamble(schema) {
  return schema
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/datasource\s+db\s*\{[\s\S]*?\}/g, "")
    .replace(/generator\s+client\s*\{[\s\S]*?\}/g, "")
    .trim();
}

/**
 * Merge packages/core/prisma/schema.prisma with overlay domain models.
 * @param {string} staging
 * @param {string} overlayName
 */
function mergePrismaSchema(staging, overlayName) {
  const coreSchemaPath = join(coreDir, "prisma", "schema.prisma");
  const overlaySchemaPath = join(overlaysDir, overlayName, "prisma", "schema.prisma");
  const destSchemaPath = join(staging, "prisma", "schema.prisma");

  if (!existsSync(coreSchemaPath)) {
    return;
  }

  let merged = readFileSync(coreSchemaPath, "utf8").trim();

  if (existsSync(overlaySchemaPath)) {
    let overlayPart = readFileSync(overlaySchemaPath, "utf8");
    overlayPart = stripPrismaPreamble(overlayPart);
    for (const model of SHARED_PRISMA_MODELS) {
      overlayPart = stripPrismaModel(overlayPart, model);
    }
    overlayPart = overlayPart.trim();
    if (overlayPart) {
      merged = `${merged}\n\n${overlayPart}`;
    }
  }

  mkdirSync(dirname(destSchemaPath), { recursive: true });
  writeFileSync(destSchemaPath, `${merged}\n`, "utf8");
}

/**
 * @param {string} templateId
 * @param {string} overlayName
 */
function buildMergedTree(templateId, overlayName) {
  const dest = join(templatesDir, templateId);
  const overlay = join(overlaysDir, overlayName);
  const staging = join(root, ".sync-staging", templateId);

  if (existsSync(staging)) {
    rmSync(staging, { recursive: true, force: true });
  }
  mkdirSync(staging, { recursive: true });

  if (!existsSync(coreDir)) {
    throw new Error(`Core package not found: ${coreDir}`);
  }

  copyTree(coreDir, staging, { excludeFileNames: CORE_EXCLUDE });

  if (existsSync(overlay)) {
    copyTree(overlay, staging);
  }

  mergePrismaSchema(staging, overlayName);

  return { staging, dest };
}

/**
 * @param {string} expectedRoot
 * @param {string} actualRoot
 * @returns {string[]}
 */
function diffTrees(expectedRoot, actualRoot) {
  const mismatches = [];
  const expectedFiles = listFilesRecursive(expectedRoot);

  for (const expectedFile of expectedFiles) {
    const rel = relative(expectedRoot, expectedFile);
    const actualFile = join(actualRoot, rel);

    if (!existsSync(actualFile)) {
      mismatches.push(`missing: ${rel}`);
      continue;
    }

    if (hashFile(expectedFile) !== hashFile(actualFile)) {
      mismatches.push(`changed: ${rel}`);
    }
  }

  return mismatches;
}

function syncAll() {
  let hasErrors = false;
  const targets = loadTemplateTargets();

  for (const { id, overlay } of targets) {
    const { staging, dest } = buildMergedTree(id, overlay);

    if (checkOnly) {
      const mismatches = diffTrees(staging, dest);
      if (mismatches.length > 0) {
        console.error(`\n✗ ${id} is out of sync (${mismatches.length} file(s)):`);
        mismatches.slice(0, 15).forEach((m) => console.error(`  ${m}`));
        if (mismatches.length > 15) {
          console.error(`  ... and ${mismatches.length - 15} more`);
        }
        hasErrors = true;
      } else {
        console.log(`✓ ${id} is in sync`);
      }
      rmSync(staging, { recursive: true, force: true });
      continue;
    }

    if (existsSync(dest)) {
      rmSync(dest, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
    }
    mkdirSync(dirname(dest), { recursive: true });
    copyTree(staging, dest);
    rmSync(join(root, ".sync-staging"), { recursive: true, force: true });

    const fileCount = listFilesRecursive(dest).length;
    console.log(`✓ Synced ${id} (${fileCount} files)`);
  }

  if (checkOnly && hasErrors) {
    console.error("\nRun: pnpm sync-templates");
    process.exit(1);
  }
}

syncAll();
