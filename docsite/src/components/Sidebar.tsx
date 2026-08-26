"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavItem, HeadingBlock } from "@/types/content";
import {
  developerPages,
  maintainerPages,
  templatePages,
  templatesOverviewPage,
} from "@/lib/content";
import { slugify } from "@/lib/slugify";

function getSlugFromPath(path: string) {
  if (path === "/developers" || path === "/maintainers") return "intro";
  return path.split("/").pop() || "intro";
}

export function Sidebar({
  title,
  items,
}: {
  title: string;
  items: NavItem[];
}) {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");

  const isDevelopers = items.length > 0 && items[0].path.startsWith("/developers");

  function getPageContent(slug: string) {
    if (isDevelopers) {
      if (slug === "templates") return templatesOverviewPage;
      if (slug in templatePages) return templatePages[slug];
      return developerPages[slug] || null;
    } else {
      return maintainerPages[slug] || null;
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = Array.from(document.querySelectorAll("h2[id]"));
      if (headingElements.length === 0) return;

      let currentActive = "";
      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();
        // If the heading is above or near the top viewport line
        if (rect.top <= 120) {
          currentActive = `#${el.id}`;
        }
      }
      setActiveHash(currentActive || `#${headingElements[0].id}`);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on load/pathname change
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <nav className="w-56 shrink-0 sticky top-8 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-doc-muted)] mb-3">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item) => {
          const isItemActive = pathname === item.path;
          const isChildActive = item.children?.some((child) => pathname === child.path);
          const isExpanded = isItemActive || isChildActive;

          const slug = getSlugFromPath(item.path);
          const pageContent = getPageContent(slug);
          const headings = pageContent?.blocks
            ?.filter((block): block is HeadingBlock => block.type === "heading" && block.level === 2)
            .map((block) => block.text) || [];

          return (
            <li key={item.path} className="space-y-1">
              <Link
                href={item.path}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  isItemActive
                    ? "bg-teal-100 text-teal-900 font-medium"
                    : "text-[var(--color-doc-muted)] hover:bg-slate-100 hover:text-[var(--color-doc-text)]"
                }`}
              >
                {item.label}
              </Link>

              {/* Layer 3: Headings for active main topic page (only if it has no children) */}
              {isItemActive && !item.children && headings.length > 0 && (
                <ul className="mt-1 ml-4 pl-3 border-l border-slate-200 space-y-1">
                  {headings.map((heading) => {
                    const headingId = slugify(heading);
                    const isSubActive = activeHash === `#${headingId}`;
                    return (
                      <li key={heading}>
                        <a
                          href={`#${headingId}`}
                          className={`block py-1 text-xs transition-colors ${
                            isSubActive
                              ? "text-teal-700 font-semibold"
                              : "text-[var(--color-doc-muted)] hover:text-[var(--color-doc-text)]"
                          }`}
                        >
                          {heading}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Layer 2: Sub-topics (children) if expanded */}
              {item.children && isExpanded && (
                <ul className="mt-1 ml-4 pl-3 border-l border-slate-200 space-y-1">
                  {item.children.map((child) => {
                    const isChildSelfActive = pathname === child.path;
                    const childSlug = getSlugFromPath(child.path);
                    const childContent = getPageContent(childSlug);
                    const childHeadings = childContent?.blocks
                      ?.filter((block): block is HeadingBlock => block.type === "heading" && block.level === 2)
                      .map((block) => block.text) || [];

                    return (
                      <li key={child.path} className="space-y-1">
                        <Link
                          href={child.path}
                          className={`block rounded-md px-2 py-1 text-xs transition-colors ${
                            isChildSelfActive
                              ? "bg-teal-50 text-teal-800 font-semibold"
                              : "text-[var(--color-doc-muted)] hover:bg-slate-50 hover:text-[var(--color-doc-text)]"
                          }`}
                        >
                          {child.label}
                        </Link>

                        {/* Layer 3: Headings for active sub-topic page */}
                        {isChildSelfActive && childHeadings.length > 0 && (
                          <ul className="mt-1 ml-4 pl-2 border-l border-teal-100 space-y-1">
                            {childHeadings.map((heading) => {
                              const headingId = slugify(heading);
                              const isSubActive = activeHash === `#${headingId}`;
                              return (
                                <li key={heading}>
                                  <a
                                    href={`#${headingId}`}
                                    className={`block py-0.5 text-[10px] transition-colors ${
                                      isSubActive
                                        ? "text-teal-700 font-bold"
                                        : "text-[var(--color-doc-muted)] hover:text-[var(--color-doc-text)]"
                                    }`}
                                  >
                                    {heading}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
