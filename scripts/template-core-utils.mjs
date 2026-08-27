/**
 * Shared utilities for copying packages/core into templates.
 * Used by new-template.mjs (one-time copy) and sync-templates.mjs (optional propagate).
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const coreDir = join(root, "packages", "core");

export const SHARED_PRISMA_MODELS = ["Lead", "PromoBanner"];
export const CORE_EXCLUDE = new Set([
  "package.json",
  "README.md",
  "MAINTAINERS.md",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "tsconfig.tsbuildinfo",
  "modules.json",
]);
/** Files compared loosely — templates may legitimately differ after scaffold merge. */
export const CORE_CHECK_SKIP = new Set(["tsconfig.json"]);

/** Merged from core + prisma/domain.prisma — not copied verbatim from core. */
export const CORE_MERGED_PATHS = new Set(["prisma/schema.prisma"]);

export const CORE_PATH_PREFIX_EXCLUDE = ["scripts/dev", "scaffold", "modules", "node_modules", ".next"];

/**
 * @param {string} dir
 * @returns {string[]}
 */
export function listFilesRecursive(dir) {
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
 * @param {string} rel
 * @param {Set<string>} excludeFileNames
 */
export function shouldCopyCorePath(rel, excludeFileNames) {
  if (!rel) return true;
  if (CORE_PATH_PREFIX_EXCLUDE.some((prefix) => rel === prefix || rel.startsWith(`${prefix}/`))) {
    return false;
  }
  const base = rel.split("/").pop() ?? "";
  return !excludeFileNames.has(base);
}

/**
 * @returns {string[]}
 */
export function listCoreFiles() {
  return listFilesRecursive(coreDir).filter((full) => {
    const rel = relative(coreDir, full).replace(/\\/g, "/");
    if (!shouldCopyCorePath(rel, CORE_EXCLUDE)) return false;
    if (CORE_MERGED_PATHS.has(rel)) return false;
    return true;
  });
}

/**
 * @param {string} schema
 * @param {string} modelName
 */
export function stripPrismaModel(schema, modelName) {
  const regex = new RegExp(`model\\s+${modelName}\\s*\\{[\\s\\S]*?\\n\\}`, "g");
  return schema.replace(regex, "").trim();
}

/**
 * @param {string} schema
 */
export function stripPrismaPreamble(schema) {
  return schema
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/datasource\s+db\s*\{[\s\S]*?\}/g, "")
    .replace(/generator\s+client\s*\{[\s\S]*?\}/g, "")
    .trim();
}

/**
 * @param {string} templateRoot Absolute path to template directory
 */
export function readTemplateDomainPrisma(templateRoot) {
  const domainPath = join(templateRoot, "prisma", "domain.prisma");
  if (existsSync(domainPath)) {
    return stripPrismaPreamble(readFileSync(domainPath, "utf8")).trim();
  }

  const schemaPath = join(templateRoot, "prisma", "schema.prisma");
  if (!existsSync(schemaPath)) return "";

  let part = stripPrismaPreamble(readFileSync(schemaPath, "utf8"));
  for (const model of SHARED_PRISMA_MODELS) {
    part = stripPrismaModel(part, model);
  }
  return part.trim();
}

/**
 * @param {string} templateRoot Absolute path to template directory
 */
export function buildMergedPrismaSchema(templateRoot) {
  const coreSchemaPath = join(coreDir, "prisma", "schema.prisma");
  if (!existsSync(coreSchemaPath)) return null;

  let merged = readFileSync(coreSchemaPath, "utf8").trim();
  const domainPart = readTemplateDomainPrisma(templateRoot);

  if (domainPart) {
    merged = `${merged}\n\n${domainPart}`;
  }

  return `${merged}\n`;
}

/**
 * Copy shared core files into an existing template (overwrites core-owned paths only).
 * @param {string} templateRoot Absolute path to template directory
 */
export function copyCoreFilesIntoTemplate(templateRoot) {
  if (!existsSync(coreDir)) {
    throw new Error(`Core package not found: ${coreDir}`);
  }

  for (const coreFile of listCoreFiles()) {
    const rel = relative(coreDir, coreFile).replace(/\\/g, "/");
    const dest = join(templateRoot, rel);
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(coreFile, dest, { force: true });
  }
}

/**
 * Write prisma/schema.prisma from core + prisma/domain.prisma.
 * @param {string} templateRoot Absolute path to template directory
 */
export function writeMergedPrismaSchema(templateRoot) {
  const merged = buildMergedPrismaSchema(templateRoot);
  if (!merged) return;

  const destSchema = join(templateRoot, "prisma", "schema.prisma");
  mkdirSync(dirname(destSchema), { recursive: true });
  writeFileSync(destSchema, merged, "utf8");
}

/**
 * Optional: propagate packages/core into a template (does not delete template-only files).
 * @param {string} templateRoot Absolute path to template directory
 */
export function propagateCoreIntoTemplate(templateRoot) {
  copyCoreFilesIntoTemplate(templateRoot);
  writeMergedPrismaSchema(templateRoot);
}
