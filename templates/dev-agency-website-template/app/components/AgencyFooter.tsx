import Link from "next/link";
import { SITE, getTelLink } from "@/constants";

export default function AgencyFooter() {
  const footer = SITE.agency.footer;
  const contactLinks = [
    { label: SITE.contact.email, href: `mailto:${SITE.contact.email}` },
    { label: SITE.contact.phoneDisplay, href: getTelLink() },
  ];

  return (
    <footer className="border-t border-primary/10 bg-footer-bg py-16 px-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <p className="text-lg font-bold text-text-main">{SITE.brand.name}</p>
          <p className="mt-2 text-sm text-text-muted max-w-md">{SITE.brand.tagline}</p>
        </div>
        {footer.columns.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">
              {col.title}
            </p>
            <ul className="space-y-2 text-sm text-text-muted">
              {(col.title === "Contact" ? contactLinks : col.links).map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("#") ? (
                    <a href={link.href} className="hover:text-text-main transition-colors">
                      {link.label}
                    </a>
                  ) : link.href.startsWith("tel:") || link.href.startsWith("mailto:") ? (
                    <a href={link.href} className="hover:text-text-main transition-colors">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="hover:text-text-main transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-primary/10 flex flex-wrap gap-4 justify-between text-xs text-text-muted">
        <span>© {new Date().getFullYear()} {SITE.brand.copyright}</span>
        <a href={getTelLink()} className="hover:text-text-main transition-colors">
          {SITE.contact.phoneDisplay}
        </a>
      </div>
    </footer>
  );
}
