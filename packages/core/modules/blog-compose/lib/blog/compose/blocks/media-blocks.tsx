"use client";

import { useState } from "react";
import type { ComposeCodeBlock, ComposeCommandBlock, ComposeCalloutBlock, ComposeImageBlock } from "../types";

export function ComposeCode({ block }: { block: ComposeCodeBlock }) {
  return (
    <div className="my-6 rounded-xl border border-primary/10 bg-bg-light overflow-hidden">
      {block.language && block.language !== "text" && (
        <div className="px-4 py-2 border-b border-primary/10 text-[10px] font-bold uppercase tracking-widest text-text-muted">
          {block.language}
        </div>
      )}
      <pre
        className={[
          "px-4 py-3 text-sm overflow-x-auto font-mono text-text-main leading-relaxed",
          block.showLineNumbers ? "pl-8" : "",
        ].join(" ")}
      >
        <code>{block.code}</code>
      </pre>
    </div>
  );
}

export function ComposeCommand({ block }: { block: ComposeCommandBlock }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(block.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="my-6 rounded-xl border border-primary/10 bg-bg-card shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-primary/10 px-4 py-2 bg-bg-light">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          {block.title || "Command"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="rounded-md px-3 py-1 text-xs font-bold bg-primary text-white hover:opacity-90 cursor-pointer"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {block.description && (
        <p className="px-4 py-2 text-sm text-text-muted border-b border-primary/5">
          {block.description}
        </p>
      )}
      <pre className="px-4 py-3 text-sm font-mono text-text-main overflow-x-auto whitespace-pre-wrap">
        <code>{block.command}</code>
      </pre>
    </div>
  );
}

export function ComposeCallout({ block }: { block: ComposeCalloutBlock }) {
  const styles = {
    info: "bg-primary/5 border-primary/20 text-text-main",
    tip: "bg-emerald-50 border-emerald-200 text-emerald-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
  }[block.variant];

  return (
    <div className={`my-6 rounded-xl border p-4 ${styles}`}>
      {block.title && <p className="font-bold text-sm mb-1">{block.title}</p>}
      <p className="text-sm leading-relaxed">{block.text}</p>
    </div>
  );
}

export function ComposeDivider() {
  return <hr className="my-10 border-t border-primary/10" />;
}

export function ComposeImage({ block }: { block: ComposeImageBlock }) {
  return (
    <figure className="my-8">
      <img
        src={block.src}
        alt={block.alt}
        className="w-full rounded-xl border border-primary/10 shadow-sm"
      />
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-text-muted">{block.caption}</figcaption>
      )}
    </figure>
  );
}
