import site from "@content/site.json";
import navigation from "@content/navigation.json";
import commandsRegistry from "@content/shared/commands.json";
import initFieldsRegistry from "@content/shared/init-fields.json";
import commandBuilderFields from "@content/shared/command-builder-fields.json";
import commandBuilderOptions from "@content/shared/command-builder-options.json";
import commandBuildersRegistryJson from "@content/shared/command-builders-registry.json";
import templatesRegistry from "@content/templates-registry.json";

import devIntro from "@content/developers/intro.json";
import devCommands from "@content/developers/commands.json";
import devCustomization from "@content/developers/customization.json";
import devUpdates from "@content/developers/updates.json";
import devDocker from "@content/developers/docker.json";
import devOptionalModules from "@content/developers/optional-modules.json";
import devBlogCompose from "@content/developers/blog-compose.json";
import templatesOverview from "@content/developers/templates/overview.json";

import hotelTemplate from "@content/developers/templates/hotel.json";
import realEstateTemplate from "@content/developers/templates/real-estate.json";

import maintIntro from "@content/maintainers/intro.json";
import maintArchitecture from "@content/maintainers/architecture.json";
import maintCore from "@content/maintainers/core.json";
import maintWorkflow from "@content/maintainers/workflow.json";
import maintTemplateTools from "@content/maintainers/template-tools.json";
import maintNewTemplate from "@content/maintainers/new-template.json";
import maintVersioning from "@content/maintainers/versioning.json";
import maintCommands from "@content/maintainers/commands.json";
import maintModules from "@content/maintainers/modules.json";
import maintBlogCompose from "@content/maintainers/blog-compose.json";
import maintCommandBuilders from "@content/maintainers/command-builders.json";

import type {
  CommandsRegistry,
  FlagDef,
  InitFieldsRegistry,
  Navigation,
  NavItem,
  PageContent,
  SiteMeta,
  CommandBuilderFieldsRegistry,
  CommandBuilderOptionsRegistry,
  CommandBuilderConfig,
  CommandBuildersRegistry,
  TemplateRegistry,
  TemplateRegistryEntry,
} from "@/types/content";

export const siteMeta = site as SiteMeta;
export const nav = navigation as Navigation;
export const commands = commandsRegistry as CommandsRegistry;
export const initFields = initFieldsRegistry as InitFieldsRegistry;
export const templateRegistry = templatesRegistry as TemplateRegistry;
export const commandBuilderFieldDefs = commandBuilderFields as CommandBuilderFieldsRegistry;
const staticOptionSets = commandBuilderOptions as CommandBuilderOptionsRegistry;
export const commandBuilderOptionSets: CommandBuilderOptionsRegistry = {
  ...staticOptionSets,
  templates: templateRegistry.templates.map((t) => ({
    value: t.cliId,
    label: t.label,
  })),
};
export const commandBuildersRegistry = commandBuildersRegistryJson as CommandBuildersRegistry;

export const developerPages: Record<string, PageContent> = {
  intro: devIntro as PageContent,
  commands: devCommands as PageContent,
  customization: devCustomization as PageContent,
  updates: devUpdates as PageContent,
  docker: devDocker as PageContent,
  "optional-modules": devOptionalModules as PageContent,
  "blog-compose": devBlogCompose as PageContent,
};

export const templatesOverviewPage = templatesOverview as PageContent;

export const templatePages: Record<string, PageContent> = {
  hotel: hotelTemplate as PageContent,
  "real-estate": realEstateTemplate as PageContent,
};

export const maintainerPages: Record<string, PageContent> = {
  intro: maintIntro as PageContent,
  architecture: maintArchitecture as PageContent,
  core: maintCore as PageContent,
  workflow: maintWorkflow as PageContent,
  "template-tools": maintTemplateTools as PageContent,
  "new-template": maintNewTemplate as PageContent,
  versioning: maintVersioning as PageContent,
  commands: maintCommands as PageContent,
  modules: maintModules as PageContent,
  "blog-compose": maintBlogCompose as PageContent,
  "command-builders": maintCommandBuilders as PageContent,
};

export function getTemplatePage(templateId: string): PageContent | null {
  return templatePages[templateId] || null;
}

export function getAllTemplatePages(): Record<string, PageContent> {
  return templatePages;
}

export function getTemplateRegistryEntry(templateId: string): TemplateRegistryEntry | undefined {
  return templateRegistry.templates.find((t) => t.id === templateId);
}

export function buildDeveloperSidebar(): NavItem[] {
  const templateChildren: NavItem[] = templateRegistry.templates.map((t) => ({
    id: t.id,
    label: t.label,
    path: `/developers/templates/${t.id}`,
  }));

  const templatesGroup: NavItem = {
    id: "templates",
    label: "Templates",
    path: "/developers/templates",
    children: templateChildren,
  };

  const staticItems = nav.developers;
  const commandsIndex = staticItems.findIndex((item) => item.id === "commands");
  const before = staticItems.slice(0, commandsIndex + 1);
  const after = staticItems.slice(commandsIndex + 1);

  return [...before, templatesGroup, ...after];
}

export function getCommand(id: string) {
  return commands.commands[id];
}

export function getTemplateFlagDefs(entry: TemplateRegistryEntry): FlagDef[] {
  const brandFlags: FlagDef[] = [];
  for (const key of entry.brandFields) {
    const field = initFields.fields[key];
    if (!field) continue;
    brandFlags.push({
      flag: field.flag,
      description: field.description,
      example: field.example,
    });
  }

  const sharedGroups = entry.flagGroups.flatMap((g) => {
    if (g === "brand") return [];
    return commands.flagGroups[g] ?? [];
  });

  return [...sharedGroups, ...brandFlags];
}

/**
 * Resolve command builder config from registry id or template entry.
 */
export function getCommandBuilderConfig(
  builderId: string | undefined,
  templateEntry?: TemplateRegistryEntry
): CommandBuilderConfig | null {
  if (!builderId || builderId === "template") {
    return templateEntry?.commandBuilder ?? null;
  }

  const entry = commandBuildersRegistry.builders[builderId];
  if (entry) {
    return { presets: entry.presets, modes: entry.modes };
  }

  return null;
}

export function getCommandBuilderLabel(
  builderId: string | undefined,
  templateEntry?: TemplateRegistryEntry
): string {
  if (!builderId || builderId === "template") {
    return templateEntry?.label ?? "Template";
  }
  const entry = commandBuildersRegistry.builders[builderId];
  return entry?.label ?? builderId;
}

export function listCommandBuilders() {
  const templateBuilders = templateRegistry.templates.map((t) => ({
    id: `template-${t.id}`,
    label: `${t.label} — generate project`,
    segment: "templates" as const,
    pagePath: `/developers/templates/${t.id}`,
  }));

  const segmentBuilders = Object.values(commandBuildersRegistry.builders).map((b) => ({
    id: b.id,
    label: b.label,
    segment: b.segment,
    pagePath: b.pagePath,
  }));

  return [...templateBuilders, ...segmentBuilders];
}
