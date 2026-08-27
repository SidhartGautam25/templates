import { SITE } from "@/constants";
import type { AdminTabDefinition } from "@/lib/admin/types";
import { Users, Sliders, Award, Palette } from "lucide-react";
import LeadsPanel from "./panels/LeadsPanel";
import PromoBannerForm from "./components/PromoBannerForm";
import LaunchLogoForm from "./components/LaunchLogoForm";
import ThemeEditor from "./components/ThemeEditor";
import { Images } from "lucide-react";
import GalleryList from "./components/GalleryList";
import { MessageSquare } from "lucide-react";
import ReviewsList from "./components/ReviewsList";

/** Scaffold admin tabs — leads, theme, promo, logo; gallery/reviews when modules installed. */
export function getAdminTabs(): AdminTabDefinition[] {
  const tabs: AdminTabDefinition[] = [
    { id: "leads", label: "Customer Leads", icon: Users, Panel: LeadsPanel },
    { id: "theme", label: "Theme & Colors", icon: Palette, Panel: ThemeEditor },
    { id: "banner", label: "Promo Settings", icon: Sliders, Panel: PromoBannerForm },
    { id: "logo", label: "Launch Logo", icon: Award, Panel: LaunchLogoForm },
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
      label: "Testimonials",
      icon: MessageSquare,
      Panel: ReviewsList,
      featureFlag: "reviews",
    });
  }

  return tabs;
}
