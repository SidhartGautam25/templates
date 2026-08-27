import type { Metadata } from "next";
import LegalDocumentPage from "@/app/components/LegalDocumentPage";
import { SITE } from "@/constants";

export const metadata: Metadata = {
  title: `${SITE.privacyPage.title} | ${SITE.brand.shortName}`,
  description: `Privacy policy for ${SITE.brand.name}.`,
  alternates: { canonical: `${SITE.domain.baseUrl.replace(/\/$/, "")}${SITE.legal.privacyPolicyPath}` },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentPage
      title={SITE.privacyPage.title}
      lastUpdated={SITE.privacyPage.lastUpdated || undefined}
      sections={SITE.privacyPage.sections}
    />
  );
}
