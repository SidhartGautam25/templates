/**
 * Compose Blog Engine — declarative JSON document types.
 * First engine variant: block-based composition (not WYSIWYG).
 */

export const COMPOSE_ENGINE_ID = "compose" as const;

export type ComposeHeadingLevel = "title" | "h2" | "h3";
export type ComposeHeadingVariant = "default" | "accent" | "serif" | "underline-bar";

export type ComposeExplainVariant = "default" | "lead" | "muted";

export type ComposeCalloutVariant = "info" | "tip" | "warning";

export type ComposeListStyle = "bullet" | "number";

export interface ComposeHeadingBlock {
  type: "heading";
  level: ComposeHeadingLevel;
  variant: ComposeHeadingVariant;
  text: string;
}

export interface ComposeExplainBlock {
  type: "explain";
  text: string;
  variant?: ComposeExplainVariant;
  /** Substrings in `text` rendered with highlight styling */
  highlight?: string[];
  /** Substrings in `text` rendered with underline styling */
  underline?: string[];
}

export interface ComposeParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface ComposeCodeBlock {
  type: "code";
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export interface ComposeCommandBlock {
  type: "command";
  command: string;
  title?: string;
  description?: string;
}

export interface ComposeCalloutBlock {
  type: "callout";
  variant: ComposeCalloutVariant;
  title?: string;
  text: string;
}

export interface ComposeDividerBlock {
  type: "divider";
}

export interface ComposeListBlock {
  type: "list";
  style: ComposeListStyle;
  items: string[];
}

export interface ComposeQuoteBlock {
  type: "quote";
  text: string;
  attribution?: string;
}

export interface ComposeImageBlock {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
}

export type ComposeBlock =
  | ComposeHeadingBlock
  | ComposeExplainBlock
  | ComposeParagraphBlock
  | ComposeCodeBlock
  | ComposeCommandBlock
  | ComposeCalloutBlock
  | ComposeDividerBlock
  | ComposeListBlock
  | ComposeQuoteBlock
  | ComposeImageBlock;

export type ComposeBlockType = ComposeBlock["type"];

export interface ComposeDocument {
  engine: typeof COMPOSE_ENGINE_ID;
  version: 1;
  blocks: ComposeBlock[];
}

export interface BlogPostMeta {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImage?: string | null;
  engine: string;
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostWithContent extends BlogPostMeta {
  content: ComposeDocument;
}

export function createEmptyComposeDocument(): ComposeDocument {
  return { engine: COMPOSE_ENGINE_ID, version: 1, blocks: [] };
}

export function isComposeDocument(value: unknown): value is ComposeDocument {
  if (!value || typeof value !== "object") return false;
  const doc = value as ComposeDocument;
  return doc.engine === COMPOSE_ENGINE_ID && doc.version === 1 && Array.isArray(doc.blocks);
}
