import type { ComposeHeadingBlock } from "../types";
import { AnnotatedText } from "../annotate-text";
import type { ComposeListBlock, ComposeQuoteBlock } from "../types";

export function ComposeHeading({ block }: { block: ComposeHeadingBlock }) {
  const base = "text-text-main tracking-tight";

  if (block.level === "title") {
    return (
      <h1
        className={[
          base,
          "text-3xl md:text-4xl font-bold font-serif mb-6",
          block.variant === "accent" ? "text-primary" : "",
          block.variant === "underline-bar"
            ? "border-b-4 border-accent-gold pb-3"
            : "",
        ].join(" ")}
      >
        {block.text}
      </h1>
    );
  }

  if (block.level === "h3") {
    return (
      <h3
        className={[
          base,
          "text-lg font-semibold mt-8 mb-3",
          block.variant === "serif" ? "font-serif" : "",
          block.variant === "accent" ? "text-primary" : "",
        ].join(" ")}
      >
        {block.text}
      </h3>
    );
  }

  return (
    <h2
      className={[
        base,
        "text-2xl font-bold mt-10 mb-4",
        block.variant === "serif" ? "font-serif" : "",
        block.variant === "accent" ? "text-primary" : "",
        block.variant === "underline-bar"
          ? "border-b border-primary/20 pb-2"
          : "",
      ].join(" ")}
    >
      {block.text}
    </h2>
  );
}

export function ComposeExplain({
  block,
}: {
  block: import("../types").ComposeExplainBlock;
}) {
  const variantClass =
    block.variant === "lead"
      ? "text-lg leading-relaxed text-text-main"
      : block.variant === "muted"
        ? "text-sm text-text-muted"
        : "text-base leading-relaxed text-text-muted";

  return (
    <p className={`my-4 ${variantClass}`}>
      <AnnotatedText
        text={block.text}
        highlight={block.highlight}
        underline={block.underline}
      />
    </p>
  );
}

export function ComposeParagraph({
  block,
}: {
  block: import("../types").ComposeParagraphBlock;
}) {
  return <p className="my-4 text-text-muted leading-relaxed">{block.text}</p>;
}

export function ComposeList({ block }: { block: ComposeListBlock }) {
  const Tag = block.style === "number" ? "ol" : "ul";
  const listClass =
    block.style === "number"
      ? "my-4 list-decimal pl-6 space-y-2 text-text-muted"
      : "my-4 list-disc pl-6 space-y-2 text-text-muted";

  return (
    <Tag className={listClass}>
      {block.items.map((item, i) => (
        <li key={i} className="leading-relaxed">{item}</li>
      ))}
    </Tag>
  );
}

export function ComposeQuote({ block }: { block: ComposeQuoteBlock }) {
  return (
    <blockquote className="my-6 border-l-4 border-accent-gold pl-4 py-1">
      <p className="text-lg font-serif text-text-main leading-relaxed italic">{block.text}</p>
      {block.attribution && (
        <footer className="mt-2 text-sm text-text-muted not-italic">— {block.attribution}</footer>
      )}
    </blockquote>
  );
}
