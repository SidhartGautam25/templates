import { SITE } from "./site";

export interface Project {
  id: string;
  name: string;
  location: string;
  typology: string;
  price: string;
  image: string;
  possession?: string;
  tag1?: string;
  tag2?: string;
  highlights: string[];
  rera: string;
  category: "plots" | "apartments" | "all";
  isNewLaunch?: boolean;
  sortOrder?: number;
}

const defaultImage = SITE.assets.defaultProjectImage;

export const defaultProjects: Project[] = [
  {
    id: "baner-skyline",
    name: "Baner Skyline Residences",
    location: "Baner, Pune",
    typology: "2 & 3 BHK Apartments",
    price: "₹ 85 Lakh* onwards",
    image: defaultImage,
    tag1: "RERA Registered",
    tag2: "Ready 2027",
    highlights: ["Clubhouse", "Rooftop garden", "Covered parking"],
    rera: "P52100011234",
    category: "apartments",
    isNewLaunch: true,
    sortOrder: 1,
  },
  {
    id: "hinjewadi-greens",
    name: "Hinjewadi Greens",
    location: "Hinjewadi, Pune",
    typology: "2 BHK Smart Homes",
    price: "₹ 72 Lakh* onwards",
    image: defaultImage,
    tag1: "Near IT Park",
    highlights: ["Gated community", "24/7 security", "Power backup"],
    rera: "P52100015678",
    category: "apartments",
    sortOrder: 2,
  },
  {
    id: "kharadi-plots",
    name: "Kharadi Premium Plots",
    location: "Kharadi, Pune",
    typology: "Residential Plots",
    price: "₹ 45 Lakh* onwards",
    image: defaultImage,
    tag1: "Clear Title",
    highlights: ["Corner plots available", "Drainage & roads ready"],
    rera: "P52100019876",
    category: "plots",
    sortOrder: 3,
  },
  {
    id: "wakad-heights",
    name: "Wakad Heights",
    location: "Wakad, Pune",
    typology: "3 BHK + Study",
    price: "₹ 1.2 Cr* onwards",
    image: defaultImage,
    tag1: "Premium Finishes",
    highlights: ["Sky lounge", "Kids play zone", "EV charging"],
    rera: "P52100014321",
    category: "apartments",
    sortOrder: 4,
  },
];
