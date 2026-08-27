import type { AdminTabDefinition } from "@/lib/admin/types";
import { Users, Layers, Sliders, Award } from "lucide-react";
import LeadsPanel from "./panels/LeadsPanel";
import ProjectsPanel from "./panels/ProjectsPanel";
import PromoBannerForm from "./components/PromoBannerForm";
import LaunchLogoForm from "./components/LaunchLogoForm";

export function getAdminTabs(): AdminTabDefinition[] {
  return [
    { id: "leads", label: "Customer Leads", icon: Users, Panel: LeadsPanel },
    { id: "projects", label: "Projects", icon: Layers, Panel: ProjectsPanel },
    { id: "banner", label: "Promo Settings", icon: Sliders, Panel: PromoBannerForm },
    { id: "logo", label: "Launch Logo", icon: Award, Panel: LaunchLogoForm },
  ];
}
