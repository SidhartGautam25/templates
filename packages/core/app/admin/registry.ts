import type { AdminTabDefinition } from "@/lib/admin/types";
import { Users, Sliders, Award } from "lucide-react";
import LeadsPanel from "./panels/LeadsPanel";
import PromoBannerForm from "./components/PromoBannerForm";
import LaunchLogoForm from "./components/LaunchLogoForm";

/**
 * Base admin tabs (always available). Optional module tabs are merged in
 * app/admin/registry.ts when gallery/reviews modules are installed.
 */
export function getBaseAdminTabs(): AdminTabDefinition[] {
  return [
    { id: "leads", label: "Customer Leads", icon: Users, Panel: LeadsPanel },
    { id: "banner", label: "Promo Settings", icon: Sliders, Panel: PromoBannerForm },
    { id: "logo", label: "Launch Logo", icon: Award, Panel: LaunchLogoForm },
  ];
}

/** Default registry for scaffold templates without optional CMS modules. */
export function getAdminTabs(): AdminTabDefinition[] {
  return getBaseAdminTabs();
}
