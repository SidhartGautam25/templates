import type { AdminTabDefinition } from "@/lib/admin/types";
import { Users, Layers, Sliders, Award, Palette } from "lucide-react";
import LeadsPanel from "./panels/LeadsPanel";
import ProjectsPanel from "./panels/ProjectsPanel";
import PromoBannerForm from "./components/PromoBannerForm";
import LaunchLogoForm from "./components/LaunchLogoForm";
import ThemeEditor from "./components/ThemeEditor";

export function getAdminTabs(): AdminTabDefinition[] {
  return [
    { id: "leads", label: "Customer Leads", icon: Users, Panel: LeadsPanel },
    { id: "projects", label: "Projects", icon: Layers, Panel: ProjectsPanel },
    { id: "theme", label: "Theme & Colors", icon: Palette, Panel: ThemeEditor },
    { id: "banner", label: "Promo Settings", icon: Sliders, Panel: PromoBannerForm },
    { id: "logo", label: "Launch Logo", icon: Award, Panel: LaunchLogoForm },
  ];
}
