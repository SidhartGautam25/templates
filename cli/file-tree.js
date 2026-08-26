import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { shouldSkipPath } from "./fs-ignore.js";

/**
 * @param {string} filePath
 * @returns {string}
 */
export function hashFileContents(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

/**
 * @param {string} rootDir
 * @returns {Record<string, string>}
 */
export function collectFileHashes(rootDir) {
  const hashes = {};
  collectRecursive(rootDir, rootDir, hashes);
  return hashes;
}

/**
 * @param {string} rootDir
 * @param {string} currentDir
 * @param {Record<string, string>} hashes
 */
function collectRecursive(rootDir, currentDir, hashes) {
  if (!existsSync(currentDir)) return;

  for (const name of readdirSync(currentDir)) {
    const fullPath = join(currentDir, name);
    const relPath = relative(rootDir, fullPath).replace(/\\/g, "/");

    if (shouldSkipPath(relPath, name)) continue;

    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      collectRecursive(rootDir, fullPath, hashes);
    } else {
      hashes[relPath] = hashFileContents(fullPath);
    }
  }
}

/**
 * @param {string} rootDir
 * @returns {number}
 */
export function countFiles(rootDir) {
  return Object.keys(collectFileHashes(rootDir)).length;
}

/**
 * @typedef {{
 *   newFiles: string[],
 *   upToDate: string[],
 *   safeUpdates: string[],
 *   conflicts: string[],
 *   protectedSkips: string[],
 *   removedFromTemplate: string[]
 * }} UpdateDiff
 */

/**
 * Compare project against baseline (at generation) and latest template hashes.
 * @param {Record<string, string>} baselineHashes
 * @param {Record<string, string>} currentHashes
 * @param {Record<string, string>} latestHashes
 * @returns {UpdateDiff}
 */
export function diffTemplateTrees(baselineHashes, currentHashes, latestHashes) {
  const diff = {
    newFiles: [],
    upToDate: [],
    safeUpdates: [],
    conflicts: [],
    protectedSkips: [],
    removedFromTemplate: [],
  };

  for (const path of Object.keys(latestHashes).sort()) {
    const latest = latestHashes[path];
    const current = currentHashes[path];
    const baseline = baselineHashes[path];

    if (current === undefined) {
      diff.newFiles.push(path);
      continue;
    }

    if (current === latest) {
      diff.upToDate.push(path);
      continue;
    }

    if (baseline !== undefined && current === baseline && latest !== baseline) {
      diff.safeUpdates.push(path);
      continue;
    }

    diff.conflicts.push(path);
  }

  for (const path of Object.keys(baselineHashes).sort()) {
    if (!latestHashes[path]) {
      diff.removedFromTemplate.push(path);
    }
  }

  return diff;
}
