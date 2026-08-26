import Link from "next/link";
import type { TemplateCardData } from "@/types/content";

export function TemplateCard({ template }: { template: TemplateCardData }) {
  return (
    <Link
      href={`/developers/templates/${template.id}`}
      className="block rounded-xl border border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] p-5 shadow-sm hover:border-[var(--color-doc-accent)] transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-lg">{template.name}</h3>
        <span className="text-xs font-mono bg-[var(--color-doc-badge-bg)] text-[var(--color-doc-badge-text)] px-2 py-0.5 rounded">
          v{template.version}
        </span>
      </div>
      <p className="mt-1 text-sm font-mono text-[var(--color-doc-muted)]">tempjs {template.id}</p>
      <p className="mt-3 text-sm text-[var(--color-doc-muted)] leading-relaxed">{template.description}</p>
      {template.tags && (
        <div className="mt-3 flex flex-wrap gap-1">
          {template.tags.map((t) => (
            <span
              key={t}
              className="text-xs bg-[var(--color-doc-tag-bg)] text-[var(--color-doc-tag-text)] px-2 py-0.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      {template.features && (
        <ul className="mt-4 space-y-1 text-sm text-[var(--color-doc-muted)]">
          {template.features.map((f) => (
            <li key={f}>• {f}</li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-sm font-medium text-[var(--color-doc-accent)]">View template guide →</p>
    </Link>
  );
}

export function TemplateCardGrid({ templates }: { templates: TemplateCardData[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 my-6">
      {templates.map((t) => <TemplateCard key={t.id} template={t} />)}
    </div>
  );
}
