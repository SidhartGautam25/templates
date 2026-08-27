"use client";

import { useState } from "react";
import type {
  CommandBuilderFieldsRegistry,
  CommandBuilderOptionsRegistry,
  TemplateCommandBuilderConfig,
} from "@/types/content";
import { PresetList } from "./PresetList";
import { CommandWizard } from "./CommandWizard";

export function CommandBuilder({
  config,
  fieldRegistry,
  optionSets,
  label,
}: {
  config: TemplateCommandBuilderConfig;
  fieldRegistry: CommandBuilderFieldsRegistry;
  optionSets: CommandBuilderOptionsRegistry;
  label: string;
}) {
  const [activeTab, setActiveTab] = useState<"presets" | "builder">("presets");
  const [modeId, setModeId] = useState(config.modes[0]?.id ?? "");

  const activeMode = config.modes.find((m) => m.id === modeId) ?? config.modes[0];

  return (
    <section className="my-8 rounded-xl border border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] shadow-sm overflow-hidden">
      <div className="border-b border-[var(--color-doc-border)] px-5 py-4 bg-[var(--color-doc-surface-elevated)]">
        <h3 className="text-lg font-semibold text-[var(--color-doc-text)]">
          Command generator — {label}
        </h3>
        <p className="mt-2 text-sm text-[var(--color-doc-muted)] leading-relaxed">
          Pick a ready-made command or build a custom one step by step. Every field is optional unless
          you turn on a toggle — empty fields are omitted from the final command.
        </p>
      </div>

      <div className="flex border-b border-[var(--color-doc-border)]">
        <button
          type="button"
          onClick={() => setActiveTab("presets")}
          className={`px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === "presets"
              ? "text-[var(--color-doc-accent)] border-b-2 border-[var(--color-doc-accent)]"
              : "text-[var(--color-doc-muted)] hover:text-[var(--color-doc-text)]"
          }`}
        >
          Quick commands
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("builder")}
          className={`px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === "builder"
              ? "text-[var(--color-doc-accent)] border-b-2 border-[var(--color-doc-accent)]"
              : "text-[var(--color-doc-muted)] hover:text-[var(--color-doc-text)]"
          }`}
        >
          Build custom command
        </button>
      </div>

      <div className="px-5 py-5">
        {activeTab === "presets" && <PresetList presets={config.presets} />}

        {activeTab === "builder" && activeMode && (
          <div className="space-y-5">
            <div>
              <label
                htmlFor="command-mode"
                className="block text-sm font-medium text-[var(--color-doc-text)] mb-2"
              >
                What are you trying to do?
              </label>
              <select
                id="command-mode"
                value={modeId}
                onChange={(e) => setModeId(e.target.value)}
                className="w-full rounded-md border border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] px-3 py-2 text-sm"
              >
                {config.modes.map((mode) => (
                  <option key={mode.id} value={mode.id}>{mode.label}</option>
                ))}
              </select>
              {activeMode.description && (
                <p className="text-sm text-[var(--color-doc-muted)] mt-2">{activeMode.description}</p>
              )}
            </div>

            <CommandWizard
              key={modeId}
              mode={activeMode}
              fields={fieldRegistry.fields}
              optionSets={optionSets}
            />
          </div>
        )}
      </div>
    </section>
  );
}
