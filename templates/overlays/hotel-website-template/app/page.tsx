"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PromoBanner from "./components/PromoBanner";
import ProjectGrid from "./components/ProjectGrid";
import FacilitiesSection from "./components/FacilitiesSection";
import GallerySection from "./components/GallerySection";
import ReviewsSection from "./components/ReviewsSection";
import Footer from "./components/Footer";
import StickyWidgets from "./components/StickyWidgets";
import EnquiryModal from "./components/EnquiryModal";
import { defaultRoomTypes } from "@/constants/default-room-types";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProject, setModalProject] = useState("");
  const [hasOpened, setHasOpened] = useState(false);

  const handleOpenEnquiry = (projectName: string = "") => {
    setModalProject(projectName || defaultRoomTypes[0].name);
    setIsModalOpen(true);
    setHasOpened(true);
  };

  const handleCloseEnquiry = () => {
    setIsModalOpen(false);
    setModalProject("");
  };

  // 1. Initial trigger: Open the modal 5 seconds after page load (only 1 time)
  useEffect(() => {
    const timer = setTimeout(() => {
      setModalProject(defaultRoomTypes[0].name);
      setIsModalOpen(true);
      setHasOpened(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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

      {/* Main Facilities Section */}
      <FacilitiesSection />

      {/* Interior Gallery Preview Section */}
      <GallerySection />

      {/* Guest Reviews Section */}
      <ReviewsSection />

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
