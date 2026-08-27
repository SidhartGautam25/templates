"use client";

import { SITE } from "@/constants";

import React, { useState } from "react";
import Link from "next/link";
import {
  Waves,
  Dumbbell,
  Home,
  Smile,
  Trees,
  ShieldCheck,
  Footprints,
  Car,
  Sparkles,
  ArrowLeft,
  ZoomIn,
  Phone,
  Mail,
  User,
  Check,
  Loader2,
  Calendar,
  IndianRupee,
  FileCheck2,
  Building2,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StickyWidgets from "@/app/components/StickyWidgets";

interface ProjectDetailsClientProps {
  project: any;
}

export default function ProjectDetailsClient({ project }: ProjectDetailsClientProps) {
  const [activeFpIndex, setActiveFpIndex] = useState(0);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Lead Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`Interested in ${project.name}. Please share more details.`);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (!name.trim()) {
      setLoading(false);
      return setErrorMsg("Please enter your name.");
    }
    if (!phone.trim()) {
      setLoading(false);
      return setErrorMsg("Please enter your mobile number.");
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: project.name,
          name,
          email,
          phone,
          message,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit enquiry.");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to map amenity names to icons
  const getAmenityIcon = (name: string) => {
    const term = name.toLowerCase();
    if (term.includes("pool") || term.includes("swim")) return <Waves className="w-5 h-5 text-accent-gold" />;
    if (term.includes("gym") || term.includes("fit")) return <Dumbbell className="w-5 h-5 text-accent-gold" />;
    if (term.includes("club") || term.includes("lounge")) return <Home className="w-5 h-5 text-accent-gold" />;
    if (term.includes("kid") || term.includes("play") || term.includes("child")) return <Smile className="w-5 h-5 text-accent-gold" />;
    if (term.includes("garden") || term.includes("park") || term.includes("lawn") || term.includes("tree")) return <Trees className="w-5 h-5 text-accent-gold" />;
    if (term.includes("security") || term.includes("cctv") || term.includes("guard")) return <ShieldCheck className="w-5 h-5 text-accent-gold" />;
    if (term.includes("track") || term.includes("jog") || term.includes("walk")) return <Footprints className="w-5 h-5 text-accent-gold" />;
    if (term.includes("car") || term.includes("park") || term.includes("garage")) return <Car className="w-5 h-5 text-accent-gold" />;
    return <Sparkles className="w-5 h-5 text-accent-gold" />;
  };

  // Dynamic Navigation Links for Project Page
  const navLinks = [
    { label: "Overview", id: "overview" },
    { label: "Highlights", id: "highlights" },
  ];
  if (project.amenities && project.amenities.length > 0) {
    navLinks.push({ label: "Amenities", id: "amenities" });
  }
  if (project.gallery && project.gallery.length > 0) {
    navLinks.push({ label: "Gallery", id: "gallery" });
  }

  // Smooth scroll to enquiry form
  const handleScrollToEnquiry = () => {
    const element = document.getElementById("enquiry-form");
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Header Navbar with Custom Project Links */}
      <Navbar onOpenEnquiry={handleScrollToEnquiry} customLinks={navLinks} />

      {/* Hero Section */}
      <section className="relative h-[65vh] w-full min-h-[450px] overflow-hidden flex items-end">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
        </div>

        {/* Hero Info Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 pb-12">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-xs uppercase tracking-widest font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-full transition-all hover:translate-x-[-4px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>

          <div className="space-y-4 max-w-3xl">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-accent-gold text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                {project.category === "plots" ? "Luxury Plots" : "Premium Apartments"}
              </span>
              {project.tag1 && (
                <span className="bg-black/40 text-accent-gold text-[10px] font-bold px-3 py-1 rounded-full border border-accent-gold/20 backdrop-blur-sm">
                  {project.tag1}
                </span>
              )}
              {project.tag2 && (
                <span className="bg-black/40 text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                  {project.tag2}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white tracking-tight leading-tight">
              {project.name}
            </h1>

            {/* Location Info */}
            <p className="text-white/80 text-sm md:text-base font-medium flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent-gold animate-pulse" />
              {project.location}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Specifications Bar */}
      <section className="relative z-20 max-w-7xl mx-auto w-full px-4 md:px-8 mt-[-30px]">
        <div className="bg-white rounded-3xl shadow-xl border border-black/[0.04] p-5 sm:p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Typology */}
          <div className="flex items-center gap-4 border-b border-black/[0.04] sm:border-b-0 sm:border-r border-black/[0.05] pb-4 sm:pb-0 pr-2">
            <div className="p-3.5 bg-bg-tan rounded-2xl flex-shrink-0">
              <Building2 className="w-6 h-6 text-accent-gold-dark" />
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-text-muted font-bold">
                Typology
              </span>
              <span className="text-sm font-bold text-primary block mt-0.5">
                {project.typology}
              </span>
            </div>
          </div>
 
          {/* Pricing */}
          <div className="flex items-center gap-4 border-b border-black/[0.04] lg:border-b-0 lg:border-r border-black/[0.05] pb-4 lg:pb-0 pr-2">
            <div className="p-3.5 bg-bg-tan rounded-2xl flex-shrink-0">
              <IndianRupee className="w-6 h-6 text-accent-gold-dark" />
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-text-muted font-bold">
                Starting Price
              </span>
              <span className="text-sm font-bold text-accent-gold-dark block mt-0.5">
                {project.price}
              </span>
            </div>
          </div>
 
          {/* RERA */}
          <div className="flex items-center gap-4 border-b border-black/[0.04] sm:border-b-0 sm:border-r border-black/[0.05] pb-4 sm:pb-0 pr-2">
            <div className="p-3.5 bg-bg-tan rounded-2xl flex-shrink-0">
              <FileCheck2 className="w-6 h-6 text-accent-gold-dark" />
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-text-muted font-bold">
                RERA Number
              </span>
              <span className="text-sm font-bold text-primary block mt-0.5 select-all">
                {project.rera}
              </span>
            </div>
          </div>
 
          {/* Possession */}
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-bg-tan rounded-2xl flex-shrink-0">
              <Calendar className="w-6 h-6 text-accent-gold-dark" />
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-text-muted font-bold">
                Possession Year
              </span>
              <span className="text-sm font-bold text-primary block mt-0.5">
                {project.possession || "Contact Agent"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Split Layout Content */}
      <section className="py-16 max-w-7xl mx-auto w-full px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Rich details columns */}
        <div className="lg:col-span-8 space-y-12">
          {/* Overview & Description */}
          <div id="overview" className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-sm space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-bold font-serif text-primary border-b border-black/[0.04] pb-4">
              Project Overview
            </h2>
            <div className="text-primary/80 text-sm leading-relaxed whitespace-pre-line font-medium space-y-4">
              {project.description ? (
                project.description
              ) : (
                `${SITE.brand.name} is delighted to present ${project.name} at ${project.location}. Designed for guests seeking refined comfort combined with ${project.typology}, this offering blends thoughtful amenities, serene surroundings, and warm hospitality to create an unforgettable stay experience.`
              )}
            </div>
          </div>

          {/* Key Highlights */}
          <div id="highlights" className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-sm space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-bold font-serif text-primary border-b border-black/[0.04] pb-4">
              Key Highlights
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.highlights.map((hl: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-accent-gold-dark font-bold" />
                  </div>
                  <span className="text-xs font-semibold text-primary/95">{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Amenities Grid */}
          {project.amenities && project.amenities.length > 0 && (
            <div id="amenities" className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-sm space-y-6 scroll-mt-24">
              <h2 className="text-2xl font-bold font-serif text-primary border-b border-black/[0.04] pb-4">
                Lifestyle Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {project.amenities.map((item: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center p-5 bg-bg-tan/20 border border-black/[0.03] rounded-2xl text-center hover:shadow-md hover:border-accent-gold/20 transition-all duration-300 group"
                  >
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-black/[0.03] group-hover:scale-105 transition-transform mb-3">
                      {getAmenityIcon(item)}
                    </div>
                    <span className="text-xs font-bold text-primary tracking-wide">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Floor Plans */}
          {project.floorPlans && project.floorPlans.length > 0 && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-sm space-y-6">
              <h2 className="text-2xl font-bold font-serif text-primary border-b border-black/[0.04] pb-4">
                Floor Plans & Layouts
              </h2>

              {/* Floor plan tabs */}
              <div className="flex flex-wrap gap-2 border-b border-black/[0.05] pb-4">
                {project.floorPlans.map((fp: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFpIndex(idx)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                      activeFpIndex === idx
                        ? "bg-primary text-white shadow-md"
                        : "bg-bg-tan/40 text-text-muted hover:bg-black/5 hover:text-primary"
                    }`}
                  >
                    {fp.title}
                  </button>
                ))}
              </div>

              {/* Active floor plan showcase */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Meta details */}
                <div className="md:col-span-4 space-y-4 text-center md:text-left">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted block">
                      Configuration
                    </span>
                    <h4 className="text-xl font-bold text-primary mt-1">
                      {project.floorPlans[activeFpIndex]?.title}
                    </h4>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted block">
                      Dimensions / Carpet Area
                    </span>
                    <span className="text-lg font-bold text-accent-gold-dark mt-1 block">
                      {project.floorPlans[activeFpIndex]?.size}
                    </span>
                  </div>
                  <button
                    onClick={() => setLightboxUrl(project.floorPlans[activeFpIndex]?.image)}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer"
                  >
                    <ZoomIn className="w-4 h-4" /> Expand Plan Layout
                  </button>
                </div>

                {/* Plan Layout image */}
                <div className="md:col-span-8 flex justify-center">
                  <div
                    onClick={() => setLightboxUrl(project.floorPlans[activeFpIndex]?.image)}
                    className="relative max-w-md w-full aspect-[4/3] bg-bg-tan/20 border border-black/[0.06] rounded-2xl overflow-hidden flex items-center justify-center p-4 cursor-zoom-in hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={project.floorPlans[activeFpIndex]?.image}
                      alt={project.floorPlans[activeFpIndex]?.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Project Gallery Masonry Grid */}
          {project.gallery && project.gallery.length > 0 && (
            <div id="gallery" className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-sm space-y-6 scroll-mt-24">
              <h2 className="text-2xl font-bold font-serif text-primary border-b border-black/[0.04] pb-4">
                Media Gallery
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {project.gallery.map((url: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxUrl(url)}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-black/[0.06] shadow-sm cursor-zoom-in group hover:shadow-md transition-shadow"
                  >
                    <img
                      src={url}
                      alt="Project Gallery"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Enquiry Form Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div id="enquiry-form" className="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-xl relative overflow-hidden scroll-mt-24">
            {/* Soft decorative header border line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 gold-gradient" />
            
            {success ? (
              // Success Screen state
              <div className="py-8 text-center space-y-5 animate-fade-in">
                <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-serif text-primary">
                    Request Submitted!
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed px-4">
                    Thank you for your interest in {project.name}. Our relationship manager will reach out shortly to provide brochures and schedule your private site tour.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl tracking-wider cursor-pointer"
                >
                  Request Another Callback
                </button>
              </div>
            ) : (
              // Standard Enquiry Form state
              <form onSubmit={handleEnquirySubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-serif text-primary">
                    Private Consultations
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    Leave your contact details to request current floor plan layouts, availability lists, and private tours.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-xl">
                    {errorMsg}
                  </div>
                )}

                {/* Form fields */}
                <div className="space-y-3.5">
                  <div className="relative flex items-center">
                    <User className="absolute left-4 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl pl-11 pr-4 py-3 text-xs text-primary focus:outline-none focus:border-accent-gold"
                    />
                  </div>

                  <div className="relative flex items-center">
                    <Phone className="absolute left-4 w-4 h-4 text-text-muted" />
                    <input
                      type="tel"
                      placeholder="Contact Number *"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl pl-11 pr-4 py-3 text-xs text-primary focus:outline-none focus:border-accent-gold"
                    />
                  </div>

                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-4 h-4 text-text-muted" />
                    <input
                      type="email"
                      placeholder="Email Address (Optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl pl-11 pr-4 py-3 text-xs text-primary focus:outline-none focus:border-accent-gold"
                    />
                  </div>

                  <div className="relative">
                    <textarea
                      rows={3}
                      placeholder="Message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-bg-tan/30 border border-black/[0.08] rounded-xl px-4 py-3 text-xs text-primary focus:outline-none focus:border-accent-gold resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 gold-gradient hover:gold-gradient-hover text-primary font-bold text-xs tracking-wider transition-all duration-300 shadow-md hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      SUBMITTING...
                    </>
                  ) : (
                    "REQUEST CALL BACK"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox / Overlay gallery image modal */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={lightboxUrl}
              alt="Lightbox View"
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-4 right-4 bg-white/10 text-white hover:bg-white/20 p-2.5 rounded-full backdrop-blur-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <Footer singleProject={project} />

      {/* Sticky Call & Form Widgets */}
      <StickyWidgets onOpenEnquiry={handleScrollToEnquiry} />
    </>
  );
}

// Simple absolute close SVG icon support without full package imports
function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
