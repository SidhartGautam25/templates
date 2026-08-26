import site from "@content/site.json";
import navigation from "@content/navigation.json";
import commandsRegistry from "@content/shared/commands.json";

import devIntro from "@content/developers/intro.json";
import devCommands from "@content/developers/commands.json";
import devTemplates from "@content/developers/templates.json";
import devCustomization from "@content/developers/customization.json";
import devUpdates from "@content/developers/updates.json";
import devDocker from "@content/developers/docker.json";

import maintIntro from "@content/maintainers/intro.json";
import maintArchitecture from "@content/maintainers/architecture.json";
import maintWorkflow from "@content/maintainers/workflow.json";
import maintNewTemplate from "@content/maintainers/new-template.json";
import maintVersioning from "@content/maintainers/versioning.json";
import maintCommands from "@content/maintainers/commands.json";

import type { CommandsRegistry, Navigation, PageContent, SiteMeta } from "@/types/content";

export const siteMeta = site as SiteMeta;
export const nav = navigation as Navigation;
export const commands = commandsRegistry as CommandsRegistry;

export const developerPages: Record<string, PageContent> = {
  intro: devIntro as PageContent,
  commands: devCommands as PageContent,
  templates: devTemplates as PageContent,
  customization: devCustomization as PageContent,
  updates: devUpdates as PageContent,
  docker: devDocker as PageContent,
};

export const maintainerPages: Record<string, PageContent> = {
  intro: maintIntro as PageContent,
  architecture: maintArchitecture as PageContent,
  workflow: maintWorkflow as PageContent,
  "new-template": maintNewTemplate as PageContent,
  versioning: maintVersioning as PageContent,
  commands: maintCommands as PageContent,
};

export function getCommand(id: string) {
  return commands.commands[id];
}
