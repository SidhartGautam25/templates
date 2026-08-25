import { prisma } from "../lib/db";
import dotenv from "dotenv";
import { defaultRoomTypes } from "../constants/default-room-types";
import { defaultFacilities } from "../constants/default-facilities";
import { defaultReviews } from "../constants/default-reviews";

dotenv.config();

async function main() {
  console.log("Seeding database with default room types...");

  for (const room of defaultRoomTypes) {
    await prisma.roomType.upsert({
      where: { id: room.id },
      update: {},
      create: {
        id: room.id,
        name: room.name,
        startingPrice: room.startingPrice,
        size: room.size,
        view: room.view,
        bedType: room.bedType,
        bathrooms: room.bathrooms,
        image: room.image,
        amenities: room.amenities as any,
        ratePlans: room.ratePlans as any,
        sortOrder: room.sortOrder || 0,
      },
    });
  }
  console.log(`Seeded ${defaultRoomTypes.length} room types.`);

  console.log("Seeding database with default facilities...");
  for (const facility of defaultFacilities) {
    await prisma.facility.upsert({
      where: { title: facility.title },
      update: {},
      create: {
        id: facility.id,
        title: facility.title,
        description: facility.description,
        icon: facility.icon,
        sortOrder: facility.sortOrder,
      },
    });
  }
  console.log(`Seeded ${defaultFacilities.length} facilities.`);

  console.log("Seeding database with default reviews...");
  for (const review of defaultReviews) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: {},
      create: {
        id: review.id,
        name: review.name,
        otherInfo: review.otherInfo,
        description: review.description,
        sortOrder: review.sortOrder,
      },
    });
  }
  console.log(`Seeded ${defaultReviews.length} reviews.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
