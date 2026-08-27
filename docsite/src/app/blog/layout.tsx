import Link from "next/link";
import postsRegistry from "@content/blog/posts.json";
import { getAllBlogPosts, type BlogPostsRegistry } from "@/lib/blog-posts";
import { BlogDocSidebar } from "@/components/blog/BlogDocSidebar";
import { siteMeta } from "@/lib/content";
import { ThemeToggle } from "@/components/ThemeToggle";

const registry = postsRegistry as BlogPostsRegistry;

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const posts = getAllBlogPosts(registry);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--color-doc-border)] bg-[var(--color-doc-surface)]">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="text-xl font-bold text-[var(--color-doc-accent)] hover:opacity-90"
            >
              {siteMeta.title}
            </Link>
            <p className="text-sm text-[var(--color-doc-muted)]">Compose blog demo</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/developers"
              className="text-sm font-medium text-[var(--color-doc-muted)] hover:text-[var(--color-doc-accent)]"
            >
              Docs
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 flex gap-10 flex-1 w-full">
        <BlogDocSidebar posts={posts} />
        <main className="flex-1 min-w-0 max-w-3xl">{children}</main>
      </div>

      <footer className="border-t border-[var(--color-doc-border)] py-6 text-center text-sm text-[var(--color-doc-muted)]">
        Static JSON posts — same Compose engine as client templates
      </footer>
    </div>
  );
}
