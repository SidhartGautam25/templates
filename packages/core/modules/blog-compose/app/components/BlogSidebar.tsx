"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/constants";

export interface BlogSidebarPost {
  slug: string;
  title: string;
}

export default function BlogSidebar({ posts }: { posts: BlogSidebarPost[] }) {
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
      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">
        {SITE.blog.sidebarTitle}
      </p>
      <ul className="space-y-1">
        {posts.map((post) => {
          const href = `/blog/${post.slug}`;
          const isActive = pathname === href;
          return (
            <li key={post.slug}>
              <Link
                href={href}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-text-muted hover:bg-bg-light hover:text-primary"
                }`}
              >
                {post.title}
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            href="/blog"
            className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
              pathname === "/blog"
                ? "bg-primary/10 text-primary font-bold"
                : "text-text-muted hover:bg-bg-light hover:text-primary"
            }`}
          >
            {SITE.blog.viewAllLabel}
          </Link>
        </li>
      </ul>

      {showToc && (
        <div className="mt-6 border-t border-primary/10 pt-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">
            On this page
          </p>
          <ul className="ml-2 pl-3 border-l border-primary/15 space-y-1">
            {tocItems.map((item) => {
              const isSubActive = activeHash === `#${item.id}`;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block py-1 text-xs transition-colors ${
                      isSubActive
                        ? "text-primary font-bold"
                        : "text-text-muted hover:text-primary"
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
