/**
 * Default site configuration — copied into each template and customized per client.
 * packages/core uses this stub so next.config.ts and shared modules typecheck.
 */
export const SITE = {
  id: "demo-site",

  brand: {
    name: "Demo Client Site",
    shortName: "Demo",
    tagline: "Your tagline here",
    developerName: "Demo Client Site",
    channelPartner: "Demo Partner",
    copyright: "Demo Client Site. All Rights Reserved.",
    managedBy: "Managed by Demo Client Site.",
  },

  domain: {
    baseUrl: "https://example.com",
    wwwHost: "www.example.com",
  },

  contact: {
    phone: "9876543210",
    phoneDisplay: "+91 98765 43210",
    countryCode: "91",
    email: "hello@example.com",
    address: {
      locality: "City",
      region: "State",
      country: "IN",
      full: "City, State, India",
    },
  },

  legal: {
    agentRera: "",
    privacyPolicyPath: "/privacy-policy",
    termsPath: "/terms-and-conditions",
    consentText: "I authorize representatives to contact me about offers and services.",
    shortConsentText: "I authorize representatives to contact me about offers.",
    disclaimer: ["Details are indicative and subject to change."],
  },

  seo: {
    defaultTitle: "Demo Client Site",
    defaultDescription: "Welcome to our website.",
    keywords: "demo, website",
    priceRange: "",
    locale: "en_IN",
    schemaType: "Organization" as const,
    sameAs: [] as string[],
    /** Optional site search path for WebSite SearchAction JSON-LD (e.g. "/search") */
    searchPath: "",
    openGraph: {
      type: "website" as const,
      image: "",
    },
    sitemap: {
      staticRoutes: [] as {
        path: string;
        changeFrequency?: "daily" | "weekly" | "monthly" | "yearly";
        priority?: number;
      }[],
    },
    robots: {
      allow: ["/"] as string[],
      disallow: [] as string[],
    },
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
    eyebrow: "WELCOME",
    headline: "Your headline here",
    subheadline: "Your subheadline here.",
    startingPrice: "",
    features: [] as { icon: string; label: string }[],
    ctaButtons: [] as { label: string; enquiryLabel: string }[],
    locationsTitle: "",
    locations: [] as { label: string; enquiryLabel: string }[],
    carouselImages: [] as string[],
    slideDuration: 5000,
  },

  navigation: {
    home: "Home",
    projects: "Projects",
    contact: "Contact Us",
    backToHome: "Back to Home",
  },

  projectGrid: {
    eyebrow: "Featured",
    title: "Our Work",
    tabs: { all: "All", apartments: "Category A", plots: "Category B" },
  },

  promoBanner: {
    imageUrl: "",
    sec1Title: "",
    sec1Sub: "",
    sec2Title: "",
    sec2Sub: "",
    sec3Title: "",
    sec3Sub: "",
    sec4Title: "",
    sec4Sub: "",
  },

  about: {
    eyebrow: "About",
    title: "About Us",
    paragraphs: ["Add your story here."],
    callLabel: "Contact Us",
  },

  enquiry: {
    modalTitle: "Demo Client Site",
    modalSubtitle: "We will get back to you shortly.",
    formTitle: "Request a callback:",
    successMessage: "Thank you! We will contact you soon.",
    aboutSuccessMessage: "We received your enquiry.",
    selectionLabel: "Interest",
    selectionOptions: [] as { value: string; label: string }[],
    /** Optional API path returning { success, data: [{ name }] } for enquiry dropdown */
    listingsApiPath: "",
  },

  admin: {
    displayName: "Demo Admin",
    portalTitle: "Admin Portal",
    portalSubtitle: "Sign in to manage content and leads.",
    defaultUserName: "Admin",
    defaultUserEmail: "admin@example.com",
    leadsExportPrefix: "demo_leads",
    projectForm: {
      addTitle: "Add Item",
      editTitle: "Edit Item",
      namePlaceholder: "Name",
      reraPlaceholder: "Reference ID",
    },
  },

  footer: {
    reraLabel: "License",
    reraFallbacks: [] as { name: string; rera: string }[],
    /** Optional API returning { success, data: [{ name, rera, reraId, reraLabel, reraQrImage }] } */
    listingsApiPath: "",
  },

  gallery: {
    sectionEyebrow: "Gallery",
    sectionTitle: "Photo Gallery",
    sectionSubtitle: "Explore our space.",
    pageTitle: "Gallery",
    pageSubtitle: "Browse our collection of images.",
    viewAllLabel: "View full gallery",
    emptyMessage: "Gallery images will appear here once added in admin.",
  },

  reviews: {
    sectionEyebrow: "Testimonials",
    sectionTitle: "What people say",
    sectionSubtitle: "Reviews from our guests and clients.",
    emptyMessage: "Reviews will appear here once added in admin.",
  },

  blog: {
    sectionEyebrow: "Blog",
    sectionTitle: "Articles & insights",
    sectionSubtitle: "News, guides, and updates from our team.",
    pageTitle: "Blog",
    pageSubtitle: "Read our latest articles and guides.",
    backToBlog: "Back to blog",
    viewAllLabel: "View all articles",
    emptyMessage: "Articles will appear here once published in admin.",
    homepageLimit: 3,
  },

  privacyPage: {
    title: "Privacy Policy",
    lastUpdated: "",
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "This privacy policy explains how we collect, use, and protect your personal information when you use our website.",
        ],
      },
      {
        heading: "Information we collect",
        paragraphs: [
          "We may collect your name, phone number, email address, and any message you submit through enquiry forms.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          "For privacy-related questions, contact us using the details on this website.",
        ],
      },
    ],
  },

  termsPage: {
    title: "Terms and Conditions",
    lastUpdated: "",
    sections: [
      {
        heading: "Use of website",
        paragraphs: [
          "By using this website you agree to these terms. Content is provided for general information and may change without notice.",
        ],
      },
      {
        heading: "Limitation of liability",
        paragraphs: [
          "We are not liable for indirect or consequential damages arising from use of this website.",
        ],
      },
    ],
  },

  /** Enabled by optional core modules (pnpm new-template --modules). */
  features: {
    enquiryModal: false,
    footer: false,
    heroSimple: false,
    seo: false,
    gallery: false,
    reviews: false,
    legalPages: false,
    blogCompose: false,
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
