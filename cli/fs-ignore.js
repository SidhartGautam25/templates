/** Files and directories never copied from templates or merged on update. */
export const NEVER_COPY_NAMES = new Set([".git", ".gitignore.bak"]);

/** Paths relative to project root that must not be overwritten by template update. */
export const UPDATE_PROTECTED_PATHS = new Set([
  ".env",
  ".tempjsrc",
  ".tempjs.json",
  "constants/site.ts",
  "app/tempjs-theme.css",
]);

/** Directory names skipped when walking trees. */
export const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "coverage",
]);

/**
 * @param {string} name
 * @returns {boolean}
 */
export function shouldSkipFileName(name) {
  if (NEVER_COPY_NAMES.has(name)) return true;
  if (name === ".env" || name.startsWith(".env.")) {
    return name !== ".env.example";
  }
  return false;
}

/**
 * @param {string} relativePath
 * @param {string} [name]
 * @returns {boolean}
 */
export function shouldSkipPath(relativePath, name) {
  const base = name ?? relativePath.split("/").pop() ?? "";
  if (shouldSkipFileName(base)) return true;

  const parts = relativePath.split("/");
  for (const part of parts) {
    if (SKIP_DIR_NAMES.has(part)) return true;
  }
  return false;
}

/**
 * @param {string} relativePath
 * @returns {boolean}
 */
export function isUpdateProtected(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");
  if (UPDATE_PROTECTED_PATHS.has(normalized)) return true;
  if (normalized.startsWith(".env.") && normalized !== ".env.example") return true;
  return false;
}
