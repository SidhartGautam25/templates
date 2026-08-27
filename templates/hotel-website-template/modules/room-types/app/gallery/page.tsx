"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EnquiryModal from "../components/EnquiryModal";
import { ArrowLeft, ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { defaultRoomTypes } from "@/constants/default-room-types";
import { SITE } from "@/constants";

const STATIC_VIEWS = [
  { src: "/hero/hero-image-1.avif", category: "resort" },
  { src: "/hero/hero-image-2.jpg", category: "resort" },
  { src: "/hero/hero-image-3.jpg", category: "resort" },
  { src: "/hero/hero-image-4.jpg", category: "resort" },
  { src: "/hero/family-delux-triple-bed-room-3.jpg", category: "resort" },
  { src: "/hero/room-1.avif", category: "resort" },
];

export default function GalleryPage() {
  const [images, setImages] = useState<{ src: string; category: "resort" | "rooms"; title?: string }[]>([]);
  const [filter, setFilter] = useState<"all" | "resort" | "rooms">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Enquiry Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProject, setModalProject] = useState("");

  const handleOpenEnquiry = (projectName: string = "") => {
    setModalProject(projectName || defaultRoomTypes[0].name);
    setIsModalOpen(true);
  };

  const handleCloseEnquiry = () => {
    setIsModalOpen(false);
    setModalProject("");
  };

  useEffect(() => {
    async function loadRoomImages() {
      const allImages: { src: string; category: "resort" | "rooms"; title?: string }[] = [
        ...STATIC_VIEWS.map(v => ({ src: v.src, category: v.category as "resort" | "rooms", title: "Resort Exterior" }))
      ];
      
      try {
        const res = await fetch("/api/room-types");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          json.data.forEach((room: any) => {
            if (room.image) {
              try {
                if (room.image.startsWith("[")) {
                  const parsed = JSON.parse(room.image);
                  if (Array.isArray(parsed)) {
                    parsed.forEach((img) => {
                      allImages.push({
                        src: img,
                        category: "rooms",
                        title: room.name,
                      });
                    });
                  }
                } else {
                  allImages.push({
                    src: room.image,
                    category: "rooms",
                    title: room.name,
                  });
                }
              } catch (e) {
                allImages.push({
                  src: room.image,
                  category: "rooms",
                  title: room.name,
                });
              }
            }
          });
        }
      } catch (err) {
        console.warn("Failed to load dynamic room images, falling back to static:", err);
      }
      setImages(allImages);
    }
    
    loadRoomImages();
  }, []);

  const filteredImages = images.filter((img) => {
    if (filter === "all") return true;
    return img.category === filter;
  });

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! + 1) % filteredImages.length);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans bg-bg-tan">
      {/* Navigation Header */}
      <Navbar onOpenEnquiry={handleOpenEnquiry} />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header Title & Back Link */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-gold-dark hover:text-primary transition-colors uppercase tracking-wider"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Home
              </Link>
              <h1 className="text-3xl md:text-5xl font-extrabold font-serif text-primary tracking-tight">
                FullScreen Gallery
              </h1>
              <p className="text-xs text-text-muted">
                Explore the premium interiors, suite styles, and beautiful landscape of {SITE.brand.name}.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-bg-light border border-black/[0.04] p-1.5 rounded-2xl self-start md:self-center">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  filter === "all" ? "bg-primary text-white shadow-sm" : "text-text-muted hover:text-primary"
                }`}
              >
                All Photos
              </button>
              <button
                onClick={() => setFilter("resort")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  filter === "resort" ? "bg-primary text-white shadow-sm" : "text-text-muted hover:text-primary"
                }`}
              >
                Resort Views
              </button>
              <button
                onClick={() => setFilter("rooms")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  filter === "rooms" ? "bg-primary text-white shadow-sm" : "text-text-muted hover:text-primary"
                }`}
              >
                Rooms & Suites
              </button>
            </div>
          </div>

          {/* Gallery Masonry/Grid */}
          {filteredImages.length === 0 ? (
            <div className="text-center py-20 text-xs text-text-muted bg-white/40 rounded-3xl border border-black/[0.04]">
              No images found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative aspect-[4/3] bg-bg-tan/30 rounded-3xl overflow-hidden shadow-sm border border-black/[0.04] cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <Image
                    src={img.src}
                    alt={img.title || "Resort Gallery"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
                    <div className="flex justify-end">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-accent-gold uppercase tracking-wider block mb-1">
                        {img.category === "resort" ? "Exterior View" : "Accommodation"}
                      </span>
                      <h4 className="text-sm font-bold text-white font-serif">
                        {img.title || SITE.brand.name}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Lightbox modal */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between items-center py-6 px-4 select-none"
        >
          {/* Lightbox Header */}
          <div className="w-full max-w-7xl flex items-center justify-between text-white/70">
            <span className="text-xs font-semibold">
              {lightboxIndex + 1} / {filteredImages.length}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-1 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Content Section */}
          <div className="relative w-full max-w-4xl aspect-[4/3] max-h-[75vh]">
            <Image
              src={filteredImages[lightboxIndex].src}
              alt="Fullscreen Zoom"
              fill
              className="object-contain"
              sizes="80vw"
              priority
            />

            {/* Lightbox controls */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Footer */}
          <div className="text-center text-white/90 space-y-1">
            <h4 className="text-base font-serif font-bold">
              {filteredImages[lightboxIndex].title || SITE.brand.name}
            </h4>
            <p className="text-[10px] uppercase tracking-wider text-accent-gold">
              {filteredImages[lightboxIndex].category === "resort" ? "Exterior View" : "Accommodation"}
            </p>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <Footer />

      {/* Inquiry Modal */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={handleCloseEnquiry}
        defaultProject={modalProject}
      />
    </div>
  );
}
