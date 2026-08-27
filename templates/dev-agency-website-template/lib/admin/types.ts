import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

/** Tab panel mounted by the unified admin dashboard. */
export type AdminTabPanel = ComponentType;

export interface AdminTabDefinition {
  id: string;
  label: string;
  icon: LucideIcon;
  Panel: AdminTabPanel;
  /** When set, tab is shown only if SITE.features[featureFlag] is true. */
  featureFlag?: string;
}
