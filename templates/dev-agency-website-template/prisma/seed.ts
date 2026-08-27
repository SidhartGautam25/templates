import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("No seed data yet — add models in prisma/domain.prisma and seed logic here.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
