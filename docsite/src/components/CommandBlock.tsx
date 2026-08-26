import type { CommandDef } from "@/types/content";
import { commands } from "@/lib/content";
import { FlagTable } from "./FlagTable";
import { ExampleList } from "./ExampleList";

export function CommandBlock({ command, id }: { command?: CommandDef; id?: string }) {
  const cmd = command ?? (id ? commands.commands[id] : undefined);
  if (!cmd) return null;

  const flagGroups = cmd.flagGroups?.flatMap((g) => commands.flagGroups[g] ?? []) ?? [];

  return (
    <section className="my-8 rounded-xl border border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] shadow-sm">
      <div className="border-b border-[var(--color-doc-border)] px-5 py-4">
        <h3 className="text-lg font-semibold text-[var(--color-doc-text)]">{cmd.title}</h3>
        <pre className="mt-2 rounded-md bg-slate-900 text-teal-300 px-3 py-2 text-sm overflow-x-auto">
          <code>{cmd.syntax}</code>
        </pre>
        <p className="mt-3 text-sm text-[var(--color-doc-muted)] leading-relaxed">{cmd.description}</p>
      </div>

      {cmd.arguments && cmd.arguments.length > 0 && (
        <div className="px-5 py-4 border-b border-[var(--color-doc-border)]">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-doc-muted)] mb-2">
            Arguments
          </h4>
          <ul className="space-y-2 text-sm">
            {cmd.arguments.map((arg) => (
              <li key={arg.name}>
                <code className="text-teal-800">{arg.name}</code>
                {arg.required && <span className="text-red-600 text-xs ml-1">required</span>}
                <span className="text-[var(--color-doc-muted)]"> — {arg.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {flagGroups.length > 0 && (
        <div className="px-5 py-4 border-b border-[var(--color-doc-border)]">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-doc-muted)] mb-2">
            Options
          </h4>
          <FlagTable flags={flagGroups} />
        </div>
      )}

      {cmd.examples && cmd.examples.length > 0 && (
        <div className="px-5 py-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-doc-muted)] mb-2">
            Examples
          </h4>
          <ExampleList examples={cmd.examples} />
        </div>
      )}
    </section>
  );
}
