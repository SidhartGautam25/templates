import Link from "next/link";
import { siteMeta, nav } from "@/lib/content";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] px-6 py-4">
        <div className="mx-auto max-w-4xl flex justify-between items-center gap-4">
          <Link
            href="/blog"
            className="text-sm font-medium text-[var(--color-doc-muted)] hover:text-[var(--color-doc-accent)]"
          >
            Blog demo →
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="border-b border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-[var(--color-doc-accent)]">{siteMeta.title} documentation</h1>
        <p className="mt-4 text-lg text-[var(--color-doc-muted)] max-w-2xl mx-auto">
          {siteMeta.description}
        </p>
        <pre className="mt-6 mx-auto max-w-md rounded-lg bg-[var(--color-doc-code-bg)] text-[var(--color-doc-code-text)] px-4 py-3 text-sm">
          {siteMeta.installCommand}
        </pre>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 grid md:grid-cols-3 gap-6">
        {nav.audiences.map((aud) => (
          <Link
            key={aud.id}
            href={aud.home}
            className="rounded-xl border border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] p-6 shadow-sm hover:border-[var(--color-doc-accent)] hover:shadow-md transition-all"
          >
            <h2 className="text-xl font-semibold text-[var(--color-doc-accent)]">{aud.label}</h2>
            <p className="mt-2 text-[var(--color-doc-muted)]">{aud.description}</p>
            <span className="mt-4 inline-block text-sm font-medium text-[var(--color-doc-accent)]">
              Open guide →
            </span>
          </Link>
        ))}
        <Link
          href="/blog"
          className="rounded-xl border border-[var(--color-doc-border)] bg-[var(--color-doc-surface)] p-6 shadow-sm hover:border-[var(--color-doc-accent)] hover:shadow-md transition-all"
        >
          <h2 className="text-xl font-semibold text-[var(--color-doc-accent)]">Blog demo</h2>
          <p className="mt-2 text-[var(--color-doc-muted)]">
            Live Compose Blog Engine — JSON blocks rendered like client templates.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-[var(--color-doc-accent)]">
            Read articles →
          </span>
        </Link>
      </div>
    </div>
  );
}
