import type { Metadata } from "next";
import LegalDocumentPage from "@/app/components/LegalDocumentPage";
import { SITE } from "@/constants";

export const metadata: Metadata = {
  title: `${SITE.termsPage.title} | ${SITE.brand.shortName}`,
  description: `Terms and conditions for ${SITE.brand.name}.`,
  alternates: { canonical: `${SITE.domain.baseUrl.replace(/\/$/, "")}${SITE.legal.termsPath}` },
};

export default function TermsPage() {
  return (
    <LegalDocumentPage
      title={SITE.termsPage.title}
      lastUpdated={SITE.termsPage.lastUpdated || undefined}
      sections={SITE.termsPage.sections}
    />
  );
}
