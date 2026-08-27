#!/usr/bin/env node
/**
 * Assemble template-level vertical modules into a shipped template directory.
 *
 * Usage:
 *   node scripts/template-assemble.mjs <template-id|directory> [module-id[,module-id...]]
 *
 * With no module ids, assembles all modules listed in template-modules.json.
 */
import { resolveTemplateRef, templateRootPath, ensureTemplateExists } from "./template-cli-utils.mjs";
import {
  assembleTemplateModules,
  listTemplateModuleIds,
  parseModulesArg,
} from "./template-vertical-modules.mjs";

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error(
    "Usage: node scripts/template-assemble.mjs <template-id|directory> [module-id[,module-id...]]"
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

  if (ids.length === 0) {
    console.log(`No template modules defined for ${template.id}.`);
    process.exit(0);
  }

  console.log(`Assembling template modules for ${template.id}:`);
  const installed = assembleTemplateModules(templateRoot, ids);
  console.log(`\n✓ Assembled: ${installed.join(", ")}`);
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
