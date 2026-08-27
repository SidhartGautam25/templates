import type { CommandBuilderFieldDef } from "@/types/content";

export function escapeShellValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function quoteArg(value: string, quote?: boolean): string {
  const trimmed = value.trim();
  const needsQuote = quote || /[\s"'$`!]/.test(trimmed);
  if (needsQuote) {
    return `"${escapeShellValue(trimmed)}"`;
  }
  return trimmed;
}

export function formatFieldArg(field: CommandBuilderFieldDef, value: string): string {
  if (field.type === "toggle") {
    return value === "true" ? field.flag : "";
  }

  if (field.type === "arg") {
    const trimmed = value.trim();
    if (!trimmed) return "";
    return quoteArg(trimmed, field.quote);
  }

  const trimmed = value.trim();
  if (!trimmed) return "";

  const needsQuote = field.quote || /[\s"'$`!]/.test(trimmed);
  if (needsQuote) {
    return `${field.flag} "${escapeShellValue(trimmed)}"`;
  }
  return `${field.flag} ${trimmed}`;
}

/**
 * Build a shell command from base + field values.
 * Positional args (type arg) are inserted after baseCommand in argOrder.
 * toggles: only included when value is "true"
 * text/select: only included when non-empty
 */
export function buildCommandFromFields(
  baseCommand: string,
  fieldKeys: string[],
  fields: Record<string, CommandBuilderFieldDef>,
  values: Record<string, string>,
  multiline = true
): string {
  const argKeys = fieldKeys
    .filter((key) => fields[key]?.type === "arg")
    .sort((a, b) => (fields[a]?.argOrder ?? 0) - (fields[b]?.argOrder ?? 0));

  const flagKeys = fieldKeys.filter((key) => fields[key]?.type !== "arg");

  const positional: string[] = [];
  for (const key of argKeys) {
    const field = fields[key];
    if (!field) continue;
    const raw = values[key];
    if (!raw?.trim()) continue;
    const arg = formatFieldArg(field, raw);
    if (arg) positional.push(arg);
  }

  const args: string[] = [];
  for (const key of flagKeys) {
    const field = fields[key];
    if (!field) continue;
    const raw = values[key];
    if (raw === undefined || raw === "") continue;

    if (field.type === "toggle" && raw !== "true") continue;

    const arg = formatFieldArg(field, raw);
    if (arg) args.push(arg);
  }

  const head = [baseCommand, ...positional].join(" ");

  if (args.length === 0) return head;

  if (multiline && args.length > 1) {
    return `${head} \\\n  ${args.join(" \\\n  ")}`;
  }

  return `${head} ${args.join(" ")}`;
}
