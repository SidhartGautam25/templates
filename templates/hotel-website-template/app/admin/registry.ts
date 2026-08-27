import { SITE } from "@/constants";
import type { AdminTabDefinition } from "@/lib/admin/types";
import {
  Users,
  Layers,
  Sliders,
  Award,
  Sparkles,
  MessageSquare,
  Images,
  Palette,
} from "lucide-react";
import LeadsPanel from "./panels/LeadsPanel";
import RoomTypesPanel from "./panels/RoomTypesPanel";
import PromoBannerForm from "./components/PromoBannerForm";
import LaunchLogoForm from "./components/LaunchLogoForm";
import ThemeEditor from "./components/ThemeEditor";
import FacilitiesList from "./components/FacilitiesList";
import GalleryList from "./components/GalleryList";
import ReviewsList from "./components/ReviewsList";

/** Hotel admin tab registry — core settings plus vertical and optional module tabs. */
export function getAdminTabs(): AdminTabDefinition[] {
  const tabs: AdminTabDefinition[] = [
    { id: "leads", label: "Customer Leads", icon: Users, Panel: LeadsPanel },
    { id: "room-types", label: "Room Types", icon: Layers, Panel: RoomTypesPanel },
    { id: "theme", label: "Theme & Colors", icon: Palette, Panel: ThemeEditor },
    { id: "banner", label: "Promo Settings", icon: Sliders, Panel: PromoBannerForm },
    { id: "logo", label: "Launch Logo", icon: Award, Panel: LaunchLogoForm },
    { id: "facilities", label: "Resort Facilities", icon: Sparkles, Panel: FacilitiesList },
  ];

  if (SITE.features.gallery) {
    tabs.push({
      id: "gallery",
      label: "Photo Gallery",
      icon: Images,
      Panel: GalleryList,
      featureFlag: "gallery",
    });
  }

  if (SITE.features.reviews) {
    tabs.push({
      id: "reviews",
      label: "Guest Reviews",
      icon: MessageSquare,
      Panel: ReviewsList,
      featureFlag: "reviews",
    });
  }

  return tabs;
}
