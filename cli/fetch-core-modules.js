import { execFileSync } from "node:child_process";
import { createWriteStream, existsSync, statSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const CODELOAD_BASE = "https://codeload.github.com";

/**
 * @typedef {{ coreDir: string, cleanupDir: string }} CoreModulesFetchResult
 */

/**
 * @param {import('./config.js').RepositoryConfig} repo
 * @returns {Promise<CoreModulesFetchResult>}
 */
export async function fetchCoreModulesFromGitHub(repo) {
  const tempRoot = await mkdtemp(join(tmpdir(), "tempjs-core-"));
  const tarballPath = join(tempRoot, "archive.tar.gz");
  const coreDir = join(tempRoot, "core");

  try {
    await downloadTarball(repo, tarballPath);
    await extractCoreFromTarball(tarballPath, coreDir, repo);
    await readFile(join(coreDir, "modules.json"));

    return { coreDir, cleanupDir: tempRoot };
  } catch (error) {
    await rm(tempRoot, { recursive: true, force: true });
    throw error;
  }
}

/**
 * @param {string} packageRoot
 * @returns {string | null}
 */
export function resolveLocalCoreDir(packageRoot) {
  const localPath = join(packageRoot, "packages", "core");
  if (existsSync(join(localPath, "modules.json"))) {
    return localPath;
  }
  return null;
}

/**
 * @param {import('./config.js').RepositoryConfig} repo
 * @param {string} destPath
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
 */
async function extractCoreFromTarball(tarballPath, destDir, repo) {
  const listing = execFileSync("tar", ["-tzf", tarballPath], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });

  const lines = listing.split("\n").filter(Boolean);
  if (lines.length === 0) {
    throw new Error("Repository archive is empty");
  }

  const archiveRoot = lines[0].replace(/\/$/, "").split("/")[0];
  const coreArchivePath = `${archiveRoot}/packages/core`;
  const corePrefix = `${coreArchivePath}/`;

  const hasCore = lines.some((line) => line === corePrefix || line.startsWith(corePrefix));

  if (!hasCore) {
    throw new Error(`Core package not found in repository: packages/core`);
  }

  const stripComponents = coreArchivePath.split("/").length;

  await mkdir(destDir, { recursive: true });

  execFileSync(
    "tar",
    [
      "-xzf",
      tarballPath,
      "-C",
      destDir,
      `--strip-components=${stripComponents}`,
      coreArchivePath,
    ],
    { stdio: "pipe", maxBuffer: 64 * 1024 * 1024 }
  );
}

function buildHeaders() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) {
    return { Authorization: `token ${token}` };
  }
  return {};
}
