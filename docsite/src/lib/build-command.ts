import type { CommandBuilderFieldDef } from "@/types/content";

export function escapeShellValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function formatFieldArg(field: CommandBuilderFieldDef, value: string): string {
  if (field.type === "toggle") {
    return value === "true" ? field.flag : "";
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
  const args: string[] = [];

  for (const key of fieldKeys) {
    const field = fields[key];
    if (!field) continue;
    const raw = values[key];
    if (raw === undefined || raw === "") continue;

    if (field.type === "toggle" && raw !== "true") continue;

    const arg = formatFieldArg(field, raw);
    if (arg) args.push(arg);
  }

  if (args.length === 0) return baseCommand;

  if (multiline && args.length > 1) {
    return `${baseCommand} \\\n  ${args.join(" \\\n  ")}`;
  }

  return `${baseCommand} ${args.join(" ")}`;
}
