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
    id: "garden-view-suite",
    name: "Garden View Suite",
    location: "Main Wing, Chanakya Resort",
    typology: "Deluxe Suite",
    price: "₹ 8,500* per night",
    image: defaultImage,
    tag1: "Breakfast Included",
    highlights: ["King-size bed", "Private balcony", "Complimentary Wi-Fi"],
    rera: "CRS-GVS-001",
    category: "apartments",
  },
  {
    id: "hilltop-villa",
    name: "Hilltop Private Villa",
    location: "Exclusive Villa Cluster",
    typology: "2 Bedroom Villa",
    price: "₹ 18,000* per night",
    image: defaultImage,
    tag1: "Private Pool Access",
    highlights: ["Butler service", "Outdoor deck", "In-villa dining"],
    rera: "CRS-HPV-002",
    category: "plots",
    isNewLaunch: true,
  },
  {
    id: "wellness-retreat",
    name: "Wellness Retreat Package",
    location: "Spa & Wellness Centre",
    typology: "3 Day Package",
    price: "₹ 24,999* onwards",
    image: defaultImage,
    tag1: "Spa Sessions Included",
    highlights: ["Ayurvedic therapies", "Yoga sessions", "Organic meals"],
    rera: "CRS-WRP-003",
    category: "apartments",
  },
  {
    id: "family-cottage",
    name: "Family Cottage",
    location: "Lakeside Grove",
    typology: "Family Stay",
    price: "₹ 12,500* per night",
    image: defaultImage,
    highlights: ["Sleeps 4 guests", "Kids activity zone", "Lakeside views"],
    rera: "CRS-FC-004",
    category: "plots",
  },
  {
    id: "honeymoon-suite",
    name: "Honeymoon Suite",
    location: "Sunset Wing",
    typology: "Premium Suite",
    price: "₹ 15,000* per night",
    image: defaultImage,
    tag1: "Romantic Setup",
    highlights: ["Candlelight dinner", "Flower decoration", "Late checkout"],
    rera: "CRS-HS-005",
    category: "apartments",
    isNewLaunch: true,
  },
  {
    id: "corporate-retreat",
    name: "Corporate Retreat Package",
    location: "Conference & Events Block",
    typology: "Group Booking",
    price: "Custom Pricing",
    image: defaultImage,
    highlights: ["Conference hall", "Team activities", "Custom catering"],
    rera: "CRS-CRP-006",
    category: "apartments",
  },
];
