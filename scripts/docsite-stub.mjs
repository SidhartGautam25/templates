import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docsiteContent = join(root, "docsite", "content");

/**
 * Add docsite registry stub for a new template.
 * @param {{ templateId: string, displayName: string, directory: string, description?: string }} options
 */
export function applyDocsiteStub(options) {
  const { templateId, displayName, directory, description } = options;
  const label = `${displayName} Website`;
  const desc =
    description ??
    `${displayName} website template — customize this docsite page after scaffolding.`;

  const registryPath = join(docsiteContent, "templates-registry.json");
  const registry = JSON.parse(readFileSync(registryPath, "utf8"));

  if (!registry.templates.some((t) => t.id === templateId)) {
    registry.templates.push({
      id: templateId,
      label,
      version: "1.0.0",
      cliId: templateId,
      flagGroups: ["generate", "theme", "brand", "database"],
      brandFields: [
        "name",
        "shortName",
        "baseUrl",
        "phone",
        "phoneDisplay",
        "countryCode",
        "email",
        "address",
        "tagline",
        "developerName",
        "channelPartner",
      ],
      commandBuilder: {
        presets: [
          {
            id: "quick-copy",
            label: "Quick copy",
            description: "Copy template files only — configure theme, brand, and database later.",
            command: `tempjs ${templateId} --yes`,
          },
          {
            id: "interactive",
            label: "Interactive setup",
            description: "Guided prompts for theme, brand, and database.",
            command: `tempjs ${templateId} config`,
          },
        ],
        modes: [
          {
            id: "generate",
            label: "Generate new project",
            description: `Create a new site from the ${label} template.`,
            baseCommand: `tempjs ${templateId}`,
            wizardSteps: [
              {
                id: "options",
                title: "How should tempjs run?",
                fieldKeys: ["config", "yes", "force", "remote", "initGit"],
              },
              {
                id: "theme",
                title: "Theme & typography",
                fieldKeys: ["theme", "font"],
              },
              {
                id: "brand",
                title: "Brand & contact",
                fieldKeys: [
                  "name",
                  "shortName",
                  "baseUrl",
                  "phone",
                  "phoneDisplay",
                  "countryCode",
                  "email",
                  "address",
                  "tagline",
                  "developerName",
                  "channelPartner",
                ],
              },
              {
                id: "database",
                title: "Database & admin",
                fieldKeys: [
                  "dbHost",
                  "dbPort",
                  "dbUser",
                  "dbPassword",
                  "dbName",
                  "adminUser",
                  "adminPassword",
                  "skipDbPush",
                  "dbPush",
                ],
              },
            ],
          },
        ],
      },
    });
    writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n", "utf8");
    console.log(`  ✓ docsite: added templates-registry.json entry (${templateId})`);
  }

  const templatePageDir = join(docsiteContent, "developers", "templates");
  mkdirSync(templatePageDir, { recursive: true });
  const pagePath = join(templatePageDir, `${templateId}.json`);
  const page = {
    title: label,
    description: desc,
    templateId,
    blocks: [
      {
        type: "paragraph",
        text: `Documentation stub for ${label}. Expand this page with vertical-specific setup, features, and command examples.`,
      },
      {
        type: "callout",
        variant: "info",
        title: "Maintainer note",
        text: `Template directory: templates/${directory}/. Update this JSON after the vertical is built.`,
      },
      {
        type: "heading",
        level: 2,
        text: "Quick start",
      },
      {
        type: "code",
        code: `mkdir client-site && cd client-site\ntempjs ${templateId} config`,
      },
    ],
  };
  writeFileSync(pagePath, JSON.stringify(page, null, 2) + "\n", "utf8");
  console.log(`  ✓ docsite: created developers/templates/${templateId}.json stub`);

  const contentTsPath = join(root, "docsite", "src", "lib", "content.ts");
  if (existsSync(contentTsPath)) {
    let contentTs = readFileSync(contentTsPath, "utf8");
    const importName = templateId.replace(/-/g, "_");
    const importLine = `import ${importName}Template from "@content/developers/templates/${templateId}.json";`;
    if (!contentTs.includes(importLine)) {
      contentTs = contentTs.replace(
        /import realEstateTemplate from "@content\/developers\/templates\/real-estate.json";/,
        `import realEstateTemplate from "@content/developers/templates/real-estate.json";\nimport ${importName}Template from "@content/developers/templates/${templateId}.json";`
      );
      contentTs = contentTs.replace(
        /"real-estate": realEstateTemplate as PageContent,/,
        `"real-estate": realEstateTemplate as PageContent,\n  "${templateId}": ${importName}Template as PageContent,`
      );
      writeFileSync(contentTsPath, contentTs, "utf8");
      console.log(`  ✓ docsite: registered ${templateId} in src/lib/content.ts`);
    }
  }
}
