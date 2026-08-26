import type { Metadata } from "next";
import { siteMeta } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${siteMeta.title} - ${siteMeta.tagline}`,
    template: `%s | ${siteMeta.title}`,
  },
  description: siteMeta.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
