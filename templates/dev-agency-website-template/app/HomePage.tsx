"use client";

import { useState } from "react";
import type { AgencyExpertise, AgencyFeaturedWork, AgencyTeamMember } from "@prisma/client";
import { SITE } from "@/constants";
import AgencyNavbar from "./components/AgencyNavbar";
import ExpertiseSection from "./components/ExpertiseSection";
import TeamSection from "./components/TeamSection";
import CtaSection from "./components/CtaSection";
import FeaturedWorkSection from "./components/FeaturedWorkSection";
import AgencyFooter from "./components/AgencyFooter";
import StickyWidgets from "./components/StickyWidgets";
import EnquiryModal from "./components/EnquiryModal";

export default function HomePage({
  expertise,
  team,
  work,
}: {
  expertise: AgencyExpertise[];
  team: AgencyTeamMember[];
  work: AgencyFeaturedWork[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSelection, setModalSelection] = useState("");

  const handleOpenEnquiry = (label = "") => {
    setModalSelection(label || SITE.brand.name);
    setIsModalOpen(true);
  };

  return (
    <div id="top" className="min-h-screen bg-bg-tan text-text-main transition-colors duration-200">
      <AgencyNavbar onOpenEnquiry={handleOpenEnquiry} />

      <main className="pt-16">
        <section className="py-20 px-6 border-b border-primary/10">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
              {SITE.agency.hero.eyebrow}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight text-text-main">
              {SITE.agency.hero.headline}{" "}
              <span className="bg-gradient-to-r from-primary to-accent-gold bg-clip-text text-transparent">
                {SITE.agency.hero.headlineAccent}
              </span>
            </h1>
            <p className="mt-6 text-lg text-text-muted max-w-2xl leading-relaxed">
              {SITE.agency.hero.subheadline}
            </p>
          </div>
        </section>

        <ExpertiseSection items={expertise} />
        <TeamSection members={team} />
        <CtaSection onOpenEnquiry={handleOpenEnquiry} />
        <FeaturedWorkSection items={work} />
      </main>

      <AgencyFooter />
      <StickyWidgets onOpenEnquiry={handleOpenEnquiry} />

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultSelection={modalSelection}
      />
    </div>
  );
}
