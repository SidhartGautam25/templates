import type { Metadata } from "next";
import { SITE } from "@/constants";

export const metadata: Metadata = {
  title: `${SITE.gallery.pageTitle} | ${SITE.brand.shortName}`,
  description: SITE.gallery.pageSubtitle,
  alternates: { canonical: `${SITE.domain.baseUrl.replace(/\/$/, "")}/gallery` },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
