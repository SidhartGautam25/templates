#!/usr/bin/env node

import { execSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { loadManifest, getPackageRoot, resolveRepositoryConfig } from "./config.js";
import {
  promptTheme,
  promptFont,
  applyThemeAndFont,
  getSavedConfig,
} from "./theme-manager.js";
import { promptAndApplyBrand } from "./brand-manager.js";
import { promptAndSetupDb } from "./db-setup.js";
import { printTemplateInfo } from "./info.js";
import { parseArgs, toCliOptions } from "./parse-args.js";
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
  tempjs info <template-id>
  tempjs <template-id> [options]
  tempjs <template-id> config     Interactive theme, typography, brand & database setup
  tempjs theme                    Change theme in an initialized project
  tempjs font                     Change font styling in an initialized project
  tempjs brand                    Configure brand & contact info
  tempjs init-db                  Configure .env and sync database schema
  tempjs --help

OPTIONS
  --config          Run full setup (theme, font, brand, database) after copying
  --yes, -y         Skip all prompts (use defaults or values from flags/env)
  --no-prompt       Same as --yes
  --force, -f       Overwrite existing files without prompting
  --remote          Fetch from GitHub even if a local template copy exists
  --init-git        Run git init after copying the template

  Theme & typography:
  --theme <id>      Theme id (theme1–theme5)
  --font <id>       Font id (default, inter, lora-montserrat, …)

  Brand & contact:
  --name <text>           Brand name
  --short-name <text>     Short / display name
  --base-url <url>        Site base URL
  --phone <text>          Contact phone
  --phone-display <text>  Formatted phone for display
  --country-code <text>   Phone country code
  --email <text>          Contact email
  --address <text>        Full address

  Database & admin:
  --db-host <host>        MySQL/MariaDB host
  --db-port <port>        MySQL/MariaDB port
  --db-user <user>        Database username
  --db-password <pass>    Database password
  --db-name <name>        Database name
  --admin-user <user>     Admin portal username
  --admin-password <pass> Admin portal password
  --db-push               Run prisma db push after writing .env
  --skip-db-push          Skip prisma db push (with --yes)

EXAMPLES
  mkdir hotel-client && cd hotel-client
  tempjs hotel config

  # Non-interactive full setup
  tempjs hotel --config --yes \\
    --theme theme2 --name "Mi Plaza" --base-url "https://miplaza.com" \\
    --db-host localhost --db-name mi_plaza_db --admin-user admin

  tempjs info hotel
  tempjs theme --theme theme3 --yes
  tempjs init-db --yes --db-host localhost --skip-db-push

ENVIRONMENT
  TEMPLATES_REPO_URL       GitHub repo URL or owner/repo
  TEMPLATES_REPO_OWNER     GitHub owner/username
  TEMPLATES_REPO_REPO      GitHub repository name
  TEMPLATES_REPO_BRANCH    Branch name (default: main)
  TEMPLATE_USE_REMOTE=1    Always fetch from GitHub
  GITHUB_TOKEN / GH_TOKEN  Optional — private repositories only
`;

/**
 * @param {Record<string, import('./config.js').TemplateEntry>} templates
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
    if (entry.tags?.length) {
      console.log(`${"".padEnd(idWidth + 2)}[${entry.tags.join(", ")}]`);
    }
    if (entry.stack?.length) {
      console.log(`${"".padEnd(idWidth + 2)}${entry.stack.slice(0, 4).join(" · ")}`);
    }
  }
  console.log("");
  console.log("Run `tempjs info <template-id>` for full details.\n");
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
 * @param {boolean} autoConfirm
 */
async function confirmOverwrite(autoConfirm) {
  if (autoConfirm) return true;
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
 * @param {import('./parse-args.js').CliFlags} flags
 * @param {boolean} runWithConfig
 */
async function runTemplate(targetDir, templateId, flags, runWithConfig = false) {
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
  const cliOptions = toCliOptions(flags);
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
    const autoConfirm = flags.force || flags.yes;

    if (hasContent && !flags.force) {
      const conflicts = findConflictingPaths(sourceDir, targetDir);
      if (conflicts.length > 0) {
        printConflictWarning(conflicts);
        const confirmed = await confirmOverwrite(autoConfirm);
        if (!confirmed) {
          console.log("Aborted.");
          return;
        }
      } else if (!isDirectoryEmpty(targetDir)) {
        console.log("Current directory is not empty, but no files would be overwritten.");
        const confirmed = await confirmOverwrite(autoConfirm);
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

    if (runWithConfig) {
      console.log("\nConfiguring project theme and typography...");
      const selectedTheme = await promptTheme("theme1", cliOptions);
      const selectedFont = await promptFont("default", cliOptions);
      await applyThemeAndFont(targetDir, selectedTheme, selectedFont);

      await promptAndApplyBrand(targetDir, cliOptions);
      await promptAndSetupDb(targetDir, cliOptions);
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
  let command = positionals[0];

  if (flags.help || command === "help" || (!command && argv.length === 0)) {
    console.log(HELP_TEXT.trim());
    return;
  }

  const manifest = loadManifest();
  const repo = resolveRepositoryConfig(manifest.repository);
  const cliOptions = toCliOptions(flags);

  if (command === "list") {
    printTemplateList(manifest.templates);
    return;
  }

  if (command === "info") {
    const templateId = positionals[1];
    if (!templateId) {
      console.error("Usage: tempjs info <template-id>");
      console.error("Run `tempjs list` to see available templates.");
      process.exitCode = 1;
      return;
    }
    const entry = manifest.templates[templateId];
    if (!entry) {
      console.error(`Unknown template: ${templateId}`);
      console.error("Run `tempjs list` to see available templates.");
      process.exitCode = 1;
      return;
    }
    printTemplateInfo(templateId, entry, repo);
    return;
  }

  if (
    command === "theme" ||
    command === "font" ||
    command === "brand" ||
    command === "init-db"
  ) {
    const targetDir = process.cwd();
    const currentConfig = getSavedConfig(targetDir);

    if (command === "theme") {
      const selectedTheme = await promptTheme(currentConfig.theme || "theme1", cliOptions);
      const selectedFont = await promptFont(currentConfig.font || "default", {
        ...cliOptions,
        yes: cliOptions.yes || Boolean(cliOptions.font),
      });
      await applyThemeAndFont(targetDir, selectedTheme, selectedFont);
    } else if (command === "font") {
      const selectedFont = await promptFont(currentConfig.font || "default", cliOptions);
      await applyThemeAndFont(
        targetDir,
        currentConfig.theme || "theme1",
        selectedFont
      );
    } else if (command === "brand") {
      await promptAndApplyBrand(targetDir, cliOptions);
    } else if (command === "init-db") {
      await promptAndSetupDb(targetDir, cliOptions);
    }
    return;
  }

  let runWithConfig = flags.config;
  if (positionals.length >= 2 && positionals[1] === "config") {
    runWithConfig = true;
    positionals.splice(1, 1);
  }

  const targetDir = process.cwd();
  await runTemplate(targetDir, command, flags, runWithConfig);
}

main(process.argv.slice(2)).catch((error) => {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
