import * as ftp from "basic-ftp";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { prisma } from "../lib/db";

dotenv.config();

const BRAIN_DIR = "/home/sidharthg/.gemini/antigravity/brain/4372e7c9-4da2-412e-9f59-3edc9da240fc";

const filesToUpload = [
  {
    localName: "media__1787553332435.png",
    remoteName: "deluxe_ac_1.png",
    roomTypeId: "deluxe-ac-room",
    index: 0,
  },
  {
    localName: "media__1787553390895.png",
    remoteName: "deluxe_ac_2.png",
    roomTypeId: "deluxe-ac-room",
    index: 1,
  },
  {
    localName: "media__1787553403113.png",
    remoteName: "deluxe_ac_3.png",
    roomTypeId: "deluxe-ac-room",
    index: 2,
  },
  {
    localName: "media__1787553489051.png",
    remoteName: "twin_deluxe_1.png",
    roomTypeId: "twin-deluxe-with-bathtub",
    index: 0,
  },
  {
    localName: "media__1787553499332.png",
    remoteName: "twin_deluxe_2.png",
    roomTypeId: "twin-deluxe-with-bathtub",
    index: 1,
  },
];

// Helper to ensure and navigate FTP directories with dynamic fallback for "public_html" prefix
async function ensureFtpDir(client: ftp.Client, remotePath: string) {
  const segments = remotePath.split("/").filter(Boolean);
  for (const segment of segments) {
    if (segment === "public_html") {
      const list = await client.list();
      const hasPublicHtml = list.some(item => item.name === "public_html" && item.isDirectory);
      if (!hasPublicHtml) {
        continue;
      }
    }
    await client.ensureDir(segment);
  }
}

async function main() {
  console.log("Starting FTP upload for room images...");
  const client = new ftp.Client();

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: Number(process.env.FTP_PORT) || 21,
      secure: false,
    });

    console.log("Connected to FTP server!");

    // Ensure we are in remote path directory
    await client.cd("/");
    await ensureFtpDir(client, process.env.FTP_REMOTE_PATH || "public/assets");

    console.log("Remote directory ready. Starting file uploads...");

    for (const item of filesToUpload) {
      const localPath = path.join(BRAIN_DIR, item.localName);
      if (!fs.existsSync(localPath)) {
        throw new Error(`Local file not found: ${localPath}`);
      }

      console.log(`Uploading ${item.localName} as ${item.remoteName}...`);
      await client.uploadFrom(localPath, item.remoteName);
      console.log(`Uploaded ${item.remoteName} successfully!`);
    }

    console.log("FTP uploads complete. Updating database...");

    const deluxeImages = [
      "/assets/deluxe_ac_1.png",
      "/assets/deluxe_ac_2.png",
      "/assets/deluxe_ac_3.png",
    ];

    const twinImages = [
      "/assets/twin_deluxe_1.png",
      "/assets/twin_deluxe_2.png",
    ];

    // Update Deluxe AC Room
    await prisma.roomType.update({
      where: { id: "deluxe-ac-room" },
      data: {
        image: JSON.stringify(deluxeImages),
      },
    });
    console.log("Updated deluxe-ac-room images in database.");

    // Update Twin Deluxe With Bathtub
    await prisma.roomType.update({
      where: { id: "twin-deluxe-with-bathtub" },
      data: {
        image: JSON.stringify(twinImages),
      },
    });
    console.log("Updated twin-deluxe-with-bathtub images in database.");

  } catch (err: any) {
    console.error("Error running script:", err);
  } finally {
    client.close();
    await prisma.$disconnect();
  }
}

main();
