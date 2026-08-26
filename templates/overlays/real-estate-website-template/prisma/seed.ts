import { prisma } from "../lib/db";
import dotenv from "dotenv";
import { defaultProjects } from "../constants/default-projects";

dotenv.config();

async function main() {
  console.log("Seeding database with default listings...");

  for (const project of defaultProjects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: {},
      create: {
        id: project.id,
        name: project.name,
        location: project.location,
        typology: project.typology,
        price: project.price,
        image: project.image,
        possession: project.possession || null,
        tag1: project.tag1 || null,
        tag2: project.tag2 || null,
        highlights: project.highlights,
        rera: project.rera,
        category: project.category,
        isNewLaunch: project.isNewLaunch || false,
        sortOrder: project.sortOrder || 0,
      },
    });
  }

  console.log(`Seeded ${defaultProjects.length} listings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
