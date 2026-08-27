import Link from "next/link";
import { SITE } from "@/constants";

interface LegalSection {
  heading?: string;
  paragraphs: readonly string[];
}

interface LegalDocumentPageProps {
  title: string;
  lastUpdated?: string;
  sections: readonly LegalSection[];
  backLabel?: string;
}

export default function LegalDocumentPage({
  title,
  lastUpdated,
  sections,
  backLabel,
}: LegalDocumentPageProps) {
  return (
    <div className="min-h-screen bg-bg-main">
      <header className="border-b border-primary/10 bg-white/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-semibold text-primary hover:text-primary-hover">
            {backLabel ?? SITE.navigation.backToHome}
          </Link>
          <h1 className="text-lg font-bold font-serif text-primary text-right">{title}</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {lastUpdated && (
          <p className="text-xs text-text-muted mb-8 uppercase tracking-wider">
            Last updated: {lastUpdated}
          </p>
        )}

        <article className="prose prose-slate max-w-none space-y-8">
          {sections.map((section, idx) => (
            <section key={idx}>
              {section.heading && (
                <h2 className="text-xl font-bold text-primary font-serif mb-3">{section.heading}</h2>
              )}
              {section.paragraphs.map((paragraph, pIdx) => (
                <p key={pIdx} className="text-sm text-text-main/90 leading-relaxed mb-3">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>

        <p className="mt-12 text-xs text-text-muted border-t border-primary/10 pt-6">
          Questions? Contact us at {SITE.contact.email} or {SITE.contact.phoneDisplay}.
        </p>
      </main>
    </div>
  );
}
