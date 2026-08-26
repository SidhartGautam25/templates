import dotenv from "dotenv";
dotenv.config();

import { prisma } from "../lib/db";

async function main() {
  const target = "1782640718753-s3iauyv.jpg";
  console.log(`Searching for database references to: ${target}`);

  // Search Projects
  const projects = await prisma.project.findMany();
  for (const project of projects) {
    if (project.image && project.image.includes(target)) {
      console.log(`Found in Project ID: ${project.id}, Name: ${project.name}, field: image`);
    }
    if (project.reraQrImage && project.reraQrImage.includes(target)) {
      console.log(`Found in Project ID: ${project.id}, Name: ${project.name}, field: reraQrImage`);
    }
    const gallery = (project.gallery as string[]) || [];
    if (gallery.some(img => img && img.includes(target))) {
      console.log(`Found in Project ID: ${project.id}, Name: ${project.name}, field: gallery`);
    }
    const floorPlans = (project.floorPlans as any[]) || [];
    if (floorPlans.some(fp => fp && fp.image && fp.image.includes(target))) {
      console.log(`Found in Project ID: ${project.id}, Name: ${project.name}, field: floorPlans`);
    }
  }

  // Search PromoBanner
  const promoBanners = await prisma.promoBanner.findMany();
  for (const banner of promoBanners) {
    if (banner.imageUrl && banner.imageUrl.includes(target)) {
      console.log(`Found in PromoBanner ID: ${banner.id}, field: imageUrl`);
    }
    if (banner.newLaunchLogoUrl && banner.newLaunchLogoUrl.includes(target)) {
      console.log(`Found in PromoBanner ID: ${banner.id}, field: newLaunchLogoUrl`);
    }
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
});
