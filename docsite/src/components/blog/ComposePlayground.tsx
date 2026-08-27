"use client";

import { useState, useMemo } from "react";
import { DocComposeRenderer } from "@/components/blog-compose/DocComposeRenderer";
import { isComposeDocument, type ComposeDocument } from "@/lib/blog-compose/types";

const DEFAULT_JSON = `{
  "engine": "compose",
  "version": 1,
  "blocks": [
    {
      "type": "heading",
      "level": "h2",
      "variant": "underline-bar",
      "text": "Edit me"
    },
    {
      "type": "explain",
      "text": "Change the JSON on the left to see live output here.",
      "highlight": ["JSON"],
      "underline": ["live output"]
    },
    {
      "type": "command",
      "title": "Install with sidebar",
      "command": "tempjs add-module blog-compose+sidebar"
    }
  ]
}`;

function parseComposeJson(raw: string): { document: ComposeDocument | null; error: string | null } {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isComposeDocument(parsed)) {
      return {
        document: null,
        error: "JSON must be a Compose document (engine: compose, version: 1, blocks array).",
      };
    }
    return { document: parsed, error: null };
  } catch (err) {
    return { document: null, error: err instanceof Error ? err.message : "Invalid JSON" };
  }
}

export function ComposePlayground() {
  const [raw, setRaw] = useState(DEFAULT_JSON);
  const { document, error } = useMemo(() => parseComposeJson(raw), [raw]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--color-doc-text)]">Compose playground</h1>
      <p className="mt-3 text-[var(--color-doc-muted)] leading-relaxed">
        Edit the Compose document JSON and preview blocks instantly. Same shape as{" "}
        <code className="text-xs bg-[var(--color-doc-surface-elevated)] px-1 rounded">
          BlogPost.contentJson
        </code>{" "}
        on client sites.
      </p>

      <div className="mt-8 grid lg:grid-cols-2 gap-6 items-start">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-doc-muted)]">
            JSON document
          </label>
          <textarea
            className="mt-2 w-full min-h-[420px] rounded-lg border border-[var(--color-doc-border)] bg-[var(--color-doc-code-bg)] text-[var(--color-doc-code-text)] px-4 py-3 text-sm font-mono leading-relaxed"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            spellCheck={false}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] p-6 min-h-[420px]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-doc-muted)] mb-4">
            Live preview
          </p>
          {document ? (
            <DocComposeRenderer document={document} />
          ) : (
            <p className="text-sm text-[var(--color-doc-muted)]">Fix JSON to see preview.</p>
          )}
        </div>
      </div>
    </div>
  );
}
