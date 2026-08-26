"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PromoBanner from "./components/PromoBanner";
import ProjectGrid from "./components/ProjectGrid";
import DeveloperAbout from "./components/DeveloperAbout";
import Footer from "./components/Footer";
import StickyWidgets from "./components/StickyWidgets";
import EnquiryModal from "./components/EnquiryModal";
import { projectsData } from "./data/projects";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProject, setModalProject] = useState("");
  const [hasOpened, setHasOpened] = useState(false);

  const handleOpenEnquiry = (projectName: string = "") => {
    setModalProject(projectName || projectsData[0].name);
    setIsModalOpen(true);
    setHasOpened(true);
  };

  const handleCloseEnquiry = () => {
    setIsModalOpen(false);
    setModalProject("");
  };

  // 1. Initial trigger: Open the modal 5 seconds after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setModalProject(projectsData[0].name);
      setIsModalOpen(true);
      setHasOpened(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // 2. Subsequent triggers: Re-open the modal 10 seconds after it is closed
  useEffect(() => {
    if (!isModalOpen && hasOpened) {
      const timer = setTimeout(() => {
        setModalProject(projectsData[0].name);
        setIsModalOpen(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isModalOpen, hasOpened]);

  return (
    <div className="relative min-h-screen flex flex-col font-sans bg-bg-tan">
      {/* Navigation Bar */}
      <Navbar onOpenEnquiry={handleOpenEnquiry} />

      {/* Hero Section */}
      <Hero onOpenEnquiry={handleOpenEnquiry} />

      {/* Promo Banner Section */}
      <PromoBanner onOpenEnquiry={handleOpenEnquiry} />

      {/* Project Grid Listings */}
      <ProjectGrid onOpenEnquiry={handleOpenEnquiry} />

      {/* Developer Information Section */}
      <DeveloperAbout onOpenEnquiry={handleOpenEnquiry} />

      {/* Footer Details */}
      <Footer />

      {/* Sticky Call & Form Widgets */}
      <StickyWidgets onOpenEnquiry={handleOpenEnquiry} />

      {/* Lead Submission Modal Form */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={handleCloseEnquiry}
        defaultProject={modalProject}
      />
    </div>
  );
}
