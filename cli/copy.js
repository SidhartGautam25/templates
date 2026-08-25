import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readlinkSync,
  rmSync,
  statSync,
} from "node:fs";
import { join } from "node:path";

const NEVER_COPY = new Set([".git", ".gitignore.bak"]);
const NEVER_OVERWRITE = new Set([".git"]);

/**
 * Files that must never be transferred into a generated project.
 * @param {string} name
 * @returns {boolean}
 */
function shouldSkipFile(name) {
  if (NEVER_COPY.has(name)) return true;
  if (name === ".env" || name.startsWith(".env.")) {
    return name !== ".env.example";
  }
  return false;
}

/**
 * @param {string} dir
 * @returns {string[]}
 */
export function listDirectoryEntries(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => name !== "." && name !== "..");
}

/**
 * @param {string} dir
 * @returns {boolean}
 */
export function isDirectoryEmpty(dir) {
  return listDirectoryEntries(dir).length === 0;
}

/**
 * @param {string} targetDir
 * @returns {boolean}
 */
export function targetHasGitRepo(targetDir) {
  return existsSync(join(targetDir, ".git"));
}

/**
 * Files in targetDir that would be overwritten by source copy.
 * @param {string} sourceDir
 * @param {string} targetDir
 * @returns {string[]}
 */
export function findConflictingPaths(sourceDir, targetDir) {
  const conflicts = [];
  collectConflicts(sourceDir, targetDir, "", conflicts);
  return conflicts.sort();
}

/**
 * @param {string} sourceDir
 * @param {string} targetDir
 * @param {string} relative
 * @param {string[]} conflicts
 */
function collectConflicts(sourceDir, targetDir, relative, conflicts) {
  const currentSource = join(sourceDir, relative);
  if (!existsSync(currentSource)) return;

  const sourceNames = readdirSync(currentSource);
  for (const name of sourceNames) {
    if (shouldSkipFile(name)) continue;

    const relPath = relative ? join(relative, name) : name;
    const sourcePath = join(sourceDir, relPath);
    const targetPath = join(targetDir, relPath);

    if (existsSync(targetPath)) {
      conflicts.push(relPath);
    }

    if (statSync(sourcePath).isDirectory()) {
      collectConflicts(sourceDir, targetDir, relPath, conflicts);
    }
  }
}

/**
 * Copy template source into target directory.
 * @param {string} sourceDir
 * @param {string} targetDir
 * @param {{ force?: boolean }} options
 */
export function copyTemplate(sourceDir, targetDir, options = {}) {
  const force = options.force ?? false;

  if (!existsSync(sourceDir)) {
    throw new Error(`Template source not found: ${sourceDir}`);
  }

  if (!force && !isDirectoryEmpty(targetDir)) {
    const conflicts = findConflictingPaths(sourceDir, targetDir);
    if (conflicts.length > 0) {
      const err = new Error("TARGET_NOT_EMPTY");
      err.conflicts = conflicts;
      throw err;
    }
  }

  copyRecursive(sourceDir, targetDir, "");
}

/**
 * @param {string} sourceRoot
 * @param {string} targetRoot
 * @param {string} relative
 */
function copyRecursive(sourceRoot, targetRoot, relative) {
  const sourcePath = join(sourceRoot, relative);
  const names = readdirSync(sourcePath);

  for (const name of names) {
    if (shouldSkipFile(name)) continue;

    const relPath = relative ? join(relative, name) : name;
    const from = join(sourceRoot, relPath);
    const to = join(targetRoot, relPath);

    if (NEVER_OVERWRITE.has(name) && existsSync(to)) {
      continue;
    }

    const stat = lstatSync(from);
    if (stat.isSymbolicLink()) {
      const linkTarget = readlinkSync(from);
      mkdirSync(join(to, ".."), { recursive: true });
      cpSync(from, to, { recursive: true, force: true });
      continue;
    }

    if (stat.isDirectory()) {
      mkdirSync(to, { recursive: true });
      copyRecursive(sourceRoot, targetRoot, relPath);
    } else {
      mkdirSync(join(to, ".."), { recursive: true });
      cpSync(from, to, { force: true });
    }
  }
}

/**
 * @param {string} dir
 */
export function removeDirectory(dir) {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
}
