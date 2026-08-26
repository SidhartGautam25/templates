import { writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { collectFileHashes } from "./file-tree.js";

export const STAMP_FILENAME = ".tempjs.json";

/**
 * @typedef {{
 *   template: string,
 *   templateVersion: string,
 *   templateDirectory: string,
 *   generatedAt: string,
 *   updatedAt?: string,
 *   repository?: string,
 *   branch?: string,
 *   fileHashes: Record<string, string>
 * }} ProjectStamp
 */

/**
 * @param {string} projectDir
 * @returns {ProjectStamp | null}
 */
export function readProjectStamp(projectDir) {
  const stampPath = join(projectDir, STAMP_FILENAME);
  if (!existsSync(stampPath)) return null;

  try {
    return JSON.parse(readFileSync(stampPath, "utf8"));
  } catch {
    return null;
  }
}

/**
 * @param {string} projectDir
 * @param {{
 *   templateId: string,
 *   templateVersion: string,
 *   templateDirectory: string,
 *   repository?: string,
 *   branch?: string,
 *   sourceDir: string,
 *   isUpdate?: boolean
 * }} options
 */
export async function writeProjectStamp(projectDir, options) {
  const existing = readProjectStamp(projectDir);
  const fileHashes = collectFileHashes(options.sourceDir);

  /** @type {ProjectStamp} */
  const stamp = {
    template: options.templateId,
    templateVersion: options.templateVersion,
    templateDirectory: options.templateDirectory,
    generatedAt: existing?.generatedAt ?? new Date().toISOString(),
    updatedAt: options.isUpdate ? new Date().toISOString() : existing?.updatedAt,
    repository: options.repository,
    branch: options.branch,
    fileHashes,
  };

  if (options.isUpdate) {
    stamp.updatedAt = new Date().toISOString();
  }

  await writeFile(join(projectDir, STAMP_FILENAME), JSON.stringify(stamp, null, 2) + "\n", "utf8");
}
