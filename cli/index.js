#!/usr/bin/env node

import { execSync } from "node:child_process";
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
  targetHasGitRepo,
} from "./copy.js";
import { writeProjectStamp } from "./project-stamp.js";
import { printFetchComplete } from "./progress.js";
import { confirmYesNo } from "./prompt.js";
import { resolveTemplateSource } from "./template-resolver.js";
import { runUpdate } from "./update.js";

const HELP_TEXT = `
tempjs — instantiate project templates from GitHub

USAGE
  tempjs list
  tempjs info <template-id>
  tempjs <template-id> [options]
  tempjs <template-id> config     Interactive theme, typography, brand & database setup
  tempjs update [--check | --merge]
  tempjs theme                    Change theme in an initialized project
  tempjs font                     Change font styling in an initialized project
  tempjs brand                    Configure brand & contact info
  tempjs init-db                  Configure .env and sync database schema
  tempjs --help

UPDATE
  tempjs update --check           Show diff vs latest template (read-only)
  tempjs update --merge           Apply non-conflicting template updates only
  tempjs update --merge --yes     Apply without confirmation prompt

OPTIONS
  --config          Run full setup (theme, font, brand, database) after copying
  --yes, -y         Skip all prompts
  --no-prompt       Same as --yes
  --force, -f       Overwrite existing files without prompting
  --remote          Fetch from GitHub even if a local template copy exists
  --init-git        Run git init after copying the template

  (See tempjs --help for theme, brand, and database flags.)

EXAMPLES
  mkdir hotel-client && cd hotel-client
  tempjs hotel config

  tempjs update --check
  tempjs update --merge --yes

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
    const version = entry.version ? ` v${entry.version}` : "";
    console.log(`${id.padEnd(idWidth + 2)}${entry.name}${version}`);
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

  let resolved = null;

  try {
    resolved = await resolveTemplateSource({
      repo,
      packageRoot,
      templateDirectory: entry.directory,
      useRemote,
    });
    printFetchComplete({ templateId, stats: resolved.stats });

    if (targetHasGitRepo(targetDir)) {
      console.warn(
        "Warning: This directory already contains a .git folder (existing Git repository)."
      );
    }

    const entries = listDirectoryEntries(targetDir);
    const hasContent = entries.length > 0;
    const autoConfirm = flags.force || flags.yes;

    if (hasContent && !flags.force) {
      const conflicts = findConflictingPaths(resolved.templateRoot, targetDir);
      if (conflicts.length > 0) {
        printConflictWarning(conflicts);
        const confirmed = await confirmYesNo("Continue? [y/N] ", autoConfirm);
        if (!confirmed) {
          console.log("Aborted.");
          return;
        }
      } else if (!isDirectoryEmpty(targetDir)) {
        console.log("Current directory is not empty, but no files would be overwritten.");
        const confirmed = await confirmYesNo("Continue? [y/N] ", autoConfirm);
        if (!confirmed) {
          console.log("Aborted.");
          return;
        }
      }
    }

    const allowOverwrite = flags.force || hasContent;
    copyTemplate(resolved.templateRoot, targetDir, { force: allowOverwrite });

    await writeProjectStamp(targetDir, {
      templateId,
      templateVersion: entry.version ?? "0.0.0",
      templateDirectory: entry.directory,
      repository: `${repo.owner}/${repo.repo}`,
      branch: repo.branch,
      sourceDir: resolved.templateRoot,
      isUpdate: false,
    });

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
    console.log(`Stamped .tempjs.json (template v${entry.version ?? "0.0.0"})`);
    console.log("\nNext steps — see GETTING_STARTED.md:");
    console.log("  1. pnpm install");
    console.log("  2. cp .env.example .env");
    console.log("  3. docker compose up -d   # or: tempjs init-db");
    console.log("  4. pnpm prisma db push && pnpm prisma db seed");
    console.log("  5. pnpm dev");
    console.log("  6. Open /admin — login with ADMIN_USER / ADMIN_PASSWORD");
    console.log("\n  curl http://localhost:3000/api/health   # verify DB + env");
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
    if (resolved) {
      resolved.release();
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

  if (command === "update") {
    const hasCheck = flags.updateCheck || argv.includes("--check");
    const hasMerge = flags.updateMerge || argv.includes("--merge");

    if (!hasCheck && !hasMerge) {
      console.error("Usage: tempjs update --check | tempjs update --merge [--yes]");
      process.exitCode = 1;
      return;
    }

    const targetDir = process.cwd();
    await runUpdate(targetDir, flags, { checkOnly: hasCheck && !hasMerge });
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
