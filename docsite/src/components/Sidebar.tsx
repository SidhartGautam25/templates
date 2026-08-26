"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types/content";

function NavLink({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname();
  const isActive = pathname === item.path;
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = hasChildren && item.children?.some((c) => pathname === c.path);
  const padding = depth === 0 ? "px-3" : "pl-6 pr-3";

  return (
    <li>
      <Link
        href={item.path}
        className={`block rounded-md ${padding} py-2 text-sm transition-colors ${
          isActive
            ? "bg-[var(--color-doc-nav-active-bg)] text-[var(--color-doc-nav-active-text)] font-medium"
            : isChildActive
              ? "text-[var(--color-doc-text)] font-medium"
              : "text-[var(--color-doc-muted)] hover:bg-[var(--color-doc-surface-elevated)] hover:text-[var(--color-doc-text)]"
        }`}
      >
        {item.label}
      </Link>
      {hasChildren && (
        <ul className="mt-1 space-y-0.5">
          {item.children!.map((child) => (
            <NavLink key={child.path} item={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function Sidebar({
  title,
  items,
}: {
  title: string;
  items: NavItem[];
}) {
  return (
    <nav className="w-56 shrink-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-doc-muted)] mb-3">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <NavLink key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  );
}
