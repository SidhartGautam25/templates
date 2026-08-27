export type CalloutVariant = "info" | "warning" | "tip";

export interface ContentBlockBase {
  type: string;
}

export interface ParagraphBlock extends ContentBlockBase {
  type: "paragraph";
  text: string;
}

export interface HeadingBlock extends ContentBlockBase {
  type: "heading";
  level: 2 | 3;
  text: string;
}

export interface ListBlock extends ContentBlockBase {
  type: "list";
  items: string[];
}

export interface CodeBlock extends ContentBlockBase {
  type: "code";
  code: string;
  language?: string;
}

export interface CalloutBlock extends ContentBlockBase {
  type: "callout";
  variant: CalloutVariant;
  title?: string;
  text: string;
}

export interface TableBlock extends ContentBlockBase {
  type: "table";
  headers: string[];
  rows: string[][];
}

export interface CommandRefBlock extends ContentBlockBase {
  type: "command-ref";
  id: string;
}

export interface TemplateCommandBlock extends ContentBlockBase {
  type: "template-command";
}

export interface CommandBuilderBlock extends ContentBlockBase {
  type: "command-builder";
  /** Registry id from command-builders-registry.json, or omit on template pages to use templates-registry commandBuilder */
  builderId?: string;
}

export interface TemplateCardsBlock extends ContentBlockBase {
  type: "template-cards";
}

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | CodeBlock
  | CalloutBlock
  | TableBlock
  | CommandRefBlock
  | TemplateCommandBlock
  | CommandBuilderBlock
  | TemplateCardsBlock;

export interface PageContent {
  title: string;
  description?: string;
  templateId?: string;
  blocks?: ContentBlock[];
  commandIds?: string[];
  templates?: TemplateCardData[];
}

export interface TemplateCardData {
  id: string;
  name: string;
  version: string;
  description: string;
  tags?: string[];
  features?: string[];
}

export interface FlagDef {
  flag: string;
  description: string;
  example?: string;
}

export interface CommandExample {
  label: string;
  command: string;
}

export interface CommandDef {
  syntax: string;
  title: string;
  description: string;
  audience?: string[];
  arguments?: { name: string; required: boolean; description: string }[];
  flagGroups?: string[];
  examples?: CommandExample[];
}

export interface CommandsRegistry {
  commands: Record<string, CommandDef>;
  flagGroups: Record<string, FlagDef[]>;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  children?: NavItem[];
}

export interface TemplateRegistryEntry {
  id: string;
  label: string;
  version: string;
  cliId: string;
  flagGroups: string[];
  brandFields: string[];
  commandBuilder?: TemplateCommandBuilderConfig;
}

export interface CommandBuilderPreset {
  id: string;
  label: string;
  description?: string;
  command: string;
}

export interface CommandBuilderWizardStep {
  id: string;
  title: string;
  description?: string;
  fieldKeys: string[];
}

export interface CommandBuilderMode {
  id: string;
  label: string;
  description?: string;
  baseCommand: string;
  wizardSteps: CommandBuilderWizardStep[];
}

export interface TemplateCommandBuilderConfig {
  presets: CommandBuilderPreset[];
  modes: CommandBuilderMode[];
}

/** Alias — same shape for template and segment command builders */
export type CommandBuilderConfig = TemplateCommandBuilderConfig;

export interface CommandBuilderRegistryEntry extends CommandBuilderConfig {
  id: string;
  label: string;
  segment: "developers" | "maintainers" | "templates" | string;
  description?: string;
  pagePath?: string;
}

export interface CommandBuildersRegistry {
  builders: Record<string, CommandBuilderRegistryEntry>;
}

export interface CommandBuilderFieldDef {
  flag: string;
  label: string;
  description: string;
  type: "text" | "select" | "toggle" | "arg";
  optionSet?: string;
  placeholder?: string;
  quote?: boolean;
  default?: boolean;
  /** For type arg — order after baseCommand (0 = first positional arg) */
  argOrder?: number;
}

export interface CommandBuilderFieldsRegistry {
  fields: Record<string, CommandBuilderFieldDef>;
  databaseFieldKeys: string[];
  generateToggleKeys: string[];
}

export interface CommandBuilderOption {
  value: string;
  label: string;
}

export interface CommandBuilderOptionsRegistry {
  themes: CommandBuilderOption[];
  fonts: CommandBuilderOption[];
  coreModules: CommandBuilderOption[];
  templates: CommandBuilderOption[];
}

export interface TemplateRegistry {
  templates: TemplateRegistryEntry[];
}

export interface InitFieldDef {
  flag: string;
  description: string;
  example?: string;
}

export interface InitFieldsRegistry {
  fields: Record<string, InitFieldDef>;
}

export interface AudienceNav {
  id: string;
  label: string;
  description: string;
  home: string;
}

export interface Navigation {
  audiences: AudienceNav[];
  developers: NavItem[];
  maintainers: NavItem[];
}

export interface SiteMeta {
  title: string;
  tagline: string;
  description: string;
  npmPackage: string;
  repository: string;
  installCommand: string;
}
