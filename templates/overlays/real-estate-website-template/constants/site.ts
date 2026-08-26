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
      locality: "Lonavala",
      region: "MH",
      country: "IN",
      full: "Lonavala, Maharashtra, India",
    },
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
    defaultTitle: "Chanakya Resort | Luxury Stay & Experiences in Lonavala",
    defaultDescription:
      "Discover Chanakya Resort — a serene luxury retreat in Lonavala with premium suites, private villas, spa experiences, and curated dining. Book your escape today.",
    keywords:
      "Chanakya Resort, luxury resort Lonavala, hill station resort, weekend getaway Maharashtra, resort booking, spa resort, family resort, honeymoon resort Lonavala",
    priceRange: "₹8,000 - ₹45,000 per night",
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
    headline: "Luxury Retreat at Chanakya Resort",
    subheadline:
      "Unwind in nature's embrace with premium suites, private villas, and world-class amenities. Starting from ₹8,000* per night. Your perfect getaway awaits.",
    startingPrice: "₹8,000*",
    features: [
      { icon: "map", label: "Scenic Location" },
      { icon: "sparkles", label: "Curated Experiences" },
      { icon: "shield", label: "Trusted Hospitality" },
      { icon: "tag", label: "Seasonal Offers" },
    ],
    ctaButtons: [
      { label: "Book Your Stay", enquiryLabel: "Book Your Stay" },
      { label: "View Packages", enquiryLabel: "View Packages" },
      { label: "Download Brochure", enquiryLabel: "Download Brochure" },
    ],
    locationsTitle: "Explore Our Signature Experiences",
    locations: [
      { label: "Luxury Suites", enquiryLabel: "Luxury Suites Enquiry" },
      { label: "Private Villas", enquiryLabel: "Private Villas Enquiry" },
      { label: "Spa & Wellness", enquiryLabel: "Spa & Wellness Enquiry" },
      { label: "Fine Dining", enquiryLabel: "Fine Dining Enquiry" },
      { label: "Events & Weddings", enquiryLabel: "Events & Weddings Enquiry" },
    ],
  },

  navigation: {
    home: "Home",
    projects: "Our Offerings",
    contact: "Contact Us",
    backToHome: "Back to Home",
  },

  projectGrid: {
    eyebrow: "Our Offerings",
    title: "Discover Experiences at Chanakya Resort",
    tabs: {
      all: "All Offerings",
      apartments: "Luxury Suites",
      plots: "Private Villas",
    },
  },

  promoBanner: {
    imageUrl: "",
    sec1Title: "Premium Suites & Villas",
    sec1Sub: "Starting At ₹8,000*",
    sec2Title: "Nestled In Nature",
    sec2Sub: "Lonavala Hills",
    sec3Title: "Curated For You",
    sec3Sub: "Wellness & Dining",
    sec4Title: "Limited Season",
    sec4Sub: "Special Packages",
  },

  about: {
    eyebrow: "Our Story",
    title: "About Chanakya Resort",
    paragraphs: [
      "Chanakya Resort is a sanctuary where lush landscapes meet refined hospitality. Nestled in the serene hills of Lonavala, our retreat offers thoughtfully designed accommodations, immersive wellness experiences, and warm service that makes every guest feel at home.",
      "From intimate couple getaways to family celebrations and corporate retreats, Chanakya Resort blends modern comfort with the timeless charm of the Western Ghats — creating memories that linger long after you leave.",
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
