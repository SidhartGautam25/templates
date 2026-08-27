import { NextRequest, NextResponse } from "next/server";
import { join } from "node:path";

import { auth } from "@/auth";
import { SITE } from "@/constants";
import { deriveDarkColorsFromLight } from "@/lib/theme/dark-colors";
import type { ThemeAppearance } from "@/lib/theme/mode-toggle";
import { THEME_PRESETS } from "@/lib/theme/presets";
import {
  applyThemeToProjectFiles,
  buildExportSnippets,
  readThemeAppearanceFromSite,
  readThemeDarkFromProject,
  readThemeFromProject,
} from "@/lib/theme/patch-files";
import { THEME_COLOR_FIELDS, type ThemeColors } from "@/lib/theme/types";

export const dynamic = "force-dynamic";

const projectRoot = process.cwd();
const themeModesEnabled = Boolean(SITE.features.themeModes);

function isValidHex(color: string) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color.trim());
}

function sanitizeColors(input: Record<string, string>, fallback: ThemeColors): ThemeColors {
  const result = { ...fallback };
  for (const field of THEME_COLOR_FIELDS) {
    const value = input[field.key];
    if (typeof value === "string" && isValidHex(value)) {
      result[field.key] = value.trim();
    }
  }
  return result;
}

function sanitizeAppearance(value: unknown): ThemeAppearance | undefined {
  if (value === "light" || value === "dark" || value === "system") return value;
  return undefined;
}

export async function GET() {
  try {
    const fallback = { ...SITE.theme.colors } as ThemeColors;
    const colors = readThemeFromProject(projectRoot, fallback);
    const colorsDark = themeModesEnabled
      ? readThemeDarkFromProject(projectRoot, colors, deriveDarkColorsFromLight(colors))
      : undefined;
    const appearance = themeModesEnabled
      ? readThemeAppearanceFromSite(projectRoot) ?? "system"
      : undefined;
    const exportSnippets = buildExportSnippets(colors, {
      colorsDark,
      appearance,
    });

    return NextResponse.json({
      success: true,
      data: {
        colors,
        colorsDark,
        appearance,
        themeModes: themeModesEnabled,
        presets: THEME_PRESETS.map((p) => ({ id: p.id, name: p.name })),
        export: exportSnippets,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to read theme";
    console.error("GET /api/theme error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const fallback = { ...SITE.theme.colors } as ThemeColors;
    const colors = sanitizeColors(body?.colors ?? {}, fallback);

    let colorsDark: ThemeColors | undefined;
    let appearance: ThemeAppearance | undefined;

    if (themeModesEnabled) {
      const darkFallback = deriveDarkColorsFromLight(colors);
      colorsDark = sanitizeColors(body?.colorsDark ?? {}, darkFallback);
      appearance = sanitizeAppearance(body?.appearance) ?? readThemeAppearanceFromSite(projectRoot) ?? "system";
    }

    applyThemeToProjectFiles(projectRoot, colors, {
      colorsDark,
      appearance,
    });

    const exportSnippets = buildExportSnippets(colors, {
      colorsDark,
      appearance,
    });

    return NextResponse.json({
      success: true,
      data: {
        colors,
        colorsDark,
        appearance,
        themeModes: themeModesEnabled,
        export: exportSnippets,
        message:
          "Theme saved to constants/site.ts and app/globals.css. Restart dev server if site.ts changes do not hot-reload.",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save theme";
    console.error("POST /api/theme error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
