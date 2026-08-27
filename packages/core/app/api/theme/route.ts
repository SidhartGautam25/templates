import { NextRequest, NextResponse } from "next/server";
import { join } from "node:path";

import { auth } from "@/auth";
import { SITE } from "@/constants";
import { THEME_PRESETS } from "@/lib/theme/presets";
import {
  applyThemeToProjectFiles,
  buildExportSnippets,
  readThemeFromProject,
} from "@/lib/theme/patch-files";
import { THEME_COLOR_FIELDS, type ThemeColors } from "@/lib/theme/types";

export const dynamic = "force-dynamic";

const projectRoot = process.cwd();

function isValidHex(color: string) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color.trim());
}

function sanitizeColors(input: Record<string, string>, fallback: ThemeColors): ThemeColors | null {
  const result = { ...fallback };
  for (const field of THEME_COLOR_FIELDS) {
    const value = input[field.key];
    if (typeof value === "string" && isValidHex(value)) {
      result[field.key] = value.trim();
    }
  }
  return result;
}

export async function GET() {
  try {
    const fallback = { ...SITE.theme.colors } as ThemeColors;
    const colors = readThemeFromProject(projectRoot, fallback);
    const exportSnippets = buildExportSnippets(colors);

    return NextResponse.json({
      success: true,
      data: {
        colors,
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
    if (!colors) {
      return NextResponse.json({ success: false, error: "Invalid theme colors" }, { status: 400 });
    }

    applyThemeToProjectFiles(projectRoot, colors);
    const exportSnippets = buildExportSnippets(colors);

    return NextResponse.json({
      success: true,
      data: {
        colors,
        export: exportSnippets,
        message: "Theme saved to constants/site.ts and app/globals.css. Restart dev server if site.ts changes do not hot-reload.",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save theme";
    console.error("POST /api/theme error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
