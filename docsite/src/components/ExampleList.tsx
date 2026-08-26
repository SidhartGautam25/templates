import type { CommandExample } from "@/types/content";

export function ExampleList({ examples }: { examples: CommandExample[] }) {
  return (
    <div className="space-y-3 my-4">
      {examples.map((ex) => (
        <div key={ex.label}>
          <p className="text-sm font-medium text-[var(--color-doc-muted)] mb-1">{ex.label}</p>
          <pre className="rounded-lg bg-[var(--color-doc-code-bg)] text-[var(--color-doc-code-text)] px-4 py-3 text-sm overflow-x-auto">
            <code>{ex.command}</code>
          </pre>
        </div>
      ))}
    </div>
  );
}
