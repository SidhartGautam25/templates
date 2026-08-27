import Script from "next/script";

import { SITE } from "@/constants";
import {
  getThemeModeInitScript,
  THEME_MODE_INIT_SCRIPT_ID,
  THEME_MODE_STORAGE_KEY,
  type ThemeAppearance,
} from "@/lib/theme/mode-toggle";

/**
 * FOUC-safe theme init — mount once in root layout when theme-modes is installed.
 * Requires suppressHydrationWarning on <html> and <body> (see module installer).
 */
export default function ThemeModeInit() {
  const siteTheme = SITE.theme as { appearance?: ThemeAppearance };
  const siteDefault = siteTheme.appearance ?? "system";

  return (
    <Script id={THEME_MODE_INIT_SCRIPT_ID} strategy="beforeInteractive">
      {getThemeModeInitScript(THEME_MODE_STORAGE_KEY, siteDefault)}
    </Script>
  );
}
