import * as ftp from "basic-ftp";
import dotenv from "dotenv";
import path from "path";
import { prisma } from "../lib/db";

dotenv.config();

async function main() {
  console.log("=================================================");
  console.log("          ASSET VERIFICATION REPORT              ");
  console.log("=================================================");

  // 1. Fetch all asset references from Database
  console.log("\n[1/3] Fetching image references from database...");
  const projects = await prisma.project.findMany();
  
  const dbImages = new Set<string>();
  
  for (const project of projects) {
    if (project.image) dbImages.add(path.basename(project.image));
    if (project.reraQrImage) dbImages.add(path.basename(project.reraQrImage));
    
    const gallery = (project.gallery as string[]) || [];
    for (const img of gallery) {
      if (img) dbImages.add(path.basename(img));
    }
    
    const floorPlans = (project.floorPlans as any[]) || [];
    for (const fp of floorPlans) {
      if (fp && fp.image) dbImages.add(path.basename(fp.image));
    }
  }

  console.log(`Found ${dbImages.size} unique image references in the database.`);

  // 2. Connect to FTP and list files
  console.log("\n[2/3] Connecting to FTP server...");
  const client = new ftp.Client();
  
  const primaryFiles = new Set<string>();
  const secondaryFiles = new Set<string>();

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: Number(process.env.FTP_PORT) || 21,
      secure: false
    });

    console.log("Successfully connected to FTP server!");

    // Helper to safely read directory contents
    async function listFtpFolder(dirPath: string): Promise<string[]> {
      try {
        await client.cd("/");
        const segments = dirPath.split("/").filter(Boolean);
        for (const segment of segments) {
          if (segment === "public_html") {
            const list = await client.list();
            const hasPublicHtml = list.some(item => item.name === "public_html" && item.isDirectory);
            if (!hasPublicHtml) continue;
          }
          await client.cd(segment);
        }
        const fileList = await client.list();
        return fileList.filter(item => item.isFile).map(item => item.name);
      } catch (err) {
        return [];
      }
    }

    const primaryDir = "public/assets";
    console.log(`Scanning primary FTP path: '${primaryDir}'...`);
    const filesInPrimary = await listFtpFolder(primaryDir);
    filesInPrimary.forEach(f => primaryFiles.add(f));
    console.log(`-> Found ${primaryFiles.size} files in primary path.`);

    const secondaryDir = ".builds/last-source/public/assets";
    console.log(`Scanning secondary build-source path: '${secondaryDir}'...`);
    const filesInSecondary = await listFtpFolder(secondaryDir);
    filesInSecondary.forEach(f => secondaryFiles.add(f));
    console.log(`-> Found ${secondaryFiles.size} files in secondary path.`);

  } catch (err: any) {
    console.error("FTP Connection/Scanning failed:", err.message);
  } finally {
    client.close();
  }

  // 3. Compare and output report
  console.log("\n[3/3] Cross-referencing database assets against FTP files...\n");
  
  const report: {
    filename: string;
    status: "PRIMARY" | "SECONDARY" | "MISSING";
    location: string;
  }[] = [];

  for (const filename of dbImages) {
    if (primaryFiles.has(filename)) {
      report.push({ filename, status: "PRIMARY", location: "Primary FTP (public/assets)" });
    } else if (secondaryFiles.has(filename)) {
      report.push({ filename, status: "SECONDARY", location: "Secondary FTP (.builds/...)" });
    } else {
      report.push({ filename, status: "MISSING", location: "NOT FOUND ON FTP SERVER" });
    }
  }

  // Print results grouped by status
  console.log("--- RESULTS ---");
  const missing = report.filter(r => r.status === "MISSING");
  const primary = report.filter(r => r.status === "PRIMARY");
  const secondary = report.filter(r => r.status === "SECONDARY");

  console.log(`\n✅ Located in Primary Folder (${primary.length} files):`);
  if (primary.length === 0) console.log("  (None)");
  primary.forEach(r => console.log(`  [OK] ${r.filename}`));

  console.log(`\n🔄 Located in Legacy Build Folder (${secondary.length} files):`);
  if (secondary.length === 0) console.log("  (None)");
  secondary.forEach(r => console.log(`  [BUILD] ${r.filename}`));

  console.log(`\n❌ Missing Assets (${missing.length} files):`);
  if (missing.length === 0) {
    console.log("  (None! All assets are accounted for.)");
  } else {
    missing.forEach(r => console.log(`  [MISSING] ${r.filename} - (Please re-upload this file in Admin Panel)`));
  }

  console.log("\n=================================================");
  console.log("              VERIFICATION COMPLETE              ");
  console.log("=================================================");
  
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
