import { loadManifest, resolveRepositoryConfig } from "./config.js";
import { getTemplateBrandFields } from "./init-options.js";

/**
 * @param {string} templateId
 * @param {import('./config.js').TemplateEntry} entry
 * @param {import('./config.js').RepositoryConfig} repo
 */
export function printTemplateInfo(templateId, entry, repo) {
  const lines = [];

  lines.push(`${entry.name} (${templateId})`);
  lines.push("=".repeat(Math.min(60, entry.name.length + templateId.length + 4)));
  lines.push("");

  if (entry.description) {
    lines.push(entry.description);
    lines.push("");
  }

  if (entry.version) {
    lines.push(`Version:          ${entry.version}`);
  }

  if (entry.stack?.length) {
    lines.push(`Stack:            ${entry.stack.join(", ")}`);
  }

  if (entry.node) {
    lines.push(`Node.js:          ${entry.node}`);
  }

  if (entry.packageManager) {
    lines.push(`Package manager:  ${entry.packageManager}`);
  }

  if (entry.setupTime) {
    lines.push(`Typical setup:    ${entry.setupTime}`);
  }

  if (entry.docker !== undefined) {
    lines.push(`Docker support:   ${entry.docker ? "Yes (docker-compose.yml)" : "No"}`);
  }

  if (entry.tags?.length) {
    lines.push(`Tags:             ${entry.tags.join(", ")}`);
  }

  lines.push(`Source directory: ${repo.templatesPath}/${entry.directory}`);
  lines.push(`Repository:       github.com/${repo.owner}/${repo.repo} (${repo.branch})`);

  if (entry.features?.length) {
    lines.push("");
    lines.push("Features:");
    for (const feature of entry.features) {
      lines.push(`  • ${feature}`);
    }
  }

  lines.push("");
  lines.push("Quick start:");
  lines.push(`  mkdir my-project && cd my-project`);
  lines.push(`  tempjs ${templateId} config`);
  lines.push(`  pnpm install && pnpm dev`);
  lines.push("");
  lines.push("Non-interactive:");
  const brandFields = getTemplateBrandFields(entry);
  const flagPreview = brandFields
    .slice(0, 4)
    .map((f) => f.flag)
    .join(" ");
  lines.push(
    `  tempjs ${templateId} --config --yes --theme theme1 ${flagPreview} --db-host localhost`
  );

  if (entry.init?.brandFields?.length) {
    lines.push("");
    lines.push("Init options for this template:");
    for (const field of brandFields) {
      lines.push(`  ${field.flag.padEnd(22)} ${field.description}`);
    }
  }

  if (entry.docs) {
    lines.push("");
    lines.push(`Docs in generated project: ${entry.docs}`);
  }

  console.log(lines.join("\n"));
}

/**
 * @param {Record<string, import('./config.js').TemplateEntry>} templates
 * @param {import('./config.js').RepositoryConfig} repo
 */
export function printAllTemplatesInfo(templates, repo) {
  const ids = Object.keys(templates).sort();
  for (let i = 0; i < ids.length; i++) {
    if (i > 0) console.log("\n");
    printTemplateInfo(ids[i], templates[ids[i]], repo);
  }
}
