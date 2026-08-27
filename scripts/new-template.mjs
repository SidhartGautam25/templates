#!/usr/bin/env node
/**
 * Create a new template: copy packages/core + scaffold into templates/<directory>.
 *
 * Usage:
 *   node scripts/new-template.mjs <template-id> [directory-name] [--name "Display Name"]
 *   node scripts/new-template.mjs bakery bakery-website-template --name "Bakery" --modules enquiry-modal,footer,hero-simple
 *
 * Example:
 *   node scripts/new-template.mjs bakery bakery-website-template --name "Bakery Website"
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { coreDir, CORE_EXCLUDE, shouldCopyCorePath, writeMergedPrismaSchema } from "./template-core-utils.mjs";
import {
  copyModulesIntoTemplate,
  parseModulesArg,
  parseModuleSpecs,
  moduleInstallOptionsFromSpecs,
  listModuleIds,
} from "./template-modules.mjs";
import { applyDocsiteStub } from "./docsite-stub.mjs";
import {
  applyScaffoldAdminRegistry,
} from "./template-modules-admin.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const scaffoldDir = join(coreDir, "scaffold");
const templatesDir = join(root, "templates");
const manifestPath = join(root, "templates.json");
const rootPackagePath = join(root, "package.json");

const args = process.argv.slice(2);
let templateId = args[0];
let directory = args[1];
let displayNameArg = null;
let modulesArg = null;
let withDocs = false;

for (let i = 2; i < args.length; i++) {
  if (args[i] === "--name" && args[i + 1]) {
    displayNameArg = args[++i];
  } else if (args[i] === "--modules" && args[i + 1]) {
    modulesArg = args[++i];
  } else if (args[i]?.startsWith("--modules=")) {
    modulesArg = args[i].slice("--modules=".length);
  } else if (args[i] === "--with-docs") {
    withDocs = true;
  }
}

if (!templateId) {
  console.error(
    "Usage: node scripts/new-template.mjs <template-id> [directory-name] [--name \"Display Name\"] [--modules enquiry-modal,footer,hero-simple] [--with-docs]"
  );
  console.error(`Available modules: ${listModuleIds().join(", ")}`);
  process.exit(1);
}

directory = directory ?? `${templateId}-website-template`;
const templatePath = join(templatesDir, directory);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

if (manifest.templates[templateId]) {
  console.error(`Template id "${templateId}" already exists in templates.json`);
  process.exit(1);
}

if (existsSync(templatePath)) {
  console.error(`Template directory already exists: templates/${directory}`);
  process.exit(1);
}

const displayName =
  displayNameArg ??
  directory
    .replace(/-website-template$/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const moduleSpecs = parseModuleSpecs(modulesArg);
const moduleIds = moduleSpecs.map((s) => s.id);
const installOptions = moduleInstallOptionsFromSpecs(moduleSpecs);

function copyTreeFiltered(src, dest) {
  cpSync(src, dest, {
    recursive: true,
    force: true,
    filter: (path) => {
      const rel = relative(src, path).replace(/\\/g, "/");
      return shouldCopyCorePath(rel, CORE_EXCLUDE);
    },
  });
}

mkdirSync(templatePath, { recursive: true });
copyTreeFiltered(coreDir, templatePath);

if (existsSync(scaffoldDir)) {
  cpSync(scaffoldDir, templatePath, { recursive: true, force: true });
}

writeFileSync(
  join(templatePath, "constants/site.ts"),
  readFileSync(join(coreDir, "constants/site.ts"), "utf8")
    .replace('id: "demo-site"', `id: "${templateId}"`)
    .replace('name: "Demo Client Site"', `name: "${displayName}"`)
    .replace('shortName: "Demo"', `shortName: "${displayName.split(" ")[0]}"`)
    .replace('developerName: "Demo Client Site"', `developerName: "${displayName}"`)
    .replace('leadsExportPrefix: "demo_leads"', `leadsExportPrefix: "${templateId}_leads"`)
);

const pkg = JSON.parse(readFileSync(join(templatePath, "package.json"), "utf8"));
pkg.name = directory.replace(/-website-template$/, "") + "-website";
writeFileSync(join(templatePath, "package.json"), JSON.stringify(pkg, null, 2) + "\n");

if (moduleIds.length > 0) {
  console.log("Installing core modules:");
  const installed = copyModulesIntoTemplate(templatePath, moduleIds, {
    displayName,
    installOptions,
  });
}

writeFileSync(
  join(templatePath, "README.md"),
  `# ${displayName} Website Template\n\nStandalone Next.js project. Edit everything in this folder.\n\nCore was copied once from \`packages/core\` at creation — you do not need sync for day-to-day work.\n\n${
    moduleIds.length > 0
      ? `Core modules installed: ${moduleIds.join(", ")}\n\n`
      : ""
  }See GETTING_STARTED.md.\n`
);

writeMergedPrismaSchema(templatePath);
if (moduleIds.some((id) => id === "gallery" || id === "reviews")) {
  // copyModulesIntoTemplate already updated registry + dashboard
} else {
  applyScaffoldAdminRegistry(templatePath);
}

writeFileSync(
  join(templatePath, "CHANGELOG.md"),
  `# Changelog — ${displayName}\n\n## [1.0.0] — ${new Date().toISOString().slice(0, 10)}\n\n- Initial scaffold via \`pnpm new-template\`${
    moduleIds.length > 0 ? `\n- Core modules: ${moduleIds.join(", ")}` : ""
  }\n`
);

mkdirSync(join(templatePath, "lib/features"), { recursive: true });
writeFileSync(
  join(templatePath, "lib/features/index.ts"),
  `// Export template-specific features, e.g.:\n// export * from "./listings";\n`
);

const templateEntry = {
  directory,
  name: `${displayName} Website`,
  description: `${displayName} website template`,
  version: "1.0.0",
  stack: [
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Tailwind CSS 4",
    "Prisma",
    "MariaDB",
    "NextAuth",
  ],
  packageManager: "pnpm",
  node: ">=20",
  setupTime: "~10 min",
  docker: true,
  tags: ["admin", "cms", "leads"],
  features: ["Admin dashboard", "Lead capture", "Docker Compose for MariaDB"],
  docs: "GETTING_STARTED.md",
  init: {
    flagGroups: ["generate", "theme", "brand", "database"],
    brandFields: [
      "name",
      "shortName",
      "baseUrl",
      "phone",
      "phoneDisplay",
      "countryCode",
      "email",
      "address",
      "tagline",
      "developerName",
      "channelPartner",
    ],
  },
};

if (moduleIds.length > 0) {
  templateEntry.coreModules = moduleIds;
}

manifest.templates[templateId] = templateEntry;

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

const rootPkg = JSON.parse(readFileSync(rootPackagePath, "utf8"));
const devScript = `dev:${templateId}`;
if (!rootPkg.scripts[devScript]) {
  rootPkg.scripts[devScript] = `cd templates/${directory} && pnpm dev`;
  writeFileSync(rootPackagePath, JSON.stringify(rootPkg, null, 2) + "\n", "utf8");
  console.log(`Added root script: ${devScript}`);
}

if (withDocs) {
  applyDocsiteStub({ templateId, displayName, directory });
}

console.log(`Created template: templates/${directory}/`);
console.log(`Added templates.json entry: "${templateId}"`);
if (moduleIds.length > 0) {
  console.log(`Core modules: ${moduleIds.join(", ")}`);
}
console.log("\nNext steps:");
console.log("  1. Edit templates/" + directory + "/ — add app pages, lib/features/, prisma/domain.prisma");
console.log("  2. Customize constants/site.ts");
console.log(`  3. pnpm dev:${templateId}`);
if (moduleIds.length === 0) {
  console.log("\nTip: add optional UI on next template with --modules enquiry-modal,footer,hero-simple");
}
console.log("\nNote: packages/core is only a starter kit. This template is independent after creation.");
