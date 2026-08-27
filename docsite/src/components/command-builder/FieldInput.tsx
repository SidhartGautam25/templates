"use client";

import type {
  CommandBuilderFieldDef,
  CommandBuilderOption,
} from "@/types/content";

export function FieldInput({
  fieldKey,
  field,
  value,
  options,
  onChange,
}: {
  fieldKey: string;
  field: CommandBuilderFieldDef;
  value: string;
  options?: CommandBuilderOption[];
  onChange: (key: string, value: string) => void;
}) {
  if (field.type === "toggle") {
    const checked = value === "true";
    return (
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(fieldKey, e.target.checked ? "true" : "false")}
          className="mt-1 h-4 w-4 rounded border-[var(--color-doc-border)] accent-[var(--color-doc-accent)]"
        />
        <span>
          <span className="font-medium text-[var(--color-doc-text)]">{field.label}</span>
          <span className="block text-sm text-[var(--color-doc-muted)] mt-0.5">{field.description}</span>
          <code className="text-xs text-[var(--color-doc-accent)] mt-1">{field.flag}</code>
        </span>
      </label>
    );
  }

  if (field.type === "select" || (field.type === "arg" && options?.length)) {
    return (
      <div>
        <label className="block text-sm font-medium text-[var(--color-doc-text)]" htmlFor={fieldKey}>
          {field.label}
        </label>
        <p className="text-sm text-[var(--color-doc-muted)] mt-0.5 mb-2">{field.description}</p>
        <select
          id={fieldKey}
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className="w-full rounded-md border border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] px-3 py-2 text-sm text-[var(--color-doc-text)]"
        >
          <option value="">{field.placeholder ?? "Skip — leave empty"}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {field.type === "arg" ? (
          <span className="text-xs text-[var(--color-doc-muted)] mt-1 block">Positional argument</span>
        ) : (
          <code className="text-xs text-[var(--color-doc-accent)] mt-1 block">{field.flag}</code>
        )}
      </div>
    );
  }

  if (field.type === "arg") {
    return (
      <div>
        <label className="block text-sm font-medium text-[var(--color-doc-text)]" htmlFor={fieldKey}>
          {field.label}
          <span className="text-[var(--color-doc-muted)] font-normal"> (optional)</span>
        </label>
        <p className="text-sm text-[var(--color-doc-muted)] mt-0.5 mb-2">{field.description}</p>
        <input
          id={fieldKey}
          type="text"
          value={value}
          placeholder={field.placeholder ?? "Leave empty to skip"}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className="w-full rounded-md border border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] px-3 py-2 text-sm text-[var(--color-doc-text)] placeholder:text-[var(--color-doc-muted)]"
        />
        <span className="text-xs text-[var(--color-doc-muted)] mt-1 block">Positional argument</span>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-doc-text)]" htmlFor={fieldKey}>
        {field.label}
        <span className="text-[var(--color-doc-muted)] font-normal"> (optional)</span>
      </label>
      <p className="text-sm text-[var(--color-doc-muted)] mt-0.5 mb-2">{field.description}</p>
      <input
        id={fieldKey}
        type="text"
        value={value}
        placeholder={field.placeholder ?? "Leave empty to skip"}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        className="w-full rounded-md border border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] px-3 py-2 text-sm text-[var(--color-doc-text)] placeholder:text-[var(--color-doc-muted)]"
      />
      <code className="text-xs text-[var(--color-doc-accent)] mt-1 block">{field.flag}</code>
    </div>
  );
}
