#!/usr/bin/env node
/**
 * Add optional core modules to an existing template.
 *
 * Usage:
 *   node scripts/template-add-module.mjs <template-id|directory> <module-id>[,<module-id>...]
 *
 * Example:
 *   pnpm template:add-module bakery enquiry-modal,footer
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveTemplateRef, templateRootPath, ensureTemplateExists } from "./template-cli-utils.mjs";
import {
  copyModulesIntoTemplate,
  applyModulesHomePage,
  parseModulesArg,
  listModuleIds,
} from "./template-modules.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error(
    "Usage: node scripts/template-add-module.mjs <template-id|directory> <module-id>[,<module-id>...]"
  );
  console.error(`Available modules: ${listModuleIds().join(", ")}`);
  process.exit(1);
}

const templateRef = args[0];
const moduleIds = parseModulesArg(args.slice(1).join(","));

if (moduleIds.length === 0) {
  console.error("No module ids provided.");
  process.exit(1);
}

try {
  const template = resolveTemplateRef(templateRef);
  const templateRoot = templateRootPath(template);
  ensureTemplateExists(templateRoot, template.directory);

  const displayName =
    (template.entry.name && String(template.entry.name).replace(/ Website$/, "")) || template.id;

  console.log(`Adding modules to ${template.id} (templates/${template.directory}):`);
  const installed = copyModulesIntoTemplate(templateRoot, moduleIds, { displayName });
  applyModulesHomePage(templateRoot, installed);

  console.log(`\n✓ Installed: ${installed.join(", ")}`);
  console.log("Run pnpm template:validate " + template.id + " to verify.");
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
