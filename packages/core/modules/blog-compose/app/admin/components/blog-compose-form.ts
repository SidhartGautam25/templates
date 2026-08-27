import type { ComposeBlock } from "@/lib/blog/compose";
import { getComposeBlockDefinition } from "@/lib/blog/compose";

export function blockToFormValues(block: ComposeBlock): Record<string, string> {
  const def = getComposeBlockDefinition(block.type);
  const values: Record<string, string> = {};
  const raw = block as Record<string, unknown>;

  for (const field of def.fields) {
    const v = raw[field.key];
    if (field.input === "tags") {
      values[field.key] = Array.isArray(v) ? (v as string[]).join(", ") : "";
    } else if (field.input === "toggle") {
      values[field.key] = v === true ? "true" : "false";
    } else {
      values[field.key] = typeof v === "string" ? v : String(v ?? "");
    }
  }
  return values;
}

export function formValuesToBlock(
  type: ComposeBlock["type"],
  values: Record<string, string>
): ComposeBlock {
  const def = getComposeBlockDefinition(type);
  const block = def.createDefault() as Record<string, unknown>;

  for (const field of def.fields) {
    const raw = values[field.key] ?? "";
    if (field.input === "tags") {
      block[field.key] = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (field.input === "toggle") {
      block[field.key] = raw === "true";
    } else {
      block[field.key] = raw;
    }
  }

  return block as ComposeBlock;
}
