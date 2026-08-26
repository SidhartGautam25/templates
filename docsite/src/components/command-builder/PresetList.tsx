"use client";

import type { CommandBuilderPreset } from "@/types/content";
import { CommandOutput } from "./CommandOutput";

export function PresetList({ presets }: { presets: CommandBuilderPreset[] }) {
  return (
    <div className="space-y-3">
      {presets.map((preset) => (
        <div
          key={preset.id}
          className="rounded-lg border border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] p-4"
        >
          <h4 className="font-semibold text-[var(--color-doc-text)]">{preset.label}</h4>
          <p className="text-sm text-[var(--color-doc-muted)] mt-1">{preset.description}</p>
          <div className="mt-3">
            <CommandOutput command={preset.command} />
          </div>
        </div>
      ))}
    </div>
  );
}
