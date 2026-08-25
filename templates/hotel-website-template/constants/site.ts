/**
 * Site configuration — edit this file when setting up a new hotel, resort, or real estate project.
 * All UI-facing brand, contact, SEO, theme, and copy values live here.
 */

export const SITE = {
  id: "chanakya-resort",

  brand: {
    name: "Chanakya Resort",
    shortName: "Chanakya",
    tagline: "Where Nature Meets Refined Comfort",
    developerName: "Chanakya Resort",
    channelPartner: "Chanakya Hospitality Pvt. Ltd.",
    copyright: "Chanakya Resort. All Rights Reserved.",
    managedBy: "Managed by Chanakya Hospitality.",
  },

  domain: {
    baseUrl: "https://chanakyaresort.com",
    wwwHost: "www.chanakyaresort.com",
  },

  contact: {
    phone: "9876543210",
    phoneDisplay: "+91 98765 43210",
    countryCode: "91",
    email: "reservations@chanakyaresort.com",
    address: {
      locality: "Gaya",
      region: "Bihar",
      country: "IN",
      full: "KHATA No.- 2, KHESARA No.- 6, BHAG VARTMAN- 6, Sadar Hospital, Anchal Sadar Dhansir, Gaya, Bihar, India",
    },
    templeDistance: "12.1 km drive to Mahabodhi Temple",
  },

  legal: {
    agentRera: "",
    privacyPolicyPath: "/privacy-policy",
    termsPath: "/terms-and-conditions",
    consentText:
      "I authorize Chanakya Hospitality Pvt. Ltd. and its representatives to Call, SMS, Email or WhatsApp me about its products and benefits. This consent overrides any registration for DNC/NDNC.",
    shortConsentText:
      "I authorize company representatives to Call, SMS, Email or WhatsApp me about its products and offers. This consent overrides any registration for DNC/NDNC.",
    disclaimer: [
      "Disclaimer: The information provided on this website is for informational purposes only and does not constitute an offer or contract. All renderings, specifications, layouts, dimensions, pricing, and project highlights are representative and subject to change without prior notice.",
      "Images, amenities, and availability are subject to change. Please contact our reservations team for the latest details and confirmed pricing.",
    ],
  },

  seo: {
    defaultTitle: "Chanakya Resort | Hotel & Luxury Rooms in Gaya, Bihar",
    defaultDescription:
      "Discover Chanakya Resort — a serene premium retreat in Gaya near Sadar Hospital and 12.1 km from Mahabodhi Temple. Offering Deluxe AC rooms, Family suites, and exceptional service.",
    keywords:
      "Chanakya Resort Gaya, hotel in Gaya, hotel near Mahabodhi Temple, resort booking Gaya, family room Gaya, Bodhgaya hotel, deluxe room Gaya",
    priceRange: "₹2,100 - ₹6,375 per night",
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
    headline: "Premium Rooms at Chanakya Resort",
    subheadline:
      "Unwind in Gaya with our modern, fully-equipped rooms and suites located near Mahabodhi Temple. Starting from ₹2,100* per night. Your perfect stay awaits.",
    startingPrice: "₹2,100*",
    features: [
      { icon: "map", label: "Central Gaya Location" },
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
      { label: "Deluxe AC Rooms", enquiryLabel: "Deluxe AC Rooms Enquiry" },
      { label: "Twin Deluxe Rooms", enquiryLabel: "Twin Deluxe Rooms Enquiry" },
      { label: "Standard Rooms", enquiryLabel: "Standard Rooms Enquiry" },
      { label: "Family Deluxe Suites", enquiryLabel: "Family Deluxe Suites Enquiry" },
      { label: "Events & Dining", enquiryLabel: "Events & Dining Enquiry" },
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
    title: "Discover Rooms & Suites at Chanakya Resort",
    tabs: {
      all: "All Rooms",
      apartments: "Deluxe & Suites",
      plots: "Standard Rooms",
    },
  },

  promoBanner: {
    imageUrl: "",
    sec1Title: "Deluxe AC Rooms",
    sec1Sub: "Starting At ₹2,100*",
    sec2Title: "Sadar Hospital, Gaya",
    sec2Sub: "12.1 km to Mahabodhi Temple",
    sec3Title: "Premium Comfort",
    sec3Sub: "Free Wi-Fi & Services",
    sec4Title: "Best Price Guarantee",
    sec4Sub: "Book Direct & Save",
  },

  about: {
    eyebrow: "Our Story",
    title: "About Chanakya Resort",
    paragraphs: [
      "Chanakya Resort is a sanctuary where convenience meets exceptional hospitality. Located in the heart of Gaya, Bihar, near Sadar Hospital and a short 12.1 km drive from the world-famous Mahabodhi Temple in Bodhgaya, our hotel offers beautifully designed room types and modern amenities to ensure a comfortable stay.",
      "From deluxe AC options with premium bathrooms to spacious family suites, Chanakya Resort provides the perfect resting place for pilgrims, tourists, and business guests alike. We combine modern amenities with warm, dedicated service to make your stay memorable.",
    ],
    callLabel: "Talk to Reservations",
  },

  enquiry: {
    modalTitle: "Chanakya Resort",
    modalSubtitle: "Register Here And Avail The Best Benefits!!",
    formTitle: "Get a Call Back from Our Expert:",
    successMessage:
      "Thank you for your interest. A representative will contact you shortly on your mobile number.",
    aboutSuccessMessage:
      "We have received your enquiry. An expert will reach out to you within 24 hours.",
  },

  admin: {
    displayName: "Chanakya Resort",
    portalTitle: "Chanakya Admin Portal",
    portalSubtitle: "Enter administrator credentials to manage listings.",
    defaultUserName: "Chanakya Admin",
    defaultUserEmail: "admin@chanakyaresort.com",
    leadsExportPrefix: "chanakya_leads",
    projectForm: {
      addTitle: "Add New Listing",
      editTitle: "Edit Listing",
      namePlaceholder: "e.g. Garden View Suite",
      reraPlaceholder: "e.g. Registration / License ID",
    },
  },

  footer: {
    reraLabel: "License",
    reraFallbacks: [] as { name: string; rera: string }[],
  },
} as const;

/** Tel link for click-to-call */
export function getTelLink(phone = SITE.contact.phone) {
  return `tel:+${SITE.contact.countryCode}${phone}`;
}

/** WhatsApp link */
export function getWhatsAppLink(phone = SITE.contact.phone) {
  return `https://wa.me/${SITE.contact.countryCode}${phone}`;
}

/** Full URL helper */
export function getSiteUrl(path = "") {
  const base = SITE.domain.baseUrl.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${base}${normalized}`;
}
