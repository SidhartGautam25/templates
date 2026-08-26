/**
 * Site configuration — edit for each real estate client.
 */

export const SITE = {
  id: "greenfield-properties",

  brand: {
    name: "Greenfield Properties",
    shortName: "Greenfield",
    tagline: "Homes & Investments You Can Trust",
    developerName: "Greenfield Properties",
    channelPartner: "Greenfield Realty Partners",
    copyright: "Greenfield Properties. All Rights Reserved.",
    managedBy: "Managed by Greenfield Realty.",
  },

  domain: {
    baseUrl: "https://greenfieldproperties.example.com",
    wwwHost: "www.greenfieldproperties.example.com",
  },

  contact: {
    phone: "9123456780",
    phoneDisplay: "+91 91234 56780",
    countryCode: "91",
    email: "hello@greenfieldproperties.example.com",
    address: {
      locality: "Baner",
      region: "Maharashtra",
      country: "IN",
      full: "Baner Road, Pune, Maharashtra 411045, India",
    },
  },

  legal: {
    agentRera: "A52100012345",
    privacyPolicyPath: "/privacy-policy",
    termsPath: "/terms-and-conditions",
    consentText:
      "I authorize Greenfield Realty Partners to contact me via call, SMS, email, or WhatsApp about properties and offers.",
    shortConsentText:
      "I authorize representatives to contact me about property listings and offers.",
    disclaimer: [
      "Listing details are indicative and subject to change without notice.",
      "Prices, availability, and specifications must be confirmed with our sales team.",
    ],
  },

  seo: {
    defaultTitle: "Greenfield Properties | Premium Homes in Pune",
    defaultDescription:
      "Explore curated apartments and plotted developments in Pune with Greenfield Properties. RERA-registered listings, site visits, and expert guidance.",
    keywords:
      "Pune real estate, apartments Baner, new projects Pune, RERA properties, Greenfield Properties",
    priceRange: "₹45 Lakh - ₹2.5 Cr",
    locale: "en_IN",
    schemaType: "RealEstateAgent" as const,
  },

  theme: {
    colors: {
      primary: "#1e40af",
      primaryHover: "#1e3a8a",
      accent: "#38bdf8",
      accentDark: "#0284c7",
      accentLight: "#e0f2fe",
      textMain: "#0f172a",
      textMuted: "#64748b",
      bgMain: "#f8fafc",
      bgLight: "#f1f5f9",
      bgCard: "#ffffff",
      footerBg: "#e2e8f0",
      ctaPrimary: "#1e40af",
      ctaPrimaryHover: "#1e3a8a",
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
    eyebrow: "CURATED LIVING. TRANSPARENT DEALS.",
    headline: "Find Your Next Home in Pune",
    subheadline:
      "Browse RERA-registered apartments and plotted developments with virtual tours, site visit scheduling, and expert sales support.",
    startingPrice: "₹45 Lakh*",
    features: [
      { icon: "map", label: "Prime Pune Locations" },
      { icon: "sparkles", label: "RERA Verified" },
      { icon: "shield", label: "Trusted Developer Partners" },
      { icon: "tag", label: "Flexible Payment Plans" },
    ],
    ctaButtons: [
      { label: "View Listings", enquiryLabel: "View Listings" },
      { label: "Schedule Site Visit", enquiryLabel: "Schedule Site Visit" },
      { label: "Download Brochure", enquiryLabel: "Download Brochure" },
    ],
    locationsTitle: "Popular Micro-Markets",
    locations: [
      { label: "Baner", enquiryLabel: "Baner Enquiry" },
      { label: "Hinjewadi", enquiryLabel: "Hinjewadi Enquiry" },
      { label: "Kharadi", enquiryLabel: "Kharadi Enquiry" },
      { label: "Wakad", enquiryLabel: "Wakad Enquiry" },
    ],
  },

  navigation: {
    home: "Home",
    projects: "Properties",
    contact: "Contact Us",
    backToHome: "Back to Home",
  },

  projectGrid: {
    eyebrow: "Featured Listings",
    title: "Properties by Greenfield",
    tabs: {
      all: "All Properties",
      apartments: "Apartments",
      plots: "Plots & Villas",
    },
  },

  promoBanner: {
    imageUrl: "",
    sec1Title: "Baner Skyline",
    sec1Sub: "2 & 3 BHK from ₹85 Lakh*",
    sec2Title: "RERA Registered",
    sec2Sub: "Transparent documentation",
    sec3Title: "Site Visits",
    sec3Sub: "Book in 24 hours",
    sec4Title: "Home Loan Assistance",
    sec4Sub: "Partner banks available",
  },

  about: {
    eyebrow: "Who We Are",
    title: "About Greenfield Properties",
    paragraphs: [
      "Greenfield Properties helps families and investors discover residential projects across Pune with clarity and confidence. Every listing on this site is managed through our admin portal with up-to-date pricing, media, and lead capture.",
      "From first enquiry to site visit, our team focuses on responsive communication and accurate project information.",
    ],
    callLabel: "Talk to Sales",
  },

  enquiry: {
    modalTitle: "Greenfield Properties",
    modalSubtitle: "Share your requirements — we'll match you with the right project.",
    formTitle: "Request a callback:",
    successMessage: "Thank you! A property advisor will contact you shortly.",
    aboutSuccessMessage: "We received your enquiry. Our team will respond within one business day.",
  },

  admin: {
    displayName: "Greenfield Admin",
    portalTitle: "Greenfield Admin Portal",
    portalSubtitle: "Manage property listings, leads, and promo content.",
    defaultUserName: "Sales Admin",
    defaultUserEmail: "admin@greenfieldproperties.example.com",
    leadsExportPrefix: "greenfield_leads",
    projectForm: {
      addTitle: "Add Property",
      editTitle: "Edit Property",
      namePlaceholder: "e.g. Baner Skyline Residences",
      reraPlaceholder: "RERA registration number",
    },
  },

  footer: {
    reraLabel: "RERA",
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
