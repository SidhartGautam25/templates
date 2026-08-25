import { createWriteStream } from "node:fs";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const GITHUB_API = "https://api.github.com";
const RAW_BASE = "https://raw.githubusercontent.com";
const LARGE_FILE_BYTES = 1024 * 1024;

/**
 * Download a single template directory from GitHub without cloning the full repo.
 * @param {import('./config.js').RepositoryConfig} repo
 * @param {string} templateDirectory
 * @returns {Promise<string>} Path to temp directory containing template files
 */
export async function fetchTemplateFromGitHub(repo, templateDirectory) {
  const prefix = `${repo.templatesPath}/${templateDirectory}/`;
  const tree = await fetchRepoTree(repo);

  const blobs = tree
    .filter((entry) => entry.type === "blob" && entry.path.startsWith(prefix))
    .map((entry) => ({
      githubPath: entry.path,
      relPath: entry.path.slice(prefix.length),
      sha: entry.sha,
    }));

  if (blobs.length === 0) {
    throw new Error(
      `Template directory not found on GitHub: ${repo.templatesPath}/${templateDirectory}`
    );
  }

  const tempRoot = await mkdtemp(join(tmpdir(), "template-cli-"));
  const templateRoot = join(tempRoot, "template");
  await mkdir(templateRoot, { recursive: true });

  const concurrency = 8;
  let index = 0;
  const errors = [];

  async function worker() {
    while (index < blobs.length) {
      const current = index++;
      const blob = blobs[current];
      try {
        await downloadBlob(repo, blob, templateRoot);
      } catch (error) {
        errors.push({ relPath: blob.relPath, error });
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  if (errors.length > 0) {
    const detail = errors
      .slice(0, 5)
      .map((e) => `${e.relPath}: ${e.error.message}`)
      .join("\n");
    throw new Error(
      `Failed to download ${errors.length} file(s).\n${detail}`
    );
  }

  return templateRoot;
}

/**
 * @param {import('./config.js').RepositoryConfig} repo
 * @returns {Promise<Array<{ path: string, type: string, sha: string }>>}
 */
async function fetchRepoTree(repo) {
  const refUrl = `${GITHUB_API}/repos/${repo.owner}/${repo.repo}/git/ref/heads/${repo.branch}`;
  const refResponse = await githubRequest(refUrl);

  if (!refResponse.ok) {
    throw await formatGitHubError(
      refResponse,
      `Could not resolve branch "${repo.branch}" for ${repo.owner}/${repo.repo}`
    );
  }

  const refData = await refResponse.json();
  const commitSha = refData.object?.sha;
  if (!commitSha) {
    throw new Error(`Invalid ref response for branch ${repo.branch}`);
  }

  const commitUrl = `${GITHUB_API}/repos/${repo.owner}/${repo.repo}/git/commits/${commitSha}`;
  const commitResponse = await githubRequest(commitUrl);
  if (!commitResponse.ok) {
    throw await formatGitHubError(commitResponse, "Could not fetch commit metadata");
  }

  const commitData = await commitResponse.json();
  const treeSha = commitData.tree?.sha;
  if (!treeSha) {
    throw new Error("Invalid commit response: missing tree SHA");
  }

  const treeUrl = `${GITHUB_API}/repos/${repo.owner}/${repo.repo}/git/trees/${treeSha}?recursive=1`;
  const treeResponse = await githubRequest(treeUrl);
  if (!treeResponse.ok) {
    throw await formatGitHubError(treeResponse, "Could not fetch repository tree");
  }

  const treeData = await treeResponse.json();
  if (treeData.truncated) {
    throw new Error(
      "Repository tree is too large for a single API request. Contact the repository maintainer."
    );
  }

  return treeData.tree ?? [];
}

/**
 * @param {import('./config.js').RepositoryConfig} repo
 * @param {{ githubPath: string, relPath: string, sha: string }} blob
 * @param {string} templateRoot
 */
async function downloadBlob(repo, blob, templateRoot) {
  const { githubPath, relPath, sha } = blob;

  if (relPath.includes(".git/") || relPath === ".git" || githubPath.includes("/.git/")) {
    return;
  }

  const baseName = relPath.includes("/") ? relPath.slice(relPath.lastIndexOf("/") + 1) : relPath;
  if (baseName === ".env" || (baseName.startsWith(".env.") && baseName !== ".env.example")) {
    return;
  }

  const targetPath = join(templateRoot, relPath);
  await mkdir(dirname(targetPath), { recursive: true });

  const blobUrl = `${GITHUB_API}/repos/${repo.owner}/${repo.repo}/git/blobs/${sha}`;
  const blobResponse = await githubRequest(blobUrl);
  if (!blobResponse.ok) {
    throw await formatGitHubError(blobResponse, `Failed to fetch blob for ${relPath}`);
  }

  const blobData = await blobResponse.json();

  if (blobData.encoding === "base64" && blobData.content && blobData.size <= LARGE_FILE_BYTES) {
    const content = Buffer.from(blobData.content.replace(/\n/g, ""), "base64");
    await writeFile(targetPath, content);
    return;
  }

  await downloadRawFile(repo, githubPath, targetPath);
}

/**
 * @param {import('./config.js').RepositoryConfig} repo
 * @param {string} githubPath
 * @param {string} targetPath
 */
async function downloadRawFile(repo, githubPath, targetPath) {
  const url = `${RAW_BASE}/${repo.owner}/${repo.repo}/${repo.branch}/${githubPath}`;
  const response = await fetch(url, {
    headers: buildHeaders(),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  if (!response.body) {
    throw new Error(`Empty response body for ${url}`);
  }

  await pipeline(Readable.fromWeb(response.body), createWriteStream(targetPath));
}

/**
 * @param {string} url
 */
async function githubRequest(url) {
  return fetch(url, {
    headers: {
      ...buildHeaders(),
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
}

function buildHeaders() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

/**
 * @param {Response} response
 * @param {string} message
 */
async function formatGitHubError(response, message) {
  let detail = message;
  try {
    const body = await response.json();
    if (body?.message) detail = `${message}: ${body.message}`;
  } catch {
    // ignore parse errors
  }

  if (response.status === 404) {
    return new Error(
      `${detail}\nVerify TEMPLATES_REPO_URL / templates.json repository settings.`
    );
  }

  if (response.status === 403) {
    return new Error(
      `${detail}\nGitHub API rate limit may apply. Set GITHUB_TOKEN for higher limits.`
    );
  }

  return new Error(`${detail} (HTTP ${response.status})`);
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
