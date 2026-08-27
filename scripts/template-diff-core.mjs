#!/usr/bin/env node
/**
 * Compare a template folder to packages/core (what sync-templates would overwrite).
 *
 * Usage:
 *   node scripts/template-diff-core.mjs [template-id|directory]
 *   node scripts/template-diff-core.mjs hotel
 *   node scripts/template-diff-core.mjs hotel-website-template
 *
 * Without an argument, diffs all templates in templates.json.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";

import {
  coreDir,
  CORE_CHECK_SKIP,
  listCoreFiles,
  listFilesRecursive,
  buildMergedPrismaSchema,
} from "./template-core-utils.mjs";
import {
  resolveTemplateRefs,
  templateRootPath,
  ensureTemplateExists,
} from "./template-cli-utils.mjs";
import {
  diffCoreModules,
  diffTemplateModules,
  readTempjsModulesManifest,
  manifestListDiff,
} from "./template-modules-diff.mjs";

const templateArg = process.argv.slice(2).find((a) => !a.startsWith("-"));

function hashContent(content) {
  return createHash("sha256").update(content).digest("hex");
}

/**
 * @param {string} templateRoot
 */
function listTemplateOnlyFiles(templateRoot) {
  const coreRelSet = new Set(
    listCoreFiles().map((full) => relative(coreDir, full).replace(/\\/g, "/"))
  );
  coreRelSet.add("prisma/schema.prisma");

  const skipDirs = new Set([
    "node_modules",
    ".next",
    ".git",
    "public",
    "dist",
    "coverage",
  ]);
  const skipFiles = new Set([
    "pnpm-lock.yaml",
    "tsconfig.tsbuildinfo",
    "next-env.d.ts",
    "CHANGELOG.md",
    "README.md",
    "ARCHITECTURE.md",
    "DEVELOPER_GUIDE.md",
    "GETTING_STARTED.md",
    "guide.md",
    "digital_marketing_guide.md",
    "seo_guide.md",
    "AGENTS.md",
    "CLAUDE.md",
  ]);

  const templateOnly = [];

  for (const full of listFilesRecursive(templateRoot)) {
    const rel = relative(templateRoot, full).replace(/\\/g, "/");
    const parts = rel.split("/");
    if (parts.some((p) => skipDirs.has(p))) continue;
    if (skipFiles.has(parts[parts.length - 1])) continue;
    if (coreRelSet.has(rel)) continue;
    templateOnly.push(rel);
  }

  return templateOnly.sort();
}

/**
 * @param {{ id: string, directory: string }} template
 */
function diffTemplate(template) {
  const templateRoot = templateRootPath(template);
  ensureTemplateExists(templateRoot, template.directory);

  const matches = [];
  const differs = [];
  const missing = [];

  for (const coreFile of listCoreFiles()) {
    const rel = relative(coreDir, coreFile).replace(/\\/g, "/");
    if (CORE_CHECK_SKIP.has(rel)) continue;

    const destFile = join(templateRoot, rel);
    if (!existsSync(destFile)) {
      missing.push(rel);
      continue;
    }

    const coreHash = hashContent(readFileSync(coreFile, "utf8"));
    const destHash = hashContent(readFileSync(destFile, "utf8"));
    if (coreHash === destHash) {
      matches.push(rel);
    } else {
      differs.push(rel);
    }
  }

  const expectedPrisma = buildMergedPrismaSchema(templateRoot);
  const destSchema = join(templateRoot, "prisma", "schema.prisma");
  let prismaStatus = "match";

  if (expectedPrisma) {
    if (!existsSync(destSchema)) {
      prismaStatus = "missing";
      missing.push("prisma/schema.prisma");
    } else {
      const actual = readFileSync(destSchema, "utf8");
      if (hashContent(expectedPrisma) !== hashContent(actual)) {
        prismaStatus = "diff";
        differs.push("prisma/schema.prisma");
      } else {
        matches.push("prisma/schema.prisma");
      }
    }
  }

  const templateOnly = listTemplateOnlyFiles(templateRoot);

  const installed = readTempjsModulesManifest(templateRoot);
  const declaredCore = template.entry.coreModules ?? [];
  const declaredTemplate = template.entry.templateModules ?? [];

  const coreManifestDiff = manifestListDiff(declaredCore, installed.coreModules);
  const templateManifestDiff = manifestListDiff(declaredTemplate, installed.templateModules);

  const coreModuleDiffs = diffCoreModules(templateRoot, installed.coreModules);
  const templateModuleDiffs =
    installed.templateModules.length > 0 || declaredTemplate.length > 0
      ? diffTemplateModules(templateRoot, installed.templateModules)
      : [];

  return {
    template,
    matches,
    differs,
    missing,
    prismaStatus,
    templateOnly,
    installed,
    declaredCore,
    declaredTemplate,
    coreManifestDiff,
    templateManifestDiff,
    coreModuleDiffs,
    templateModuleDiffs,
  };
}

