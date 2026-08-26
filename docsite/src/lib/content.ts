import site from "@content/site.json";
import navigation from "@content/navigation.json";
import commandsRegistry from "@content/shared/commands.json";
import initFieldsRegistry from "@content/shared/init-fields.json";
import commandBuilderFields from "@content/shared/command-builder-fields.json";
import commandBuilderOptions from "@content/shared/command-builder-options.json";
import templatesRegistry from "@content/templates-registry.json";

import devIntro from "@content/developers/intro.json";
import devCommands from "@content/developers/commands.json";
import devCustomization from "@content/developers/customization.json";
import devUpdates from "@content/developers/updates.json";
import devDocker from "@content/developers/docker.json";
import templatesOverview from "@content/developers/templates/overview.json";

import hotelTemplate from "@content/developers/templates/hotel.json";
import realEstateTemplate from "@content/developers/templates/real-estate.json";

import maintIntro from "@content/maintainers/intro.json";
import maintArchitecture from "@content/maintainers/architecture.json";
import maintWorkflow from "@content/maintainers/workflow.json";
import maintNewTemplate from "@content/maintainers/new-template.json";
import maintVersioning from "@content/maintainers/versioning.json";
import maintCommands from "@content/maintainers/commands.json";

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
  TemplateRegistry,
  TemplateRegistryEntry,
} from "@/types/content";

export const siteMeta = site as SiteMeta;
export const nav = navigation as Navigation;
export const commands = commandsRegistry as CommandsRegistry;
export const initFields = initFieldsRegistry as InitFieldsRegistry;
export const commandBuilderFieldDefs = commandBuilderFields as CommandBuilderFieldsRegistry;
export const commandBuilderOptionSets = commandBuilderOptions as CommandBuilderOptionsRegistry;
export const templateRegistry = templatesRegistry as TemplateRegistry;

export const developerPages: Record<string, PageContent> = {
  intro: devIntro as PageContent,
  commands: devCommands as PageContent,
  customization: devCustomization as PageContent,
  updates: devUpdates as PageContent,
  docker: devDocker as PageContent,
};

export const templatesOverviewPage = templatesOverview as PageContent;

export const templatePages: Record<string, PageContent> = {
  hotel: hotelTemplate as PageContent,
  "real-estate": realEstateTemplate as PageContent,
};

export const maintainerPages: Record<string, PageContent> = {
  intro: maintIntro as PageContent,
  architecture: maintArchitecture as PageContent,
  workflow: maintWorkflow as PageContent,
  "new-template": maintNewTemplate as PageContent,
  versioning: maintVersioning as PageContent,
  commands: maintCommands as PageContent,
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
