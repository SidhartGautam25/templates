import Link from "next/link";
import { siteMeta } from "@/lib/content";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--color-doc-border)] bg-[var(--color-doc-surface)]">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="text-lg font-bold text-[var(--color-doc-accent)] hover:opacity-90"
            >
              {siteMeta.title}
            </Link>
            <p className="text-xs text-[var(--color-doc-muted)]">Compose blog demo</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/developers/blog-compose"
              className="text-sm font-medium text-[var(--color-doc-muted)] hover:text-[var(--color-doc-accent)]"
            >
              Module docs
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10 flex-1 w-full">{children}</main>
      <footer className="border-t border-[var(--color-doc-border)] py-6 text-center text-sm text-[var(--color-doc-muted)]">
        Static JSON posts — same Compose engine as client templates
      </footer>
    </div>
  );
}
