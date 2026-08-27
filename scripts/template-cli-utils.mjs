/**
 * Shared helpers for template maintainer scripts (validate, diff-core).
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const templatesDir = join(root, "templates");
const manifestPath = join(root, "templates.json");

/**
 * @typedef {{ id: string, directory: string, entry: Record<string, unknown> }} TemplateRef
 */

/**
 * @returns {Record<string, { directory: string, name?: string, [key: string]: unknown }>}
 */
export function loadManifest() {
  return JSON.parse(readFileSync(manifestPath, "utf8")).templates;
}

/**
 * Resolve CLI id or directory name to a template ref.
 * @param {string} ref Template id (hotel) or directory (hotel-website-template)
 * @returns {TemplateRef}
 */
export function resolveTemplateRef(ref) {
  const templates = loadManifest();

  if (templates[ref]) {
    return { id: ref, directory: templates[ref].directory, entry: templates[ref] };
  }

  for (const [id, entry] of Object.entries(templates)) {
    if (entry.directory === ref) {
      return { id, directory: entry.directory, entry };
    }
  }

  throw new Error(
    `Unknown template "${ref}". Use a templates.json id (e.g. hotel) or directory (e.g. hotel-website-template).`
  );
}

/**
 * @param {string | null | undefined} ref If omitted, all templates from manifest.
 * @returns {TemplateRef[]}
 */
export function resolveTemplateRefs(ref) {
  if (!ref) {
    const templates = loadManifest();
    return Object.entries(templates).map(([id, entry]) => ({
      id,
      directory: entry.directory,
      entry,
    }));
  }
  return [resolveTemplateRef(ref)];
}

/**
 * @param {TemplateRef} template
 * @returns {string} Absolute path to template root
 */
export function templateRootPath(template) {
  return join(templatesDir, template.directory);
}

/**
 * @param {string} templateRoot
 */
export function ensureTemplateExists(templateRoot, directory) {
  if (!existsSync(templateRoot)) {
    throw new Error(`Template directory not found: templates/${directory}`);
  }
}

export { root, templatesDir, manifestPath };
