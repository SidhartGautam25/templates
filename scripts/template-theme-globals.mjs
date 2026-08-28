#!/usr/bin/env node
/**
 * Ensure :root, @theme bridge, and body theme wiring in all templates (or one).
 *
 * Usage:
 *   pnpm template:theme-globals
 *   pnpm template:theme-globals dev-agency
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ensureTemplateThemeGlobals } from "./theme-globals-core.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "templates.json");
const templatesDir = join(root, "templates");

const targetArg = process.argv[2];
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const directories = targetArg
  ? [manifest.templates[targetArg]?.directory ?? targetArg]
  : Object.values(manifest.templates).map((t) => t.directory);

for (const dir of directories) {
  const templateRoot = join(templatesDir, dir);
  if (!existsSync(templateRoot)) {
    console.warn(`Skip missing: templates/${dir}`);
    continue;
  }
  console.log(`Theme globals: ${dir}`);
  ensureTemplateThemeGlobals(templateRoot);
}

console.log("Done.");
