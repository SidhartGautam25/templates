/**
 * Site configuration — edit this file when setting up a new hotel or resort project.
 * All UI-facing brand, contact, SEO, theme, and copy values live here.
 */

export const SITE = {
  id: "lakeside-haven-resort",

  brand: {
    name: "Lakeside Haven Resort",
    shortName: "Lakeside Haven",
    tagline: "Where Nature Meets Refined Comfort",
    developerName: "Lakeside Haven Resort",
    channelPartner: "Lakeside Hospitality Partners",
    copyright: "Lakeside Haven Resort. All Rights Reserved.",
    managedBy: "Managed by Lakeside Hospitality.",
  },

  domain: {
    baseUrl: "https://lakesidehaven.example.com",
    wwwHost: "www.lakesidehaven.example.com",
  },

  contact: {
    phone: "9876543210",
    phoneDisplay: "+91 98765 43210",
    countryCode: "91",
    email: "reservations@lakesidehaven.example.com",
    address: {
      locality: "Lonavala",
      region: "Maharashtra",
      country: "IN",
      full: "Lake View Road, Lonavala, Maharashtra 410401, India",
    },
    templeDistance: "5 min walk to Lonavala Lake viewpoint",
  },

  legal: {
    agentRera: "",
    privacyPolicyPath: "/privacy-policy",
    termsPath: "/terms-and-conditions",
    consentText:
      "I authorize Lakeside Hospitality Partners and its representatives to call, SMS, email, or WhatsApp me about offers and services.",
    shortConsentText:
      "I authorize company representatives to contact me about products and offers.",
    disclaimer: [
      "Rates and availability are subject to change. Images are representative.",
      "Please contact reservations for confirmed pricing and seasonal offers.",
    ],
  },

  seo: {
    defaultTitle: "Lakeside Haven Resort | Boutique Hotel in Lonavala",
    defaultDescription:
      "Lakeside Haven Resort — boutique rooms and suites in Lonavala with lake views, modern amenities, and warm hospitality. Book direct for the best rates.",
    keywords:
      "Lonavala hotel, resort booking, weekend getaway Maharashtra, family suite Lonavala, boutique resort",
    priceRange: "₹3,500 - ₹12,000 per night",
    locale: "en_IN",
    schemaType: "Resort" as const,
  },

  theme: {
    colors: {
      primary: "#3d5a52",
      primaryHover: "#2f4841",
      accent: "#c4a574",
      accentDark: "#a68b5b",
      accentLight: "#e8d9c0",
      textMain: "#3d4a47",
      textMuted: "#6b7c78",
      bgMain: "#faf8f5",
      bgLight: "#f3f0eb",
      bgCard: "#ffffff",
      footerBg: "#eef2f0",
      ctaPrimary: "#4a7c59",
      ctaPrimaryHover: "#3d6b4a",
    },
  },

  assets: {
    logo: "/logo.svg",
    logoOfficial: "/logo.svg",
    favicon: "/logo.svg",
    icon192: "/logo.svg",
    icon512: "/logo.svg",
    appleIcon: "/logo.svg",
    heroDesktop: [] as string[],
    heroMobile: [] as string[],
    enquireWidget: "",
    defaultPromoBanner: "",
    defaultProjectImage: "/assets/placeholder-project.svg",
  },

  hero: {
    eyebrow: "SERENE ESCAPES. TIMELESS COMFORT.",
    headline: "Your Lakeside Retreat in Lonavala",
    subheadline:
      "Wake up to misty hills and curated comfort. Deluxe rooms, family suites, and lake-view stays — from ₹3,500* per night.",
    startingPrice: "₹3,500*",
    features: [
      { icon: "map", label: "Lonavala Lake Nearby" },
      { icon: "sparkles", label: "Premium Comfort" },
      { icon: "shield", label: "Trusted Hospitality" },
      { icon: "tag", label: "Best Rates Guaranteed" },
    ],
    ctaButtons: [
      { label: "Book Your Stay", enquiryLabel: "Book Your Stay" },
      { label: "View Rooms", enquiryLabel: "View Rooms" },
      { label: "Download Brochure", enquiryLabel: "Download Brochure" },
    ],
    locationsTitle: "Explore Our Accommodations",
    locations: [
      { label: "Deluxe Lake View", enquiryLabel: "Deluxe Lake View Enquiry" },
      { label: "Garden Suites", enquiryLabel: "Garden Suites Enquiry" },
      { label: "Family Rooms", enquiryLabel: "Family Rooms Enquiry" },
      { label: "Wellness Packages", enquiryLabel: "Wellness Packages Enquiry" },
    ],
    carouselImages: [
      "/hero/hero-image-1.avif",
      "/hero/hero-image-2.jpg",
      "/hero/hero-image-3.jpg",
      "/hero/hero-image-4.jpg",
    ],
    slideDuration: 5000,
  },

  navigation: {
    home: "Home",
    projects: "Our Rooms",
    contact: "Contact Us",
    backToHome: "Back to Home",
  },

  projectGrid: {
    eyebrow: "Our Accommodations",
    title: "Rooms & Suites at Lakeside Haven",
    tabs: {
      all: "All Rooms",
      apartments: "Deluxe & Suites",
      plots: "Standard Rooms",
    },
  },

  promoBanner: {
    imageUrl: "",
    sec1Title: "Deluxe Lake View",
    sec1Sub: "From ₹3,500*",
    sec2Title: "Lonavala, Maharashtra",
    sec2Sub: "Weekend getaway ready",
    sec3Title: "Complimentary Wi-Fi",
    sec3Sub: "Breakfast options available",
    sec4Title: "Book Direct & Save",
    sec4Sub: "Best price guarantee",
  },

  about: {
    eyebrow: "Our Story",
    title: "About Lakeside Haven Resort",
    paragraphs: [
      "Lakeside Haven Resort is a boutique retreat nestled in Lonavala where modern design meets the calm of the Western Ghats. Whether you are planning a family weekend, a corporate offsite, or a quiet escape, our rooms are designed for rest and recharge.",
      "From lake-view deluxe rooms to spacious family suites, every stay includes attentive service, fast Wi-Fi, and easy access to Lonavala's top attractions.",
    ],
    callLabel: "Talk to Reservations",
  },

  enquiry: {
    modalTitle: "Lakeside Haven Resort",
    modalSubtitle: "Register for exclusive offers and availability updates.",
    formTitle: "Get a call back from our reservations team:",
    successMessage:
      "Thank you! A reservations specialist will contact you shortly.",
    aboutSuccessMessage:
      "We received your enquiry. Our team will reach out within 24 hours.",
  },

  admin: {
    displayName: "Lakeside Haven",
    portalTitle: "Lakeside Haven Admin",
    portalSubtitle: "Sign in to manage rooms, leads, and site content.",
    defaultUserName: "Resort Admin",
    defaultUserEmail: "admin@lakesidehaven.example.com",
    leadsExportPrefix: "lakeside_leads",
    projectForm: {
      addTitle: "Add Room Type",
      editTitle: "Edit Room Type",
      namePlaceholder: "e.g. Deluxe Lake View",
      reraPlaceholder: "Internal reference / license ID",
    },
  },

  footer: {
    reraLabel: "License",
    reraFallbacks: [] as { name: string; rera: string }[],
  },
} as const;

export function getTelLink(phone = SITE.contact.phone) {
  return `tel:+${SITE.contact.countryCode}${phone}`;
}

export function getWhatsAppLink(phone = SITE.contact.phone) {
  return `https://wa.me/${SITE.contact.countryCode}${phone}`;
}

export function getSiteUrl(path = "") {
  const base = SITE.domain.baseUrl.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${base}${normalized}`;
}
