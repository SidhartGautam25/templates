/**
 * Dev Agency site configuration — brand, agency sections, and feature flags.
 */
export const SITE = {
  id: "dev-agency",

  brand: {
    name: "Dev Agency",
    shortName: "Dev Agency",
    tagline: "We build modern web products for ambitious teams.",
    developerName: "Dev Agency",
    channelPartner: "",
    copyright: "Dev Agency. All rights reserved.",
    managedBy: "",
  },

  domain: {
    baseUrl: "https://example.com",
    wwwHost: "www.example.com",
  },

  contact: {
    phone: "9876543210",
    phoneDisplay: "+91 98765 43210",
    countryCode: "91",
    email: "hello@devagency.com",
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
    consentText: "I authorize representatives to contact me about services and project inquiries.",
    shortConsentText: "I authorize representatives to contact me.",
    disclaimer: ["Details are indicative and subject to change."],
  },

  seo: {
    defaultTitle: "Dev Agency — Web development studio",
    defaultDescription:
      "Freelance development agency — full-stack web apps, UI/UX, cloud, and featured client work.",
    keywords: "web development, agency, next.js, freelance, studio",
    priceRange: "",
    locale: "en_IN",
    schemaType: "Organization" as const,
    sameAs: [] as string[],
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
      disallow: ["/admin", "/api"] as string[],
    },
  },

  theme: {
    colors: {
      primary: "#8b5cf6",
      primaryHover: "#7c3aed",
      accent: "#38bdf8",
      accentDark: "#0ea5e9",
      accentLight: "#1e293b",
      textMain: "#f1f5f9",
      textMuted: "#94a3b8",
      bgMain: "#020617",
      bgLight: "#0f172a",
      bgCard: "#1e293b",
      footerBg: "#020617",
      ctaPrimary: "#f8fafc",
      ctaPrimaryHover: "#e2e8f0",
    },
  },

  assets: {
    logo: "/logo.svg",
    logoOfficial: "/logo.svg",
    favicon: "/favicon.ico",
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
    contact: "Contact",
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
    modalTitle: "Dev Agency",
    modalSubtitle: "Tell us about your project — we'll get back within one business day.",
    formTitle: "Request a callback:",
    successMessage: "Thank you! We will contact you soon.",
    aboutSuccessMessage: "We received your enquiry.",
    selectionLabel: "Interest",
    selectionOptions: [] as { value: string; label: string }[],
    listingsApiPath: "",
  },

  admin: {
    displayName: "Dev Agency Admin",
    portalTitle: "Admin Portal",
    portalSubtitle: "Manage expertise, team, portfolio, leads, and theme.",
    defaultUserName: "Admin",
    defaultUserEmail: "admin@example.com",
    leadsExportPrefix: "dev_agency_leads",
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
    listingsApiPath: "",
  },

  gallery: {
    sectionEyebrow: "Gallery",
    sectionTitle: "Gallery",
    pageTitle: "Gallery",
    pageDescription: "Project gallery",
  },

  reviews: {
    sectionEyebrow: "Reviews",
    sectionTitle: "What clients say",
    pageTitle: "Reviews",
    pageDescription: "Client reviews",
  },

  blog: {
    sectionEyebrow: "Blog",
    sectionTitle: "Latest articles",
    pageTitle: "Blog",
    pageDescription: "Articles and updates",
    homepageLimit: 3,
  },

  privacyPage: {
    title: "Privacy Policy",
    lastUpdated: "2026",
    sections: [] as { heading: string; paragraphs: string[] }[],
  },

  termsPage: {
    title: "Terms and Conditions",
    lastUpdated: "2026",
    sections: [] as { heading: string; paragraphs: string[] }[],
  },

  agency: {
    hero: {
      eyebrow: "FREELANCE DEV STUDIO",
      headline: "We craft digital products that",
      headlineAccent: "scale with your business",
      subheadline:
        "Full-stack engineering, thoughtful design, and reliable delivery for startups and growing teams.",
    },
    nav: [
      { label: "Expertise", sectionId: "expertise" },
      { label: "Team", sectionId: "team" },
      { label: "Work", sectionId: "work" },
      { label: "Contact", sectionId: "contact" },
    ] as { label: string; sectionId: string }[],
    expertise: {
      eyebrow: "What we do",
      title: "Our",
      titleAccent: "Expertise",
      subtitle: "From architecture to launch — we cover the full product lifecycle.",
    },
    team: {
      title: "About",
      titleAccent: "Our Team",
      paragraphs: [
        "We are a small studio focused on quality over volume. Every project gets senior attention.",
        "We partner with founders and product teams who care about craft, performance, and maintainability.",
      ],
      ctaLabel: "Get to know us",
      ctaSectionId: "contact",
    },
    cta: {
      title: "Ready to build something",
      titleAccent: "amazing?",
      subtitle: "We are currently accepting new freelance projects. Let's discuss your vision.",
      buttonLabel: "Get in touch",
    },
    work: {
      title: "Featured",
      titleAccent: "Work",
      subtitle: "A selection of our latest freelance projects and client success stories.",
    },
    footer: {
      columns: [
        {
          title: "Navigate",
          links: [
            { label: "Expertise", href: "#expertise" },
            { label: "Team", href: "#team" },
            { label: "Work", href: "#work" },
            { label: "Contact", href: "#contact" },
          ],
        },
        {
          title: "Contact",
          links: [] as { label: string; href: string }[],
        },
      ],
    },
  },

  features: {
    enquiryModal: true,
    footer: false,
    heroSimple: false,
    seo: true,
    gallery: false,
    reviews: false,
    legalPages: false,
    blogCompose: false,
    blogSidebar: false,
    themeModes: false,
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
