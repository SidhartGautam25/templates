import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadManifest, getPackageRoot } from "./config.js";

export const VERSION_STATE_FILE = ".tempjs-version.json";

const CLI_WATCH_PATHS = ["cli", "package.json", "templates.json"];

const CORE_PATH = "packages/core";
const SYNC_SCRIPT = "scripts/sync-templates.mjs";

/**
 * @typedef {{
 *   version: string,
 *   gitCommit: string,
 *   recordedAt: string
 * }} VersionRecord
 */

/**
 * @typedef {{
 *   cli?: VersionRecord,
 *   core?: VersionRecord,
 *   templates?: Record<string, VersionRecord>
 * }} VersionState
 */

/**
 * @param {string} repoRoot
 */
export function isGitRepository(repoRoot) {
  try {
    execSync("git rev-parse --git-dir", { cwd: repoRoot, stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {string} repoRoot
 */
export function getHeadCommit(repoRoot) {
  return execSync("git rev-parse HEAD", { cwd: repoRoot, encoding: "utf8" }).trim();
}

/**
 * @param {string} repoRoot
 * @returns {VersionState}
 */
export function readVersionState(repoRoot) {
  const path = join(repoRoot, VERSION_STATE_FILE);
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return {};
  }
}

/**
 * @param {string} repoRoot
 * @param {VersionState} state
 */
export function writeVersionState(repoRoot, state) {
  const path = join(repoRoot, VERSION_STATE_FILE);
  writeFileSync(path, JSON.stringify(state, null, 2) + "\n", "utf8");
}

/**
 * @param {string} version
 * @param {"patch"|"minor"|"major"} level
 */
export function bumpSemver(version, level) {
  const parts = version.split(".").map((n) => Number.parseInt(n, 10) || 0);
  const major = parts[0] ?? 0;
  const minor = parts[1] ?? 0;
  const patch = parts[2] ?? 0;

  if (level === "major") return `${major + 1}.0.0`;
  if (level === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

/**
 * @param {string} repoRoot
 * @param {string[]} paths
 */
function gitDiffFiles(repoRoot, sinceCommit, paths) {
  if (!sinceCommit) return [];
  const quoted = paths.map((p) => `"${p}"`).join(" ");
  try {
    const out = execSync(`git diff --name-only ${sinceCommit} HEAD -- ${quoted}`, {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();
    return out ? out.split("\n").filter(Boolean) : [];
  } catch {
    return [];
  }
}

/**
 * @param {string} repoRoot
 * @param {string[]} paths
 */
function gitDirtyFiles(repoRoot, paths) {
  const quoted = paths.map((p) => `"${p}"`).join(" ");
  try {
    const out = execSync(`git status --porcelain -- ${quoted}`, {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();
    if (!out) return [];
    return out
      .split("\n")
      .map((line) => line.slice(3).trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Paths that require sync before a template release (excludes merged output).
 * @param {import('./config.js').TemplateEntry} entry
 */
export function getTemplateSourcePaths(entry) {
  return [CORE_PATH, SYNC_SCRIPT];
}

/**
 * @param {string} templateId
 * @param {import('./config.js').TemplateEntry} entry
 */
export function getTemplateWatchPaths(templateId, entry) {
  return [`templates/${entry.directory}`];
}

/**
 * @param {string} repoRoot
 * @returns {{ ok: boolean, output?: string }}
 */
export function runSyncTemplatesCheck(repoRoot) {
  const scriptPath = join(repoRoot, SYNC_SCRIPT);
  if (!existsSync(scriptPath)) {
    return { ok: false, output: `Sync script not found: ${SYNC_SCRIPT}` };
  }

  try {
    const output = execSync(`node ${SYNC_SCRIPT} --check`, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { ok: true, output };
  } catch (error) {
    const stdout = error.stdout?.toString?.() ?? "";
    const stderr = error.stderr?.toString?.() ?? "";
    return { ok: false, output: `${stdout}${stderr}`.trim() };
  }
}

/**
 * Verify templates match packages/core when core or sync script changed.
 * @param {string} repoRoot
 * @param {import('./config.js').TemplateEntry} entry
 * @param {string | undefined} sinceCommit
 * @returns {boolean} false if check failed (sets process.exitCode)
 */
export function ensureTemplateSyncIfNeeded(repoRoot, entry, sinceCommit) {
  const sourcePaths = getTemplateSourcePaths(entry);
  const { files } = collectPathChanges(repoRoot, sourcePaths, sinceCommit);

  if (files.length === 0) {
    return true;
  }

  console.log(
    `Template source changed (${files.length} path(s)) — running sync-templates:check...`
  );

  const result = runSyncTemplatesCheck(repoRoot);

  if (result.ok) {
    console.log("✓ Templates are in sync with packages/core\n");
    return true;
  }

  console.error("✗ Templates are out of sync with packages/core.");
  if (result.output) {
    console.error(result.output);
  }
  console.error("\nRun: pnpm sync-templates");
  console.error("Then retry the version bump.");
  process.exitCode = 1;
  return false;
}

/**
 * @param {string} repoRoot
 * @param {string[]} paths
 * @param {string | undefined} sinceCommit
 */
export function collectPathChanges(repoRoot, paths, sinceCommit) {
  const committed = gitDiffFiles(repoRoot, sinceCommit, paths);
  const dirty = gitDirtyFiles(repoRoot, paths);
  const unique = [...new Set([...committed, ...dirty])];
  return { files: unique, committed, dirty };
}

/**
 * @param {string} repoRoot
 */
export function readCliPackageVersion(repoRoot) {
  const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
  return pkg.version ?? "0.0.0";
}

/**
 * @param {string} repoRoot
 * @param {string} version
 */
export function writeCliPackageVersion(repoRoot, version) {
  const pkgPath = join(repoRoot, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.version = version;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
}

/**
 * @param {string} repoRoot
 * @param {string} templateId
 * @param {string} version
 */
export function writeTemplateManifestVersion(repoRoot, templateId, version) {
  const manifestPath = join(repoRoot, "templates.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (!manifest.templates[templateId]) {
    throw new Error(`Unknown template: ${templateId}`);
  }
  manifest.templates[templateId].version = version;
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

/**
 * @param {string} repoRoot
 * @param {string} directory
 * @param {string} version
 * @param {"patch"|"minor"|"major"} level
 */
export function appendChangelogStub(repoRoot, directory, version, level) {
  const changelogPath = join(repoRoot, "templates", directory, "CHANGELOG.md");
  if (!existsSync(changelogPath)) return;

  const date = new Date().toISOString().slice(0, 10);
  const header = `## [${version}] — ${date}`;
  if (readFileSync(changelogPath, "utf8").includes(header)) return;

  const stub = `\n${header}\n\n### ${level === "patch" ? "Fixed" : "Changed"}\n- \n`;
  writeFileSync(changelogPath, readFileSync(changelogPath, "utf8").trimEnd() + stub, "utf8");
}

/**
 * @param {string} repoRoot
 * @returns {VersionState}
 */
export function initializeVersionState(repoRoot) {
  const manifest = loadManifest();
  const head = getHeadCommit(repoRoot);
  const now = new Date().toISOString();

  /** @type {VersionState} */
  const state = {
    cli: {
      version: readCliPackageVersion(repoRoot),
      gitCommit: head,
      recordedAt: now,
    },
    core: {
      version: "shared",
      gitCommit: head,
      recordedAt: now,
    },
    templates: {},
  };

  for (const [id, entry] of Object.entries(manifest.templates)) {
    state.templates[id] = {
      version: entry.version ?? "0.0.0",
      gitCommit: head,
      recordedAt: now,
    };
  }

  writeVersionState(repoRoot, state);
  return state;
}

/**
 * @param {string[]} files
 * @param {number} max
 */
export function formatFileList(files, max = 8) {
  if (files.length === 0) return "";
  const preview = files.slice(0, max);
  const lines = preview.map((f) => `    ${f}`);
  if (files.length > max) {
    lines.push(`    ... and ${files.length - max} more`);
  }
  return lines.join("\n");
}

/**
 * @typedef {{
 *   scope: string,
 *   version: string,
 *   baselineCommit?: string,
 *   upToDate: boolean,
 *   files: string[],
 *   dirty: boolean
 * }} VersionCheckResult
 */

/**
 * @param {string} repoRoot
 * @param {{ scope?: string }} options
 */
export function runVersionCheck(repoRoot, options = {}) {
  if (!isGitRepository(repoRoot)) {
    console.error("Version tracking requires a git repository.");
    console.error("Run from the templates monorepo root.");
    process.exitCode = 1;
    return;
  }

  let state = readVersionState(repoRoot);
  if (!state.cli?.gitCommit) {
    console.log("Initializing version tracking (.tempjs-version.json)...");
    state = initializeVersionState(repoRoot);
    console.log("Baseline recorded at current HEAD. All versions marked up to date.\n");
  }

  const manifest = loadManifest();
  const scope = options.scope?.toLowerCase();
  const checkCli = !scope || scope === "cli";
  const checkTemplates = !scope || scope === "all" || (scope && scope !== "cli" && manifest.templates[scope]);

  /** @type {VersionCheckResult[]} */
  const results = [];

  if (checkCli) {
    const paths = CLI_WATCH_PATHS;
    const record = state.cli;
    const currentVersion = readCliPackageVersion(repoRoot);
    const { files, dirty } = collectPathChanges(repoRoot, paths, record?.gitCommit);
    const versionMismatch = record?.version !== currentVersion;
    results.push({
      scope: "cli",
      version: currentVersion,
      baselineCommit: record?.gitCommit,
      upToDate: files.length === 0 && !versionMismatch,
      files,
      dirty: dirty.length > 0,
    });
  }

  const templateIds =
    scope && scope !== "cli" && scope !== "all"
      ? [scope]
      : checkTemplates
        ? Object.keys(manifest.templates)
        : [];

  for (const templateId of templateIds) {
    const entry = manifest.templates[templateId];
    if (!entry) continue;
    const paths = getTemplateWatchPaths(templateId, entry);
    const record = state.templates?.[templateId];
    const currentVersion = entry.version ?? "0.0.0";
    const { files, dirty } = collectPathChanges(repoRoot, paths, record?.gitCommit);
    const versionMismatch = record?.version !== currentVersion;
    results.push({
      scope: `template:${templateId}`,
      version: currentVersion,
      baselineCommit: record?.gitCommit,
      upToDate: files.length === 0 && !versionMismatch,
      files,
      dirty: dirty.length > 0,
    });
  }

  console.log("tempjs version check\n");

  let anyStale = false;

  for (const result of results) {
    const label =
      result.scope === "cli"
        ? `CLI (@navneet_25/tempjs)`
        : `Template ${result.scope.replace("template:", "")} (${manifest.templates[result.scope.replace("template:", "")]?.name ?? ""})`;

    if (result.upToDate) {
      console.log(`✓ ${label} v${result.version}`);
      console.log(`  Up to date since ${result.baselineCommit?.slice(0, 7) ?? "baseline"}`);
    } else {
      anyStale = true;
      console.log(`✗ ${label} v${result.version}`);
      if (result.files.length > 0) {
        console.log(`  ${result.files.length} path(s) changed since last version bump:`);
        console.log(formatFileList(result.files));
      }
      if (result.scope === "cli") {
        console.log(`  → tempjs version inc patch cli`);
      } else {
        const id = result.scope.replace("template:", "");
        console.log(`  → tempjs version inc patch ${id}`);
      }
      console.log("");
    }
  }

  if (!anyStale) {
    console.log("\nEverything is up to date — no unreleased changes detected.");
  } else {
    console.log("\nDocument changes in CHANGELOG.md, then bump with tempjs version inc.");
    process.exitCode = 1;
  }
}

/**
 * @param {string} repoRoot
 * @param {"patch"|"minor"|"major"} level
 * @param {string} target cli | template id | all
 */
export function runVersionInc(repoRoot, level, target) {
  if (!["patch", "minor", "major"].includes(level)) {
    console.error(`Invalid level: ${level}. Use patch, minor, or major.`);
    process.exitCode = 1;
    return;
  }

  if (!isGitRepository(repoRoot)) {
    console.error("Version bumps require a git repository.");
    process.exitCode = 1;
    return;
  }

  let state = readVersionState(repoRoot);
  if (!state.cli?.gitCommit) {
    state = initializeVersionState(repoRoot);
  }

  const manifest = loadManifest();
  const head = getHeadCommit(repoRoot);
  const now = new Date().toISOString();
  const normalized = target?.toLowerCase() ?? "cli";

  if (normalized === "all") {
    runVersionInc(repoRoot, level, "cli");
    for (const id of Object.keys(manifest.templates)) {
      runVersionInc(repoRoot, level, id);
    }
    return;
  }

  if (normalized === "cli") {
    const current = readCliPackageVersion(repoRoot);
    const next = bumpSemver(current, level);
    writeCliPackageVersion(repoRoot, next);
    state.cli = { version: next, gitCommit: head, recordedAt: now };
    writeVersionState(repoRoot, state);
    console.log(`CLI: ${current} → ${next} (${level})`);
    console.log(`Recorded baseline commit ${head.slice(0, 7)}`);
    return;
  }

  const entry = manifest.templates[normalized];
  if (!entry) {
    console.error(`Unknown template: ${normalized}`);
    console.error("Run `tempjs list` for template ids.");
    process.exitCode = 1;
    return;
  }

  const baselineCommit = state.templates?.[normalized]?.gitCommit;

  const current = entry.version ?? "0.0.0";
  const next = bumpSemver(current, level);
  writeTemplateManifestVersion(repoRoot, normalized, next);
  appendChangelogStub(repoRoot, entry.directory, next, level);

  if (!state.templates) state.templates = {};
  state.templates[normalized] = { version: next, gitCommit: head, recordedAt: now };
  state.core = { version: "shared", gitCommit: head, recordedAt: now };
  writeVersionState(repoRoot, state);

  console.log(`Template ${normalized}: ${current} → ${next} (${level})`);
  console.log(`Updated templates.json and CHANGELOG.md stub`);
  console.log(`Recorded baseline commit ${head.slice(0, 7)}`);
  console.log("\nNext: edit CHANGELOG, commit, publish/push.");
}

/**
 * Ensure we're in the monorepo (has templates.json + cli).
 * @param {string} cwd
 */
export function resolveMonorepoRoot(cwd) {
  const packageRoot = getPackageRoot();
  if (existsSync(join(packageRoot, "templates.json")) && existsSync(join(packageRoot, "cli"))) {
    return packageRoot;
  }
  if (existsSync(join(cwd, "templates.json")) && existsSync(join(cwd, "cli"))) {
    return cwd;
  }
  return null;
}
