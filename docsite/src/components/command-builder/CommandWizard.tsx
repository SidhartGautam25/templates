"use client";

import { useMemo, useState } from "react";
import type {
  CommandBuilderFieldDef,
  CommandBuilderMode,
  CommandBuilderOptionsRegistry,
} from "@/types/content";
import { buildCommandFromFields } from "@/lib/build-command";
import { FieldInput } from "./FieldInput";
import { CommandOutput } from "./CommandOutput";

function defaultValuesForKeys(
  keys: string[],
  fields: Record<string, CommandBuilderFieldDef>
): Record<string, string> {
  const values: Record<string, string> = {};
  for (const key of keys) {
    const field = fields[key];
    if (!field) continue;
    if (field.type === "toggle") {
      values[key] = field.default ? "true" : "false";
    } else {
      values[key] = "";
    }
  }
  return values;
}

function allFieldKeys(mode: CommandBuilderMode): string[] {
  const keys = new Set<string>();
  for (const step of mode.wizardSteps) {
    for (const key of step.fieldKeys) keys.add(key);
  }
  return [...keys];
}

export function CommandWizard({
  mode,
  fields,
  optionSets,
}: {
  mode: CommandBuilderMode;
  fields: Record<string, CommandBuilderFieldDef>;
  optionSets: CommandBuilderOptionsRegistry;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>(() =>
    defaultValuesForKeys(allFieldKeys(mode), fields)
  );

  const step = mode.wizardSteps[stepIndex];
  const isLast = stepIndex === mode.wizardSteps.length - 1;

  const command = useMemo(() => {
    const allKeys = allFieldKeys(mode);
    return buildCommandFromFields(mode.baseCommand, allKeys, fields, values);
  }, [mode, fields, values]);

  function resolveOptions(field: CommandBuilderFieldDef) {
    if (!field.optionSet) return undefined;
    if (field.optionSet === "themes") return optionSets.themes;
    if (field.optionSet === "fonts") return optionSets.fonts;
    return undefined;
  }

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function resetMode() {
    setStepIndex(0);
    setValues(defaultValuesForKeys(allFieldKeys(mode), fields));
  }

  if (!step) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {mode.wizardSteps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStepIndex(i)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              i === stepIndex
                ? "bg-[var(--color-doc-nav-active-bg)] text-[var(--color-doc-nav-active-text)]"
                : "bg-[var(--color-doc-surface-elevated)] text-[var(--color-doc-muted)] hover:text-[var(--color-doc-text)]"
            }`}
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] p-5">
        <h4 className="text-lg font-semibold text-[var(--color-doc-text)]">{step.title}</h4>
        {step.description && (
          <p className="text-sm text-[var(--color-doc-muted)] mt-2 leading-relaxed">{step.description}</p>
        )}

        <div className="mt-5 space-y-5">
          {step.fieldKeys.map((key) => {
            const field = fields[key];
            if (!field) return null;
            return (
              <FieldInput
                key={key}
                fieldKey={key}
                field={field}
                value={values[key] ?? ""}
                options={resolveOptions(field)}
                onChange={handleChange}
              />
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={() => setStepIndex((i) => i - 1)}
              className="rounded-md px-4 py-2 text-sm font-medium border border-[var(--color-doc-border)] text-[var(--color-doc-text)] hover:bg-[var(--color-doc-surface-elevated)]"
            >
              Back
            </button>
          )}
          {!isLast && (
            <button
              type="button"
              onClick={() => setStepIndex((i) => i + 1)}
              className="rounded-md px-4 py-2 text-sm font-medium bg-[var(--color-doc-accent)] text-white hover:opacity-90"
            >
              Next step
            </button>
          )}
          {isLast && (
            <button
              type="button"
              onClick={resetMode}
              className="rounded-md px-4 py-2 text-sm font-medium border border-[var(--color-doc-border)] text-[var(--color-doc-muted)] hover:bg-[var(--color-doc-surface-elevated)]"
            >
              Reset wizard
            </button>
          )}
        </div>
      </div>

      <CommandOutput command={command} />
    </div>
  );
}
