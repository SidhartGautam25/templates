import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/app/components/QueryProvider";
import { SITE } from "@/constants";

export const metadata: Metadata = {
  title: SITE.seo.defaultTitle,
  description: SITE.seo.defaultDescription,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
