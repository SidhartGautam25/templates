import type { FlagDef } from "@/types/content";

export function FlagTable({ flags }: { flags: FlagDef[] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-[var(--color-doc-border)]">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left">
          <tr>
            <th className="px-4 py-2 font-semibold">Flag</th>
            <th className="px-4 py-2 font-semibold">Description</th>
            <th className="px-4 py-2 font-semibold">Example</th>
          </tr>
        </thead>
        <tbody>
          {flags.map((f) => (
            <tr key={f.flag} className="border-t border-[var(--color-doc-border)]">
              <td className="px-4 py-2 font-mono text-teal-800 whitespace-nowrap">{f.flag}</td>
              <td className="px-4 py-2 text-[var(--color-doc-muted)]">{f.description}</td>
              <td className="px-4 py-2 font-mono text-xs text-slate-600">{f.example ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
