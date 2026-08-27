import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { storageService } from "@/lib/storage/StorageService";
import { auth } from "@/auth";
import { SITE } from "@/constants";

export const dynamic = "force-dynamic";

const DEFAULT_BANNER = {
  id: "global",
  imageUrl: SITE.promoBanner.imageUrl,
  sec1Title: SITE.promoBanner.sec1Title,
  sec1Sub: SITE.promoBanner.sec1Sub,
  sec2Title: SITE.promoBanner.sec2Title,
  sec2Sub: SITE.promoBanner.sec2Sub,
  sec3Title: SITE.promoBanner.sec3Title,
  sec3Sub: SITE.promoBanner.sec3Sub,
  sec4Title: SITE.promoBanner.sec4Title,
  sec4Sub: SITE.promoBanner.sec4Sub,
  newLaunchLogoUrl: null,
};

export async function GET() {
  try {
    const settings = await prisma.promoBanner.findUnique({
      where: { id: "global" },
    });
    return NextResponse.json({
      success: true,
      data: settings || DEFAULT_BANNER,
    }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/promo-banner error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to fetch banner settings",
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ success: false, error: "Content type must be multipart/form-data" }, { status: 400 });
    }

    // Fetch existing settings first to allow merging/fallback
    const existing = await prisma.promoBanner.findUnique({
      where: { id: "global" },
    });

    const formData = await req.formData();
    
    const sec1Title = formData.has("sec1Title") ? (formData.get("sec1Title") as string) : (existing?.sec1Title || DEFAULT_BANNER.sec1Title);
    const sec1Sub = formData.has("sec1Sub") ? (formData.get("sec1Sub") as string) : (existing?.sec1Sub || DEFAULT_BANNER.sec1Sub);
    const sec2Title = formData.has("sec2Title") ? (formData.get("sec2Title") as string) : (existing?.sec2Title || DEFAULT_BANNER.sec2Title);
    const sec2Sub = formData.has("sec2Sub") ? (formData.get("sec2Sub") as string) : (existing?.sec2Sub || DEFAULT_BANNER.sec2Sub);
    const sec3Title = formData.has("sec3Title") ? (formData.get("sec3Title") as string) : (existing?.sec3Title || DEFAULT_BANNER.sec3Title);
    const sec3Sub = formData.has("sec3Sub") ? (formData.get("sec3Sub") as string) : (existing?.sec3Sub || DEFAULT_BANNER.sec3Sub);
    const sec4Title = formData.has("sec4Title") ? (formData.get("sec4Title") as string) : (existing?.sec4Title || DEFAULT_BANNER.sec4Title);
    const sec4Sub = formData.has("sec4Sub") ? (formData.get("sec4Sub") as string) : (existing?.sec4Sub || DEFAULT_BANNER.sec4Sub);

    const imageFile = formData.get("image") as File | null;
    let imageUrl = existing?.imageUrl || DEFAULT_BANNER.imageUrl;
    const uploadLogs: string[] = [];

    if (imageFile) {
      const result = await storageService.uploadFile(imageFile, "assets");
      imageUrl = result.url;
      if (result.logs) {
        uploadLogs.push(...result.logs);
      }
      // Clean up previous custom image if it exists
      if (existing?.imageUrl && existing.imageUrl.startsWith("/assets/") && existing.imageUrl.includes("-")) {
        await storageService.deleteFile(existing.imageUrl);
      }
    }

    // Launch logo file/reset processing
    const launchLogoFile = formData.get("launchLogo") as File | null;
    const shouldResetLogo = formData.get("resetLaunchLogo") === "true";
    let newLaunchLogoUrl = existing?.newLaunchLogoUrl || null;

    if (shouldResetLogo) {
      if (existing?.newLaunchLogoUrl && existing.newLaunchLogoUrl.startsWith("/assets/") && existing.newLaunchLogoUrl.includes("-")) {
        try {
          await storageService.deleteFile(existing.newLaunchLogoUrl);
        } catch (e) {
          console.warn("Failed to delete old launch logo:", e);
        }
      }
      newLaunchLogoUrl = null;
    } else if (launchLogoFile) {
      const result = await storageService.uploadFile(launchLogoFile, "assets");
      newLaunchLogoUrl = result.url;
      if (result.logs) {
        uploadLogs.push(...result.logs);
      }
      // Clean up previous custom image if it exists
      if (existing?.newLaunchLogoUrl && existing.newLaunchLogoUrl.startsWith("/assets/") && existing.newLaunchLogoUrl.includes("-")) {
        try {
          await storageService.deleteFile(existing.newLaunchLogoUrl);
        } catch (e) {
          console.warn("Failed to delete old launch logo:", e);
        }
      }
    }

    // Upsert banner settings
    const updated = await prisma.promoBanner.upsert({
      where: { id: "global" },
      update: {
        imageUrl,
        sec1Title,
        sec1Sub,
        sec2Title,
        sec2Sub,
        sec3Title,
        sec3Sub,
        sec4Title,
        sec4Sub,
        newLaunchLogoUrl,
      },
      create: {
        id: "global",
        imageUrl,
        sec1Title,
        sec1Sub,
        sec2Title,
        sec2Sub,
        sec3Title,
        sec3Sub,
        sec4Title,
        sec4Sub,
        newLaunchLogoUrl,
      },
    });

    return NextResponse.json({ success: true, data: updated, logs: uploadLogs }, { status: 200 });
  } catch (error: any) {
    console.error("POST /api/promo-banner error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to update banner settings",
    }, { status: 400 });
  }
}
