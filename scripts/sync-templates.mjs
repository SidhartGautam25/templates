#!/usr/bin/env node
/**
 * Sync packages/core into each template directory, then apply template overlays.
 *
 * Usage: node scripts/sync-templates.mjs
 *        node scripts/sync-templates.mjs --check  (verify templates match without writing)
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const coreDir = join(root, "packages", "core");
const overlaysDir = join(root, "templates", "overlays");
const templatesDir = join(root, "templates");

/** @type {Array<{ id: string, overlay: string }>} */
const TEMPLATE_TARGETS = [
  { id: "hotel-website-template", overlay: "hotel-website-template" },
  { id: "real-estate-website-template", overlay: "real-estate-website-template" },
];

const checkOnly = process.argv.includes("--check");

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

/**
 * @param {string} src
 * @param {string} dest
 */
function copyTree(src, dest) {
  cpSync(src, dest, { recursive: true, force: true });
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

  copyTree(coreDir, staging);

  if (existsSync(overlay)) {
    copyTree(overlay, staging);
  }

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

  for (const { id, overlay } of TEMPLATE_TARGETS) {
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
      rmSync(dest, { recursive: true, force: true });
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
