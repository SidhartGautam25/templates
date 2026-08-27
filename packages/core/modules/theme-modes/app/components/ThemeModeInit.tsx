import Script from "next/script";

import { SITE } from "@/constants";
import { getThemeModeInitScript, THEME_MODE_STORAGE_KEY, type ThemeAppearance } from "@/lib/theme/mode-toggle";

/** FOUC-safe theme init — mount once in app/layout.tsx when theme-modes is installed. */
export default function ThemeModeInit() {
  const siteTheme = SITE.theme as { appearance?: ThemeAppearance };
  const siteDefault = siteTheme.appearance ?? "system";

  return (
    <Script id="tempjs-theme-mode-init" strategy="beforeInteractive">
      {getThemeModeInitScript(THEME_MODE_STORAGE_KEY, siteDefault)}
    </Script>
  );
}
