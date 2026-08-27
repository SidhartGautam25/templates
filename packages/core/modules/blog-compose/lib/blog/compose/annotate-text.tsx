import React from "react";

export interface TextAnnotation {
  highlight?: string[];
  underline?: string[];
}

interface Segment {
  text: string;
  highlight?: boolean;
  underline?: boolean;
}

/**
 * Split plain text into segments with highlight/underline flags.
 * Matches are case-sensitive; longer phrases are preferred first to reduce overlap issues.
 */
function buildSegments(text: string, annotations: TextAnnotation): Segment[] {
  const phrases: { phrase: string; highlight?: boolean; underline?: boolean }[] = [];
  for (const p of annotations.highlight ?? []) {
    if (p.trim()) phrases.push({ phrase: p, highlight: true });
  }
  for (const p of annotations.underline ?? []) {
    if (p.trim()) phrases.push({ phrase: p, underline: true });
  }
  if (phrases.length === 0) return [{ text }];

  phrases.sort((a, b) => b.phrase.length - a.phrase.length);

  type Match = { start: number; end: number; highlight?: boolean; underline?: boolean };
  const matches: Match[] = [];

  for (const { phrase, highlight, underline } of phrases) {
    let from = 0;
    while (from < text.length) {
      const idx = text.indexOf(phrase, from);
      if (idx === -1) break;
      matches.push({ start: idx, end: idx + phrase.length, highlight, underline });
      from = idx + phrase.length;
    }
  }

  if (matches.length === 0) return [{ text }];

  matches.sort((a, b) => a.start - b.start);

  const segments: Segment[] = [];
  let cursor = 0;

  for (const m of matches) {
    if (m.start < cursor) continue;
    if (m.start > cursor) {
      segments.push({ text: text.slice(cursor, m.start) });
    }
    segments.push({
      text: text.slice(m.start, m.end),
      highlight: m.highlight,
      underline: m.underline,
    });
    cursor = m.end;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor) });
  }

  return segments.length > 0 ? segments : [{ text }];
}

export function AnnotatedText({
  text,
  highlight,
  underline,
  className,
}: {
  text: string;
  highlight?: string[];
  underline?: string[];
  className?: string;
}) {
  const segments = buildSegments(text, { highlight, underline });

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (!seg.highlight && !seg.underline) {
          return <span key={i}>{seg.text}</span>;
        }
        return (
          <span
            key={i}
            className={[
              seg.highlight ? "bg-accent-gold-light/80 text-text-main px-0.5 rounded" : "",
              seg.underline ? "underline decoration-accent-gold decoration-2 underline-offset-2" : "",
            ].join(" ")}
          >
            {seg.text}
          </span>
        );
      })}
    </span>
  );
}
