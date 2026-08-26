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
  Phone,
  Mail,
  User,
  Check,
  Loader2,
  IndianRupee,
  BedDouble,
  Bath,
  Maximize2,
  Compass,
  Tv,
  Coffee,
  Wind,
  Wrench,
  GlassWater,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StickyWidgets from "@/app/components/StickyWidgets";

interface ProjectDetailsClientProps {
  project: any;
}

export default function ProjectDetailsClient({ project }: ProjectDetailsClientProps) {
  // Parse images (supporting single image or array from db)
  const images = React.useMemo(() => {
    if (!project.image) return [SITE.assets.defaultProjectImage];
    if (project.image.startsWith("[")) {
      try {
        const parsed = JSON.parse(project.image);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse room type images:", e);
      }
    }
    return [project.image];
  }, [project.image]);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Lead Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`Interested in booking ${project.name}. Please confirm availability.`);
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
        throw new Error(json.error || "Failed to submit booking request.");
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
    if (term.includes("tv") || term.includes("television") || term.includes("media")) return <Tv className="w-4 h-4 text-accent-gold" />;
    if (term.includes("kettle") || term.includes("coffee") || term.includes("tea")) return <Coffee className="w-4 h-4 text-accent-gold" />;
    if (term.includes("air condition") || term.includes("ac")) return <Wind className="w-4 h-4 text-accent-gold" />;
    if (term.includes("iron") || term.includes("board") || term.includes("laundry")) return <Wrench className="w-4 h-4 text-accent-gold" />;
    if (term.includes("water") || term.includes("mineral") || term.includes("drink")) return <GlassWater className="w-4 h-4 text-accent-gold" />;
    if (term.includes("pool") || term.includes("swim")) return <Waves className="w-4 h-4 text-accent-gold" />;
    if (term.includes("gym") || term.includes("fit")) return <Dumbbell className="w-4 h-4 text-accent-gold" />;
    if (term.includes("club") || term.includes("lounge")) return <Home className="w-4 h-4 text-accent-gold" />;
    if (term.includes("kid") || term.includes("play") || term.includes("child")) return <Smile className="w-4 h-4 text-accent-gold" />;
    if (term.includes("garden") || term.includes("park") || term.includes("lawn") || term.includes("tree")) return <Trees className="w-4 h-4 text-accent-gold" />;
    if (term.includes("security") || term.includes("cctv") || term.includes("guard")) return <ShieldCheck className="w-4 h-4 text-accent-gold" />;
    if (term.includes("track") || term.includes("jog") || term.includes("walk")) return <Footprints className="w-4 h-4 text-accent-gold" />;
    if (term.includes("car") || term.includes("park") || term.includes("garage")) return <Car className="w-4 h-4 text-accent-gold" />;
    return <Sparkles className="w-4 h-4 text-accent-gold" />;
  };

  // Dynamic Navigation Links for Room Page
  const navLinks = [
    { label: "Overview", id: "overview" },
  ];
  if (project.ratePlans && project.ratePlans.length > 0) {
    navLinks.push({ label: "Rates & Plans", id: "rates" });
  }
  if (project.amenities) {
    navLinks.push({ label: "Amenities", id: "amenities" });
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
      {/* Header Navbar with Custom Room Links */}
      <Navbar onOpenEnquiry={handleScrollToEnquiry} customLinks={navLinks} />

      {/* Hero Section */}
      <section className="relative h-[65vh] w-full min-h-[450px] overflow-hidden flex items-end">
        {/* Background Image Carousel */}
        <div className="absolute inset-0 z-0">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentImgIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={imgUrl}
                alt={`${project.name} - View ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40 z-20" />
          
          {/* Slider Controls */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition-all cursor-pointer backdrop-blur-sm border border-white/10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition-all cursor-pointer backdrop-blur-sm border border-white/10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Dot Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImgIndex ? "bg-accent-gold w-4" : "bg-white/40"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Hero Info Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 pb-12">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-xs uppercase tracking-widest font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-full transition-all hover:translate-x-[-4px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Rooms
          </Link>

          <div className="space-y-4 max-w-3xl">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-accent-gold text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                {SITE.brand.name}
              </span>
              {project.view && (
                <span className="bg-black/40 text-accent-gold text-[10px] font-bold px-3 py-1 rounded-full border border-accent-gold/20 backdrop-blur-sm">
                  {project.view}
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
              Sadar Hospital, Gaya, Bihar
            </p>
          </div>
        </div>
      </section>

      {/* Quick Specifications Bar */}
      <section className="relative z-20 max-w-7xl mx-auto w-full px-4 md:px-8 mt-[-30px]">
        <div className="bg-white rounded-3xl shadow-xl border border-black/[0.04] p-5 sm:p-6 md:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Room Size */}
          <div className="flex items-center gap-4 border-r border-black/[0.05] pr-2">
            <div className="p-3.5 bg-bg-tan rounded-2xl flex-shrink-0">
              <Maximize2 className="w-6 h-6 text-accent-gold-dark" />
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-text-muted font-bold">
                Room Size
              </span>
              <span className="text-sm font-bold text-primary block mt-0.5">
                {project.size}
              </span>
            </div>
          </div>
 
          {/* Bed Type */}
          <div className="flex items-center gap-4 lg:border-r border-black/[0.05] pr-2">
            <div className="p-3.5 bg-bg-tan rounded-2xl flex-shrink-0">
              <BedDouble className="w-6 h-6 text-accent-gold-dark" />
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-text-muted font-bold">
                Bed Config
              </span>
              <span className="text-sm font-bold text-primary block mt-0.5">
                {project.bedType}
              </span>
            </div>
          </div>
 
          {/* Bathrooms */}
          <div className="flex items-center gap-4 border-r border-black/[0.05] pr-2">
            <div className="p-3.5 bg-bg-tan rounded-2xl flex-shrink-0">
              <Bath className="w-6 h-6 text-accent-gold-dark" />
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-text-muted font-bold">
                Bathroom
              </span>
              <span className="text-sm font-bold text-primary block mt-0.5">
                {project.bathrooms}
              </span>
            </div>
          </div>
 
          {/* Starting Price */}
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-bg-tan rounded-2xl flex-shrink-0">
              <IndianRupee className="w-6 h-6 text-accent-gold-dark" />
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-text-muted font-bold">
                Starting Price
              </span>
              <span className="text-sm font-bold text-accent-gold-dark block mt-0.5">
                ₹{project.startingPrice.toLocaleString("en-IN")} / night
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
              Room Overview
            </h2>
            <div className="text-primary/80 text-sm leading-relaxed whitespace-pre-line font-medium space-y-4">
              {project.description ? (
                project.description
              ) : (
                `${SITE.brand.name} is delighted to present the ${project.name} in Gaya, Bihar. Designed for guests seeking refined comfort, this room blends modern amenities, serene surroundings, and warm hospitality to create an unforgettable stay experience.`
              )}
            </div>
          </div>

          {/* Rate Plans Section */}
          {project.ratePlans && project.ratePlans.length > 0 && (
            <div id="rates" className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-sm space-y-6 scroll-mt-24">
              <h2 className="text-2xl font-bold font-serif text-primary border-b border-black/[0.04] pb-4">
                Available Rate Plans
              </h2>
              <div className="space-y-4">
                {project.ratePlans.map((plan: any, idx: number) => (
                  <div key={idx} className="p-5 bg-bg-tan/20 border border-black/[0.05] rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-primary">{plan.option}</h4>
                      <ul className="mt-2 space-y-1.5">
                        {(plan.details || []).map((detail: string, dIdx: number) => (
                          <li key={dIdx} className="text-xs text-text-muted flex items-center gap-1.5 font-medium">
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-left md:text-right flex flex-col md:items-end">
                      <span className="text-xs text-text-muted line-through font-semibold">₹{plan.price.toLocaleString("en-IN")}</span>
                      <span className="text-xl font-bold text-accent-gold-dark mt-0.5">₹{plan.discountedPrice.toLocaleString("en-IN")} <span className="text-xs text-text-muted font-semibold">/ night</span></span>
                      <span className="text-[10px] text-text-muted font-bold mt-1">+ ₹{plan.taxesAndFees} Taxes & fees</span>
                      <button
                        onClick={() => {
                          setMessage(`I want to book ${project.name} under the plan: ${plan.option}. Please confirm availability.`);
                          handleScrollToEnquiry();
                        }}
                        className="mt-3 px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer w-full md:w-auto"
                      >
                        Select Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities Grid */}
          {project.amenities && (
            <div id="amenities" className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-sm space-y-6 scroll-mt-24">
              <h2 className="text-2xl font-bold font-serif text-primary border-b border-black/[0.04] pb-4">
                Room Amenities & Facilities
              </h2>
              
              <div className="space-y-6">
                {Object.entries(project.amenities).map(([category, list]: [string, any]) => {
                  if (!Array.isArray(list) || list.length === 0) return null;
                  const categoryLabels: Record<string, string> = {
                    popular: "Popular with Guests",
                    features: "Room Features",
                    basic: "Basic Facilities",
                    media: "Media and Entertainment",
                    bathroom: "Bathroom Amenities"
                  };
                  return (
                    <div key={category} className="space-y-3">
                      <h4 className="text-xs font-bold text-accent-gold-dark uppercase tracking-wider">{categoryLabels[category] || category}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {list.map((item: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 bg-bg-tan/10 border border-black/[0.02] rounded-xl font-semibold text-xs text-primary"
                          >
                            <div className="p-1.5 bg-white rounded shadow-sm flex-shrink-0">
                              {getAmenityIcon(item)}
                            </div>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
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
                    Booking Request Sent!
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed px-4">
                    Thank you for your interest in {project.name}. Our front desk manager will reach out shortly to confirm availability and complete your booking.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl tracking-wider cursor-pointer"
                >
                  Book Another Room
                </button>
              </div>
            ) : (
              // Standard Enquiry Form state
              <form onSubmit={handleEnquirySubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-serif text-primary">
                    Book Your Stay
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    Submit your details and preferences. Our reservations desk will contact you within minutes.
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
                      rows={4}
                      placeholder="Special Request or Preferred Date..."
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
                    "SUBMIT BOOKING REQUEST"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />

      {/* Sticky Call & Form Widgets */}
      <StickyWidgets onOpenEnquiry={handleScrollToEnquiry} />
    </>
  );
}
