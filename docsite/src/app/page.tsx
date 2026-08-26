import Link from "next/link";
import { siteMeta, nav } from "@/lib/content";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-teal-900">{siteMeta.title} documentation</h1>
        <p className="mt-4 text-lg text-[var(--color-doc-muted)] max-w-2xl mx-auto">
          {siteMeta.description}
        </p>
        <pre className="mt-6 mx-auto max-w-md rounded-lg bg-slate-900 text-teal-300 px-4 py-3 text-sm">
          {siteMeta.installCommand}
        </pre>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12 grid md:grid-cols-2 gap-6">
        {nav.audiences.map((aud) => (
          <Link
            key={aud.id}
            href={aud.home}
            className="rounded-xl border border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] p-6 shadow-sm hover:border-teal-300 hover:shadow-md transition-all"
          >
            <h2 className="text-xl font-semibold text-teal-800">{aud.label}</h2>
            <p className="mt-2 text-[var(--color-doc-muted)]">{aud.description}</p>
            <span className="mt-4 inline-block text-sm font-medium text-teal-700">
              Open guide →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
