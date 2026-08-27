import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import "./globals.css";
import SiteJsonLd from "@/app/components/SiteJsonLd";
import QueryProvider from "@/app/components/QueryProvider";

export const metadata: Metadata = buildPageMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteJsonLd />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
