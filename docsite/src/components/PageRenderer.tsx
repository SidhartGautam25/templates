import type { ContentBlock, PageContent, TemplateRegistryEntry } from "@/types/content";
import { Callout } from "./Callout";
import { CommandBlock } from "./CommandBlock";
import { TemplateCardGrid } from "./TemplateCard";
import { TemplateCommandBlock } from "./TemplateCommandBlock";
import { CommandBuilder } from "./command-builder/CommandBuilder";
import {
  commandBuilderFieldDefs,
  commandBuilderOptionSets,
  getCommandBuilderConfig,
  getCommandBuilderLabel,
} from "@/lib/content";
import { slugify } from "@/lib/slugify";

function Block({
  block,
  templateEntry,
}: {
  block: ContentBlock;
  templateEntry?: TemplateRegistryEntry;
}) {
  switch (block.type) {
    case "paragraph":
      return <p className="my-4 text-[var(--color-doc-muted)] leading-relaxed">{block.text}</p>;
    case "heading":
      const Tag = block.level === 2 ? "h2" : "h3";
      const id = block.level === 2 ? slugify(block.text) : undefined;
      const cls =
        block.level === 2
          ? "mt-10 mb-4 text-2xl font-semibold text-[var(--color-doc-text)]"
          : "mt-8 mb-3 text-lg font-semibold text-[var(--color-doc-text)]";
      return <Tag id={id} className={cls}>{block.text}</Tag>;
    case "list":
      return (
        <ul className="my-4 space-y-2 text-[var(--color-doc-muted)] list-disc pl-6">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre className="my-4 rounded-lg bg-[var(--color-doc-code-bg)] text-[var(--color-doc-code-text)] px-4 py-3 text-sm overflow-x-auto leading-relaxed">
          <code>{block.code}</code>
        </pre>
      );
    case "callout":
      return (
        <Callout variant={block.variant} title={block.title}>
          {block.text}
        </Callout>
      );
    case "table":
      return (
        <div className="my-4 overflow-x-auto rounded-lg border border-[var(--color-doc-border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-doc-surface-elevated)]">
              <tr>
                {block.headers.map((h) => (
                  <th key={h} className="px-4 py-2 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t border-[var(--color-doc-border)]">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2 text-[var(--color-doc-muted)]">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "command-ref":
      return <CommandBlock id={block.id} />;
    case "template-command":
      return templateEntry ? <TemplateCommandBlock entry={templateEntry} /> : null;
    case "command-builder": {
      const builderId = block.builderId;
      const config = getCommandBuilderConfig(
        builderId ?? (templateEntry ? "template" : undefined),
        templateEntry
      );
      const label = getCommandBuilderLabel(
        builderId ?? (templateEntry ? "template" : undefined),
        templateEntry
      );
      return config ? (
        <CommandBuilder
          config={config}
          fieldRegistry={commandBuilderFieldDefs}
          optionSets={commandBuilderOptionSets}
          label={label}
        />
      ) : null;
    }
    case "template-cards":
      return null;
    default:
      return null;
  }
}

export function PageRenderer({
  page,
  templateEntry,
}: {
  page: PageContent;
  templateEntry?: TemplateRegistryEntry;
}) {
  return (
    <article>
      <header className="mb-8 border-b border-[var(--color-doc-border)] pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{page.title}</h1>
        {page.description && (
          <p className="mt-3 text-lg text-[var(--color-doc-muted)]">{page.description}</p>
        )}
      </header>

      {page.blocks?.map((block, i) => {
        if (block.type === "template-cards" && page.templates) {
          return <TemplateCardGrid key={i} templates={page.templates} />;
        }
        return <Block key={i} block={block} templateEntry={templateEntry} />;
      })}

      {page.commandIds?.map((id) => <CommandBlock key={id} id={id} />)}
    </article>
  );
}
