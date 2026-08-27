import type {
  ComposeBlock,
  ComposeBlockType,
  ComposeCalloutBlock,
  ComposeCodeBlock,
  ComposeCommandBlock,
  ComposeDividerBlock,
  ComposeExplainBlock,
  ComposeHeadingBlock,
  ComposeImageBlock,
  ComposeListBlock,
  ComposeParagraphBlock,
  ComposeQuoteBlock,
} from "./types";

export type ComposeFieldInput = "text" | "textarea" | "select" | "toggle" | "tags";

export interface ComposeFieldDef {
  key: string;
  label: string;
  description?: string;
  input: ComposeFieldInput;
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}

export interface ComposeBlockDefinition {
  type: ComposeBlockType;
  label: string;
  description: string;
  icon: string;
  createDefault: () => ComposeBlock;
  fields: ComposeFieldDef[];
}

export const COMPOSE_BLOCK_REGISTRY: Record<ComposeBlockType, ComposeBlockDefinition> = {
  heading: {
    type: "heading",
    label: "Heading",
    description: "Title, section header, or subheader with style variants.",
    icon: "H",
    createDefault: (): ComposeHeadingBlock => ({
      type: "heading",
      level: "h2",
      variant: "default",
      text: "",
    }),
    fields: [
      { key: "text", label: "Text", input: "text", required: true, placeholder: "Section heading" },
      {
        key: "level",
        label: "Level",
        input: "select",
        options: [
          { value: "title", label: "Page title" },
          { value: "h2", label: "Section (H2)" },
          { value: "h3", label: "Subsection (H3)" },
        ],
      },
      {
        key: "variant",
        label: "Design",
        input: "select",
        options: [
          { value: "default", label: "Default" },
          { value: "accent", label: "Accent color" },
          { value: "serif", label: "Serif display" },
          { value: "underline-bar", label: "Underline bar" },
        ],
      },
    ],
  },
  explain: {
    type: "explain",
    label: "Explanation",
    description: "Rich text with optional highlight and underline phrases.",
    icon: "¶",
    createDefault: (): ComposeExplainBlock => ({
      type: "explain",
      text: "",
      variant: "default",
      highlight: [],
      underline: [],
    }),
    fields: [
      {
        key: "text",
        label: "Body text",
        input: "textarea",
        required: true,
        placeholder: "Write your explanation…",
      },
      {
        key: "variant",
        label: "Style",
        input: "select",
        options: [
          { value: "default", label: "Default" },
          { value: "lead", label: "Lead paragraph" },
          { value: "muted", label: "Muted" },
        ],
      },
      {
        key: "highlight",
        label: "Highlight phrases",
        input: "tags",
        description: "Exact substrings in the text to highlight (comma-separated).",
        placeholder: "important term, keyword",
      },
      {
        key: "underline",
        label: "Underline phrases",
        input: "tags",
        description: "Exact substrings to underline.",
        placeholder: "term to underline",
      },
    ],
  },
  paragraph: {
    type: "paragraph",
    label: "Paragraph",
    description: "Simple body paragraph.",
    icon: "P",
    createDefault: (): ComposeParagraphBlock => ({ type: "paragraph", text: "" }),
    fields: [
      { key: "text", label: "Text", input: "textarea", required: true },
    ],
  },
  code: {
    type: "code",
    label: "Code block",
    description: "Syntax-friendly code snippet.",
    icon: "</>",
    createDefault: (): ComposeCodeBlock => ({
      type: "code",
      code: "",
      language: "typescript",
      showLineNumbers: false,
    }),
    fields: [
      { key: "code", label: "Code", input: "textarea", required: true },
      {
        key: "language",
        label: "Language",
        input: "select",
        options: [
          { value: "typescript", label: "TypeScript" },
          { value: "javascript", label: "JavaScript" },
          { value: "bash", label: "Bash" },
          { value: "json", label: "JSON" },
          { value: "text", label: "Plain text" },
        ],
      },
      { key: "showLineNumbers", label: "Show line numbers", input: "toggle" },
    ],
  },
  command: {
    type: "command",
    label: "Command",
    description: "Terminal command with copy-friendly styling (like docsite).",
    icon: "$",
    createDefault: (): ComposeCommandBlock => ({
      type: "command",
      command: "",
      title: "",
      description: "",
    }),
    fields: [
      { key: "command", label: "Command", input: "textarea", required: true, placeholder: "pnpm dev" },
      { key: "title", label: "Title (optional)", input: "text" },
      { key: "description", label: "Description (optional)", input: "textarea" },
    ],
  },
  callout: {
    type: "callout",
    label: "Callout",
    description: "Info, tip, or warning box.",
    icon: "!",
    createDefault: (): ComposeCalloutBlock => ({
      type: "callout",
      variant: "info",
      title: "",
      text: "",
    }),
    fields: [
      {
        key: "variant",
        label: "Variant",
        input: "select",
        options: [
          { value: "info", label: "Info" },
          { value: "tip", label: "Tip" },
          { value: "warning", label: "Warning" },
        ],
      },
      { key: "title", label: "Title", input: "text" },
      { key: "text", label: "Body", input: "textarea", required: true },
    ],
  },
  divider: {
    type: "divider",
    label: "Divider",
    description: "Visual separator between sections.",
    icon: "—",
    createDefault: (): ComposeDividerBlock => ({ type: "divider" }),
    fields: [],
  },
  list: {
    type: "list",
    label: "List",
    description: "Bulleted or numbered list of items.",
    icon: "•",
    createDefault: (): ComposeListBlock => ({
      type: "list",
      style: "bullet",
      items: [],
    }),
    fields: [
      {
        key: "style",
        label: "Style",
        input: "select",
        options: [
          { value: "bullet", label: "Bulleted" },
          { value: "number", label: "Numbered" },
        ],
      },
      {
        key: "items",
        label: "Items",
        input: "tags",
        description: "One item per comma-separated entry.",
        placeholder: "First point, Second point",
      },
    ],
  },
  quote: {
    type: "quote",
    label: "Quote",
    description: "Blockquote with optional attribution.",
    icon: "❝",
    createDefault: (): ComposeQuoteBlock => ({
      type: "quote",
      text: "",
      attribution: "",
    }),
    fields: [
      { key: "text", label: "Quote text", input: "textarea", required: true },
      { key: "attribution", label: "Attribution (optional)", input: "text", placeholder: "Author name" },
    ],
  },
  image: {
    type: "image",
    label: "Image",
    description: "Image with alt text and optional caption.",
    icon: "🖼",
    createDefault: (): ComposeImageBlock => ({
      type: "image",
      src: "",
      alt: "",
      caption: "",
    }),
    fields: [
      { key: "src", label: "Image URL or path", input: "text", required: true, placeholder: "/assets/photo.jpg" },
      { key: "alt", label: "Alt text", input: "text", required: true },
      { key: "caption", label: "Caption (optional)", input: "text" },
    ],
  },
};

export const COMPOSE_BLOCK_TYPES = Object.keys(COMPOSE_BLOCK_REGISTRY) as ComposeBlockType[];

export function getComposeBlockDefinition(type: ComposeBlockType): ComposeBlockDefinition {
  return COMPOSE_BLOCK_REGISTRY[type];
}
