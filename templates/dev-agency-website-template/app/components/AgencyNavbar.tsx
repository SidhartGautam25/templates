"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SITE } from "@/constants";

export default function AgencyNavbar({
  onOpenEnquiry,
}: {
  onOpenEnquiry: (label?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const scrollTo = (sectionId: string) => {
    setOpen(false);
    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-primary/10 bg-bg-tan/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => scrollTo("top")}
          className="text-lg font-bold text-text-main tracking-tight cursor-pointer"
        >
          {SITE.brand.name}
        </button>

        <nav className="hidden md:flex items-center gap-6">
          {SITE.agency.nav.map((item) => (
            <button
              key={item.sectionId}
              type="button"
              onClick={() => scrollTo(item.sectionId)}
              className="text-sm text-text-muted hover:text-text-main transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onOpenEnquiry(SITE.agency.cta.buttonLabel)}
            className="text-sm font-semibold text-text-main bg-primary/10 hover:bg-primary/15 px-4 py-2 rounded-full cursor-pointer transition-colors"
          >
            {SITE.navigation.contact}
          </button>
        </nav>

        <button
          type="button"
          className="md:hidden text-text-main p-2 cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-primary/10 bg-bg-tan px-6 py-4 space-y-3">
          {SITE.agency.nav.map((item) => (
            <button
              key={item.sectionId}
              type="button"
              onClick={() => scrollTo(item.sectionId)}
              className="block w-full text-left text-sm text-text-muted py-2 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onOpenEnquiry(SITE.agency.cta.buttonLabel);
            }}
            className="w-full text-sm font-semibold text-text-main bg-primary/10 py-2 rounded-lg cursor-pointer"
          >
            {SITE.navigation.contact}
          </button>
        </div>
      )}
    </header>
  );
}
