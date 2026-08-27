import type { Metadata } from "next";
import { SITE } from "@/constants";
import type { PageMetadataInput } from "./types";
import { absoluteUrl } from "./urls";

/**
 * Build Next.js Metadata for a public page with canonical URL, Open Graph, and Twitter cards.
 */
export function buildPageMetadata(input: PageMetadataInput = {}): Metadata {
  const title = input.title ?? SITE.seo.defaultTitle;
  const description = input.description ?? SITE.seo.defaultDescription;
  const path = input.path ?? "";
  const canonical = absoluteUrl(path);
  const image =
    input.image ?? SITE.seo.openGraph?.image ?? SITE.assets.logoOfficial ?? SITE.assets.logo;
  const imageUrl = absoluteUrl(image);

  const fullTitle =
    title === SITE.seo.defaultTitle ? title : `${title} | ${SITE.brand.shortName}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(absoluteUrl()),
    alternates: {
      canonical,
    },
    openGraph: {
      type: SITE.seo.openGraph?.type ?? "website",
      locale: SITE.seo.locale?.replace("_", "-") ?? "en_IN",
      url: canonical,
      siteName: SITE.brand.name,
      title: fullTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: SITE.brand.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    keywords: SITE.seo.keywords,
  };
}
