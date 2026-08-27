/** Seed content when the database has no agency rows yet. */
export const DEFAULT_AGENCY_EXPERTISE = [
  {
    title: "Full-Stack Web Dev",
    description: "Robust, scalable architectures using Next.js and Node.",
    iconKey: "code",
  },
  {
    title: "UI/UX Design",
    description: "Pixel-perfect interfaces with modern design systems.",
    iconKey: "palette",
  },
  {
    title: "Cloud & DevOps",
    description: "Reliable deployments on AWS, Docker, and CI pipelines.",
    iconKey: "cloud",
  },
  {
    title: "Mobile Apps",
    description: "Cross-platform experiences with React Native.",
    iconKey: "smartphone",
  },
] as const;

export const DEFAULT_AGENCY_TEAM = [
  { name: "Sidharth G", role: "Lead Engineer & Founder", avatarColor: "blue" },
  { name: "Alex Rivera", role: "UX/UI Designer", avatarColor: "purple" },
  { name: "Sarah Chen", role: "Cloud Architect", avatarColor: "cyan" },
] as const;

export const DEFAULT_AGENCY_WORK = [
  {
    clientName: "snapbharat.com",
    websiteUrl: "https://snapbharat.com",
    category: "Real Estate Portal",
    review: "Delivered a fast, modern listing platform on schedule.",
    gradient: "orange",
  },
  {
    clientName: "tempjs.dev",
    websiteUrl: "https://github.com/SidhartGautam25/templates",
    category: "Digital Platform",
    review: "Template system that scaled our client onboarding.",
    gradient: "purple",
  },
  {
    clientName: "boutiquehotel.in",
    websiteUrl: "https://example.com",
    category: "Hospitality",
    review: "Beautiful brand site with admin CMS and lead capture.",
    gradient: "rose",
  },
  {
    clientName: "propertylane.com",
    websiteUrl: "https://example.com",
    category: "Real Estate",
    review: "Property search and enquiry flows built end-to-end.",
    gradient: "blue",
  },
] as const;
