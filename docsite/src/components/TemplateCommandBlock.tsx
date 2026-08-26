import type { TemplateRegistryEntry } from "@/types/content";
import { getTemplateFlagDefs } from "@/lib/content";
import { FlagTable } from "./FlagTable";
import { ExampleList } from "./ExampleList";

export function TemplateCommandBlock({ entry }: { entry: TemplateRegistryEntry }) {
  const flags = getTemplateFlagDefs(entry);
  const syntax = `tempjs ${entry.cliId} [options]`;
  const configSyntax = `tempjs ${entry.cliId} config`;

  const examples = [
    {
      label: "Interactive full setup",
      command: configSyntax,
    },
    {
      label: "Quick copy only",
      command: `mkdir client-site && cd client-site && tempjs ${entry.cliId} --yes`,
    },
    {
      label: "Non-interactive with config",
      command: `tempjs ${entry.cliId} --config --yes --name "My Brand" --db-host localhost`,
    },
  ];

  return (
    <section className="my-8 rounded-xl border border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] shadow-sm">
      <div className="border-b border-[var(--color-doc-border)] px-5 py-4">
        <h3 className="text-lg font-semibold text-[var(--color-doc-text)]">Generate this template</h3>
        <pre className="mt-2 rounded-md bg-[var(--color-doc-code-bg)] text-[var(--color-doc-code-text)] px-3 py-2 text-sm overflow-x-auto">
          <code>{syntax}</code>
        </pre>
        <p className="mt-3 text-sm text-[var(--color-doc-muted)] leading-relaxed">
          Copies the <strong>{entry.label}</strong> template into the current directory (flat, no nested folder).
          Creates <code className="text-[var(--color-doc-accent)]">.tempjs.json</code> with version stamp and file hashes.
          Use <code className="text-[var(--color-doc-accent)]">{configSyntax}</code> for interactive theme, brand, and database setup.
        </p>
      </div>

      <div className="px-5 py-4 border-b border-[var(--color-doc-border)]">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-doc-muted)] mb-2">
          Template-specific options
        </h4>
        <p className="text-sm text-[var(--color-doc-muted)] mb-3">
          Only flags listed below apply to <code className="text-[var(--color-doc-accent)]">{entry.cliId}</code>.
          Shared database and generate flags are included when configured in templates-registry.json.
        </p>
        <FlagTable flags={flags} />
      </div>

      <div className="px-5 py-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-doc-muted)] mb-2">
          Examples
        </h4>
        <ExampleList examples={examples} />
      </div>
    </section>
  );
}
