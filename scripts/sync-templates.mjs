#!/usr/bin/env node
/**
 * OPTIONAL: Propagate packages/core shared files into existing templates.
 *
 * Normal template development does NOT use this command. Each template is a
 * standalone copy created by `pnpm new-template`. Use this only when you fixed
 * a bug in packages/core and want to push that fix into one or all templates.
 *
 * Usage:
 *   node scripts/sync-templates.mjs              # all templates
 *   node scripts/sync-templates.mjs --check      # verify without writing
 *   node scripts/sync-templates.mjs --template hotel-website-template
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

import {
  coreDir,
  CORE_CHECK_SKIP,
  listCoreFiles,
  listFilesRecursive,
  buildMergedPrismaSchema,
  propagateCoreIntoTemplate,
} from "./template-core-utils.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const templatesDir = join(root, "templates");
const manifestPath = join(root, "templates.json");

const checkOnly = process.argv.includes("--check");
const templateArg = process.argv.find((a) => a.startsWith("--template="))?.slice(10) ??
  (process.argv.includes("--template") ? process.argv[process.argv.indexOf("--template") + 1] : null);

function loadTemplateDirectories() {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const all = Object.values(manifest.templates).map((entry) => entry.directory);
  if (templateArg) {
    if (!all.includes(templateArg)) {
      throw new Error(`Unknown template directory: ${templateArg}`);
    }
    return [templateArg];
  }
  return all;
}

function hashContent(content) {
  return createHash("sha256").update(content).digest("hex");
}

function checkTemplate(templateDir) {
  const destRoot = join(templatesDir, templateDir);
  const mismatches = [];

  if (!existsSync(destRoot)) {
    mismatches.push(`missing template directory: templates/${templateDir}`);
    return mismatches;
  }

  for (const coreFile of listCoreFiles()) {
    const rel = relative(coreDir, coreFile).replace(/\\/g, "/");
    if (CORE_CHECK_SKIP.has(rel)) continue;
    const destFile = join(destRoot, rel);

    if (!existsSync(destFile)) {
      mismatches.push(`missing: ${rel}`);
      continue;
    }

    const coreHash = hashContent(readFileSync(coreFile, "utf8"));
    const destHash = hashContent(readFileSync(destFile, "utf8"));
    if (coreHash !== destHash) {
      mismatches.push(`changed: ${rel}`);
    }
  }

  const expectedPrisma = buildMergedPrismaSchema(destRoot);
  const destSchema = join(destRoot, "prisma", "schema.prisma");
  if (expectedPrisma) {
    if (!existsSync(destSchema)) {
      mismatches.push("missing: prisma/schema.prisma");
    } else {
      const actual = readFileSync(destSchema, "utf8");
      if (hashContent(expectedPrisma) !== hashContent(actual)) {
        mismatches.push("changed: prisma/schema.prisma");
      }
    }
  }

  return mismatches;
}

function syncAll() {
  let hasErrors = false;
  const directories = loadTemplateDirectories();

  for (const templateDir of directories) {
    const destRoot = join(templatesDir, templateDir);

    if (checkOnly) {
      const mismatches = checkTemplate(templateDir);
      if (mismatches.length > 0) {
        console.error(`\n✗ ${templateDir} differs from packages/core (${mismatches.length} file(s)):`);
        mismatches.slice(0, 20).forEach((m) => console.error(`  ${m}`));
        if (mismatches.length > 20) {
          console.error(`  ... and ${mismatches.length - 20} more`);
        }
        hasErrors = true;
      } else {
        console.log(`✓ ${templateDir} matches packages/core (optional propagate not needed)`);
      }
      continue;
    }

    propagateCoreIntoTemplate(destRoot);
    const fileCount = listFilesRecursive(destRoot).length;
    console.log(`✓ Propagated packages/core → ${templateDir} (${fileCount} files)`);
  }

  if (checkOnly && hasErrors) {
    console.error("\nTo apply core fixes to templates, run: pnpm sync-templates");
    console.error("(Only needed when you changed packages/core intentionally.)");
    process.exit(1);
  }
}

syncAll();
