import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

/** @typedef {{ owner: string, repo: string, branch: string, templatesPath: string }} RepositoryConfig */
/** @typedef {{
 *   directory: string,
 *   name: string,
 *   description: string,
 *   version?: string,
 *   stack?: string[],
 *   packageManager?: string,
 *   node?: string,
 *   setupTime?: string,
 *   docker?: boolean,
 *   tags?: string[],
 *   features?: string[],
 *   docs?: string,
 *   init?: {
 *     flagGroups?: string[],
 *     brandFields?: string[],
 *     skipBrand?: boolean,
 *     skipDatabase?: boolean
 *   }
 * }} TemplateEntry */
/** @typedef {{ repository: RepositoryConfig, templates: Record<string, TemplateEntry> }} Manifest */

/**
 * @returns {Manifest}
 */
export function loadManifest() {
  const manifestPath = join(packageRoot, "templates.json");
  const raw = readFileSync(manifestPath, "utf8");
  return JSON.parse(raw);
}

export function getPackageRoot() {
  return packageRoot;
}

/**
 * Repository settings can be overridden via environment variables.
 * @param {RepositoryConfig} defaults
 * @returns {RepositoryConfig}
 */
export function resolveRepositoryConfig(defaults) {
  const url = process.env.TEMPLATES_REPO_URL?.trim();
  if (url) {
    const parsed = parseGitHubUrl(url);
    if (parsed) {
      return {
        owner: parsed.owner,
        repo: parsed.repo,
        branch:
          process.env.TEMPLATES_REPO_BRANCH?.trim() || parsed.branch || defaults.branch,
        templatesPath: defaults.templatesPath,
      };
    }
  }

  const owner = process.env.TEMPLATES_REPO_OWNER?.trim();
  const repo = process.env.TEMPLATES_REPO_REPO?.trim();
  const branch = process.env.TEMPLATES_REPO_BRANCH?.trim();

  return {
    owner: owner || defaults.owner,
    repo: repo || defaults.repo,
    branch: branch || defaults.branch,
    templatesPath: defaults.templatesPath,
  };
}

/**
 * @param {string} url
 * @returns {{ owner: string, repo: string, branch?: string } | null}
 */
function parseGitHubUrl(url) {
  const patterns = [
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/tree\/([^/]+))?$/,
    /^git@github\.com:([^/]+)\/([^/.]+)(?:\.git)?$/,
    /^([^/]+)\/([^/]+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ""),
        branch: match[3] || undefined,
      };
    }
  }
  return null;
}
