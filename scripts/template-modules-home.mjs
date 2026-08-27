/**
 * @param {string[]} moduleIds
 * @returns {string}
 */
export function buildModulesHomePageSource(moduleIds) {
  const hasHero = moduleIds.includes("hero-simple");
  const hasFooter = moduleIds.includes("footer");
  const hasEnquiry = moduleIds.includes("enquiry-modal");

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

  lines.push(
    "      <main className=\"mx-auto max-w-3xl px-6 py-16 flex-1\">",
    "        {!SITE.features.heroSimple && (",
    "          <>",
    "            <h1 className=\"text-3xl font-bold text-primary\">{SITE.brand.name}</h1>",
    "            <p className=\"mt-4 text-text-muted\">{SITE.brand.tagline}</p>",
    "          </>",
    "        )}",
    "        <p className=\"mt-6 text-sm text-text-muted\">",
    "          Add domain sections (listings, gallery, etc.) in this template folder.",
    "        </p>",
    "      </main>",
    "",
    "      <PromoBanner onOpenEnquiry={handleOpenEnquiry} />"
  );

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

  return lines.join("\n");
}
