import { execFileSync } from "node:child_process";
import { createWriteStream, existsSync, statSync } from "node:fs";
import { mkdir, mkdtemp, readdir, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { shouldSkipFileName } from "./fs-ignore.js";
import { countFiles } from "./file-tree.js";

const CODELOAD_BASE = "https://codeload.github.com";

/**
 * @typedef {{ bytes: number, files: number, durationMs: number, source: string }} FetchStats
 * @typedef {{ templateRoot: string, cleanupDir: string, stats: FetchStats }} FetchResult
 */

/**
 * @param {import('./config.js').RepositoryConfig} repo
 * @param {string} templateDirectory
 * @returns {Promise<FetchResult>}
 */
export async function fetchTemplateFromGitHub(repo, templateDirectory) {
  const startMs = performance.now();
  const tempRoot = await mkdtemp(join(tmpdir(), "template-cli-"));
  const tarballPath = join(tempRoot, "archive.tar.gz");
  const templateRoot = join(tempRoot, "template");

  try {
    const bytes = await downloadTarball(repo, tarballPath);
    await extractTemplateFromTarball(tarballPath, templateRoot, repo, templateDirectory);
    await readFile(join(templateRoot, "package.json"));

    const durationMs = performance.now() - startMs;
    const files = countFiles(templateRoot);

    return {
      templateRoot,
      cleanupDir: tempRoot,
      stats: { bytes, files, durationMs, source: "remote" },
    };
  } catch (error) {
    await rm(tempRoot, { recursive: true, force: true });
    throw error;
  }
}

/**
 * @param {import('./config.js').RepositoryConfig} repo
 * @param {string} destPath
 * @returns {Promise<number>} Downloaded bytes
 */
async function downloadTarball(repo, destPath) {
  const branch = encodeURIComponent(repo.branch);
  const url = `${CODELOAD_BASE}/${repo.owner}/${repo.repo}/tar.gz/${branch}`;

  const response = await fetch(url, {
    headers: buildHeaders(),
    redirect: "follow",
  });

  if (!response.ok) {
    let detail = `Could not download ${repo.owner}/${repo.repo}@${repo.branch}`;
    if (response.status === 404) {
      detail += "\nVerify the repository, branch, and templates.json settings.";
    }
    if (response.status === 401 || response.status === 403) {
      detail += "\nFor private repositories, set GITHUB_TOKEN or GH_TOKEN.";
    }
    throw new Error(`${detail} (HTTP ${response.status})`);
  }

  if (!response.body) {
    throw new Error("Empty response while downloading repository archive");
  }

  await pipeline(Readable.fromWeb(response.body), createWriteStream(destPath));
  return statSync(destPath).size;
}

/**
 * @param {string} tarballPath
 * @param {string} destDir
 * @param {import('./config.js').RepositoryConfig} repo
 * @param {string} templateDirectory
 */
async function extractTemplateFromTarball(
  tarballPath,
  destDir,
  repo,
  templateDirectory
) {
  const listing = execFileSync("tar", ["-tzf", tarballPath], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });

  const lines = listing.split("\n").filter(Boolean);
  if (lines.length === 0) {
    throw new Error("Repository archive is empty");
  }

  const archiveRoot = lines[0].replace(/\/$/, "").split("/")[0];
  const templateArchivePath = `${archiveRoot}/${repo.templatesPath}/${templateDirectory}`;
  const templatePrefix = `${templateArchivePath}/`;

  const hasTemplate = lines.some(
    (line) => line === templatePrefix || line.startsWith(templatePrefix)
  );

  if (!hasTemplate) {
    throw new Error(
      `Template directory not found in repository: ${repo.templatesPath}/${templateDirectory}`
    );
  }

  const stripComponents = templateArchivePath.split("/").length;

  await mkdir(destDir, { recursive: true });

  execFileSync(
    "tar",
    [
      "-xzf",
      tarballPath,
      "-C",
      destDir,
      `--strip-components=${stripComponents}`,
      templateArchivePath,
    ],
    { stdio: "pipe", maxBuffer: 64 * 1024 * 1024 }
  );

  await removeSkippedFiles(destDir);
}

/**
 * @param {string} dir
 */
async function removeSkippedFiles(dir) {
  if (!existsSync(dir)) return;

  const entries = await readDirEntries(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory) {
      if (entry.name === ".git") {
        await rm(fullPath, { recursive: true, force: true });
        continue;
      }
      await removeSkippedFiles(fullPath);
      continue;
    }

    if (shouldSkipFileName(entry.name)) {
      await rm(fullPath, { force: true });
    }
  }
}

/**
 * @param {string} dir
 */
async function readDirEntries(dir) {
  const names = await readdir(dir);
  const result = [];
  for (const name of names) {
    const fullPath = join(dir, name);
    const info = await stat(fullPath);
    result.push({ name, isDirectory: info.isDirectory() });
  }
  return result;
}

function buildHeaders() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) {
    return { Authorization: `token ${token}` };
  }
  return {};
}

/**
 * @param {string} packageRoot
 * @param {string} templatesPath
 * @param {string} templateDirectory
 * @returns {Promise<string | null>}
 */
export async function resolveLocalTemplate(packageRoot, templatesPath, templateDirectory) {
  const localPath = join(packageRoot, templatesPath, templateDirectory);
  try {
    await readFile(join(localPath, "package.json"));
    return localPath;
  } catch {
    return null;
  }
}

/**
 * @param {string} packageRoot
 * @param {string} templatesPath
 * @param {string} templateDirectory
 * @returns {Promise<FetchResult | null>}
 */
export async function loadLocalTemplate(packageRoot, templatesPath, templateDirectory) {
  const localPath = await resolveLocalTemplate(packageRoot, templatesPath, templateDirectory);
  if (!localPath) return null;

  return {
    templateRoot: localPath,
    cleanupDir: "",
    stats: {
      bytes: 0,
      files: countFiles(localPath),
      durationMs: 0,
      source: "local",
    },
  };
}
