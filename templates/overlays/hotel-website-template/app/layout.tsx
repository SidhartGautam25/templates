import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import type { Viewport } from "next";
import QueryProvider from "@/app/components/QueryProvider";
import { SITE, getSiteUrl } from "@/constants";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain.baseUrl),
  title: SITE.seo.defaultTitle,
  description: SITE.seo.defaultDescription,
  keywords: SITE.seo.keywords,
  authors: [{ name: SITE.brand.developerName }],
  alternates: {
    canonical: SITE.domain.baseUrl,
  },
  icons: {
    icon: [
      { url: SITE.assets.favicon, sizes: "any" },
      { url: SITE.assets.icon192, sizes: "192x192", type: "image/png" },
      { url: SITE.assets.icon512, sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: SITE.assets.appleIcon, sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: SITE.seo.defaultTitle,
    description: SITE.seo.defaultDescription,
    url: SITE.domain.baseUrl,
    siteName: SITE.brand.name,
    images: [
      {
        url: SITE.assets.logoOfficial,
        width: 800,
        height: 600,
        alt: `${SITE.brand.name} Logo`,
      },
    ],
    locale: SITE.seo.locale,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
      style={{
        "--primary": SITE.theme.colors.primary,
        "--primary-hover": SITE.theme.colors.primaryHover,
        "--accent-gold": SITE.theme.colors.accent,
        "--accent-gold-dark": SITE.theme.colors.accentDark,
        "--accent-gold-light": SITE.theme.colors.accentLight,
        "--text-main": SITE.theme.colors.textMain,
        "--text-muted": SITE.theme.colors.textMuted,
        "--bg-tan": SITE.theme.colors.bgMain,
        "--bg-light": SITE.theme.colors.bgLight,
        "--bg-card": SITE.theme.colors.bgCard,
        "--footer-bg": SITE.theme.colors.footerBg,
        "--cta-primary": SITE.theme.colors.ctaPrimary,
        "--cta-primary-hover": SITE.theme.colors.ctaPrimaryHover,
      } as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": SITE.seo.schemaType,
              name: SITE.brand.name,
              image: getSiteUrl(SITE.assets.logoOfficial),
              url: SITE.domain.baseUrl,
              address: {
                "@type": "PostalAddress",
                addressLocality: SITE.contact.address.locality,
                addressRegion: SITE.contact.address.region,
                addressCountry: SITE.contact.address.country,
              },
              description: SITE.seo.defaultDescription,
              priceRange: SITE.seo.priceRange,
              telephone: `+${SITE.contact.countryCode}${SITE.contact.phone}`,
            }),
          }}
        />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
