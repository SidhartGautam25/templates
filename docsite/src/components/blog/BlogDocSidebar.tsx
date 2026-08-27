"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { BlogPostEntry } from "@/lib/blog-posts";

export function BlogDocSidebar({ posts }: { posts: BlogPostEntry[] }) {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");
  const [tocItems, setTocItems] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll(".compose-blog h2[id]"));
    setTocItems(
      headings.map((el) => ({ id: el.id, text: el.textContent?.trim() || el.id }))
    );

    const handleScroll = () => {
      if (headings.length === 0) return;
      let current = "";
      for (const el of headings) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          current = `#${el.id}`;
        }
      }
      setActiveHash(current || `#${headings[0].id}`);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const showToc =
    pathname.startsWith("/blog/") &&
    pathname !== "/blog/playground" &&
    tocItems.length > 0;

  return (
    <nav className="w-56 shrink-0 sticky top-8 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-doc-muted)] mb-3">
        Blog
      </p>
      <ul className="space-y-1">
        <li>
          <Link
            href="/blog/playground"
            className={`block rounded-md px-3 py-2 text-sm transition-colors ${
              pathname === "/blog/playground"
                ? "bg-[var(--color-doc-nav-active-bg)] text-[var(--color-doc-nav-active-text)] font-medium"
                : "text-[var(--color-doc-muted)] hover:bg-slate-100 hover:text-[var(--color-doc-text)]"
            }`}
          >
            Playground
          </Link>
        </li>
        <li>
          <Link
            href="/blog"
            className={`block rounded-md px-3 py-2 text-sm transition-colors ${
              pathname === "/blog"
                ? "bg-[var(--color-doc-nav-active-bg)] text-[var(--color-doc-nav-active-text)] font-medium"
                : "text-[var(--color-doc-muted)] hover:bg-slate-100 hover:text-[var(--color-doc-text)]"
            }`}
          >
            All articles
          </Link>
        </li>
        {posts.map((post) => {
          const href = `/blog/${post.slug}`;
          const isActive = pathname === href;
          return (
            <li key={post.slug}>
              <Link
                href={href}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-[var(--color-doc-nav-active-bg)] text-[var(--color-doc-nav-active-text)] font-medium"
                    : "text-[var(--color-doc-muted)] hover:bg-slate-100 hover:text-[var(--color-doc-text)]"
                }`}
              >
                {post.title}
              </Link>
            </li>
          );
        })}
      </ul>

      {showToc && (
        <div className="mt-6 border-t border-[var(--color-doc-border)] pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-doc-muted)] mb-2">
            On this page
          </p>
          <ul className="ml-2 pl-3 border-l border-[var(--color-doc-border)] space-y-1">
            {tocItems.map((item) => {
              const isSubActive = activeHash === `#${item.id}`;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block py-0.5 text-xs transition-colors ${
                      isSubActive
                        ? "text-[var(--color-doc-accent)] font-bold"
                        : "text-[var(--color-doc-muted)] hover:text-[var(--color-doc-text)]"
                    }`}
                  >
                    {item.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
