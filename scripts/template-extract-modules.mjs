#!/usr/bin/env node
/**
 * Extract template root paths into modules/<id>/ (maintainer bootstrap).
 */
import { resolveTemplateRef, templateRootPath, ensureTemplateExists } from "./template-cli-utils.mjs";
import {
  extractTemplateModules,
  listTemplateModuleIds,
  parseModulesArg,
} from "./template-vertical-modules.mjs";

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error(
    "Usage: node scripts/template-extract-modules.mjs <template-id|directory> [module-id[,module-id...]]"
  );
  process.exit(1);
}

const templateRef = args[0];
const moduleIds =
  args.length > 1 ? parseModulesArg(args.slice(1).join(",")) : null;

try {
  const template = resolveTemplateRef(templateRef);
  const templateRoot = templateRootPath(template);
  ensureTemplateExists(templateRoot, template.directory);

  const ids = moduleIds ?? listTemplateModuleIds(templateRoot);

  console.log(`Extracting template modules for ${template.id}:`);
  extractTemplateModules(templateRoot, ids);
  console.log("\n✓ Extract complete.");
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