function printModuleReport(result) {
  const {
    installed,
    declaredCore,
    declaredTemplate,
    coreManifestDiff,
    templateManifestDiff,
    coreModuleDiffs,
    templateModuleDiffs,
  } = result;

  console.log("\nOptional modules (.tempjs-modules.json):");
  console.log(
    `  core:     ${installed.coreModules.length ? installed.coreModules.join(", ") : "(none)"}`
  );
  if (installed.templateModules?.length) {
    console.log(`  template: ${installed.templateModules.join(", ")}`);
  }

  if (declaredCore.length || declaredTemplate.length) {
    console.log("\nDeclared in templates.json:");
    if (declaredCore.length) console.log(`  coreModules: ${declaredCore.join(", ")}`);
    if (declaredTemplate.length) console.log(`  templateModules: ${declaredTemplate.join(", ")}`);
  }

  if (coreManifestDiff.onlyDeclared.length || coreManifestDiff.onlyInstalled.length) {
    console.log("\n⚠ coreModules manifest mismatch:");
    if (coreManifestDiff.onlyDeclared.length) {
      console.log(`  in templates.json only: ${coreManifestDiff.onlyDeclared.join(", ")}`);
    }
    if (coreManifestDiff.onlyInstalled.length) {
      console.log(`  in .tempjs-modules.json only: ${coreManifestDiff.onlyInstalled.join(", ")}`);
    }
  }

  if (templateManifestDiff.onlyDeclared.length || templateManifestDiff.onlyInstalled.length) {
    console.log("\n⚠ templateModules manifest mismatch:");
    if (templateManifestDiff.onlyDeclared.length) {
      console.log(`  in templates.json only: ${templateManifestDiff.onlyDeclared.join(", ")}`);
    }
    if (templateManifestDiff.onlyInstalled.length) {
      console.log(`  in .tempjs-modules.json only: ${templateManifestDiff.onlyInstalled.join(", ")}`);
    }
  }

  let moduleDrift = false;

  for (const mod of coreModuleDiffs) {
    if (mod.error) {
      console.log(`\nCore module ${mod.id}: ${mod.error}`);
      moduleDrift = true;
      continue;
    }
    const drift = mod.differs.length + mod.missingInTemplate.length;
    if (drift === 0) {
      console.log(`\n✓ core module ${mod.id} (${mod.label}): ${mod.matches.length} paths match source`);
    } else {
      moduleDrift = true;
      console.log(
        `\n≠ core module ${mod.id} (${mod.label}): ${mod.differs.length} differ, ${mod.missingInTemplate.length} missing in template`
      );
      mod.differs.slice(0, 15).forEach((rel) => console.log(`  ≠ ${rel}`));
      if (mod.differs.length > 15) console.log(`  ... and ${mod.differs.length - 15} more`);
      mod.missingInTemplate.slice(0, 10).forEach((rel) => console.log(`  − ${rel}`));
    }
  }

  for (const mod of templateModuleDiffs) {
    if (mod.error) {
      console.log(`\nTemplate module ${mod.id}: ${mod.error}`);
      moduleDrift = true;
      continue;
    }
    const drift = mod.differs.length + mod.missingInTemplate.length;
    if (drift === 0) {
      console.log(
        `\n✓ template module ${mod.id} (${mod.label}): ${mod.matches.length} paths match modules/${mod.id}/`
      );
    } else {
      moduleDrift = true;
      console.log(
        `\n≠ template module ${mod.id} (${mod.label}): ${mod.differs.length} differ, ${mod.missingInTemplate.length} missing at template root`
      );
      mod.differs.slice(0, 15).forEach((rel) => console.log(`  ≠ ${rel}`));
      if (mod.differs.length > 15) console.log(`  ... and ${mod.differs.length - 15} more`);
      mod.missingInTemplate.slice(0, 10).forEach((rel) => console.log(`  − ${rel}`));
      if (mod.differs.length + mod.missingInTemplate.length > 0) {
        console.log(`  → pnpm template:assemble ${result.template.id} ${mod.id}`);
      }
    }
  }

  if (moduleDrift) {
    console.log("\nModule drift detected — optional module files differ from packages/core/modules/ or modules/<id>/ source.");
  }

  return moduleDrift;
}

function printReport(result) {
  const { template, matches, differs, missing, templateOnly } = result;

  console.log(`\n${template.id} → templates/${template.directory}`);
  console.log(`Compared to packages/core (${matches.length + differs.length + missing.length} tracked paths)`);
  console.log("");
  console.log(`  ✓ matches core:     ${matches.length}`);
  console.log(`  ≠ differs from core: ${differs.length}  (sync would overwrite)`);
  console.log(`  − missing in template: ${missing.length}  (sync would add)`);
  console.log(`  + template-only:    ${templateOnly.length}  (sync does not touch)`);

  if (differs.length > 0) {
    console.log("\nDiffers from core:");
    differs.slice(0, 40).forEach((rel) => console.log(`  ≠ ${rel}`));
    if (differs.length > 40) {
      console.log(`  ... and ${differs.length - 40} more`);
    }
  }

  if (missing.length > 0) {
    console.log("\nMissing core files:");
    missing.slice(0, 40).forEach((rel) => console.log(`  − ${rel}`));
    if (missing.length > 40) {
      console.log(`  ... and ${missing.length - 40} more`);
    }
  }

  if (templateOnly.length > 0) {
    console.log("\nTemplate-only (sample):");
    templateOnly.slice(0, 25).forEach((rel) => console.log(`  + ${rel}`));
    if (templateOnly.length > 25) {
      console.log(`  ... and ${templateOnly.length - 25} more`);
    }
  }

  if (differs.length === 0 && missing.length === 0) {
    console.log("\n✓ Template core paths match packages/core. No propagate needed.");
  } else {
    console.log("\nTo apply core to this template: pnpm sync-templates --template " + template.directory);
  }

  return printModuleReport(result);
}

let hasDiff = false;

try {
  const templates = resolveTemplateRefs(templateArg);

  for (const template of templates) {
    const result = diffTemplate(template);
    const coreDiff = printReport(result);
    if (result.differs.length > 0 || result.missing.length > 0 || coreDiff) {
      hasDiff = true;
    }
  }

  if (hasDiff && templates.length > 1) {
    console.log("\nSome templates differ from packages/core.");
  }
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}

if (hasDiff) {
  process.exit(1);
}
