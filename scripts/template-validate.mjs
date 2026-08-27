#!/usr/bin/env node
/**
 * Validate template(s): install deps if needed, prisma validate, TypeScript, ESLint.
 *
 * Usage:
 *   node scripts/template-validate.mjs [template-id|directory] [--skip-install]
 *
 * Examples:
 *   pnpm template:validate hotel
 *   pnpm template:validate
 *   pnpm template:validate hotel-website-template --skip-install
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

import {
  resolveTemplateRefs,
  templateRootPath,
  ensureTemplateExists,
} from "./template-cli-utils.mjs";

const args = process.argv.slice(2);
const skipInstall = args.includes("--skip-install");
const templateArg = args.find((a) => !a.startsWith("-"));

/**
 * @param {string} cwd
 * @param {string} command
 * @param {string[]} commandArgs
 * @param {string} label
 */
function runStep(cwd, command, commandArgs, label) {
  console.log(`\n→ ${label}`);
  const result = spawnSync(command, commandArgs, {
    cwd,
    stdio: "inherit",
    shell: false,
    env: process.env,
  });

  if (result.status !== 0) {
    throw new Error(`${label} failed`);
  }
}

/**
 * @param {string} templateRoot
 */
function ensureDependencies(templateRoot, directory) {
  const nodeModules = join(templateRoot, "node_modules");
  if (existsSync(nodeModules)) {
    return;
  }

  if (skipInstall) {
    throw new Error(
      `node_modules missing in templates/${directory}. Run pnpm install there or omit --skip-install.`
    );
  }

  console.log(`\n→ Installing dependencies (templates/${directory})`);
  const result = spawnSync("pnpm", ["install"], {
    cwd: templateRoot,
    stdio: "inherit",
    shell: false,
    env: process.env,
  });

  if (result.status !== 0) {
    throw new Error("pnpm install failed");
  }
}

/**
 * @param {{ id: string, directory: string }} template
 */
function validateTemplate(template) {
  const templateRoot = templateRootPath(template);
  ensureTemplateExists(templateRoot, template.directory);

  console.log(`\n════════════════════════════════════════`);
  console.log(`Validating ${template.id} (templates/${template.directory})`);
  console.log(`════════════════════════════════════════`);

  ensureDependencies(templateRoot, template.directory);

  runStep(templateRoot, "pnpm", ["exec", "prisma", "validate"], "prisma validate");
  runStep(templateRoot, "pnpm", ["exec", "tsc", "--noEmit"], "TypeScript (tsc --noEmit)");
  runStep(templateRoot, "pnpm", ["run", "lint"], "ESLint (pnpm lint)");

  console.log(`\n✓ ${template.id} passed validation`);
}

let failed = false;

try {
  const templates = resolveTemplateRefs(templateArg);

  for (const template of templates) {
    try {
      validateTemplate(template);
    } catch (err) {
      failed = true;
      console.error(`\n✗ ${template.id}: ${err instanceof Error ? err.message : err}`);
    }
  }
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}

if (failed) {
  console.error("\nValidation failed for one or more templates.");
  process.exit(1);
}

console.log("\n✓ All templates passed validation.");
