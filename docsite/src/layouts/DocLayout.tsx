import Link from "next/link";
import { siteMeta, nav, buildDeveloperSidebar, buildMaintainerSidebar } from "@/lib/content";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DocLayout({
  activeAudience,
  children,
}: {
  activeAudience: "developers" | "maintainers";
  children: React.ReactNode;
}) {
  const sidebarItems =
    activeAudience === "maintainers" ? buildMaintainerSidebar() : buildDeveloperSidebar();
  const sidebarTitle = activeAudience === "maintainers" ? "Maintainers" : "Developers";

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-doc-border)] bg-[var(--color-doc-surface)]">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="text-xl font-bold text-[var(--color-doc-accent)] hover:opacity-90"
            >
              {siteMeta.title}
            </Link>
            <p className="text-sm text-[var(--color-doc-muted)]">{siteMeta.tagline}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {nav.audiences.map((aud) => (
              <Link
                key={aud.id}
                href={aud.home}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeAudience === aud.id
                    ? "bg-[var(--color-doc-audience-active-bg)] text-[var(--color-doc-audience-active-text)]"
                    : "bg-[var(--color-doc-audience-idle-bg)] text-[var(--color-doc-audience-idle-text)] hover:opacity-90"
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
        <code className="text-xs bg-[var(--color-doc-surface-elevated)] px-2 py-1 rounded">
          {siteMeta.installCommand}
        </code>
      </footer>
    </div>
  );
}
