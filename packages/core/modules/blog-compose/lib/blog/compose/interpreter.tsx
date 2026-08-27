import type { ComposeBlock, ComposeDocument } from "./types";
import { ComposeHeading, ComposeExplain, ComposeParagraph, ComposeList, ComposeQuote } from "./blocks/text-blocks";
import {
  ComposeCode,
  ComposeCommand,
  ComposeCallout,
  ComposeDivider,
  ComposeImage,
} from "./blocks/media-blocks";

export function ComposeBlockView({ block }: { block: ComposeBlock }) {
  switch (block.type) {
    case "heading":
      return <ComposeHeading block={block} />;
    case "explain":
      return <ComposeExplain block={block} />;
    case "paragraph":
      return <ComposeParagraph block={block} />;
    case "code":
      return <ComposeCode block={block} />;
    case "command":
      return <ComposeCommand block={block} />;
    case "callout":
      return <ComposeCallout block={block} />;
    case "divider":
      return <ComposeDivider />;
    case "list":
      return <ComposeList block={block} />;
    case "quote":
      return <ComposeQuote block={block} />;
    case "image":
      return <ComposeImage block={block} />;
    default:
      return null;
  }
}

/**
 * Interpreter: renders a Compose document as React components.
 */
export function ComposeBlogRenderer({
  document,
  className,
}: {
  document: ComposeDocument;
  className?: string;
}) {
  return (
    <article className={className ?? "compose-blog max-w-3xl"}>
      {document.blocks.map((block, index) => (
        <ComposeBlockView key={index} block={block} />
      ))}
    </article>
  );
}
