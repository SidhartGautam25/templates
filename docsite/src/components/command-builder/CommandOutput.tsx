"use client";

import { useState } from "react";

export function CommandOutput({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="rounded-lg border border-[var(--color-doc-border)] bg-[var(--color-doc-code-bg)]">
      <div className="flex items-center justify-between gap-2 border-b border-[var(--color-doc-border)] px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-doc-muted)]">
          Generated command
        </span>
        <button
          type="button"
          onClick={copy}
          className="rounded-md px-3 py-1 text-xs font-medium bg-[var(--color-doc-accent)] text-white hover:opacity-90 transition-opacity"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="px-4 py-3 text-sm text-[var(--color-doc-code-text)] overflow-x-auto leading-relaxed whitespace-pre-wrap">
        <code>{command}</code>
      </pre>
    </div>
  );
}
