import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { loadManifest, resolveRepositoryConfig, getPackageRoot } from "./config.js";
import { isUpdateProtected, shouldSkipFileName } from "./fs-ignore.js";
import {
  collectFileHashes,
  diffTemplateTrees,
  hashFileContents,
} from "./file-tree.js";
import { readProjectStamp, writeProjectStamp } from "./project-stamp.js";
import { confirmYesNo } from "./prompt.js";
import { resolveTemplateSource } from "./template-resolver.js";

/**
 * @param {import('./file-tree.js').UpdateDiff} diff
 * @param {{
 *   projectVersion: string,
 *   latestVersion: string,
 *   templateName: string
 * }} meta
 */
export function printUpdateReport(diff, meta) {
  console.log(`\nTemplate update report: ${meta.templateName}`);
  console.log(`  Project version:  ${meta.projectVersion}`);
  console.log(`  Latest version: ${meta.latestVersion}`);
  console.log("");

  if (
    diff.newFiles.length === 0 &&
    diff.safeUpdates.length === 0 &&
    diff.conflicts.length === 0 &&
    diff.removedFromTemplate.length === 0
  ) {
    console.log("Your project is up to date with the latest template.");
    return;
  }

  if (diff.newFiles.length > 0) {
    console.log(`New files in template (${diff.newFiles.length}):`);
    diff.newFiles.slice(0, 25).forEach((p) => console.log(`  + ${p}`));
    if (diff.newFiles.length > 25) {
      console.log(`  ... and ${diff.newFiles.length - 25} more`);
    }
    console.log("");
  }

  if (diff.safeUpdates.length > 0) {
    console.log(`Safe updates (${diff.safeUpdates.length}) — template changed, you did not edit:`);
    diff.safeUpdates.slice(0, 25).forEach((p) => console.log(`  ~ ${p}`));
    if (diff.safeUpdates.length > 25) {
      console.log(`  ... and ${diff.safeUpdates.length - 25} more`);
    }
    console.log("");
  }

  if (diff.conflicts.length > 0) {
    console.log(`Conflicts (${diff.conflicts.length}) — you modified these files:`);
    diff.conflicts.slice(0, 25).forEach((p) => console.log(`  ! ${p}`));
    if (diff.conflicts.length > 25) {
      console.log(`  ... and ${diff.conflicts.length - 25} more`);
    }
    console.log("");
  }

  if (diff.removedFromTemplate.length > 0) {
    console.log(`Removed from template (${diff.removedFromTemplate.length}) — not deleted locally:`);
    diff.removedFromTemplate.slice(0, 15).forEach((p) => console.log(`  - ${p}`));
    if (diff.removedFromTemplate.length > 15) {
      console.log(`  ... and ${diff.removedFromTemplate.length - 15} more`);
    }
    console.log("");
  }

  if (diff.upToDate.length > 0) {
    console.log(`${diff.upToDate.length} file(s) already match the latest template.\n`);
  }
}

/**
 * @param {string} sourcePath
 * @param {string} targetPath
 */
export function copyTemplateFile(sourcePath, targetPath) {
  mkdirSync(dirname(targetPath), { recursive: true });
  cpSync(sourcePath, targetPath, { force: true });
}

/**
 * @param {string} projectDir
 * @param {import('./parse-args.js').CliFlags} flags
 * @param {{ checkOnly: boolean }} mode
 */
export async function runUpdate(projectDir, flags, mode) {
  const stamp = readProjectStamp(projectDir);

  if (!stamp) {
    console.error("No .tempjs.json found in this directory.");
    console.error("Run `tempjs <template-id>` here first, or this project was not created with tempjs.");
    process.exitCode = 1;
    return;
  }

  const manifest = loadManifest();
  const entry = manifest.templates[stamp.template];
  if (!entry) {
    console.error(`Unknown template in .tempjs.json: ${stamp.template}`);
    process.exitCode = 1;
    return;
  }

  const repo = resolveRepositoryConfig(manifest.repository);
  const packageRoot = getPackageRoot();
  const useRemote =
    flags.remote ||
    process.env.TEMPLATE_USE_REMOTE === "1" ||
    process.env.TEMPLATE_USE_REMOTE === "true";

  const latestVersion = entry.version ?? "0.0.0";
  let resolved = null;

  try {
    resolved = await resolveTemplateSource({
      repo,
      packageRoot,
      templateDirectory: entry.directory,
      useRemote,
    });

    const latestHashes = collectFileHashes(resolved.templateRoot);
    const baselineHashes = stamp.fileHashes ?? {};
    const currentHashes = {};

    for (const path of Object.keys(latestHashes)) {
      const projectPath = join(projectDir, path);
      if (existsSync(projectPath) && !shouldSkipFileName(path.split("/").pop() ?? "")) {
        currentHashes[path] = hashFileContents(projectPath);
      }
    }

    const diff = diffTemplateTrees(baselineHashes, currentHashes, latestHashes);

    printUpdateReport(diff, {
      projectVersion: stamp.templateVersion,
      latestVersion,
      templateName: entry.name,
    });

    if (mode.checkOnly) {
      if (stamp.templateVersion !== latestVersion) {
        console.log("Run `tempjs update --merge` to apply non-conflicting template updates.");
      }
      return;
    }

    const pathsToApply = [...diff.newFiles, ...diff.safeUpdates].filter(
      (path) => !isUpdateProtected(path)
    );

    const skippedProtected = [...diff.newFiles, ...diff.safeUpdates].filter((path) =>
      isUpdateProtected(path)
    );
    if (skippedProtected.length > 0) {
      console.log(`Skipping ${skippedProtected.length} protected path(s) (brand, .env, etc.).`);
    }

    if (pathsToApply.length === 0) {
      if (diff.conflicts.length > 0) {
        console.log("\nNo safe updates to apply. Resolve conflicts manually.");
      }
      return;
    }

    const confirmed = await confirmYesNo(
      `\nApply ${pathsToApply.length} non-conflicting update(s)? [y/N] `,
      flags.yes
    );

    if (!confirmed) {
      console.log("Aborted.");
      return;
    }

    for (const relPath of pathsToApply) {
      const from = join(resolved.templateRoot, relPath);
      const to = join(projectDir, relPath);
      copyTemplateFile(from, to);
    }

    await writeProjectStamp(projectDir, {
      templateId: stamp.template,
      templateVersion: latestVersion,
      templateDirectory: entry.directory,
      repository: `${repo.owner}/${repo.repo}`,
      branch: repo.branch,
      sourceDir: resolved.templateRoot,
      isUpdate: true,
    });

    console.log(`\nApplied ${pathsToApply.length} update(s). Project stamped at template v${latestVersion}.`);

    if (diff.conflicts.length > 0) {
      console.log(`${diff.conflicts.length} conflict(s) still need manual review.`);
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  } finally {
    if (resolved) {
      resolved.release();
    }
  }
}
