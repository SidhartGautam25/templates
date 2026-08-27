"use client";

import { useState, type ReactNode } from "react";
import type {
  ComposeBlock,
  ComposeCalloutBlock,
  ComposeCodeBlock,
  ComposeCommandBlock,
  ComposeDocument,
  ComposeExplainBlock,
  ComposeHeadingBlock,
  ComposeImageBlock,
  ComposeListBlock,
  ComposeQuoteBlock,
} from "@/lib/blog-compose/types";
import { slugify } from "@/lib/slugify";

function DocAnnotatedText({
  text,
  highlight,
  underline,
}: {
  text: string;
  highlight?: string[];
  underline?: string[];
}) {
  if (!highlight?.length && !underline?.length) {
    return <>{text}</>;
  }

  const phrases: { phrase: string; highlight?: boolean; underline?: boolean }[] = [];
  for (const p of highlight ?? []) {
    if (p.trim()) phrases.push({ phrase: p, highlight: true });
  }
  for (const p of underline ?? []) {
    if (p.trim()) phrases.push({ phrase: p, underline: true });
  }
  phrases.sort((a, b) => b.phrase.length - a.phrase.length);

  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let earliest = -1;
    let matchPhrase: typeof phrases[number] | null = null;

    for (const phrase of phrases) {
      const idx = remaining.indexOf(phrase.phrase);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        matchPhrase = phrase;
      }
    }

    if (earliest === -1 || !matchPhrase) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    if (earliest > 0) {
      parts.push(<span key={key++}>{remaining.slice(0, earliest)}</span>);
    }

    const seg = matchPhrase.phrase;
    parts.push(
      <span
        key={key++}
        className={[
          matchPhrase.highlight
            ? "bg-[var(--color-doc-accent-soft)] text-[var(--color-doc-text)] px-0.5 rounded"
            : "",
          matchPhrase.underline
            ? "underline decoration-[var(--color-doc-accent)] decoration-2 underline-offset-2"
            : "",
        ].join(" ")}
      >
        {seg}
      </span>
    );
    remaining = remaining.slice(earliest + seg.length);
  }

  return <>{parts}</>;
}

function DocHeading({ block }: { block: ComposeHeadingBlock }) {
  if (block.level === "title") {
    return (
      <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-doc-text)] mt-2 mb-6">
        {block.text}
      </h1>
    );
  }
  if (block.level === "h3") {
    return (
      <h3 className="text-lg font-semibold text-[var(--color-doc-text)] mt-8 mb-3">
        {block.text}
      </h3>
    );
  }
  return (
    <h2
      id={slugify(block.text)}
      className={[
        "text-2xl font-semibold text-[var(--color-doc-text)] mt-10 mb-4",
        block.variant === "underline-bar"
          ? "border-b border-[var(--color-doc-border)] pb-2"
          : "",
      ].join(" ")}
    >
      {block.text}
    </h2>
  );
}

function DocExplain({ block }: { block: ComposeExplainBlock }) {
  const cls =
    block.variant === "lead"
      ? "text-lg leading-relaxed"
      : block.variant === "muted"
        ? "text-sm"
        : "text-base leading-relaxed";

  return (
    <p className={`my-4 text-[var(--color-doc-muted)] ${cls}`}>
      <DocAnnotatedText text={block.text} highlight={block.highlight} underline={block.underline} />
    </p>
  );
}

function DocCode({ block }: { block: ComposeCodeBlock }) {
  return (
    <pre className="my-4 rounded-lg bg-[var(--color-doc-code-bg)] text-[var(--color-doc-code-text)] px-4 py-3 text-sm overflow-x-auto leading-relaxed">
      <code>{block.code}</code>
    </pre>
  );
}

function DocCommand({ block }: { block: ComposeCommandBlock }) {
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
    <div className="my-6 rounded-lg border border-[var(--color-doc-border)] overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-[var(--color-doc-border)] px-4 py-2 bg-[var(--color-doc-surface-elevated)]">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-doc-muted)]">
          {block.title || "Command"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="rounded-md px-3 py-1 text-xs font-medium bg-[var(--color-doc-accent)] text-white cursor-pointer"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {block.description && (
        <p className="px-4 py-2 text-sm text-[var(--color-doc-muted)] border-b border-[var(--color-doc-border)]">
          {block.description}
        </p>
      )}
      <pre className="px-4 py-3 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
        <code>{block.command}</code>
      </pre>
    </div>
  );
}

function DocCallout({ block }: { block: ComposeCalloutBlock }) {
  const styles = {
    info: "border-[var(--color-doc-border)] bg-[var(--color-doc-surface-elevated)]",
    tip: "border-[var(--color-doc-accent)] bg-[var(--color-doc-accent-soft)]",
    warning: "border-amber-300 bg-amber-50 text-amber-950",
  }[block.variant];

  return (
    <div className={`my-6 rounded-lg border p-4 text-sm leading-relaxed ${styles}`}>
      {block.title && <p className="font-semibold mb-1">{block.title}</p>}
      <p>{block.text}</p>
    </div>
  );
}

function DocList({ block }: { block: ComposeListBlock }) {
  const Tag = block.style === "number" ? "ol" : "ul";
  const listClass =
    block.style === "number"
      ? "my-4 list-decimal pl-6 space-y-2 text-[var(--color-doc-muted)]"
      : "my-4 list-disc pl-6 space-y-2 text-[var(--color-doc-muted)]";

  return (
    <Tag className={listClass}>
      {block.items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Tag>
  );
}

function DocQuote({ block }: { block: ComposeQuoteBlock }) {
  return (
    <blockquote className="my-6 border-l-4 border-[var(--color-doc-accent)] pl-4">
      <p className="text-lg italic text-[var(--color-doc-text)] leading-relaxed">{block.text}</p>
      {block.attribution && (
        <footer className="mt-2 text-sm text-[var(--color-doc-muted)] not-italic">
          — {block.attribution}
        </footer>
      )}
    </blockquote>
  );
}

function DocImage({ block }: { block: ComposeImageBlock }) {
  return (
    <figure className="my-8">
      <img
        src={block.src}
        alt={block.alt}
        className="w-full rounded-lg border border-[var(--color-doc-border)]"
      />
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-[var(--color-doc-muted)]">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

function DocBlockView({ block }: { block: ComposeBlock }) {
  switch (block.type) {
    case "heading":
      return <DocHeading block={block} />;
    case "explain":
      return <DocExplain block={block} />;
    case "paragraph":
      return <p className="my-4 text-[var(--color-doc-muted)] leading-relaxed">{block.text}</p>;
    case "code":
      return <DocCode block={block} />;
    case "command":
      return <DocCommand block={block} />;
    case "callout":
      return <DocCallout block={block} />;
    case "divider":
      return <hr className="my-10 border-t border-[var(--color-doc-border)]" />;
    case "list":
      return <DocList block={block} />;
    case "quote":
      return <DocQuote block={block} />;
    case "image":
      return <DocImage block={block} />;
    default:
      return null;
  }
}

/**
 * Docsite-themed Compose Blog Engine renderer — same JSON shape as client templates.
 */
export function DocComposeRenderer({
  document,
  className,
}: {
  document: ComposeDocument;
  className?: string;
}) {
  return (
    <article className={className ?? "compose-blog"}>
      {document.blocks.map((block, index) => (
        <DocBlockView key={index} block={block} />
      ))}
    </article>
  );
}
