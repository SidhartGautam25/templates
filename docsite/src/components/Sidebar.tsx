"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types/content";

export function Sidebar({
  title,
  items,
}: {
  title: string;
  items: NavItem[];
}) {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-doc-muted)] mb-3">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.path;

          return (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-teal-100 text-teal-900 font-medium"
                    : "text-[var(--color-doc-muted)] hover:bg-slate-100 hover:text-[var(--color-doc-text)]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
