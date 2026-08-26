import type { TemplateCardData } from "@/types/content";

export function TemplateCard({ template }: { template: TemplateCardData }) {
  return (
    <div className="rounded-xl border border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-lg">{template.name}</h3>
        <span className="text-xs font-mono bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
          v{template.version}
        </span>
      </div>
      <p className="mt-1 text-sm font-mono text-[var(--color-doc-muted)]">tempjs {template.id}</p>
      <p className="mt-3 text-sm text-[var(--color-doc-muted)] leading-relaxed">{template.description}</p>
      {template.tags && (
        <div className="mt-3 flex flex-wrap gap-1">
          {template.tags.map((t) => (
            <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
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
    </div>
  );
}

export function TemplateCardGrid({ templates }: { templates: TemplateCardData[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 my-6">
      {templates.map((t) => <TemplateCard key={t.id} template={t} />)}
    </div>
  );
}
