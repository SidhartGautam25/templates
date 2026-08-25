import { execSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { loadManifest, getPackageRoot, resolveRepositoryConfig } from "./config.js";
import {
  copyTemplate,
  findConflictingPaths,
  isDirectoryEmpty,
  listDirectoryEntries,
  removeDirectory,
  targetHasGitRepo,
} from "./copy.js";
import { fetchTemplateFromGitHub, resolveLocalTemplate } from "./fetch.js";

const HELP_TEXT = `
tempjs — instantiate project templates from GitHub

USAGE
  tempjs list
  tempjs <template-id> [options]
  tempjs --help

OPTIONS
  --force       Overwrite existing files in the current directory
  --remote      Fetch from GitHub even if a local template copy exists
  --init-git    Run git init after copying the template
  --help        Show this help message

EXAMPLES
  mkdir hotel-client && cd hotel-client
  tempjs hotel
  git init

ENVIRONMENT
  TEMPLATES_REPO_URL       GitHub repo URL or owner/repo (overrides templates.json)
  TEMPLATES_REPO_OWNER     GitHub owner/username
  TEMPLATES_REPO_REPO      GitHub repository name
  TEMPLATES_REPO_BRANCH    Branch name (default: main)
  TEMPLATE_USE_REMOTE=1    Always fetch from GitHub
  GITHUB_TOKEN / GH_TOKEN    GitHub token for API rate limits

CONFIGURATION
  Repository and template mappings live in templates.json at the package root.
`;

/**
 * @param {Record<string, { name: string, description: string }>} templates
 */
function printTemplateList(templates) {
  console.log("Available templates:\n");
  const ids = Object.keys(templates).sort();
  const idWidth = Math.max(...ids.map((id) => id.length), 10);

  for (const id of ids) {
    const entry = templates[id];
    console.log(`${id.padEnd(idWidth + 2)}${entry.name}`);
    if (entry.description) {
      console.log(`${"".padEnd(idWidth + 2)}${entry.description}`);
    }
  }
  console.log("");
}

/**
 * @param {string[]} argv
 */
function parseArgs(argv) {
  const flags = {
    force: false,
    remote: false,
    initGit: false,
    help: false,
  };
  const positionals = [];

  for (const arg of argv) {
    if (arg === "--force") flags.force = true;
    else if (arg === "--remote") flags.remote = true;
    else if (arg === "--init-git") flags.initGit = true;
    else if (arg === "--help" || arg === "-h") flags.help = true;
    else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      positionals.push(arg);
    }
  }

  return { flags, positionals };
}

/**
 * @param {string[]} conflicts
 */
function printConflictWarning(conflicts) {
  console.log("Current directory is not empty.");
  console.log("The following files may be overwritten:");
  const preview = conflicts.slice(0, 20);
  for (const path of preview) {
    console.log(`  ${path}`);
  }
  if (conflicts.length > preview.length) {
    console.log(`  ... and ${conflicts.length - preview.length} more`);
  }
  console.log("");
}

/**
 * @param {boolean} force
 */
async function confirmOverwrite(force) {
  if (force) return true;
  const rl = createInterface({ input, output });
  try {
    const answer = await rl.question("Continue? [y/N] ");
    return answer.trim().toLowerCase() === "y" || answer.trim().toLowerCase() === "yes";
  } finally {
    rl.close();
  }
}

/**
 * @param {string} targetDir
 * @param {string} templateId
 * @param {{ force: boolean, remote: boolean, initGit: boolean }} flags
 */
async function runTemplate(targetDir, templateId, flags) {
  const manifest = loadManifest();
  const entry = manifest.templates[templateId];

  if (!entry) {
    console.error(`Unknown template: ${templateId}`);
    console.error("Run `tempjs list` to see available templates.");
    process.exitCode = 1;
    return;
  }

  const repo = resolveRepositoryConfig(manifest.repository);
  const packageRoot = getPackageRoot();
  const useRemote =
    flags.remote ||
    process.env.TEMPLATE_USE_REMOTE === "1" ||
    process.env.TEMPLATE_USE_REMOTE === "true";

  let sourceDir = null;
  let cleanupDir = null;

  try {
    if (!useRemote) {
      sourceDir = await resolveLocalTemplate(
        packageRoot,
        repo.templatesPath,
        entry.directory
      );
    }

    if (!sourceDir) {
      console.log(`Fetching template "${templateId}" from ${repo.owner}/${repo.repo}...`);
      sourceDir = await fetchTemplateFromGitHub(repo, entry.directory);
      cleanupDir = sourceDir.replace(/[/\\]template$/, "");
    } else {
      console.log(`Using local template "${templateId}"...`);
    }

    if (targetHasGitRepo(targetDir)) {
      console.warn(
        "Warning: This directory already contains a .git folder (existing Git repository)."
      );
    }

    const entries = listDirectoryEntries(targetDir);
    const hasContent = entries.length > 0;

    if (hasContent && !flags.force) {
      const conflicts = findConflictingPaths(sourceDir, targetDir);
      if (conflicts.length > 0) {
        printConflictWarning(conflicts);
        const confirmed = await confirmOverwrite(false);
        if (!confirmed) {
          console.log("Aborted.");
          return;
        }
      } else if (!isDirectoryEmpty(targetDir)) {
        console.log("Current directory is not empty, but no files would be overwritten.");
        const confirmed = await confirmOverwrite(false);
        if (!confirmed) {
          console.log("Aborted.");
          return;
        }
      }
    }

    const allowOverwrite = flags.force || hasContent;
    copyTemplate(sourceDir, targetDir, { force: allowOverwrite });

    if (flags.initGit && !targetHasGitRepo(targetDir)) {
      execSync("git init", { cwd: targetDir, stdio: "inherit" });
    }

    console.log(`\nTemplate "${entry.name}" created successfully in ${targetDir}`);
    console.log("\nNext steps:");
    console.log("  pnpm install   # or npm install");
    console.log("  pnpm dev       # start development server");
    if (!flags.initGit && !targetHasGitRepo(targetDir)) {
      console.log("  git init       # optional: initialize a new repository");
    }
  } catch (error) {
    if (error instanceof Error && error.message === "TARGET_NOT_EMPTY") {
      printConflictWarning(error.conflicts ?? []);
      console.error("Use --force to overwrite without prompting.");
      process.exitCode = 1;
      return;
    }

    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  } finally {
    if (cleanupDir) {
      removeDirectory(cleanupDir);
    }
  }
}

/**
 * @param {string[]} argv
 */
async function main(argv) {
  const { flags, positionals } = parseArgs(argv);
  const command = positionals[0];

  if (flags.help || command === "help" || (!command && argv.length === 0)) {
    console.log(HELP_TEXT.trim());
    return;
  }

  const manifest = loadManifest();

  if (command === "list") {
    printTemplateList(manifest.templates);
    return;
  }

  const targetDir = process.cwd();
  await runTemplate(targetDir, command, flags);
}

main(process.argv.slice(2)).catch((error) => {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
