/**
 * @param {string[]} moduleIds
 * @returns {string}
 */
export function buildModulesHomePageSource(moduleIds) {
  const hasHero = moduleIds.includes("hero-simple");
  const hasFooter = moduleIds.includes("footer");
  const hasEnquiry = moduleIds.includes("enquiry-modal");
  const hasGallery = moduleIds.includes("gallery");
  const hasReviews = moduleIds.includes("reviews");
  const hasBlogCompose = moduleIds.includes("blog-compose");

  const uiModules = ["enquiry-modal", "footer", "hero-simple", "gallery", "reviews", "blog-compose"];
  const hasAnyUi = moduleIds.some((id) => uiModules.includes(id));

  const imports = [
    'import React, { useState } from "react";',
    'import Navbar from "./components/Navbar";',
    'import PromoBanner from "./components/PromoBanner";',
    'import StickyWidgets from "./components/StickyWidgets";',
    'import { SITE } from "@/constants";',
  ];

  if (hasHero) imports.push('import Hero from "./components/Hero";');
  if (hasFooter) imports.push('import Footer from "./components/Footer";');
  if (hasEnquiry) imports.push('import EnquiryModal from "./components/EnquiryModal";');
  if (hasGallery) imports.push('import GallerySection from "./components/GallerySection";');
  if (hasReviews) imports.push('import ReviewsSection from "./components/ReviewsSection";');
  if (hasBlogCompose) imports.push('import BlogSection from "./components/BlogSection";');

  const lines = [
    ...imports,
    "",
    "export default function HomePage() {",
    "  const [isModalOpen, setIsModalOpen] = useState(false);",
    "  const [modalSelection, setModalSelection] = useState(\"\");",
    "",
    "  const handleOpenEnquiry = (label = \"\") => {",
    "    setModalSelection(label || SITE.brand.name);",
    "    setIsModalOpen(true);",
    "  };",
    "",
    "  const handleCloseEnquiry = () => {",
    "    setIsModalOpen(false);",
    "    setModalSelection(\"\");",
    "  };",
    "",
    "  return (",
    "    <div className=\"relative min-h-screen flex flex-col font-sans bg-bg-main\">",
    "      <Navbar onOpenEnquiry={handleOpenEnquiry} />",
    "",
  ];

  if (hasHero) {
    lines.push("      <Hero onOpenEnquiry={handleOpenEnquiry} />");
  }

  if (!hasHero && !hasGallery && !hasReviews && !hasBlogCompose) {
    lines.push(
      "      <main className=\"mx-auto max-w-3xl px-6 py-16 flex-1\">",
      "        <h1 className=\"text-3xl font-bold text-primary\">{SITE.brand.name}</h1>",
      "        <p className=\"mt-4 text-text-muted\">{SITE.brand.tagline}</p>",
      "        <p className=\"mt-6 text-sm text-text-muted\">",
      "          Add domain sections in this template folder.",
      "        </p>",
      "      </main>"
    );
  }

  if (hasGallery) {
    lines.push("      <GallerySection />");
  }

  if (hasReviews) {
    lines.push("      <ReviewsSection />");
  }

  if (hasBlogCompose) {
    lines.push("      <BlogSection />");
  }

  lines.push("", "      <PromoBanner onOpenEnquiry={handleOpenEnquiry} />");

  if (hasFooter) {
    lines.push("", "      <Footer />");
  }

  lines.push("", "      <StickyWidgets onOpenEnquiry={handleOpenEnquiry} />");

  if (hasEnquiry) {
    lines.push(
      "",
      "      <EnquiryModal",
      "        isOpen={isModalOpen}",
      "        onClose={handleCloseEnquiry}",
      "        defaultSelection={modalSelection}",
      "      />"
    );
  }

  lines.push("    </div>", "  );", "}", "");

  if (!hasAnyUi) {
    return [
      'import { SITE } from "@/constants";',
      "",
      "export default function HomePage() {",
      "  return (",
      "    <main className=\"mx-auto max-w-3xl px-6 py-16\">",
      "      <h1 className=\"text-3xl font-bold\">{SITE.brand.name}</h1>",
      "      <p className=\"mt-4 text-text-muted\">{SITE.brand.tagline}</p>",
      "    </main>",
      "  );",
      "}",
      "",
    ].join("\n");
  }

  return lines.join("\n");
}
