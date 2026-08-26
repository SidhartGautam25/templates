import dotenv from "dotenv";
dotenv.config();

import { prisma } from "../lib/db";

async function main() {
  const target = "1782640718753-s3iauyv.jpg";
  console.log(`Searching for database references to: ${target}`);

  // Search RoomTypes
  const rooms = await prisma.roomType.findMany();
  for (const room of rooms) {
    if (room.image && room.image.includes(target)) {
      console.log(`Found in RoomType ID: ${room.id}, Name: ${room.name}, field: image`);
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
