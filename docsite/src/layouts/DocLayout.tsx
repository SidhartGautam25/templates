import Link from "next/link";
import { siteMeta, nav } from "@/lib/content";
import { Sidebar } from "@/components/Sidebar";

export function DocLayout({
  activeAudience,
  children,
}: {
  activeAudience: "developers" | "maintainers";
  children: React.ReactNode;
}) {
  const sidebarItems = activeAudience === "maintainers" ? nav.maintainers : nav.developers;
  const sidebarTitle = activeAudience === "maintainers" ? "Maintainers" : "Developers";

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-doc-border)] bg-[var(--color-doc-surface)]">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-xl font-bold text-teal-800 hover:text-teal-900">
              {siteMeta.title}
            </Link>
            <p className="text-sm text-[var(--color-doc-muted)]">{siteMeta.tagline}</p>
          </div>
          <div className="flex gap-2">
            {nav.audiences.map((aud) => (
              <Link
                key={aud.id}
                href={aud.home}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeAudience === aud.id
                    ? "bg-teal-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {aud.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 flex gap-10">
        <Sidebar title={sidebarTitle} items={sidebarItems} />
        <main className="flex-1 min-w-0 max-w-3xl">
          {children}
        </main>
      </div>

      <footer className="border-t border-[var(--color-doc-border)] py-6 text-center text-sm text-[var(--color-doc-muted)]">
        <code className="text-xs bg-slate-100 px-2 py-1 rounded">{siteMeta.installCommand}</code>
      </footer>
    </div>
  );
}
